import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeftIcon, InformationCircleIcon } from 'react-native-heroicons/outline';

type HeaderProps = {
  onBack: () => void;
  onShowInfo: () => void;
  /** Safe area padding from the top of the screen. */
  paddingTop: number;
};

/**
 * A memoized, reusable icon button for the header.
 */
const IconButton = React.memo(
  ({ onPress, children }: { onPress: () => void; children: React.ReactNode }) => (
    <TouchableOpacity
      onPress={onPress}
      className="h-12 w-12 items-center justify-center rounded-full bg-black/40 active:opacity-70"
    >
      {children}
    </TouchableOpacity>
  )
);

/**
 * The header for the wallpaper detail screen.
 * It provides back and info buttons and sits above the wallpaper image.
 */
export const Header: React.FC<HeaderProps> = React.memo(({ onBack, onShowInfo, paddingTop }) => (
  <LinearGradient
    colors={['rgba(0,0,0,0.6)', 'transparent']}
    // Apply dynamic top padding to respect the device's safe area
    style={{ paddingTop }}
    className="absolute top-0 w-full p-4"
  >
    <View className="flex-row items-center justify-between">
      <IconButton onPress={onBack}>
        <ArrowLeftIcon size={24} color="white" />
      </IconButton>
      <IconButton onPress={onShowInfo}>
        <InformationCircleIcon size={24} color="white" />
      </IconButton>
    </View>
  </LinearGradient>
));