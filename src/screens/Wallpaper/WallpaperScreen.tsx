import React from 'react';
import { View, Text, Image, StatusBar } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useWallpaperActions } from '@screens/Wallpaper/hooks/useWallpaperActions';
import { DetailScreenProps } from '@navigation/types';
import { InfoModal } from '@screens/Wallpaper/components/InfoModal';
import { Header } from '@screens/Wallpaper/components/Header';
import { Footer } from '@screens/Wallpaper/components/Footer';

export default function WallpaperScreen() {
  const route = useRoute<DetailScreenProps['route']>();
  const wallpaper = JSON.parse(route.params.wallpaper);

  const { downloading, showInfo, setShowInfo, handleBack, handleDownload } =
    useWallpaperActions(wallpaper);

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <Image
        source={{ uri: wallpaper.largeImageURL }}
        className="absolute h-full w-full"
        resizeMode="cover"
      />

      <Header onBack={handleBack} onShowInfo={() => setShowInfo(true)} />

      <Footer
        onDummyAction={() => console.log('Future download button pressed')}
        onDownload={handleDownload}
        downloading={downloading}
      />

      <InfoModal
        visible={showInfo}
        onClose={() => setShowInfo(false)}
        wallpaper={wallpaper}
      />
    </View>
  );
}
