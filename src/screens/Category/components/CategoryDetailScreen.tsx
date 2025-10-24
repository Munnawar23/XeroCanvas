import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import HapticFeedback from "react-native-haptic-feedback";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { ArrowLeftIcon } from "react-native-heroicons/outline";

// Hooks, utils, and types
import { useSafePadding } from "@hooks/useSafePadding";
import { fetchWallpapers, PixabayImage } from "@api/index";
import {
  AppNavigationProp,
  CategoryDetailScreenProps,
} from "@navigation/types";

// Components
import { WallpaperCard } from "@components/common/WallpaperCard";
import { LoadingCard } from "@components/common/LoadingCard";

export default function CategoryDetailScreen() {
  const { paddingTop } = useSafePadding();
  const navigation = useNavigation<AppNavigationProp>();
  const route = useRoute<CategoryDetailScreenProps["route"]>();
  const { category } = route.params;

  const [wallpapers, setWallpapers] = useState<PixabayImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadWallpapers = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
      if (!append) {
        setLoading(true);
      }
      try {
        const data = await fetchWallpapers({
          category,
          page: pageNum,
          order: "popular",
        });

        if (data.hits.length === 0) {
          setHasMore(false);
        }

        setWallpapers((prev) =>
          append ? [...prev, ...data.hits] : data.hits
        );
      } catch (error) {
        console.error("Error loading category wallpapers:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [category]
  );

  useEffect(() => {
    loadWallpapers();
  }, [loadWallpapers]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    loadWallpapers(1, false);
  }, [loadWallpapers]);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    loadWallpapers(nextPage, true);
  }, [loadingMore, hasMore, page, loadWallpapers]);

  const handleBack = () => {
    HapticFeedback.trigger("impactLight");
    navigation.goBack();
  };

  const handleWallpaperPress = (wallpaper: PixabayImage) => {
    navigation.push("Detail", {
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

  const renderFooter = () =>
    loadingMore ? (
      <View className="py-8">
        <ActivityIndicator size="small" color="gray" />
      </View>
    ) : null;

  return (
    <View
      style={{ paddingTop }}
      className="flex-1 bg-background"
    >
      <StatusBar barStyle="dark-content" />

      <View className="flex-row items-center justify-between px-4 pb-4">
        <TouchableOpacity
          onPress={handleBack}
          className="p-1 rounded-full active:opacity-70"
        >
          <ArrowLeftIcon size={24} className="text-text" />
        </TouchableOpacity>
        <Text className="font-heading text-xl capitalize text-text">
          {category}
        </Text>
        <View className="w-6" />
      </View>

      {loading ? (
        <LoadingState />
      ) : (
        <FlashList<PixabayImage>
          data={wallpapers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          masonry
          contentContainerStyle={{ paddingHorizontal: 4 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.7}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="black"
            />
          }
        />
      )}
    </View>
  );
}