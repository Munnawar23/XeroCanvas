import React from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeftIcon, ShareIcon, ArrowDownTrayIcon, InformationCircleIcon } from 'react-native-heroicons/outline';

// --- REFINED IMPORTS ---
import { useWallpaperActions } from '@screens/Wallpaper/hooks/useWallpaperActions';
import { DetailScreenProps } from '@navigation/types';
import { InfoModal } from '@screens/Wallpaper/components/InfoModal'; 

// --- UI Sub-components for clarity ---
const IconButton = React.memo(({ onPress, children }: { onPress: () => void; children: React.ReactNode }) => (
  <TouchableOpacity onPress={onPress} className="h-12 w-12 items-center justify-center rounded-full bg-black/40">
    {children}
  </TouchableOpacity>
));

const Header = React.memo(({ onBack, onShare }: { onBack: () => void; onShare: () => void }) => (
  <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent']} className="absolute top-0 w-full p-4 pt-16">
    <View className="flex-row items-center justify-between">
      <IconButton onPress={onBack}><ArrowLeftIcon size={24} color="white" /></IconButton>
      <IconButton onPress={onShare}><ShareIcon size={24} color="white" /></IconButton>
    </View>
  </LinearGradient>
));

const Footer = React.memo(({ onShowInfo, onDownload, downloading }: { onShowInfo: () => void; onDownload: () => void; downloading: boolean }) => (
  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} className="absolute bottom-0 w-full p-4 pb-12">
    <View className="flex-row items-center gap-x-4">
      <TouchableOpacity onPress={onShowInfo} className="h-14 w-14 items-center justify-center rounded-full bg-white/20">
        <InformationCircleIcon size={28} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onDownload} disabled={downloading} className="flex-1 flex-row items-center justify-center gap-x-3 rounded-full bg-accent py-4">
        {downloading ? <ActivityIndicator color="white" /> : (
          <>
            <ArrowDownTrayIcon size={24} color="white" />
            <Text className="font-heading text-lg text-white">Download</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  </LinearGradient>
));


export default function WallpaperrScreen() {
  const route = useRoute<DetailScreenProps['route']>();
  const wallpaper = JSON.parse(route.params.wallpaper);

  // --- Single line to get all state and logic! ---
  const { downloading, showInfo, handleBack, handleDownload, handleShare, setShowInfo } = useWallpaperActions(wallpaper);

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <Image source={{ uri: wallpaper.largeImageURL }} className="absolute h-full w-full" resizeMode="cover" />

      <Header onBack={handleBack} onShare={handleShare} />
      <Footer onShowInfo={() => setShowInfo(true)} onDownload={handleDownload} downloading={downloading} />
      
      <InfoModal visible={showInfo} onClose={() => setShowInfo(false)} wallpaper={wallpaper} />
    </View>
  );
}