import React, { useCallback } from 'react';
import { View, Text, StatusBar, RefreshControl, Platform } from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import HapticFeedback from 'react-native-haptic-feedback';
import { useColorScheme } from 'nativewind';

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
  const { colorScheme } = useColorScheme();
  const { favourites, refreshing, handleRefresh, toggleFavourite } = useFavourites();

  // --- Handlers ---

  const handleUnfavouritePress = useCallback(
    (wallpaper: PixabayImage) => {
      toggleFavourite(wallpaper);
      Toast.show({
        type: 'success',
        text1: 'Removed from Favourites',
        position: 'top',
      });
    },
    [toggleFavourite],
  );

  const handleWallpaperPress = useCallback(
    (wallpaper: PixabayImage) => {
      // 👇 Medium haptic before navigation
      HapticFeedback.trigger('impactMedium', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });

      navigation.navigate('Detail', {
        wallpaper: JSON.stringify(wallpaper),
      });
    },
    [navigation],
  );

  // --- Render Logic ---
  const renderItem: ListRenderItem<PixabayImage> = ({ item }) => (
    <View className="p-1.5">
      <FavouriteWallpaperCard
        item={item}
        onPress={() => handleWallpaperPress(item)}
        onUnfavourite={() => handleUnfavouritePress(item)}
      />
    </View>
  );

  const renderContent = () => {
    if (favourites.length === 0) return <EmptyState />;

    return (
      <FlashList
        data={favourites}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: 4,
          paddingBottom: Platform.OS === 'ios' ? 100 : 90,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colorScheme === 'dark' ? '#9CA3AF' : '#64748B'}
          />
        }
      />
    );
  };

  return (
    <View style={{ paddingTop }} className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      <View className="px-4 pb-4">
        <Text className="font-heading text-3xl text-text dark:text-dark-text">
          My Favourites
        </Text>
      </View>

      {renderContent()}
    </View>
  );
}
