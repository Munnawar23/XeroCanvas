import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNetInfo } from "@react-native-community/netinfo";
import { Platform } from "react-native";
import HomeScreen from "@screens/Home/HomeScreen";
import CategoryScreen from "@screens/Category/CategoryScreen";
import SearchScreen from "@screens/Search/SearchScreen";
import FavouritesScreen from "@screens/Favourites/FavouritesScreen";
import SettingsScreen from "@screens/Settings/SettingsScreen";
import OfflineState from "@components/layout/OfflineState";

// Heroicons
import {
  HomeIcon,
  TagIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  Cog6ToothIcon,
} from "react-native-heroicons/outline";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const netInfo = useNetInfo();

  const activeTint = "#3B82F6";
  const inactiveTint = "#64748B";

  if (netInfo.isConnected === false) {
    return <OfflineState />;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: "absolute" as const,
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          marginHorizontal: 40,
          marginBottom: Platform.OS === "ios" ? 40 : 30,
          paddingBottom: 8,
          paddingTop: 8,
          height: Platform.OS === "ios" ? 60 : 55,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.15,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size, focused }) => {
          const iconSize = focused ? 26 : 22;
          let icon = <HomeIcon color={color} size={iconSize} />;

          switch (route.name) {
            case "Home":
              icon = <HomeIcon color={color} size={iconSize} />;
              break;
            case "Category":
              icon = <TagIcon color={color} size={iconSize} />;
              break;
            case "Search":
              icon = <MagnifyingGlassIcon color={color} size={iconSize} />;
              break;
            case "Favourites":
              icon = <HeartIcon color={color} size={iconSize} />;
              break;
            case "Settings":
              icon = <Cog6ToothIcon color={color} size={iconSize} />;
              break;
          }

          return icon;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Category" component={CategoryScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Favourites" component={FavouritesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}