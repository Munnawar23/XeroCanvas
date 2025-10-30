import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useColorScheme } from "nativewind";

type ListFooterProps = {
  loadingMore: boolean;
};

/**
 * A footer component for lists that displays an activity indicator
 * when more items are being loaded (infinite scroll).
 */
export function ListFooter({ loadingMore }: ListFooterProps) {
  const { colorScheme } = useColorScheme();

  if (!loadingMore) {
    return null;
  }

  return (
    <View className="py-8">
      <ActivityIndicator 
        size="large" 
        color={colorScheme === 'dark' ? '#9CA3AF' : '#64748B'} 
      />
    </View>
  );
}