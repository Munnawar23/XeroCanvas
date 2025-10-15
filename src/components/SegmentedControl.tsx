// src/components/SegmentedControl.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type SegmentedControlProps = {
  options: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
};

export const SegmentedControl = ({ options, selectedValue, onValueChange }: SegmentedControlProps) => {
  return (
    <View className="flex-row rounded-lg bg-light-background p-0.5 dark:bg-dark-background">
      {options.map((option) => {
        const isActive = selectedValue === option.toLowerCase();
        return (
          <TouchableOpacity
            key={option}
            onPress={() => onValueChange(option.toLowerCase())}
            className={`flex-1 items-center rounded-md px-3 py-1
              ${isActive
                ? 'bg-light-accent dark:bg-dark-accent'
                : 'bg-transparent'
              }`}
          >
            <Text className={`font-medium ${isActive ? 'text-white' : 'text-light-text dark:text-dark-text'}`}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};