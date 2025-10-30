import React from "react";
import { Pressable, Text, ViewStyle } from "react-native";
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
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
  width?: number | string; 
};

export const Button = React.memo(
  ({
    title,
    onPress,
    disabled = false,
    variant = "primary",
    icon,
    width = wp(85), 
  }: ButtonProps) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => (scale.value = withSpring(0.97));
    const handlePressOut = () => (scale.value = withSpring(1));

    const getButtonClasses = () => {
      if (disabled)
        return "bg-button-disabled dark:bg-dark-button-disabled opacity-60";
      if (variant === "secondary")
        return "bg-button-secondary dark:bg-dark-button-secondary";
      return "bg-button-primary dark:bg-dark-button-primary";
    };

    return (
      <Animated.View style={[animatedStyle, { width } as ViewStyle]}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          className={`flex-row justify-center items-center gap-x-3 rounded-xl ${getButtonClasses()}`}
          style={{ height: hp(6) }}
        >
          {icon}
          <Text className="text-white font-accent text-lg">{title}</Text>
        </Pressable>
      </Animated.View>
    );
  }
);
