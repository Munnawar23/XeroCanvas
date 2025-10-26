import React, { useMemo } from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNetInfo } from "@react-native-community/netinfo";
import { useColorScheme } from "nativewind";

// Screens
import HomeScreen from "@screens/Home/HomeScreen";
import CategoryScreen from "@screens/Category/CategoryScreen";
import SearchScreen from "@screens/Search/SearchScreen";
import FavouritesScreen from "@screens/Favourites/FavouritesScreen";

// Components
import OfflineState from "@components/layout/OfflineState";

// Heroicons
import {
  HomeIcon,
  TagIcon,
  MagnifyingGlassIcon,
  HeartIcon,
} from "react-native-heroicons/outline";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const netInfo = useNetInfo();
  const { colorScheme } = useColorScheme();

  // Tailwind colors from config
  const colors = useMemo(
    () => ({
      active: colorScheme === "dark" ? "#A78BFA" : "#3B82F6",
      inactive: colorScheme === "dark" ? "#CBD5E1" : "#64748B",
      background: colorScheme === "dark" ? "#1E293B" : "#FFFFFF",
      shadow: colorScheme === "dark" ? "#000" : "#000",
    }),
    [colorScheme]
  );

  // Show offline state if there is no internet
  if (netInfo.isConnected === false) {
    return <OfflineState />;
  }

  /**
   * Returns the appropriate icon for each tab.
   * Uses useMemo to avoid unnecessary re-renders.
   */
  const renderIcon = useMemo(
    () => (routeName: string, color: string, focused: boolean) => {
      const iconSize = focused ? 26 : 22;
      switch (routeName) {
        case "Home":
          return <HomeIcon color={color} size={iconSize} />;
        case "Category":
          return <TagIcon color={color} size={iconSize} />;
        case "Search":
          return <MagnifyingGlassIcon color={color} size={iconSize} />;
        case "Favourites":
          return <HeartIcon color={color} size={iconSize} />;
        default:
          return <HomeIcon color={color} size={iconSize} />;
      }
    },
    []
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: "absolute" as const,
          backgroundColor: colors.background,
          borderRadius: 20,
          marginHorizontal: 40,
          marginBottom: Platform.OS === "ios" ? 40 : 30,
          paddingBottom: 8,
          paddingTop: 8,
          height: Platform.OS === "ios" ? 60 : 55,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: colors.active,
        tabBarInactiveTintColor: colors.inactive,
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size, focused }) => renderIcon(route.name, color, focused),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Category" component={CategoryScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Favourites" component={FavouritesScreen} />
    </Tab.Navigator>
  );
}
