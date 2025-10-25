import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import LottieView from 'lottie-react-native';
import { useSafePadding } from '@hooks/useSafePadding';

const OfflineState = () => {
  const { paddingTop } = useSafePadding();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#64748B" />
      }
    >
      <View
        style={{ paddingTop }}
        className="flex-1 items-center justify-center bg-background space-y-3 px-8"
      >
        <LottieView
          source={require('../../assets/animations/internet.json')}
          autoPlay
          loop
          style={{ width: 280, height: 280 }}
        />
        <Text className="font-heading text-2xl text-text">
          No Connection
        </Text>
        <Text className="text-center font-body text-subtext">
          Please check your internet connection and try again.
        </Text>
        {/* Added line to clarify internet requirement */}
        <Text className="text-center font-body text-subtext">
          An active internet connection is required to use this app.
        </Text>
        <Text className="text-center font-body text-subtext mt-2">
          Pull down to refresh
        </Text>
      </View>
    </ScrollView>
  );
};

export default OfflineState;