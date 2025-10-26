import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "@screens/Splash/SplashScreen";
import MainTabNavigator from "@navigation/TabNavigator";
import CategoryDetailScreen from "@screens/Category/components/CategoryDetailScreen";
import WallpaperScreen from "@screens/Wallpaper/WallpaperScreen"; 

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  Detail: { wallpaper: string };
  CategoryDetail: { category: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
        <Stack.Screen name="Detail" component={WallpaperScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}