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
import { wp, hp } from "@helpers/index";

// --- Step 1: Import your custom Button component ---
import { Button } from "@components/ui/Button";

export default function SplashScreen({ navigation }: any) {
  // --- Animation Shared Values (No changes here) ---
  const gradientOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(hp(5));
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(hp(5));
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(hp(5));

  // --- Animation useEffect hook (No changes here) ---
  useEffect(() => {
    gradientOpacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });
    titleOpacity.value = withDelay(100, withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) }));
    titleTranslateY.value = withDelay(100, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));
    subtitleOpacity.value = withDelay(300, withTiming(1, { duration: 900, easing: Easing.out(Easing.exp) }));
    subtitleTranslateY.value = withDelay(300, withTiming(0, { duration: 900, easing: Easing.out(Easing.exp) }));
    buttonOpacity.value = withDelay(500, withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) }));
    buttonTranslateY.value = withDelay(500, withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) }));
  }, []);

  // --- Animated Styles (No changes here) ---
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

  return (
    <View className="flex-1">
      <StatusBar barStyle="dark-content" />
      <ImageBackground
        source={require("@assets/images/splash.webp")}
        className="flex-1"
        resizeMode="cover"
      >
        {/* --- Bottom Fade Gradient (No changes) --- */}
        <Animated.View style={[{ position: "absolute", bottom: 0, width: "100%", height: hp(35) }, gradientAnimatedStyle]}>
          <LinearGradient
            colors={["transparent", "rgba(255,255,255,0.8)", "#ffffff"]}
            locations={[0, 0.2, 1]}
            className="flex-1"
          />
        </Animated.View>

        {/* --- Animated Title (No changes) --- */}
        <Animated.View style={[{ position: "absolute", bottom: hp(16), width: "100%" }, titleAnimatedStyle]} className="items-center">
          <Text className="text-5xl font-bold text-gray-900 text-center">XeroCanvas</Text>
        </Animated.View>

        {/* --- Animated Subtitle (No changes) --- */}
        <Animated.View style={[{ position: "absolute", bottom: hp(12), width: "100%" }, subtitleAnimatedStyle]} className="items-center px-5">
          <Text className="text-xl font-medium text-gray-800 text-center">
            Discover a world of stunning wallpapers.
          </Text>
        </Animated.View>

        {/* --- Step 2: Replace TouchableOpacity with the new Button --- */}
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