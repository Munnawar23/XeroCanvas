import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { ExclamationTriangleIcon } from 'react-native-heroicons/outline';

type ErrorStateProps = {
  paddingTop: number;
  errorMessage: string;
  onRetry: () => void;
  refreshing: boolean;
};

export const ErrorState = React.memo(
  ({ paddingTop, errorMessage, onRetry, refreshing }: ErrorStateProps) => {
    return (
      <ScrollView
        style={{ flex: 1 }}
        className="bg-background"
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
            tintColor="#64748B" 
          />
        }
      >
        <ExclamationTriangleIcon size={64} className="text-subtext" />
        
        <Text className="mt-6 text-center font-heading text-xl text-text">
          Something Went Wrong
        </Text>
        <Text className="mt-2 text-center font-body text-subtext">{errorMessage}</Text>

        <Text className="mt-8 font-body text-md text-subtext/60">
          Pull down to try again
        </Text>
      </ScrollView>
    );
  }
);