import React, { useEffect } from "react";
import { View, ImageBackground, Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { wp, hp } from "@helpers/index";

export default function SplashScreen({ navigation }: any) {
  // --- Animation Shared Values ---
  const gradientOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(hp(5));
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(hp(5));
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(hp(5));

  useEffect(() => {
    gradientOpacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });
    titleOpacity.value = withDelay(
      100,
      withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) })
    );
    titleTranslateY.value = withDelay(
      100,
      withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) })
    );

    subtitleOpacity.value = withDelay(
      300,
      withTiming(1, { duration: 900, easing: Easing.out(Easing.exp) })
    );
    subtitleTranslateY.value = withDelay(
      300,
      withTiming(0, { duration: 900, easing: Easing.out(Easing.exp) })
    );

    buttonOpacity.value = withDelay(
      500,
      withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) })
    );
    buttonTranslateY.value = withDelay(
      500,
      withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) })
    );
  }, []);

  const gradientAnimatedStyle = useAnimatedStyle(() => ({
    opacity: gradientOpacity.value,
  }));

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
      <ImageBackground
        source={require("@assets/images/splash.webp")}
        className="flex-1"
        resizeMode="cover"
      >
        {/* --- Bottom Fade Gradient --- */}
        <Animated.View
          style={[{ position: "absolute", bottom: 0, width: "100%", height: hp(35) }, gradientAnimatedStyle]}
        >
          <LinearGradient
            colors={["transparent", "rgba(255,255,255,0.8)", "#ffffff"]}
            locations={[0, 0.2, 1]}
            className="flex-1"
          />
        </Animated.View>

        {/* --- Animated Title --- */}
        <Animated.View
          style={[{ position: "absolute", bottom: hp(19), width: "100%" }, titleAnimatedStyle]}
          className="items-center"
        >
          <Text className="text-5xl font-bold text-gray-900 text-center">
            XeroCanvas
          </Text>
        </Animated.View>

        {/* --- Animated Subtitle --- */}
        <Animated.View
          style={[{ position: "absolute", bottom: hp(13), width: "100%" }, subtitleAnimatedStyle]}
          className="items-center px-5"
        >
          <Text className="text-xl font-medium text-gray-800 text-center">
            Press the button to enter a world of stunning wallpapers.
          </Text>
        </Animated.View>

        <Animated.View
          style={[{ position: "absolute", bottom: hp(4), width: "100%" }, buttonAnimatedStyle]}
          className="items-center"
        >
          <TouchableOpacity
            onPress={() => navigation.replace("Main")}
            style={{ width: wp(90) }}
            className="bg-black py-6 rounded-2xl items-center"
          >
            <Text className="text-white font-bold text-lg">Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      </ImageBackground>
    </View>
  );
}