import React from 'react';
import { View, ActivityIndicator } from 'react-native';
type ListFooterProps = {
  loadingMore: boolean;
};

export function ListFooter({ loadingMore }: ListFooterProps) {
  if (!loadingMore) {
    return null;
  }

  return (
    <View className="py-8">
      <ActivityIndicator size="large" color="#64748B" />
    </View>
  );
}