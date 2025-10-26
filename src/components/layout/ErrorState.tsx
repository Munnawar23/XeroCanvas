import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { ExclamationTriangleIcon } from 'react-native-heroicons/outline';
import { useColorScheme } from "nativewind";

type ErrorStateProps = {
  paddingTop: number;
  errorMessage: string;
  onRetry: () => void;
  refreshing: boolean;
};

/**
 * A component displayed when an API error occurs.
 * It shows an error message and allows the user to pull-to-retry.
 */
export const ErrorState = React.memo(
  ({ paddingTop, errorMessage, onRetry, refreshing }: ErrorStateProps) => {
    const { colorScheme } = useColorScheme();

    return (
      <ScrollView
        className="bg-background dark:bg-dark-background"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: paddingTop,
          paddingHorizontal: 24,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRetry}
            tintColor={colorScheme === 'dark' ? '#9CA3AF' : '#64748B'} 
          />
        }
      >
        {/* Icon */}
        <ExclamationTriangleIcon size={64} className="text-subtext dark:text-dark-subtext" />
        
        {/* Error Title */}
        <Text className="mt-6 text-center font-heading text-xl text-text dark:text-dark-text">
          Something Went Wrong
        </Text>
        
        {/* Error Message */}
        <Text className="mt-2 text-center font-body text-subtext dark:text-dark-subtext">
          {errorMessage}
        </Text>

        {/* Retry Instruction */}
        <Text className="mt-8 font-body text-md text-subtext/60 dark:text-dark-subtext/60">
          Pull down to try again
        </Text>
      </ScrollView>
    );
  }
);