// src/screens/DownloadsScreen.tsx

import React from 'react';
import { View, Text, FlatList, Alert, StatusBar, ListRenderItem } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import HapticFeedback from 'react-native-haptic-feedback';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowDownTrayIcon } from 'react-native-heroicons/outline';

// Hooks, utils, and types
import { useSafePadding } from '@hooks/useSafePadding';
import { useTheme } from '@context/ThemeContext';
import { storage, DownloadedWallpaper } from '@utils/storage';

// Components
import { DownloadedWallpaperCard } from '@components/DownloadedWallpaperCard';

export default function DownloadsScreen() {
  const { paddingTop } = useSafePadding();
  const { isDark } = useTheme();
  const [downloads, setDownloads] = React.useState<DownloadedWallpaper[]>([]);
  const isFocused = useIsFocused();

  // Load (or reload) downloads whenever the screen comes into focus
  React.useEffect(() => {
    if (isFocused) {
      loadDownloads();
    }
  }, [isFocused]);

  const loadDownloads = async () => {
    const data = await storage.getDownloads();
    setDownloads(data);
  };

  const handleDelete = (id: string) => {
    HapticFeedback.trigger('impactMedium');
    Alert.alert('Delete Wallpaper', 'Are you sure you want to delete this downloaded wallpaper?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          // You would also delete the local file from the device's file system here
          await storage.removeDownload(id);
          loadDownloads(); // Refresh the list
        },
      },
    ]);
  };

  // --- Render Functions ---

  const renderItem: ListRenderItem<DownloadedWallpaper> = ({ item, index }) => (
    <Animated.View
      className="flex-1 p-1.5"
      entering={FadeInDown.delay(index * 100).duration(400).springify().damping(12)}
    >
      <DownloadedWallpaperCard item={item} onDelete={() => handleDelete(item.id)} />
    </Animated.View>
  );

  // The UI to show when there are no downloads
  const EmptyState = () => (
    <View className="flex-1 items-center justify-center space-y-3 px-8">
      <ArrowDownTrayIcon size={64} className="text-light-subtext dark:text-dark-subtext" />
      <Text className="font-heading text-xl text-light-text dark:text-dark-text">
        No Downloads Yet
      </Text>
      <Text className="text-center font-body text-light-subtext dark:text-dark-subtext">
        Wallpapers you save will appear here for you to view and manage.
      </Text>
    </View>
  );
  
  return (
    <View style={{ paddingTop }} className="flex-1 bg-light-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Screen Header */}
      <View className="px-4 pb-4">
        <Text className="font-heading text-3xl text-light-text dark:text-dark-text">
          My Downloads
        </Text>
      </View>

      {/* Conditional Rendering: Show empty state or the list */}
      {downloads.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={downloads}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 4 }}
        />
      )}
    </View>
  );
}