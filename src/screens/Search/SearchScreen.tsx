import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import HapticFeedback from "react-native-haptic-feedback";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
} from "react-native-heroicons/outline";
import LottieView from "lottie-react-native";

// Hooks, utils, and types
import { useSafePadding } from "@hooks/useSafePadding";
import { fetchWallpapers, PixabayImage } from "@api/index";
import { storage } from "@utils/storage";
import { AppNavigationProp } from "@navigation/types";

// Components
import { FilterModal, FilterState } from "@screens/Search/components/FilterModal";
import { WallpaperCard } from "@components/common/WallpaperCard";
import { LoadingCard } from "@components/common/LoadingCard";

const debounce = (func: Function, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export default function SearchScreen() {
  const { paddingTop } = useSafePadding();
  const navigation = useNavigation<AppNavigationProp>();

  const [searchQuery, setSearchQuery] = useState("");
  const [wallpapers, setWallpapers] = useState<PixabayImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    colors: [],
    editorsChoice: false,
    order: "popular",
  });

  // State for pagination & refresh
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const hasSearched = useRef(false);

  const performSearch = async (
    query: string,
    currentFilters: FilterState,
    pageNum: number = 1,
    append: boolean = false
  ) => {
    if (!query.trim()) {
      setWallpapers([]);
      return;
    }

    if (!append) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      if (!hasSearched.current) hasSearched.current = true;

      const response = await fetchWallpapers({
        q: query,
        colors: currentFilters.colors.join(","),
        editors_choice: currentFilters.editorsChoice || undefined,
        order: currentFilters.order,
        page: pageNum,
      });

      if (response.hits.length === 0) {
        setHasMore(false);
      }

      setWallpapers((prev) =>
        append ? [...prev, ...response.hits] : response.hits
      );

      if (pageNum === 1) {
        await storage.addSearchHistory(query);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const startNewSearch = (query: string, currentFilters: FilterState) => {
    setPage(1);
    setHasMore(true);
    setWallpapers([]);
    performSearch(query, currentFilters, 1, false);
  };

  const debouncedSearch = useCallback(
    debounce((query: string, currentFilters: FilterState) => {
      startNewSearch(query, currentFilters);
    }, 500),
    []
  );

  useEffect(() => {
    if (searchQuery.trim() || hasSearched.current) {
      debouncedSearch(searchQuery, filters);
    }
  }, [searchQuery, filters, debouncedSearch]);

  const handleRefresh = useCallback(() => {
    if (!searchQuery.trim()) {
      setRefreshing(false);
      return;
    }
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    performSearch(searchQuery, filters, 1, false);
  }, [searchQuery, filters]);

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleClearSearch = () => {
    HapticFeedback.trigger("impactLight");
    setSearchQuery("");
    setWallpapers([]);
    setPage(1);
    setHasMore(true);
    hasSearched.current = false;
  };

  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore || !searchQuery.trim()) return;
    const nextPage = page + 1;
    setPage(nextPage);
    performSearch(searchQuery, filters, nextPage, true);
  }, [loadingMore, hasMore, page, searchQuery, filters]);

  const handleWallpaperPress = (wallpaper: PixabayImage) => {
    navigation.navigate("Detail", {
      wallpaper: JSON.stringify(wallpaper),
    });
  };

  const renderItem: ListRenderItem<PixabayImage> = ({ item }) => (
    <View className="flex-1 p-1.5 mb-3">
      <WallpaperCard
        wallpaper={item}
        onPress={() => handleWallpaperPress(item)}
      />
    </View>
  );

  const LoadingState = () => (
    <View className="mt-4 flex-row gap-x-3 px-4">
      <View className="flex-1 gap-y-3">
        <LoadingCard aspectRatio={1.5} />
        <LoadingCard aspectRatio={1.2} />
      </View>
      <View className="flex-1 gap-y-3">
        <LoadingCard aspectRatio={1.3} />
        <LoadingCard aspectRatio={1.6} />
      </View>
    </View>
  );

  const EmptyState = () => (
    <View className="flex-1 items-center justify-center space-y-3 px-8">
      <LottieView
        source={require("@assets/animations/search.json")}
        autoPlay
        loop
        style={{ width: 250, height: 250 }}
      />
      <Text className="font-heading text-xl text-text">
        {hasSearched.current && searchQuery.length > 0
          ? "No Results Found"
          : "Find Your Next Wallpaper"}
      </Text>
      <Text className="text-center font-body text-subtext">
        {hasSearched.current && searchQuery.length > 0
          ? "Try a different keyword or adjust your filters."
          : "Search for anything you can imagine."}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-8">
        <ActivityIndicator size="small" color="#64748B" />
      </View>
    );
  };

  return (
    <View
      style={{ paddingTop }}
      className="flex-1 bg-background"
    >
      <StatusBar barStyle="dark-content" />

      {/* Search Bar */}
      <View className="flex-row items-center gap-x-2 px-4 pb-3">
        <View className="flex-1 flex-row items-center rounded-xl bg-card p-3">
          <MagnifyingGlassIcon size={20} className="text-subtext" />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#64748B"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 px-2 font-body text-base text-text"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <XMarkIcon size={20} className="text-subtext" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Button */}
        <TouchableOpacity
          onPress={() => setShowFilters(true)}
          className="rounded-xl bg-accent p-3"
        >
          <AdjustmentsHorizontalIcon size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Masonry Grid */}
      {loading && !refreshing ? (
        <LoadingState />
      ) : wallpapers.length > 0 ? (
        <FlashList<PixabayImage>
          data={wallpapers}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={2}
          masonry
          contentContainerStyle={{ paddingHorizontal: 4 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.8}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#64748B"
            />
          }
        />
      ) : (
        <EmptyState />
      )}

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