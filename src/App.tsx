import React from "react";
import { StatusBar } from "react-native";
import RootNavigator from "@navigation/RootNavigator";
import "../global.css";

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
      </>
  );
}