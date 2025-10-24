import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { LoadingCard } from '@components/common/LoadingCard';

type LoadingStateProps = {
  paddingTop: number;
};

export function LoadingState({ paddingTop }: LoadingStateProps) {
  return (
    <View
      style={{ paddingTop }}
      className="flex-1 bg-background px-4"
    >
      <StatusBar barStyle="dark-content" translucent />
      <Text className="font-heading text-3xl text-text">XeroCanvas</Text>
      <View className="mt-4 flex-row gap-x-3">
        {/* Column 1 */}
        <View className="flex-1 gap-y-3">
          <LoadingCard aspectRatio={0.8} />
          <LoadingCard aspectRatio={0.7} />
          <LoadingCard aspectRatio={0.6} />
        </View>
        {/* Column 2 */}
        <View className="flex-1 gap-y-3">
          <LoadingCard aspectRatio={0.7} />
          <LoadingCard aspectRatio={0.6} />
          <LoadingCard aspectRatio={0.5} />
        </View>
      </View>
    </View>
  );
}