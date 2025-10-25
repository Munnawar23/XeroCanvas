import React, { useCallback } from "react";
import {
  View,
  Text,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FlashList, ListRenderItem } from "@shopify/flash-list";

// Hooks, types, and components
import { useSafePadding } from "@hooks/useSafePadding";
import { useWallpapers } from "@hooks/useWallpapers";
import { PixabayImage } from "@api/index";
import { AppNavigationProp } from "@navigation/types";
import { WallpaperCard } from "@components/common/WallpaperCard";
import { LoadingState } from "@components/layout/LoadingState";
import { ErrorState } from "@components/layout/ErrorState";
import { ListFooter } from "@components/layout/ListFooter"; 

export default function HomeScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const { paddingTop } = useSafePadding();
  const {
    wallpapers,
    loading,
    loadingMore,
    refreshing,
    error,
    handleRefresh,
    handleLoadMore,
  } = useWallpapers();

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

  if (loading) {
    return <LoadingState paddingTop={paddingTop} />;
  }

  if (error && wallpapers.length === 0) {
    return (
      <ErrorState
        paddingTop={paddingTop}
        errorMessage={error}
        onRetry={handleRefresh} refreshing={false}  />
    );
  }
  return (
    <View
      style={{ paddingTop }}
      className="flex-1 bg-background"
    >
      <StatusBar barStyle="dark-content" />
      <Text className="px-4 pb-3 font-heading text-3xl text-text">
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
        onEndReachedThreshold={0.5}
        ListFooterComponent={<ListFooter loadingMore={loadingMore} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#64748B"
          />
        }
      />
    </View>
  );
}