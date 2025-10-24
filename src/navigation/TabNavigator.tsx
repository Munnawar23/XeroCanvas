import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "@screens/Home/HomeScreen";
import CategoryScreen from "@screens/Category/CategoryScreen";
import SearchScreen from "@screens/Search/SearchScreen";
import DownloadsScreen from "@screens/Downloads/DownloadsScreen";

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
  // Static styles for the light theme
  const tabBarStyle = {
    backgroundColor: "#FFFFFF", // from theme.colors.card
    borderTopColor: "#E5E7EB", // from theme.colors.border
  };

  const activeTint = "#3B82F6"; // from theme.colors.accent
  const inactiveTint = "#64748B"; // from theme.colors.subtext

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
            case "Downloads": // Corrected name to match screen
              icon = <ArrowDownTrayIcon color={color} size={size} />;
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
    </Tab.Navigator>
  );
}