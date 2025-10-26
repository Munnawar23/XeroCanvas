import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import LottieView from 'lottie-react-native';
import { useSafePadding } from '@hooks/useSafePadding';
import { useColorScheme } from 'nativewind';

/**
 * A full-screen component displayed when the user has no internet connection.
 * It features an animation and provides a pull-to-refresh action to re-check the connection.
 */
const OfflineState = () => {
  const { paddingTop } = useSafePadding();
  const { colorScheme } = useColorScheme();
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Handles the pull-to-refresh action.
   * A short timeout is used to provide feedback to the user before the app re-checks connectivity.
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // In a real app, you would re-check network status here.
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <ScrollView
      className="bg-background dark:bg-dark-background"
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          // Use theme-aware color for the refresh indicator
          tintColor={colorScheme === 'dark' ? '#9CA3AF' : '#64748B'}
        />
      }
    >
      <View
        style={{ paddingTop }}
        className="flex-1 items-center justify-center space-y-3 px-8"
      >
        {/* No Connection Animation */}
        <LottieView
          source={require('../../assets/animations/internet.json')}
          autoPlay
          loop
          style={{ width: 280, height: 280 }}
        />

        {/* Title */}
        <Text className="font-heading text-2xl text-text dark:text-dark-text">
          No Connection
        </Text>

        {/* Informational Text */}
        <Text className="text-center font-body text-subtext dark:text-dark-subtext">
          Please check your internet connection and try again. An active
          internet connection is required to use this app.
        </Text>
        
        {/* Call to Action */}
        <Text className="text-center font-body text-subtext/60 dark:text-dark-subtext/60 mt-2">
          Pull down to refresh
        </Text>
      </View>
    </ScrollView>
  );
};

export default OfflineState;