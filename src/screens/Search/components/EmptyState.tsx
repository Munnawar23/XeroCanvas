import React from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';

/**
 * Props for the EmptyState component.
 */
type EmptyStateProps = {
  /** Indicates if a search has been performed. */
  hasSearched: boolean;
  /** The current search query string. */
  searchQuery: string;
};

/**
 * A memoized component that displays a message for the search screen.
 * It shows a "no results" message after a search or a prompt to start searching otherwise.
 */
export const EmptyState = React.memo(({ hasSearched, searchQuery }: EmptyStateProps) => {
  // Determine if the state should be "No Results" or the initial prompt
  const isNoResults = hasSearched && searchQuery.length > 0;

  return (
    <View className="flex-1 items-center justify-center space-y-3 px-8">
      {/* Search animation */}
      <LottieView
        source={require('@assets/animations/search.json')}
        autoPlay
        loop
        style={{ width: 250, height: 250 }}
      />

      {/* Title Text */}
      <Text className="font-heading text-xl text-text dark:text-dark-text">
        {isNoResults ? 'No Results Found' : 'Find Your Next Wallpaper'}
      </Text>

      {/* Subtitle Text */}
      <Text className="text-center font-body text-subtext dark:text-dark-subtext">
        {isNoResults
          ? 'Try a different keyword or adjust your filters.'
          : 'Search for anything you can imagine.'}
      </Text>
    </View>
  );
});