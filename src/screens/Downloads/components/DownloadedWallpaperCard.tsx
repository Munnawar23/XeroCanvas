// src/components/DownloadedWallpaperCard.tsx

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { TrashIcon } from 'react-native-heroicons/solid';
import { DownloadedWallpaper } from '@utils/storage';

type DownloadedCardProps = {
  item: DownloadedWallpaper;
  onDelete: () => void;
};

export const DownloadedWallpaperCard = ({ item, onDelete }: DownloadedCardProps) => {
  // Format the date for display
  const formattedDate = new Date(item.downloadedAt).toLocaleDateString();

  return (
    <View className="relative">
      <Image
        source={{ uri: item.localUri }}
        // Using a common aspect ratio for consistency
        className="w-full aspect-[3/4] rounded-xl bg-border"
        resizeMode="cover"
      />
      {/* Dark overlay at the bottom for text readability */}
      <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between p-2">
        <Text className="rounded-full bg-black/50 px-2 py-0.5 font-accent text-xs text-white">
          {formattedDate}
        </Text>
        <TouchableOpacity
          onPress={onDelete}
          className="rounded-full bg-red-500/80 p-2"
        >
          <TrashIcon size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};