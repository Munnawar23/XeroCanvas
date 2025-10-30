import React, { useCallback } from 'react';
import { View, Image, TouchableOpacity, Pressable } from 'react-native';
import { HeartIcon } from 'react-native-heroicons/solid';
import HapticFeedback from 'react-native-haptic-feedback';
import { PixabayImage } from '@api/index';

type FavouriteCardProps = {
  item: PixabayImage;
  onPress: () => void;
  onUnfavourite: () => void;
};

export const FavouriteWallpaperCard = React.memo(
  ({ item, onPress, onUnfavourite }: FavouriteCardProps) => {

    // Handle unfavourite with haptics
    const handleUnfavourite = useCallback(() => {
      HapticFeedback.trigger('impactMedium', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
      onUnfavourite();
    }, [onUnfavourite]);

    return (
      <Pressable onPress={onPress}>
        <View className="relative">
          <Image
            source={{ uri: item.webformatURL }}
            className="w-full aspect-[3/4] rounded-xl bg-border dark:bg-dark-border"
            resizeMode="cover"
          />

          {/* Unfavourite Button */}
          <View className="absolute top-2 right-2">
            <TouchableOpacity
              onPress={handleUnfavourite}
              className="rounded-full bg-black/50 p-2.5 active:opacity-70"
            >
              <HeartIcon size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    );
  }
);
