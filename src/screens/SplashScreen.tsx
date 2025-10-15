import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useSafePadding } from "@hooks/useSafePadding";
import { useColorScheme } from "nativewind";

export default function SplashScreen({ navigation }: any) {
  const safe = useSafePadding();
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Main"); 
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={[{ flex: 1, justifyContent: "center", alignItems: "center" }, safe]}
      className="bg-light-background dark:bg-dark-background"
    >
      <Text className="text-3xl font-heading text-light-accent dark:text-dark-accent mb-4">
        MyApp
      </Text>
      <ActivityIndicator
        size="large"
        color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
      />
    </View>
  );
}
