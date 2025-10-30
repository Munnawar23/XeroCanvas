import React, { useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeftIcon, InformationCircleIcon } from 'react-native-heroicons/outline';
import HapticFeedback from 'react-native-haptic-feedback';

type HeaderProps = {
  onBack: () => void;
  onShowInfo: () => void;
  paddingTop: number;
};

const IconButton = React.memo(
  ({
    onPress,
    children,
    withHaptics = true,
  }: {
    onPress: () => void;
    children: React.ReactNode;
    withHaptics?: boolean;
  }) => {
    const handlePress = useCallback(() => {
      if (withHaptics) {
        HapticFeedback.trigger('impactMedium', {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false,
        });
      }
      onPress();
    }, [onPress, withHaptics]);

    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        className="h-12 w-12 items-center justify-center rounded-full bg-black/40"
      >
        {children}
      </TouchableOpacity>
    );
  }
);

export const Header: React.FC<HeaderProps> = React.memo(
  ({ onBack, onShowInfo, paddingTop }) => (
    <LinearGradient
      colors={['rgba(0,0,0,0.6)', 'transparent']}
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
  )
);
