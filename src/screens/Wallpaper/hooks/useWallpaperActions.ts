import { useState } from 'react';
import { Platform, PermissionsAndroid, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HapticFeedback from 'react-native-haptic-feedback';
import Toast from 'react-native-toast-message';
import { storage, DownloadedWallpaper } from '@utils/storage';
import { PixabayImage } from '@api/index';
import { downloadImage } from '@utils/downloadImage';

export const useWallpaperActions = (wallpaper: PixabayImage) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const navigation = useNavigation<any>();

  // --- Storage permission for Android ---
  const requestStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    const sdkInt = Platform.Version as number;
    const permission =
      sdkInt >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    try {
      const granted = await PermissionsAndroid.request(permission, {
        title: 'Storage Permission Required',
        message: 'XeroCanvas needs access to storage to save wallpapers.',
        buttonPositive: 'OK',
      });
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  };

  const handleBack = () => navigation.goBack();

  // --- Share the wallpaper after downloading locally ---
  const handleShare = async () => {
    setIsDownloading(true);
    HapticFeedback.trigger('impactMedium');

    try {
      const localUri = await downloadImage(wallpaper.largeImageURL);

      await Share.share({
        url: localUri, // Local file path
      });
    } catch (error) {
      console.error('Error sharing wallpaper:', error);
      Toast.show({
        type: 'error',
        text1: 'Share Failed',
        text2: 'Unable to share wallpaper.',
        position: 'top',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // --- Download and save wallpaper ---
  const handleDownload = async () => {
    setIsDownloading(true);
    HapticFeedback.trigger('impactMedium');

    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Toast.show({
        type: 'error',
        text1: 'Permission Denied',
        text2: 'Storage permission is required to download wallpapers.',
        position: 'top',
      });
      setIsDownloading(false);
      return;
    }

    try {
      const localUri = await downloadImage(wallpaper.largeImageURL);

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
        text2: 'Saved to your gallery 🎉',
        position: 'top',
      });
    } catch (error) {
      console.error('Download error:', error);
      Toast.show({
        type: 'error',
        text1: 'Download Failed',
        text2: 'Something went wrong while saving.',
        position: 'top',
      });
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
