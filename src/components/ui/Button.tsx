import React from "react";
import { Pressable, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { wp, hp } from "@helpers/index";

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export const Button = React.memo(({ title, onPress, disabled = false }: ButtonProps) => {
  const scale = useSharedValue(1);

  // Animated style that applies the transform based on the shared value
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Handler for when the user presses down on the button
  const handlePressIn = () => {
    // We use withSpring for a nice, bouncy effect
    scale.value = withSpring(0.97);
  };

  // Handler for when the user releases the button
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    // The Animated.View is the component that gets scaled
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        className={`bg-black rounded-xl justify-center items-center ${
          disabled ? "opacity-60" : ""
        }`}
        style={{ width: wp(85), height: hp(6) }}
      >
        <Text className="text-white font-semibold text-xl">{title}</Text>
      </Pressable>
    </Animated.View>
  );
});
