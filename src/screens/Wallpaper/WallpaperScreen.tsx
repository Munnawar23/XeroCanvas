import React from 'react';
import { View, Image, StatusBar } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSafePadding } from '@hooks/useSafePadding';
import { useWallpaperActions } from '@screens/Wallpaper/hooks/useWallpaperActions';
import { DetailScreenProps } from '@navigation/types';
import { InfoModal } from '@screens/Wallpaper/components/InfoModal';
import { Header } from '@screens/Wallpaper/components/Header';
import { Footer } from '@screens/Wallpaper/components/Footer';

/**
 * The wallpaper detail screen, providing an immersive full-screen view of an image.
 * It includes controls for downloading, viewing information, and navigating back.
 */
export default function WallpaperScreen() {
  const route = useRoute<DetailScreenProps['route']>();
  const wallpaper = JSON.parse(route.params.wallpaper);

  // Hook for safe area values (notches, home indicators)
  const { paddingTop, paddingBottom } = useSafePadding();

  // Custom hook to manage all actions related to the wallpaper
  const { downloading, showInfo, setShowInfo, handleBack, handleDownload } =
    useWallpaperActions(wallpaper);

  return (
    <View className="flex-1 bg-black">
      {/* Ensure status bar text is visible on the dark background */}
      <StatusBar barStyle="light-content" />

      {/* Full-screen background image */}
      <Image
        source={{ uri: wallpaper.largeImageURL }}
        className="absolute h-full w-full"
        resizeMode="cover"
      />

      {/* Header with safe area padding */}
      <Header
        onBack={handleBack}
        onShowInfo={() => setShowInfo(true)}
        paddingTop={paddingTop}
      />

      {/* Footer with safe area padding */}
      <Footer
        onDummyAction={() => console.log('Future button pressed')}
        onDownload={handleDownload}
        downloading={downloading}
        paddingBottom={paddingBottom}
      />

      {/* Information Modal */}
      <InfoModal
        visible={showInfo}
        onClose={() => setShowInfo(false)}
        wallpaper={wallpaper}
      />
    </View>
  );
}