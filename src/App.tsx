import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { useColorScheme } from "nativewind";
import RootNavigator from "@navigation/RootNavigator";
import Toast from "react-native-toast-message";
import { ThemeStore } from "@store/ThemeStore";
import "../global.css";

export default function App() {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    ThemeStore.getTheme().then((savedTheme) => {
      setColorScheme(savedTheme);
    });
  }, []);

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
