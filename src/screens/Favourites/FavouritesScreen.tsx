import React, { useCallback } from 'react';
import { View, Text, StatusBar, RefreshControl, Platform } from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

// Hooks, types, and components
import { useSafePadding } from '@hooks/useSafePadding';
import { AppNavigationProp } from '@navigation/types';
import { PixabayImage } from '@api/index';
import { useFavourites } from '@screens/Favourites/hooks/useFavourites';
import { EmptyState } from '@screens/Favourites/components/EmptyState';
import { FavouriteWallpaperCard } from '@screens/Favourites/components/FavouriteWallpaperCard';

export default function FavouritesScreen() {
  const { paddingTop } = useSafePadding();
  const navigation = useNavigation<AppNavigationProp>();
  const { favourites, refreshing, handleRefresh, toggleFavourite } = useFavourites();

  // --- 1. Handler for removing a favourite and showing a toast ---
  const handleUnfavouritePress = useCallback(
    (wallpaper: PixabayImage) => {
      toggleFavourite(wallpaper);
      Toast.show({
        type: 'success',
        text1: 'Removed from Favourites',
        position: 'top',
      });
    },
    [toggleFavourite]
  );

  // --- 2. Handler for navigating to the detail screen ---
  const handleWallpaperPress = useCallback(
    (wallpaper: PixabayImage) => {
      navigation.navigate('Detail', {
        wallpaper: JSON.stringify(wallpaper),
      });
    },
    [navigation]
  );

  // --- 3. Render item card ---
  const renderItem: ListRenderItem<PixabayImage> = ({ item }) => (
    <View className="flex-1 p-1.5 mb-3">
      <FavouriteWallpaperCard
        item={item}
        onPress={() => handleWallpaperPress(item)}
        onUnfavourite={() => handleUnfavouritePress(item)}
      />
    </View>
  );

  const renderContent = () => {
    if (favourites.length === 0) {
      return <EmptyState />;
    }

    return (
      <FlashList
        data={favourites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: 4,
          paddingBottom: Platform.OS === 'ios' ? 100 : 80, // 👈 Add bottom padding to avoid tab overlay
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#64748B"
          />
        }
      />
    );
  };

  return (
    <View style={{ paddingTop }} className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />
      <View className="px-4 pb-4">
        <Text className="font-heading text-3xl text-text">My Favourites</Text>
      </View>
      {renderContent()}
    </View>
  );
}
