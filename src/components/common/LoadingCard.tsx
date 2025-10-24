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

type LoadingCardProps = {
  aspectRatio?: number; // width / height ratio
};

export const LoadingCard = ({ aspectRatio = 1.5 }: LoadingCardProps) => {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View className="w-full rounded-xl overflow-hidden">
      <Animated.View
        style={[{ aspectRatio }, animatedStyle]}
        className="w-full bg-gray-300 rounded-xl"
      />
    </View>
  );
};
