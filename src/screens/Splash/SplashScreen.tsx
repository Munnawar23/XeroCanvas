import React, { useEffect } from "react";
import { View, ImageBackground, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useColorScheme } from "nativewind";
import HapticFeedback from "react-native-haptic-feedback";
import { wp, hp } from "@helpers/index";
import { Button } from "@components/ui/Button";

/**
 * The initial splash screen of the application.
 * It features a full-screen background image with animated text and a "Get Started" button.
 */
export default function SplashScreen({ navigation }: any) {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  // --- Animation Shared Values ---
  const gradientOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(hp(5));
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(hp(5));
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(hp(5));

  // --- Entrance Animations ---
  useEffect(() => {
    const animationConfig = { duration: 800, easing: Easing.out(Easing.exp) };
    gradientOpacity.value = withTiming(1, { ...animationConfig, duration: 1000 });
    titleOpacity.value = withDelay(100, withTiming(1, animationConfig));
    titleTranslateY.value = withDelay(100, withTiming(0, animationConfig));
    subtitleOpacity.value = withDelay(300, withTiming(1, animationConfig));
    subtitleTranslateY.value = withDelay(300, withTiming(0, animationConfig));
    buttonOpacity.value = withDelay(500, withTiming(1, animationConfig));
    buttonTranslateY.value = withDelay(500, withTiming(0, animationConfig));
  }, []);

  // --- Animated Styles ---
  const gradientAnimatedStyle = useAnimatedStyle(() => ({ opacity: gradientOpacity.value }));
  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));
  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  // --- Gradient Colors ---
  const gradientColors = isDarkMode
    ? ["transparent", "rgba(17, 24, 39, 0.8)", "#111827"]
    : ["transparent", "rgba(249, 250, 251, 0.8)", "#F9FAFB"];

  // --- Button Handler with Haptic ---
  const handleGetStarted = () => {
    HapticFeedback.trigger("impactMedium", {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    navigation.replace("Main");
  };

  return (
    <View className="flex-1">
      <ImageBackground
        source={require("@assets/images/splash.webp")}
        className="flex-1"
        resizeMode="cover"
      >
        {/* --- Bottom Fade Gradient --- */}
        <Animated.View
          style={[{ position: "absolute", bottom: 0, width: "100%", height: hp(35) }, gradientAnimatedStyle]}
        >
          <LinearGradient colors={gradientColors} locations={[0, 0.2, 1]} className="flex-1" />
        </Animated.View>

        {/* --- Animated Title --- */}
        <Animated.View
          style={[{ position: "absolute", bottom: hp(16), width: "100%" }, titleAnimatedStyle]}
          className="items-center"
        >
          <Text className="text-5xl font-heading text-text dark:text-dark-text text-center">
            XeroCanvas
          </Text>
        </Animated.View>

        {/* --- Animated Subtitle --- */}
        <Animated.View
          style={[{ position: "absolute", bottom: hp(12), width: "100%" }, subtitleAnimatedStyle]}
          className="items-center px-5"
        >
          <Text className="text-xl font-medium text-subtext dark:text-dark-subtext text-center">
            Discover a world of stunning wallpapers.
          </Text>
        </Animated.View>

        {/* --- Animated "Get Started" Button --- */}
        <Animated.View
          style={[{ position: "absolute", bottom: hp(4), width: "100%" }, buttonAnimatedStyle]}
          className="items-center"
        >
          <Button title="Get Started" onPress={handleGetStarted} />
        </Animated.View>
      </ImageBackground>
    </View>
  );
}
