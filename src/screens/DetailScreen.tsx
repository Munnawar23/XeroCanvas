// src/screens/DetailScreen.tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StatusBar, Platform, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import HapticFeedback from 'react-native-haptic-feedback';
import RNFS from 'react-native-fs';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { ArrowLeftIcon, ShareIcon, ArrowDownTrayIcon, InformationCircleIcon } from 'react-native-heroicons/outline';

// Hooks, utils, and types
import { useTheme } from '@context/ThemeContext';
import { storage, DownloadedWallpaper } from '@utils/storage';
import { AppNavigationProp, DetailScreenProps } from '@navigation/types';

// Components
import { InfoModal } from '@components/InfoModal';

export default function DetailScreen() {
  const { isDark } = useTheme();
  const navigation = useNavigation<AppNavigationProp>();
  const route = useRoute<DetailScreenProps['route']>();
  const wallpaper = JSON.parse(route.params.wallpaper);

  const [downloading, setDownloading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleBack = () => {
    HapticFeedback.trigger('impactLight');
    navigation.goBack();
  };

  const requestAndroidPermission = async () => {
    const version = parseInt(Platform.Version as string, 10);
    const permission =
      version >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES // Android 13+
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE; // Android <= 12

    const status = await request(permission);

    if (status !== RESULTS.GRANTED) {
      Alert.alert('Permission required', 'We need access to your gallery to save wallpapers.');
      return false;
    }
    return true;
  };

  const handleDownload = async () => {
    HapticFeedback.trigger('impactMedium');

    if (!(await requestAndroidPermission())) return;

    const imageUrl = wallpaper.largeImageURL || wallpaper.webformatURL;
    const fileName = `XeroCanvas-${wallpaper.id}.jpg`;
    const filePath = `${RNFS.PicturesDirectoryPath}/${fileName}`;

    try {
      setDownloading(true);

      // Download the image to Pictures folder
      await RNFS.downloadFile({
        fromUrl: imageUrl,
        toFile: filePath,
      }).promise;

      // Save info to local storage
      const downloadedWallpaper: DownloadedWallpaper = {
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

      await storage.addDownload(downloadedWallpaper);

      HapticFeedback.trigger('notificationSuccess');
      Alert.alert('Success', 'Wallpaper saved to your gallery!');
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download wallpaper.');
      HapticFeedback.trigger('notificationError');
    } finally {
      setDownloading(false);
    }
  };

  const IconButton = ({ onPress, children }: { onPress: () => void; children: React.ReactNode }) => (
    <TouchableOpacity onPress={onPress} className="h-12 w-12 items-center justify-center rounded-full bg-black/40">{children}</TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <Image source={{ uri: wallpaper.largeImageURL || wallpaper.webformatURL }} className="absolute h-full w-full" resizeMode="cover" />

      {/* Header */}
      <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent']} className="absolute top-0 w-full p-4 pt-16">
        <View className="flex-row items-center justify-between">
          <IconButton onPress={handleBack}><ArrowLeftIcon size={24} color="white" /></IconButton>
          <IconButton onPress={() => {}}><ShareIcon size={24} color="white" /></IconButton>
        </View>
      </LinearGradient>

      {/* Footer */}
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} className="absolute bottom-0 w-full p-4 pb-12">
        <View className="flex-row items-center gap-x-4">
          <TouchableOpacity onPress={() => setShowInfo(true)} className="h-14 w-14 items-center justify-center rounded-full bg-white/20">
            <InformationCircleIcon size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDownload} disabled={downloading} className="flex-1 flex-row items-center justify-center gap-x-3 rounded-full bg-light-accent py-4 dark:bg-dark-accent">
            {downloading ? (
              <ActivityIndicator color="white" />
            ) : (
              <><ArrowDownTrayIcon size={24} color="white" /><Text className="font-heading text-lg text-white">Download</Text></>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <InfoModal visible={showInfo} onClose={() => setShowInfo(false)} wallpaper={wallpaper} />
    </View>
  );
}
