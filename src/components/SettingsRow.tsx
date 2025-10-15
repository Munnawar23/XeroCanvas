// src/components/SettingsRow.tsx
import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRightIcon } from 'react-native-heroicons/outline';

type SettingsRowProps = {
  icon: ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
};

export const SettingsRow = ({ icon, label, value, onPress, destructive }: SettingsRowProps) => {
  const labelColor = destructive
    ? 'text-red-500'
    : 'text-light-text dark:text-dark-text';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center justify-between py-3"
    >
      <View className="flex-row items-center">
        {icon}
        <Text className={`ml-4 font-body text-base ${labelColor}`}>{label}</Text>
      </View>
      <View className="flex-row items-center">
        {value && <Text className="mr-2 font-body text-light-subtext dark:text-dark-subtext">{value}</Text>}
        {onPress && <ChevronRightIcon size={20} className="text-light-subtext dark:text-dark-subtext" />}
      </View>
    </TouchableOpacity>
  );
};