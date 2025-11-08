import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { ChevronRightIcon } from 'react-native-heroicons/outline';
import HapticFeedback from 'react-native-haptic-feedback';
import { useColorScheme } from 'nativewind';

type SettingsOptionProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  danger?: boolean;
};

export const SettingsOption = ({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  danger = false,
}: SettingsOptionProps) => {
  const { colorScheme } = useColorScheme();

  const handlePress = () => {
    HapticFeedback.trigger('impactMedium', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex-row items-center justify-between bg-card dark:bg-dark-card rounded-2xl p-4 mb-3"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center flex-1">
        <View className={`p-3 rounded-full mr-4 ${danger ? 'bg-red-100 dark:bg-red-900/30' : 'bg-accent/20 dark:bg-dark-accent/20'}`}>
          {icon}
        </View>
        <View className="flex-1">
          <Text className={`text-base font-semibold ${danger ? 'text-red-600 dark:text-red-400' : 'text-text dark:text-dark-text'}`}>
            {title}
          </Text>
          {subtitle && (
            <Text className="text-sm text-subtext dark:text-dark-subtext mt-1">
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {showChevron && (
        <ChevronRightIcon
          size={20}
          color={colorScheme === 'dark' ? '#9CA3AF' : '#64748B'}
        />
      )}
    </TouchableOpacity>
  );
};
