import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

type LoadingCardProps = {
  aspectRatio?: number;
};

export const LoadingCard = ({ aspectRatio = 1.5 }: LoadingCardProps) => {
  // Shared value to drive the shimmer animation
  const opacity = useSharedValue(0.4);

  // Looping animation effect
  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        // Animate from 0.4 to 0.8 opacity...
        withTiming(0.8, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        // ...and back to 0.4
        withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // -1 means infinite loop
      true // Reverse the animation on each repetition
    );
  }, []);

  // Animated style that applies the changing opacity
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[{ aspectRatio }, animatedStyle]}
      className="w-full rounded-xl bg-light-card dark:bg-dark-card"
    />
  );
};