import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import HapticFeedback from 'react-native-haptic-feedback';

type HeaderProps = {
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

export const Header = React.memo(
  ({ title, onBackPress, showBackButton = false, rightComponent, containerStyle }: HeaderProps) => {
    
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
        {/* --- Left Side Group --- */}
        {/* This View now groups the button and title together */}
        <View className="flex-1 flex-row items-center gap-x-4">
          {showBackButton && (
            <TouchableOpacity
              onPress={handleBackPress}
              className="p-1 rounded-full active:opacity-70"
            >
              <ArrowLeftIcon size={24} className="text-text" />
            </TouchableOpacity>
          )}

          <Text className="font-heading text-xl capitalize text-text" numberOfLines={1}>
            {title}
          </Text>
        </View>
        {rightComponent && <View>{rightComponent}</View>}
      </View>
    );
  }
);