import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import React from 'react';

export const EmptyState = React.memo(() => {
  return (
    <View className="flex-1 items-center justify-center space-y-3 px-8">
      <LottieView
        source={require('@assets/animations/empty.json')}
        autoPlay
        loop
        style={{ width: 300, height: 300 }}
      />
      
      <Text className="font-heading text-xl text-text dark:text-dark-text">
        No Favourites Yet
      </Text>
      
      <Text className="text-center font-body text-subtext dark:text-dark-subtext">
        Tap the heart on a wallpaper to save it here.
      </Text>
    </View>
  );
});