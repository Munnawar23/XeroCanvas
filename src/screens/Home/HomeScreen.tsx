import React, { useCallback } from 'react';
import { View, Text, RefreshControl, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useColorScheme } from 'nativewind';

// Hooks, types, and components
import { useSafePadding } from '@hooks/useSafePadding';
import { useWallpapers } from '@screens/Home/hooks/useWallpapers';
import { PixabayImage } from '@api/index';
import { AppNavigationProp } from '@navigation/types';
import { WallpaperCard } from '@components/common/WallpaperCard';
import { LoadingState } from '@components/layout/LoadingState';
import { ErrorState } from '@components/layout/ErrorState';
import { ListFooter } from '@components/layout/ListFooter';
import { useFavouritesStore } from '@store/FavouritesStore';

/**
 * The main screen of the application.
 * Displays a masonry grid of wallpapers fetched from the API.
 * Supports pull-to-refresh and infinite scrolling.
 */
export default function HomeScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const { paddingTop } = useSafePadding();
  const { colorScheme } = useColorScheme();

  const {
    wallpapers,
    loading,
    loadingMore,
    refreshing,
    error,
    handleRefresh,
    handleLoadMore,
  } = useWallpapers();

  // Favourites state from Zustand store
  const favourites = useFavouritesStore(state => state.favourites);
  const toggleFavourite = useFavouritesStore(state => state.toggleFavourite);

  /**
   * Memoized navigation handler to prevent re-renders.
   * Navigates to the detail screen with the selected wallpaper data.
   */
  const handleWallpaperPress = useCallback(
    (wallpaper: PixabayImage) => {
      navigation.navigate('Detail', {
        wallpaper: JSON.stringify(wallpaper),
      });
    },
    [navigation],
  );

  /**
   * Renders a single wallpaper card within the FlashList.
   * Determines if the wallpaper is a favourite and passes down the relevant props.
   */
  const renderItem: ListRenderItem<PixabayImage> = ({ item }) => {
    const isFavourite = favourites.some(fav => fav.id === item.id);

    return (
      <View className="p-1.5">
        <WallpaperCard
          wallpaper={item}
          isFavourite={isFavourite}
          onToggleFavourite={() => toggleFavourite(item)}
          onPress={() => handleWallpaperPress(item)}
        />
      </View>
    );
  };

  // --- Render logic based on state ---
  if (loading) {
    return <LoadingState paddingTop={paddingTop} />;
  }

  if (error && wallpapers.length === 0) {
    return (
      <ErrorState
        paddingTop={paddingTop}
        errorMessage={error}
        onRetry={handleRefresh}
        refreshing={refreshing}
      />
    );
  }

  return (
    <View
      style={{ paddingTop }}
      className="flex-1 bg-background dark:bg-dark-background"
    >
      {/* Screen Title */}
      <Text className="px-4 pb-3 font-heading text-3xl text-text dark:text-dark-text">
        XeroCanvas
      </Text>

      {/* Masonry list using FlashList v2 */}
      <FlashList<PixabayImage>
        data={wallpapers}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        masonry
        contentContainerStyle={{ paddingHorizontal: 4 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={<ListFooter loadingMore={loadingMore} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colorScheme === 'dark' ? '#9CA3AF' : '#64748B'}
          />
        }
      />
    </View>
  );
}
