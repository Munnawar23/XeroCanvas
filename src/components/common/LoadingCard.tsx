import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

/**
 * Props for the LoadingCard component.
 */
type LoadingCardProps = {
  /** The aspect ratio (width / height) of the card. Defaults to 1.5. */
  aspectRatio?: number;
};

/**
 * A placeholder card with a shimmering animation.
 * Used to indicate that content is loading, improving the user experience.
 */
export const LoadingCard = ({ aspectRatio = 1.5 }: LoadingCardProps) => {
  const opacity = useSharedValue(0.4);

  // Set up the infinite shimmering animation on component mount
  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Loop indefinitely
      true // Reverse the animation
    );
  }, [opacity]);

  // Create the animated style object based on the shared opacity value
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View className="w-full overflow-hidden rounded-xl">
      <Animated.View
        style={[{ aspectRatio }, animatedStyle]}
        // Use theme-aware border color for the shimmering background
        className="w-full rounded-xl bg-border dark:bg-dark-border"
      />
    </View>
  );
};