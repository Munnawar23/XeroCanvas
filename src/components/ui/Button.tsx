import React from "react";
import { Pressable, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { wp, hp } from "@helpers/index";

/**
 * Props for the Button component.
 */
type ButtonProps = {
  /** The text to be displayed inside the button. */
  title: string;
  /** The function to call when the button is pressed. */
  onPress: () => void;
  /** If true, the button will be non-interactive. Defaults to false. */
  disabled?: boolean;
};

/**
 * A memoized, animated primary button component.
 * It uses the app's design system for styling and provides visual feedback on press.
 */
export const Button = React.memo(({ title, onPress, disabled = false }: ButtonProps) => {
  const scale = useSharedValue(1);

  // Animated style that applies the transform based on the shared value
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // --- Animation Handlers ---

  const handlePressIn = () => {
    // Use withSpring for a bouncy, physical-feeling press effect
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        // Apply theme-aware accent color for the background
        className={`
          justify-center items-center rounded-xl 
          bg-accent dark:bg-dark-accent
          ${disabled ? "opacity-60" : ""}
        `}
        style={{ width: wp(85), height: hp(6) }}
      >
        <Text className="text-white font-accent text-lg">
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
});