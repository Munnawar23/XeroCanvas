import React, { useCallback, useState } from 'react';
import { View, StatusBar, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useColorScheme } from 'nativewind';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

// Hooks, types, and components
import { useSafePadding } from '@hooks/useSafePadding';
import { useSearch } from '@screens/Search/hooks/useSearch';
import { PixabayImage } from '@api/index';
import { AppNavigationProp } from '@navigation/types';
import { FilterModal } from '@screens/Search/components/FilterModal';
import { WallpaperCard } from '@components/common/WallpaperCard';
import { LoadingState } from '@components/layout/LoadingState';
import { ErrorState } from '@components/layout/ErrorState';
import { ListFooter } from '@components/layout/ListFooter';
import { SearchBar } from '@screens/Search/components/SearchBar';
import { EmptyState } from '@screens/Search/components/EmptyState';
import { useFavouritesStore } from '@store/FavouritesStore';

/**
 * A screen that allows users to search for wallpapers with advanced filtering options.
 */
export default function SearchScreen() {
  const { paddingTop } = useSafePadding();
  const navigation = useNavigation<AppNavigationProp>();
  const { colorScheme } = useColorScheme();
  const [showFilters, setShowFilters] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    wallpapers,
    loading,
    loadingMore,
    refreshing,
    error,
    hasSearched,
    filters,
    handleApplyFilters,
    handleClearSearch,
    handleRefresh,
    handleLoadMore,
  } = useSearch();

  // Global state for favourites
  const favourites = useFavouritesStore(state => state.favourites);
  const toggleFavourite = useFavouritesStore(state => state.toggleFavourite);

  const handleWallpaperPress = useCallback(
    (wallpaper: PixabayImage) => {
      navigation.navigate('Detail', {
        wallpaper: JSON.stringify(wallpaper),
      });
    },
    [navigation],
  );

  const handleFilterPress = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactMedium', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    setShowFilters(true);
  }, []);

  /**
   * Renders a single wallpaper card.
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

  /**
   * Conditionally render list or state views.
   */
  const renderContent = () => {
    if (loading && !refreshing) {
      return <LoadingState paddingTop={0} />;
    }
    if (error && wallpapers.length === 0) {
      return (
        <ErrorState
          paddingTop={0}
          errorMessage={error}
          onRetry={handleRefresh}
          refreshing={refreshing}
        />
      );
    }
    if (wallpapers.length > 0) {
      return (
        <FlashList<PixabayImage>
          data={wallpapers}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          masonry
          contentContainerStyle={{
            paddingHorizontal: 4,
            paddingBottom: 90,
          }}
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
      );
    }
    return <EmptyState hasSearched={hasSearched} searchQuery={searchQuery} />;
  };

  return (
    <View
      style={{ paddingTop }}
      className="flex-1 bg-background dark:bg-dark-background"
    >
      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onClearSearch={handleClearSearch}
        onFilterPress={handleFilterPress}
      />

      {/* Main Content */}
      {renderContent()}

      {/* Filter Modal */}
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        initialFilters={filters}
        onApply={handleApplyFilters}
      />
    </View>
  );
}
