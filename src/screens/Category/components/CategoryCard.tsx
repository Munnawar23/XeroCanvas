import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; 
import HapticFeedback from 'react-native-haptic-feedback'; 
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

type CategoryCardProps = {
  category: string;
  imageUrl: string | null;
  onPress: () => void;
};

export const CategoryCard = ({ category, imageUrl, onPress }: CategoryCardProps) => {
  // Shared value for press animation
  const scale = useSharedValue(1);

  // Animated style to apply the scale transform
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Press handlers for the animation
  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  // Main press handler with haptics
  const handlePress = () => {
    // Options for haptic feedback
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
    HapticFeedback.trigger('impactLight', options);
    onPress();
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="aspect-square overflow-hidden rounded-xl bg-light-card dark:bg-dark-card shadow-sm"
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          // Placeholder view if no image is available
          <View className="h-full w-full bg-light-border dark:bg-dark-border" />
        )}

        {/* Gradient overlay for text readability */}
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
          className="absolute bottom-0 left-0 right-0 h-2/3 justify-end p-3"
        >
          <Text 
            className="text-center font-heading text-lg text-white"
            numberOfLines={1}
          >
            {/* Capitalize the first letter */}
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};