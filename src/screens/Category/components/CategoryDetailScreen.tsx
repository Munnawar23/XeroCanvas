import React, { useCallback } from 'react';
import { View, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useColorScheme } from 'nativewind';

// Hooks, types, and components
import { useSafePadding } from '@hooks/useSafePadding';
import { useCategoryWallpapers } from '@screens/Category/hooks/useCategoryWallpapers';
import { PixabayImage } from '@api/index';
import {
  AppNavigationProp,
  CategoryDetailScreenProps,
} from '@navigation/types';
import { Header } from '@components/ui/Header';
import { WallpaperCard } from '@components/common/WallpaperCard';
import { LoadingState } from '@components/layout/LoadingState';
import { ErrorState } from '@components/layout/ErrorState';
import { ListFooter } from '@components/layout/ListFooter';
import { useFavouritesStore } from '@store/FavouritesStore';

/**
 * A screen that displays a list of wallpapers for a specific category.
 * Features pull-to-refresh and infinite scrolling.
 */
export default function CategoryDetailScreen() {
  const { paddingTop } = useSafePadding();
  const navigation = useNavigation<AppNavigationProp>();
  const route = useRoute<CategoryDetailScreenProps['route']>();
  const { category } = route.params;
  const { colorScheme } = useColorScheme();

  const {
    wallpapers,
    loading,
    loadingMore,
    refreshing,
    error,
    handleRefresh,
    handleLoadMore,
  } = useCategoryWallpapers(category);

  // Global state for favourites
  const favourites = useFavouritesStore(state => state.favourites);
  const toggleFavourite = useFavouritesStore(state => state.toggleFavourite);

  // --- Callbacks ---

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleWallpaperPress = useCallback(
    (wallpaper: PixabayImage) => {
      navigation.push('Detail', {
        wallpaper: JSON.stringify(wallpaper),
      });
    },
    [navigation],
  );

  // --- Render Logic ---

  /**
   * Renders a single wallpaper card, checking if it is in the user's favourites.
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
      {/* Screen Header */}
      <Header title={category} onBackPress={handleBack} showBackButton />

      {/* Masonry list of wallpapers */}
      <FlashList<PixabayImage>
        data={wallpapers}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        masonry // <-- THE FIX IS APPLIED HERE
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