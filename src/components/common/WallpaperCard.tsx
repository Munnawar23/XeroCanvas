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

// 1. Update props to receive favourite status and the toggle function
type WallpaperCardProps = {
  wallpaper: PixabayImage;
  isFavourite: boolean;
  onPress: () => void;
  onToggleFavourite: () => void;
};

export const WallpaperCard = ({ wallpaper, isFavourite, onPress, onToggleFavourite }: WallpaperCardProps) => {
  // 2. Remove the local state. The source of truth is now the `isFavourite` prop.
  // const [isFavorite, setIsFavorite] = useState(false); 

  const scale = useSharedValue(1);
  const heartScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
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

  const handleFavoritePress = () => {
    HapticFeedback.trigger('impactMedium');
    // The animation is preserved exactly as you had it.
    heartScale.value = withSpring(1.3, {}, () => {
      heartScale.value = withSpring(1);
    });
    
    // 3. Instead of setting local state, call the function from props.
    // This will trigger the update in our global Zustand store.
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
          className="w-full rounded-xl"
          resizeMode="cover"
        />
        
        {/* Heart icon in top right */}
        <View className="absolute top-2 right-2">
          <Pressable onPress={handleFavoritePress}>
            <Animated.View 
              style={heartAnimatedStyle}
              className="rounded-full bg-black/50 p-2"
            >
              {/* 4. The icon's color is now driven by the `isFavourite` prop. */}
              <HeartIcon 
                color={isFavourite ? '#ef4444' : 'white'} 
                size={20}
              />
            </Animated.View>
          </Pressable>
        </View>

        {/* Download count overlay */}
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