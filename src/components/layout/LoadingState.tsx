import React from 'react';
import { View } from 'react-native';
import { LoadingCard } from '@components/common/LoadingCard';

type LoadingStateProps = {
  paddingTop: number;
};

/**
 * A placeholder screen displayed while the initial data is being fetched.
 * It shows a masonry layout of shimmering cards to mimic the final layout.
 */
export function LoadingState({ paddingTop }: LoadingStateProps) {
  return (
    <View
      style={{ paddingTop }}
      className="flex-1 bg-background dark:bg-dark-background px-4">
      {/* An empty title space to match the home screen layout */}
      <View className="h-[48px] mt-3" />
      <View className="flex-row gap-x-3">
        {/* Column 1 of loading cards */}
        <View className="flex-1 gap-y-3">
          <LoadingCard aspectRatio={0.8} />
          <LoadingCard aspectRatio={0.7} />
          <LoadingCard aspectRatio={0.6} />
        </View>
        {/* Column 2 of loading cards */}
        <View className="flex-1 gap-y-3">
          <LoadingCard aspectRatio={0.7} />
          <LoadingCard aspectRatio={0.6} />
          <LoadingCard aspectRatio={0.5} />
        </View>
      </View>
    </View>
  );
}