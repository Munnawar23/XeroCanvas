import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import HapticFeedback from 'react-native-haptic-feedback';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { ArrowDownTrayIcon, HeartIcon } from 'react-native-heroicons/solid';
import { PixabayImage } from '@api/index';

/**
 * Props for the WallpaperCard component.
 */
type WallpaperCardProps = {
  wallpaper: PixabayImage;
  isFavourite: boolean;
  onPress: () => void;
  onToggleFavourite: () => void;
};

/**
 * A card component that displays a single wallpaper.
 * It features press and favourite animations, and shows download count.
 * The favourite state is managed globally.
 */
export const WallpaperCard = ({ wallpaper, isFavourite, onPress, onToggleFavourite }: WallpaperCardProps) => {
  const scale = useSharedValue(1);
  const heartScale = useSharedValue(1);

  // Animated style for the card's press-in/out effect
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Animated style for the heart icon's pop effect
  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  // --- Event Handlers ---

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    HapticFeedback.trigger('impactMedium');
    onPress();
  };

  const handleFavoritePress = () => {
    HapticFeedback.trigger('impactMedium');
    // Animate the heart icon scaling up and back down
    heartScale.value = withSpring(1.3, {}, () => {
      heartScale.value = withSpring(1);
    });
    // Call the provided function to toggle the favourite state
    onToggleFavourite();
  };

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
          style={{ aspectRatio }} 
          className="w-full rounded-xl bg-card dark:bg-dark-card" 
          resizeMode="cover"
        />
        
        {/* Favourite (Heart) Icon Button */}
        <View className="absolute top-2 right-2">
          <Pressable onPress={handleFavoritePress}>
            <Animated.View 
              style={heartAnimatedStyle}
              className="rounded-full bg-black/50 p-2"
            >
              <HeartIcon 
                color={isFavourite ? '#ef4444' : '#FFFFFF'} // Red for favourited, white otherwise
                size={20}
              />
            </Animated.View>
          </Pressable>
        </View>

        {/* Download Count Overlay */}
        <View className="absolute bottom-2 left-2">
          <View className="flex-row items-center rounded-full bg-black/50 px-2.5 py-1">
            <ArrowDownTrayIcon color="#FFFFFF" size={14} />
            <Text className="ml-1.5 font-medium text-xs text-white">
              {wallpaper.downloads}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};