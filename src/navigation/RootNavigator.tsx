// src/navigation/RootNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import SplashScreen from "@screens/SplashScreen";
import MainTabNavigator from "@navigation/TabNavigator";
import CategoryDetailScreen from "@screens/CategoryDetailScreen";
import DetailScreen from "@screens/DetailScreen"; // <-- 1. IMPORT THE DETAIL SCREEN

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined; // This represents the screen with the Tab Navigator
  Detail: { wallpaper: string };
  CategoryDetail: { category: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Main app flow screens */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
        
        {/* Screens that are pushed on top of the main flow */}
        <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}