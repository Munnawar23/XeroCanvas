// src/screens/Favourites/components/FavouriteWallpaperCard.tsx

import React from 'react';
import { View, Image, TouchableOpacity, Pressable } from 'react-native';
import { HeartIcon } from 'react-native-heroicons/solid';
import { PixabayImage } from '@api/index';

type FavouriteCardProps = {
  item: PixabayImage;
  onPress: () => void; // <-- For navigating
  onUnfavourite: () => void; // <-- For removing
};

export const FavouriteWallpaperCard = ({ item, onPress, onUnfavourite }: FavouriteCardProps) => {
  return (
    // The entire card is now pressable to handle navigation
    <Pressable onPress={onPress}>
      <View className="relative">
        {/* The Image no longer uses aspectRatio. It fills a container with a fixed aspect ratio. */}
        <Image
          source={{ uri: item.webformatURL }}
          className="w-full aspect-[3/4] rounded-xl bg-border" // <-- Fixed aspect ratio for uniform size
          resizeMode="cover"
        />
        <View className="absolute top-2 right-2">
          <TouchableOpacity
            onPress={onUnfavourite}
            className="rounded-full bg-black/50 p-2.5"
          >
            {/* The heart icon is now red */}
            <HeartIcon size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};