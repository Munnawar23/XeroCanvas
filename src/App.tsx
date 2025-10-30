import React from "react";
import { StatusBar } from "react-native";
import { useColorScheme } from "nativewind";
import RootNavigator from "@navigation/RootNavigator";
import Toast from "react-native-toast-message";
import "../global.css";

export default function App() {
  const { colorScheme } = useColorScheme();

  return (
    <>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
      <RootNavigator />
      <Toast />
    </>
  );
}
