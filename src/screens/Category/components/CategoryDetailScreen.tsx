import React, { useCallback } from "react";
import { View, StatusBar, RefreshControl } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FlashList, ListRenderItem } from "@shopify/flash-list";

// Refined imports
import { useSafePadding } from "@hooks/useSafePadding";
import { useCategoryWallpapers } from "@screens/Category/hooks/useCategoryWallpapers";
import { PixabayImage } from "@api/index";
import { AppNavigationProp, CategoryDetailScreenProps } from "@navigation/types";

// Reusable Components
import { Header } from "@components/common/Header";
import { WallpaperCard } from "@components/common/WallpaperCard";
import { LoadingState } from "@components/layout/LoadingState";
import { ErrorState } from "@components/layout/ErrorState";
import { ListFooter } from "@components/layout/ListFooter";
// --- 1. IMPORT THE STORE ---
import { useFavouritesStore } from '@store/FavouritesStore';

export default function CategoryDetailScreen() {
  const { paddingTop } = useSafePadding();
  const navigation = useNavigation<AppNavigationProp>();
  const route = useRoute<CategoryDetailScreenProps["route"]>();
  const { category } = route.params;

  const {
    wallpapers,
    loading,
    loadingMore,
    refreshing,
    error,
    handleRefresh,
    handleLoadMore,
  } = useCategoryWallpapers(category);

  // --- 2. CALL HOOKS AT THE TOP LEVEL ---
  const favourites = useFavouritesStore((state) => state.favourites);
  const toggleFavourite = useFavouritesStore((state) => state.toggleFavourite);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleWallpaperPress = useCallback((wallpaper: PixabayImage) => {
    navigation.push("Detail", {
      wallpaper: JSON.stringify(wallpaper),
    });
  }, [navigation]);

  // --- 3. UPDATE RENDERITEM ---
  const renderItem: ListRenderItem<PixabayImage> = ({ item }) => {
    // Plain JS check, no hook here
    const isFavourite = favourites.some(fav => fav.id === item.id);

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
      <ErrorState paddingTop={paddingTop} errorMessage={error} onRetry={handleRefresh} refreshing={false} />
    );
  }

  return (
    <View style={{ paddingTop }} className="flex-1 bg-background">
      <Header title={category} onBackPress={handleBack} showBackButton />
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