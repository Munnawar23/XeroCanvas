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
import { useWallpapers } from "@screens/Home/hooks/useWallpapers";
import { PixabayImage } from "@api/index";
import { AppNavigationProp } from "@navigation/types";
import { WallpaperCard } from "@components/common/WallpaperCard";
import { LoadingState } from "@components/layout/LoadingState";
import { ErrorState } from "@components/layout/ErrorState";
import { ListFooter } from "@components/layout/ListFooter";
import { useFavouritesStore } from '@store/FavouritesStore';

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

  const favourites = useFavouritesStore((state) => state.favourites);
  const toggleFavourite = useFavouritesStore((state) => state.toggleFavourite);

  // --- THIS IS THE CORRECTED SECTION ---
  const handleWallpaperPress = useCallback(
    (wallpaper: PixabayImage) => {
      navigation.navigate("Detail", {
        // Convert the object to a string to match your navigation type definition
        wallpaper: JSON.stringify(wallpaper),
      });
    },
    [navigation]
  );
  // --- END OF CORRECTION ---

  const renderItem: ListRenderItem<PixabayImage> = ({ item }) => {
    const isFavourite = favourites.some((fav) => fav.id === item.id);

    return (
      <View className="flex-1 p-1.5 mb-3">
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