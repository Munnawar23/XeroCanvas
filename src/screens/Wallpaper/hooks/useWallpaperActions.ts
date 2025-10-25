import { useState } from 'react';
import {
  Platform,
  PermissionsAndroid,
  Alert,
  Share,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ReactNativeBlobUtil, { FetchBlobResponse } from 'react-native-blob-util';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import HapticFeedback from 'react-native-haptic-feedback';
import Toast from 'react-native-toast-message';
import { storage, DownloadedWallpaper } from '@utils/storage';
import { PixabayImage } from '@api/index';

export const useWallpaperActions = (wallpaper: PixabayImage) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const navigation = useNavigation<any>();

  /** ✅ Request correct permission per Android version */
  const requestStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const sdkInt = Platform.Version as number;

      // Android 13+ uses READ_MEDIA_IMAGES instead of WRITE_EXTERNAL_STORAGE
      const permission =
        sdkInt >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

      try {
        const granted = await PermissionsAndroid.request(permission, {
          title: 'Storage Permission Required',
          message:
            'XeroCanvas needs access to your storage to download wallpapers.',
          buttonPositive: 'OK',
        });
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission request error:', err);
        return false;
      }
    }
    return true;
  };

  /** ✅ Go back to previous screen */
  const handleBack = () => {
    navigation.goBack();
  };

  /** ✅ Share wallpaper link */
  const handleShare = async () => {
    try {
      await Share.share({
        message: wallpaper.largeImageURL,
      });
    } catch (error) {
      console.error('Error sharing wallpaper:', error);
    }
  };

  /** ✅ Download & save wallpaper */
  const handleDownload = async () => {
    setIsDownloading(true);
    HapticFeedback.trigger('impactMedium');

    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Storage permission is required to download wallpapers.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', onPress: () => handleDownload() },
        ]
      );
      setIsDownloading(false);
      return;
    }

    try {
      const res: FetchBlobResponse = await ReactNativeBlobUtil.config({
        fileCache: true,
        appendExt: 'jpg',
      }).fetch('GET', wallpaper.largeImageURL);

      const filePath = res.path();
      const localUri = await CameraRoll.save(filePath, { type: 'photo' });

      const newDownload: DownloadedWallpaper = {
        id: String(wallpaper.id),
        localUri,
        originalUrl: wallpaper.largeImageURL,
        downloadedAt: new Date().toISOString(),
        metadata: {
          tags: wallpaper.tags,
          user: wallpaper.user,
          dimensions: `${wallpaper.imageWidth}x${wallpaper.imageHeight}`,
        },
      };

      await storage.addDownload(newDownload);
      Toast.show({
        type: 'success',
        text1: 'Wallpaper Downloaded',
        text2: 'The wallpaper has been saved to your gallery.',
      });
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download or save the wallpaper.');
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloading: isDownloading,
    showInfo,
    setShowInfo,
    handleBack,
    handleShare,
    handleDownload,
  };
};