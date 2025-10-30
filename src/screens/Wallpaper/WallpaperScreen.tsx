import React from 'react';
import { View, Image, StatusBar } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSafePadding } from '@hooks/useSafePadding';
import { useWallpaperActions } from '@screens/Wallpaper/hooks/useWallpaperActions';
import { DetailScreenProps } from '@navigation/types';
import { InfoModal } from '@screens/Wallpaper/components/InfoModal';
import { Header } from '@screens/Wallpaper/components/Header';
import { Footer } from '@screens/Wallpaper/components/Footer';


export default function WallpaperScreen() {
  const route = useRoute<DetailScreenProps['route']>();
  const wallpaper = JSON.parse(route.params.wallpaper);

  const { paddingTop, paddingBottom } = useSafePadding();
  const { downloading, showInfo, setShowInfo, handleBack, handleDownload } =
    useWallpaperActions(wallpaper);

  return (
    <View className="flex-1 bg-black">
      <Image
        source={{ uri: wallpaper.largeImageURL }}
        className="absolute h-full w-full"
        resizeMode="cover"
      />

      <Header
        onBack={handleBack}
        onShowInfo={() => setShowInfo(true)}
        paddingTop={paddingTop}
      />

      <Footer
        onDownload={handleDownload}
        downloading={downloading}
        paddingBottom={paddingBottom}
      />

      <InfoModal
        visible={showInfo}
        onClose={() => setShowInfo(false)}
        wallpaper={wallpaper}
      />
    </View>
  );
}