import React from "react";
import { StatusBar } from "react-native";
import RootNavigator from "@navigation/RootNavigator";
import Toast from 'react-native-toast-message'; // 1. Import the Toast component
import "../global.css";

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
      <Toast />
    </>
  );
}