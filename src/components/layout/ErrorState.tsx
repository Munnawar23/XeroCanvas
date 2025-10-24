import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';

// Define the types for the props that this component expects
type ErrorStateProps = {
  paddingTop: number;
  errorMessage: string;
  onRetry: () => void; 
};

export function ErrorState({ paddingTop, errorMessage, onRetry }: ErrorStateProps) {
  return (
    <View
      style={{ paddingTop }}
      className="flex-1 bg-background justify-center items-center px-6"
    >
      <Text className="text-text text-lg text-center mb-4">
        {errorMessage}
      </Text>
      <TouchableOpacity
        onPress={onRetry}
        className="bg-slate-200 active:bg-slate-300 px-6 py-3 rounded-lg"
      >
        <Text className="text-text font-semibold">Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}