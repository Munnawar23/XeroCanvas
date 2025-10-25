import React, { useCallback, useState } from "react";
import { View, StatusBar, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FlashList, ListRenderItem } from "@shopify/flash-list";

// Hooks, types, and reusable components
import { useSafePadding } from "@hooks/useSafePadding";
import { useSearch } from "@screens/Search/hooks/useSearch";
import { PixabayImage } from "@api/index";
import { AppNavigationProp } from "@navigation/types";
import { FilterModal } from "@screens/Search/components/FilterModal";
import { WallpaperCard } from "@components/common/WallpaperCard";
import { LoadingState } from "@components/layout/LoadingState";
import { ErrorState } from "@components/layout/ErrorState";
import { ListFooter } from "@components/layout/ListFooter";
import { SearchBar } from "@screens/Search/components/SearchBar";
import { EmptyState } from "@screens/Search/components/EmptyState";

export default function SearchScreen() {
  const { paddingTop } = useSafePadding();
  const navigation = useNavigation<AppNavigationProp>();
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

  const handleWallpaperPress = useCallback((wallpaper: PixabayImage) => {
    navigation.navigate("Detail", {
      wallpaper: JSON.stringify(wallpaper),
    });
  }, [navigation]);

  const renderItem: ListRenderItem<PixabayImage> = ({ item }) => (
    <View className="flex-1 p-1.5 mb-3">
      <WallpaperCard wallpaper={item} onPress={() => handleWallpaperPress(item)} />
    </View>
  );

  const renderContent = () => {
    if (loading && !refreshing) {
      return <LoadingState paddingTop={0} />;
    }
    if (error && wallpapers.length === 0) {
      return <ErrorState paddingTop={0} errorMessage={error} onRetry={handleRefresh} refreshing={false} />;
    }
    if (wallpapers.length > 0) {
      return (
        <FlashList<PixabayImage>
          data={wallpapers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          masonry
          contentContainerStyle={{ paddingHorizontal: 4 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={<ListFooter loadingMore={loadingMore} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#64748B" />}
        />
      );
    }
    // Use the new EmptyState component
    return <EmptyState hasSearched={hasSearched} searchQuery={searchQuery} />;
  };

  return (
    <View style={{ paddingTop }} className="flex-1 bg-background">
      <SearchBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onClearSearch={handleClearSearch}
        onFilterPress={() => setShowFilters(true)}
      />

      {renderContent()}

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        initialFilters={filters}
        onApply={handleApplyFilters}
      />
    </View>
  );
}