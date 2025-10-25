import { useState, useCallback } from 'react';
import { Alert, Platform, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HapticFeedback from 'react-native-haptic-feedback';
import RNFS from 'react-native-fs';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { storage, DownloadedWallpaper } from '@utils/storage';
import { PixabayImage } from '@api/index';
import { AppNavigationProp } from '@navigation/types';

export const useWallpaperActions = (wallpaper: PixabayImage) => {
  const navigation = useNavigation<AppNavigationProp>();
  const [downloading, setDownloading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleBack = useCallback(() => {
    HapticFeedback.trigger('impactLight');
    navigation.goBack();
  }, [navigation]);

  // Encapsulate the complex permission logic inside the hook
  const requestStoragePermission = useCallback(async () => {
    if (Platform.OS !== 'android') return true; // Permissions only needed for Android

    const permission =
      Platform.Version >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;

    const status = await request(permission);
    if (status !== RESULTS.GRANTED) {
      Alert.alert('Permission required', 'We need access to your gallery to save wallpapers.');
      return false;
    }
    return true;
  }, []);

  const handleDownload = useCallback(async () => {
    HapticFeedback.trigger('impactMedium');
    if (!(await requestStoragePermission())) return;

    setDownloading(true);
    const imageUrl = wallpaper.largeImageURL || wallpaper.webformatURL;
    const fileName = `XeroCanvas-${wallpaper.id}.jpg`;
    const filePath = `${RNFS.PicturesDirectoryPath}/${fileName}`;

    try {
      await RNFS.downloadFile({ fromUrl: imageUrl, toFile: filePath }).promise;
      
      const downloadedInfo: DownloadedWallpaper = {
        id: wallpaper.id.toString(),
        localUri: `file://${filePath}`,
        originalUrl: imageUrl,
        downloadedAt: new Date().toISOString(),
        metadata: {
          tags: wallpaper.tags,
          user: wallpaper.user,
          dimensions: `${wallpaper.imageWidth}x${wallpaper.imageHeight}`,
        },
      };
      await storage.addDownload(downloadedInfo);

      HapticFeedback.trigger('notificationSuccess');
      Alert.alert('Success!', 'Wallpaper saved to your gallery.');
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download wallpaper.');
      HapticFeedback.trigger('notificationError');
    } finally {
      setDownloading(false);
    }
  }, [wallpaper, requestStoragePermission]);

  const handleShare = useCallback(async () => {
    HapticFeedback.trigger('impactLight');
    try {
      await Share.share({
        message: `Check out this awesome wallpaper from XeroCanvas! ${wallpaper.pageURL}`,
        url: wallpaper.pageURL, // for iOS
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  }, [wallpaper]);

  return {
    downloading,
    showInfo,
    handleBack,
    handleDownload,
    handleShare,
    setShowInfo,
  };
};