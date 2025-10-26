import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import HapticFeedback from 'react-native-haptic-feedback';
import { useColorScheme } from 'nativewind'; // 1. Import useColorScheme

/**
 * Props for the Header component.
 */
type HeaderProps = {
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

/**
 * A memoized, reusable header component for screens.
 * It includes a title, an optional back button, and a slot for a right-side component.
 */
export const Header = React.memo(
  ({ title, onBackPress, showBackButton = false, rightComponent, containerStyle }: HeaderProps) => {
    // 2. Get the current color scheme to determine the correct icon color
    const { colorScheme } = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    // 3. Define the icon color based on the theme from your tailwind.config.js
    // Light text: #1E293B, Dark text: #F1F5F9
    const iconColor = isDarkMode ? '#F1F5F9' : '#1E293B';

    /**
     * Memoized handler for the back button press.
     * Triggers haptic feedback and calls the provided onBackPress function.
     */
    const handleBackPress = useCallback(() => {
      HapticFeedback.trigger('impactLight');
      if (onBackPress) {
        onBackPress();
      }
    }, [onBackPress]);

    return (
      <View
        className="flex-row items-center justify-between px-4 pb-4"
        style={containerStyle}
      >
        {/* --- Left Side: Groups the back button and title for proper alignment --- */}
        <View className="flex-1 flex-row items-center gap-x-4">
          {showBackButton && (
            <TouchableOpacity
              onPress={handleBackPress}
              className="p-1 rounded-full active:opacity-70"
            >
              {/* 4. Pass the dynamic iconColor to the 'color' prop instead of using className */}
              <ArrowLeftIcon size={24} color={iconColor} />
            </TouchableOpacity>
          )}

          {/* Title text color correctly uses NativeWind classes */}
          <Text 
            className="font-heading text-xl capitalize text-text dark:text-dark-text" 
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        {/* --- Right Side: Renders the provided component --- */}
        {rightComponent && <View>{rightComponent}</View>}
      </View>
    );
  }
);