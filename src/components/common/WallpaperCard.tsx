import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import HapticFeedback from 'react-native-haptic-feedback';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { ArrowDownTrayIcon } from 'react-native-heroicons/solid';
import { PixabayImage } from '@api/index';

type WallpaperCardProps = {
  wallpaper: PixabayImage;
  onPress: () => void;
};

export const WallpaperCard = ({ wallpaper, onPress }: WallpaperCardProps) => {
  // Shared value for the press animation
  const scale = useSharedValue(1);

  // Animated style for a springy press effect
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    HapticFeedback.trigger('impactLight');
    onPress();
  };

  // Calculate aspect ratio from the image data
  const aspectRatio = wallpaper.imageWidth / wallpaper.imageHeight;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Image
          source={{ uri: wallpaper.webformatURL }}
          style={{ aspectRatio }} // Apply dynamic aspect ratio
          className="w-full rounded-xl"
          resizeMode="cover"
        />
        {/* Overlay to show download count */}
        <View className="absolute bottom-2 left-2">
          <View className="flex-row items-center rounded-full bg-black/50 px-2.5 py-1">
            <ArrowDownTrayIcon color="white" size={14} />
            <Text className="ml-1.5 font-medium text-xs text-white">
              {wallpaper.downloads}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};