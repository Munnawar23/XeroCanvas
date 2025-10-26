import React, { useEffect } from "react";
import { View, ImageBackground, Text, StatusBar } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useColorScheme } from "nativewind";
import { wp, hp } from "@helpers/index";
import { Button } from "@components/ui/Button";

/**
 * The initial splash screen of the application.
 * It features a full-screen background image with animated text and a "Get Started" button.
 */
export default function SplashScreen({ navigation }: any) {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // --- Animation Shared Values ---
  // These values control the opacity and position of various UI elements for a staggered entrance animation.
  const gradientOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(hp(5));
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(hp(5));
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(hp(5));

  // --- Animation Setup Effect ---
  // This effect runs once on component mount to trigger the entrance animations.
  useEffect(() => {
    const animationConfig = { duration: 800, easing: Easing.out(Easing.exp) };
    gradientOpacity.value = withTiming(1, { ...animationConfig, duration: 1000 });
    titleOpacity.value = withDelay(100, withTiming(1, animationConfig));
    titleTranslateY.value = withDelay(100, withTiming(0, animationConfig));
    subtitleOpacity.value = withDelay(300, withTiming(1, animationConfig));
    subtitleTranslateY.value = withDelay(300, withTiming(0, animationConfig));
    buttonOpacity.value = withDelay(500, withTiming(1, animationConfig));
    buttonTranslateY.value = withDelay(500, withTiming(0, animationConfig));
  }, [gradientOpacity, titleOpacity, titleTranslateY, subtitleOpacity, subtitleTranslateY, buttonOpacity, buttonTranslateY]);

  // --- Animated Styles ---
  // These style objects are derived from the shared values to apply the animations to the components.
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

  // --- Theme-Aware Gradient Colors ---
  // The gradient fades to the app's background color for a seamless transition.
  const gradientColors = isDarkMode
    ? ["transparent", "rgba(17, 24, 39, 0.8)", "#111827"] // Fades to dark.background
    : ["transparent", "rgba(249, 250, 251, 0.8)", "#F9FAFB"]; // Fades to background

  return (
    <View className="flex-1">
      {/* Status bar adapts to the current theme */}
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <ImageBackground
        source={require("@assets/images/splash.webp")}
        className="flex-1"
        resizeMode="cover"
      >
        {/* --- Bottom Fade Gradient --- */}
        <Animated.View style={[{ position: "absolute", bottom: 0, width: "100%", height: hp(35) }, gradientAnimatedStyle]}>
          <LinearGradient
            colors={gradientColors}
            locations={[0, 0.2, 1]}
            className="flex-1"
          />
        </Animated.View>

        {/* --- Animated Title --- */}
        <Animated.View style={[{ position: "absolute", bottom: hp(16), width: "100%" }, titleAnimatedStyle]} className="items-center">
          <Text className="text-5xl font-heading text-text dark:text-dark-text text-center">
            XeroCanvas
          </Text>
        </Animated.View>

        {/* --- Animated Subtitle --- */}
        <Animated.View style={[{ position: "absolute", bottom: hp(12), width: "100%" }, subtitleAnimatedStyle]} className="items-center px-5">
          <Text className="text-xl font-medium text-subtext dark:text-dark-subtext text-center">
            Discover a world of stunning wallpapers.
          </Text>
        </Animated.View>

        {/* --- Animated "Get Started" Button --- */}
        <Animated.View
          style={[{ position: "absolute", bottom: hp(4), width: "100%" }, buttonAnimatedStyle]}
          className="items-center"
        >
          <Button
            title="Get Started"
            onPress={() => navigation.replace("Main")}
          />
        </Animated.View>
      </ImageBackground>
    </View>
  );
}