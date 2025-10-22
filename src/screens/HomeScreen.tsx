import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FlashList, ListRenderItem } from "@shopify/flash-list";

// Hooks, services, and types
import { useSafePadding } from "@hooks/useSafePadding";
import { useTheme } from "@context/ThemeContext";
import { fetchWallpapers, PixabayImage } from "@services/pixabay";
import { storage } from "@utils/storage";
import { AppNavigationProp } from "@navigation/types";

// Components
import { WallpaperCard } from "@components/WallpaperCard";
import { LoadingCard } from "@components/LoadingCard";

// ✅ Define the expected type from the API/cache
type PixabayResponse = {
  hits: PixabayImage[];
  total: number;
  totalHits: number;
};

export default function HomeScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const { isDark } = useTheme();
  const { paddingTop } = useSafePadding();

  const [wallpapers, setWallpapers] = useState<PixabayImage[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Initial load
  useEffect(() => {
    loadWallpapers();
  }, []);

  // --- Load wallpapers with caching support ---
  const loadWallpapers = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
      if (!append) setLoading(true);

      try {
        const cacheKey = `wallpapers_page_${pageNum}`;
        
        // --- FIX STARTS HERE ---
        // Assert the type of 'data' to what we expect from the cache or API
        let data = (await storage.getCache(cacheKey)) as PixabayResponse | null;
        // --- FIX ENDS HERE ---

        if (!data) {
          data = await fetchWallpapers({ page: pageNum, order: "popular" });
          await storage.setCache(cacheKey, data);
        }

        // Add a safety check to ensure data and data.hits exist before using them
        if (data && data.hits) {
            if (data.hits.length === 0) setHasMore(false);

            setWallpapers((prev) => (append ? [...prev, ...data.hits] : data.hits));
        }

      } catch (error) {
        console.error("Failed to load wallpapers:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    []
  );

  // --- Pull to refresh ---
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    loadWallpapers(1, false);
  }, [loadWallpapers]);

  // --- Load more when scrolled to end ---
  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    loadWallpapers(nextPage, true);
  }, [loadingMore, hasMore, page, loadWallpapers]);

  // --- Navigate to wallpaper detail ---
  const handleWallpaperPress = useCallback(
    (wallpaper: PixabayImage) => {
      navigation.navigate("Detail", {
        wallpaper: JSON.stringify(wallpaper),
      });
    },
    [navigation]
  );

  // --- Render individual wallpaper card ---
  const renderItem: ListRenderItem<PixabayImage> = ({ item }) => (
    <View className="flex-1 p-1.5 mb-3">
      <WallpaperCard
        wallpaper={item}
        onPress={() => handleWallpaperPress(item)}
      />
    </View>
  );

  // --- Footer loader ---
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-8">
        <ActivityIndicator
          size="small"
          color={isDark ? "#94A3B8" : "#64748B"}
        />
      </View>
    );
  };

  // --- Loading skeleton ---
  if (loading) {
    return (
      <View
        style={{ paddingTop }}
        className="flex-1 bg-light-background dark:bg-dark-background px-4"
      >
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <Text className="font-heading text-3xl text-light-text dark:text-dark-text">
          XeroCanvas
        </Text>
        <View className="mt-4 flex-row gap-x-3">
          <View className="flex-1 gap-y-3">
            <LoadingCard aspectRatio={1.5} />
            <LoadingCard aspectRatio={1.2} />
            <LoadingCard aspectRatio={1.8} />
          </View>
          <View className="flex-1 gap-y-3">
            <LoadingCard aspectRatio={1.3} />
            <LoadingCard aspectRatio={1.6} />
            <LoadingCard aspectRatio={1.4} />
          </View>
        </View>
      </View>
    );
  }

  // --- Main render ---
  return (
    <View
      style={{ paddingTop }}
      className="flex-1 bg-light-background dark:bg-dark-background"
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <Text className="px-4 pb-3 font-heading text-3xl text-light-text dark:text-dark-text">
        XeroCanvas
      </Text>

      <FlashList<PixabayImage>
        data={wallpapers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
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
            tintColor={isDark ? "#94A3B8" : "#64748B"}
          />
        }
      />
    </View>
  );
}