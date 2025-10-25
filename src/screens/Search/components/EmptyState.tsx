import React from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';

type EmptyStateProps = {
  hasSearched: boolean;
  searchQuery: string;
};

export const EmptyState = React.memo(({ hasSearched, searchQuery }: EmptyStateProps) => {
  const isNoResults = hasSearched && searchQuery.length > 0;

  return (
    <View className="flex-1 items-center justify-center space-y-3 px-8">
      <LottieView
        source={require('@assets/animations/search.json')}
        autoPlay
        loop
        style={{ width: 250, height: 250 }}
      />
      <Text className="font-heading text-xl text-text">
        {isNoResults ? 'No Results Found' : 'Find Your Next Wallpaper'}
      </Text>
      <Text className="text-center font-body text-subtext">
        {isNoResults
          ? 'Try a different keyword or adjust your filters.'
          : 'Search for anything you can imagine.'}
      </Text>
    </View>
  );
});