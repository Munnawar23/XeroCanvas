// src/screens/HomeScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, RefreshControl, ActivityIndicator, FlatList, StatusBar, ListRenderItem } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Hooks, services, and types
import { useSafePadding } from '@hooks/useSafePadding';
import { useTheme } from '@context/ThemeContext';
import { fetchWallpapers, PixabayImage } from '@services/pixabay';
import { storage } from '@utils/storage';
// --- FIX 1: Import the correct, reusable navigation type ---
import { AppNavigationProp } from '@navigation/types';

// Components
import { WallpaperCard } from '@components/WallpaperCard';
import { LoadingCard } from '@components/LoadingCard';

export default function HomeScreen() {
  // --- Hooks ---
  // --- FIX 2: Use the correct type with the useNavigation hook ---
  const navigation = useNavigation<AppNavigationProp>();
  const { isDark } = useTheme();
  const { paddingTop } = useSafePadding();

  // --- State Management ---
  const [wallpapers, setWallpapers] = useState<PixabayImage[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // --- Data Fetching ---
  useEffect(() => {
    loadWallpapers();
  }, []);

  const loadWallpapers = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    if (!append) setLoading(true);
    
    try {
      const cacheKey = `wallpapers_page_${pageNum}`;
      let data = await storage.getCache(cacheKey);
      if (!data) {
        data = await fetchWallpapers({ page: pageNum, order: 'popular' });
        await storage.setCache(cacheKey, data);
      }
      if (data.hits.length === 0) setHasMore(false);
      
      setWallpapers(prev => (append ? [...prev, ...data.hits] : data.hits));
    } catch (error) {
      console.error('Failed to load wallpapers:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, []);

  // --- Event Handlers ---
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

  const handleWallpaperPress = useCallback((wallpaper: PixabayImage) => {
    navigation.navigate('Detail', { wallpaper: JSON.stringify(wallpaper) });
  }, [navigation]);

  // --- Render Functions ---
  const renderItem: ListRenderItem<PixabayImage> = ({ item, index }) => (
    <Animated.View
      className="flex-1 p-1.5"
      entering={FadeInDown.delay(index * 100).duration(400).springify().damping(12)}
    >
      <WallpaperCard wallpaper={item} onPress={() => handleWallpaperPress(item)} />
    </Animated.View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-8">
        <ActivityIndicator size="small" className="text-light-accent dark:text-dark-accent" />
      </View>
    );
  };

  // --- Loading Skeleton UI ---
  if (loading) {
    return (
      <View style={{ paddingTop }} className="flex-1 bg-light-background dark:bg-dark-background px-4">
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <Text className="font-heading text-3xl text-light-text dark:text-dark-text">
          XeroCanvas
        </Text>
        <View className="mt-4 flex-row gap-x-3">
          <View className="flex-1 gap-y-3">
            <LoadingCard aspectRatio={1.5} /><LoadingCard aspectRatio={1.2} /><LoadingCard aspectRatio={1.8} />
          </View>
          <View className="flex-1 gap-y-3">
            <LoadingCard aspectRatio={1.3} /><LoadingCard aspectRatio={1.6} /><LoadingCard aspectRatio={1.4} />
          </View>
        </View>
      </View>
    );
  }

  // --- Main List UI ---
  return (
    <View style={{ paddingTop }} className="flex-1 bg-light-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Text className="px-4 pb-3 font-heading text-3xl text-light-text dark:text-dark-text">
        XeroCanvas
      </Text>
      <FlatList
        data={wallpapers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.8}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={isDark ? '#94A3B8' : '#64748B'}
          />
        }
      />
    </View>
  );
};