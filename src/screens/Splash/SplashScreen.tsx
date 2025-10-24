import React from "react";
import { View, ImageBackground } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Button from "@components/ui/Button";

export default function SplashScreen({ navigation }: any) {
  return (
    <View className="flex-1">
      <ImageBackground
        source={require("@assets/images/splash.webp")}
        className="flex-1"
        resizeMode="cover"
      >
        {/* Bottom fade only */}
        <LinearGradient
          colors={["transparent", "rgba(255, 255, 255, 0.6)", "#ffffff"]}
          locations={[0, 0.3, 1]}
          style={{ position: "absolute", bottom: 0, width: "100%", height: "30%" }}
        />

        {/* Get Started button */}
        <View className="absolute bottom-10 w-full items-center">
          <Button
            title="Get Started"
            onPress={() => navigation.replace("Main")}
          />
        </View>
      </ImageBackground>
    </View>
  );
}
