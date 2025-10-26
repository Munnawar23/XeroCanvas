import React, { useCallback } from 'react';
import { View, Text, StatusBar, RefreshControl, Platform } from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useColorScheme } from 'nativewind';

// Hooks, types, and components
import { useSafePadding } from '@hooks/useSafePadding';
import { AppNavigationProp } from '@navigation/types';
import { PixabayImage } from '@api/index';
import { useFavourites } from '@screens/Favourites/hooks/useFavourites';
import { EmptyState } from '@screens/Favourites/components/EmptyState';
import { FavouriteWallpaperCard } from '@screens/Favourites/components/FavouriteWallpaperCard';

/**
 * A screen that displays the user's saved favourite wallpapers.
 * Allows users to view, remove, and refresh their favourites.
 */
export default function FavouritesScreen() {
  const { paddingTop } = useSafePadding();
  const navigation = useNavigation<AppNavigationProp>();
  const { colorScheme } = useColorScheme();
  const { favourites, refreshing, handleRefresh, toggleFavourite } =
    useFavourites();

  // --- Handlers ---

  /**
   * Memoized handler for removing a favourite wallpaper.
   * It calls the toggle function and shows a confirmation toast.
   */
  const handleUnfavouritePress = useCallback(
    (wallpaper: PixabayImage) => {
      toggleFavourite(wallpaper);
      Toast.show({
        type: 'success',
        text1: 'Removed from Favourites',
        position: 'top',
      });
    },
    [toggleFavourite],
  );

  /**
   * Memoized handler for navigating to the wallpaper detail screen.
   */
  const handleWallpaperPress = useCallback(
    (wallpaper: PixabayImage) => {
      navigation.navigate('Detail', {
        wallpaper: JSON.stringify(wallpaper),
      });
    },
    [navigation],
  );

  // --- Render Logic ---

  /**
   * Renders a single FavouriteWallpaperCard item for the list.
   */
  const renderItem: ListRenderItem<PixabayImage> = ({ item }) => (
    <View className="p-1.5">
      <FavouriteWallpaperCard
        item={item}
        onPress={() => handleWallpaperPress(item)}
        onUnfavourite={() => handleUnfavouritePress(item)}
      />
    </View>
  );

  /**
   * Conditionally renders the list of favourites or the empty state component.
   */
  const renderContent = () => {
    if (favourites.length === 0) {
      return <EmptyState />;
    }

    return (
      <FlashList
        data={favourites}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: 4,
          paddingBottom: Platform.OS === 'ios' ? 100 : 90,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colorScheme === 'dark' ? '#9CA3AF' : '#64748B'}
          />
        }
      />
    );
  };

  return (
    <View
      style={{ paddingTop }}
      className="flex-1 bg-background dark:bg-dark-background"
    >
      {/* Status bar that adapts to the current theme */}
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />

      {/* Screen Title */}
      <View className="px-4 pb-4">
        <Text className="font-heading text-3xl text-text dark:text-dark-text">
          My Favourites
        </Text>
      </View>

      {/* Main Content */}
      {renderContent()}
    </View>
  );
}
