import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeftIcon, InformationCircleIcon } from 'react-native-heroicons/outline';

type HeaderProps = {
  onBack: () => void;
  onShowInfo: () => void;
};

// Reusable IconButton
const IconButton = React.memo(
  ({ onPress, children }: { onPress: () => void; children: React.ReactNode }) => (
    <TouchableOpacity
      onPress={onPress}
      className="h-12 w-12 items-center justify-center rounded-full bg-black/40"
    >
      {children}
    </TouchableOpacity>
  )
);

export const Header: React.FC<HeaderProps> = React.memo(({ onBack, onShowInfo }) => (
  <LinearGradient
    colors={['rgba(0,0,0,0.6)', 'transparent']}
    className="absolute top-0 w-full p-4 pt-16"
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
