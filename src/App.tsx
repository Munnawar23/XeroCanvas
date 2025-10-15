// src/App.tsx

import React from "react";
import { StatusBar } from "react-native";
import RootNavigator from "@navigation/RootNavigator";
import { ThemeProvider } from "@context/ThemeContext"; 
import "../global.css";

export default function App() {
  return (
    // Wrap the entire app with the ThemeProvider
    <ThemeProvider>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </ThemeProvider>
  );
}