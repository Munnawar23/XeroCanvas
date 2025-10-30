import React, { useMemo } from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNetInfo } from "@react-native-community/netinfo";
import { useColorScheme } from "nativewind";
import HapticFeedback from "react-native-haptic-feedback";

// Screens
import HomeScreen from "@screens/Home/HomeScreen";
import CategoryScreen from "@screens/Category/CategoryScreen";
import SearchScreen from "@screens/Search/SearchScreen";
import FavouritesScreen from "@screens/Favourites/FavouritesScreen";

// Components
import OfflineState from "@components/layout/OfflineState";

// Icons
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

  const colors = useMemo(
    () => ({
      active: colorScheme === "dark" ? "#FF6B35" : "#D4A574",
      inactive: colorScheme === "dark" ? "#C9B896" : "#8D6E63",
      background: colorScheme === "dark" ? "#1A1612" : "#F5E6D3",
      tabBar: colorScheme === "dark" ? "#2B2520" : "#FFF8E7",
      shadow: colorScheme === "dark" ? "#000" : "#3E2723",
    }),
    [colorScheme]
  );

  // --- Icon Renderer ---
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

  const triggerMediumHaptic = () => {
    HapticFeedback.trigger("impactMedium", {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  };

  if (netInfo.isConnected === false) {
    return <OfflineState />;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: "absolute" as const,
          backgroundColor: colors.tabBar,
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
        tabBarIcon: ({ color, focused }) => renderIcon(route.name, color, focused),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        listeners={{
          tabPress: triggerMediumHaptic,
        }}
      />
      <Tab.Screen
        name="Category"
        component={CategoryScreen}
        listeners={{
          tabPress: triggerMediumHaptic,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        listeners={{
          tabPress: triggerMediumHaptic,
        }}
      />
      <Tab.Screen
        name="Favourites"
        component={FavouritesScreen}
        listeners={{
          tabPress: triggerMediumHaptic,
        }}
      />
    </Tab.Navigator>
  );
}