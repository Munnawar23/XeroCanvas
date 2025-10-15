// src/navigation/types.ts
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// This is the master list of all screens in your stack navigator and their parameters.
export type RootStackParamList = {
  Home: undefined; // The screen that holds your main tab navigator
  Detail: { wallpaper: string };
  CategoryDetail: { category: string };
};

// A reusable, generic navigation prop type. Use this in any screen
// that needs to call navigation.navigate(), navigation.push(), etc.
export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// A reusable prop type for screens that need to access route.params.
// Replace 'CategoryDetail' with the specific screen's name.
export type CategoryDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'CategoryDetail'>;
export type DetailScreenProps = NativeStackScreenProps<RootStackParamList, 'Detail'>;