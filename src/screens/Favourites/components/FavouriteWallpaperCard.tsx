import React from 'react';
import { View, Image, TouchableOpacity, Pressable } from 'react-native';
import { HeartIcon } from 'react-native-heroicons/solid';
import { PixabayImage } from '@api/index';

/**
 * Props for the FavouriteWallpaperCard component.
 */
type FavouriteCardProps = {
  /** The wallpaper data object to display. */
  item: PixabayImage;
  /** Function to handle navigation when the card is pressed. */
  onPress: () => void;
  /** Function to handle removing the item from favourites. */
  onUnfavourite: () => void;
};

/**
 * A memoized card component specifically for the Favourites screen.
 * It displays a wallpaper image with a fixed aspect ratio and an "unfavourite" button.
 */
export const FavouriteWallpaperCard = React.memo(({ item, onPress, onUnfavourite }: FavouriteCardProps) => {
  return (
    // The entire card is pressable for navigation
    <Pressable onPress={onPress}>
      <View className="relative">
        {/* The Image fills a container with a fixed aspect ratio for a uniform grid */}
        <Image
          source={{ uri: item.webformatURL }}
          // Use a theme-aware border color as a placeholder background
          className="w-full aspect-[3/4] rounded-xl bg-border dark:bg-dark-border"
          resizeMode="cover"
        />
        
        {/* Unfavourite Button */}
        <View className="absolute top-2 right-2">
          <TouchableOpacity
            onPress={onUnfavourite}
            className="rounded-full bg-black/50 p-2.5 active:opacity-70"
          >
            {/* The red heart icon indicates the item is favourited */}
            <HeartIcon size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
});