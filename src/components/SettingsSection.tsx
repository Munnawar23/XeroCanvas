// src/components/SettingsSection.tsx
import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';

type SettingsSectionProps = {
  title: string;
  children: ReactNode;
};

export const SettingsSection = ({ title, children }: SettingsSectionProps) => (
  <View className="mb-4 rounded-xl bg-light-card p-4 dark:bg-dark-card">
    <Text className="mb-2 font-heading text-lg text-light-text dark:text-dark-text">
      {title}
    </Text>
    {children}
  </View>
);