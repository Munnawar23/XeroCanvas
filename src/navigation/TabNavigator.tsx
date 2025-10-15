import React from "react";
import { useColorScheme } from "nativewind";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "@screens/HomeScreen";
import CategoryScreen from "@screens/CategoryScreen";
import SearchScreen from "@screens/SearchScreen";
import DownloadsScreen from "@screens/DownloadsScreen";
import SettingsScreen from "@screens/SettingsScreen";

// Heroicons
import {
  HomeIcon,
  TagIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  Cog6ToothIcon,
} from "react-native-heroicons/outline";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { colorScheme } = useColorScheme();

  const tabBarStyle = {
    backgroundColor: colorScheme === "dark" ? "#1E293B" : "#FFFFFF",
    borderTopColor: colorScheme === "dark" ? "#334155" : "#E5E7EB",
  };

  const activeTint = colorScheme === "dark" ? "#60A5FA" : "#3B82F6";
  const inactiveTint = colorScheme === "dark" ? "#94A3B8" : "#64748B";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        tabBarIcon: ({ color, size }) => {
          let icon = <HomeIcon color={color} size={size} />;

          switch (route.name) {
            case "Home":
              icon = <HomeIcon color={color} size={size} />;
              break;
            case "Category":
              icon = <TagIcon color={color} size={size} />;
              break;
            case "Search":
              icon = <MagnifyingGlassIcon color={color} size={size} />;
              break;
            case "Download":
              icon = <ArrowDownTrayIcon color={color} size={size} />;
              break;
            case "Settings":
              icon = <Cog6ToothIcon color={color} size={size} />;
              break;
          }

          return icon;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Category" component={CategoryScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Downloads" component={DownloadsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
