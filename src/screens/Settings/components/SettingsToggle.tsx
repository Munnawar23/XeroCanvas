import React from 'react';
import { View, Text, Switch, Platform } from 'react-native';
import HapticFeedback from 'react-native-haptic-feedback';
import { useColorScheme } from 'nativewind';

type SettingsToggleProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export const SettingsToggle = ({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
}: SettingsToggleProps) => {
  const { colorScheme } = useColorScheme();

  const handleToggle = (newValue: boolean) => {
    HapticFeedback.trigger('impactMedium', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    onValueChange(newValue);
  };

  const isDarkMode = colorScheme === 'dark';

  return (
    <View className="flex-row items-center justify-between bg-card dark:bg-dark-card rounded-2xl p-4 mb-3">
      <View className="flex-row items-center flex-1">
        <View className="bg-accent/20 dark:bg-dark-accent/20 p-3 rounded-full mr-4">
          {icon}
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-text dark:text-dark-text">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-sm text-subtext dark:text-dark-subtext mt-1">
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={handleToggle}
        trackColor={{
          false: isDarkMode ? '#374151' : '#E5E7EB',
          true: isDarkMode ? '#FF6B35' : '#D4A574',
        }}
        thumbColor={value ? '#FFFFFF' : '#F3F4F6'}
        ios_backgroundColor={isDarkMode ? '#374151' : '#E5E7EB'}
      />
    </View>
  );
};
