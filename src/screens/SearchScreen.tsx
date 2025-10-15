// src/screens/SearchScreen.tsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StatusBar, ListRenderItem, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HapticFeedback from 'react-native-haptic-feedback';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MagnifyingGlassIcon, XMarkIcon, AdjustmentsHorizontalIcon } from 'react-native-heroicons/outline';

// Hooks, utils, and types
import { useSafePadding } from '@hooks/useSafePadding';
import { useTheme } from '@context/ThemeContext';
import { fetchWallpapers, PixabayImage } from '@services/pixabay';
import { storage } from '@utils/storage';
// --- FIX 1: Import the correct, reusable navigation type ---
import { AppNavigationProp } from '@navigation/types';

// Components
import { FilterModal, FilterState } from '@components/FilterModal';
import { WallpaperCard } from '@components/WallpaperCard';
import { LoadingCard } from '@components/LoadingCard';

const debounce = (func: Function, wait: number) => {
  let timeout: number;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export default function SearchScreen() {
  const { paddingTop } = useSafePadding();
  const { isDark } = useTheme();
  // --- FIX 2: Use the correct type with the useNavigation hook ---
  const navigation = useNavigation<AppNavigationProp>();

  const [searchQuery, setSearchQuery] = useState('');
  const [wallpapers, setWallpapers] = useState<PixabayImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    colors: [],
    editorsChoice: false,
    order: 'popular',
  });
  
  const hasSearched = useRef(false);

  const performSearch = async (query: string, currentFilters: FilterState) => {
    if (!query.trim()) {
      setWallpapers([]);
      return;
    }
    try {
      setLoading(true);
      hasSearched.current = true;
      const response = await fetchWallpapers({
        q: query,
        colors: currentFilters.colors.join(','),
        editors_choice: currentFilters.editorsChoice || undefined,
        order: currentFilters.order,
      });
      setWallpapers(response.hits);
      await storage.addSearchHistory(query);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(debounce((query: string, currentFilters: FilterState) => {
    performSearch(query, currentFilters);
  }, 500), []);

  useEffect(() => {
    debouncedSearch(searchQuery, filters);
  }, [searchQuery, filters, debouncedSearch]);

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    performSearch(searchQuery, newFilters);
  };

  const handleClearSearch = () => {
    HapticFeedback.trigger('impactLight');
    setSearchQuery('');
    setWallpapers([]);
    hasSearched.current = false;
  };

  const handleWallpaperPress = (wallpaper: PixabayImage) => {
    navigation.navigate('Detail', { wallpaper: JSON.stringify(wallpaper) });
  };
  
  const renderItem: ListRenderItem<PixabayImage> = ({ item, index }) => (
    <Animated.View className="flex-1 p-1.5" entering={FadeInDown.delay(index * 100).duration(400)}>
      <WallpaperCard wallpaper={item} onPress={() => handleWallpaperPress(item)} />
    </Animated.View>
  );

  const LoadingState = () => (
    <View className="mt-4 flex-row gap-x-3 px-4">
      <View className="flex-1 gap-y-3"><LoadingCard aspectRatio={1.5} /><LoadingCard aspectRatio={1.2} /></View>
      <View className="flex-1 gap-y-3"><LoadingCard aspectRatio={1.3} /><LoadingCard aspectRatio={1.6} /></View>
    </View>
  );

  const EmptyState = () => (
    <View className="flex-1 items-center justify-center space-y-3 px-8">
      <MagnifyingGlassIcon size={64} className="text-light-subtext dark:text-dark-subtext" />
      <Text className="font-heading text-xl text-light-text dark:text-dark-text">
        {hasSearched.current ? 'No Results Found' : 'Find Your Next Wallpaper'}
      </Text>
      <Text className="text-center font-body text-light-subtext dark:text-dark-subtext">
        {hasSearched.current ? 'Try a different keyword or adjust your filters.' : 'Search for anything you can imagine.'}
      </Text>
    </View>
  );

  return (
    <View style={{ paddingTop }} className="flex-1 bg-light-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View className="flex-row items-center gap-x-2 px-4 pb-3">
        <View className="flex-1 flex-row items-center rounded-xl bg-light-card p-3 dark:bg-dark-card">
          <MagnifyingGlassIcon size={20} className="text-light-subtext dark:text-dark-subtext" />
          <TextInput
            placeholder="Search..."
            placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 px-2 font-body text-base text-light-text dark:text-dark-text"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}><XMarkIcon size={20} className="text-light-subtext dark:text-dark-subtext" /></TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => setShowFilters(true)} className="rounded-xl bg-light-accent p-3 dark:bg-dark-accent">
          <AdjustmentsHorizontalIcon size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? <LoadingState /> : (
        wallpapers.length > 0 ? (
          <FlatList
            data={wallpapers}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={{ paddingHorizontal: 4 }}
          />
        ) : <EmptyState />
      )}

      <FilterModal 
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        initialFilters={filters}
        onApply={handleApplyFilters}
      />
    </View>
  );
}