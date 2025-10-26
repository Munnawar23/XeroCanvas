import React, { useCallback } from 'react';
import { View, Text, RefreshControl, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useColorScheme } from 'nativewind';

// Hooks, types, and components
import { useSafePadding } from '@hooks/useSafePadding';
import {
  useCategories,
  CategoryWithImage,
} from '@screens/Category/hooks/useCategories';
import { AppNavigationProp } from '@navigation/types';
import { CategoryCard } from '@screens/Category/components/CategoryCard';
import { LoadingState } from '@components/layout/LoadingState';
import { ErrorState } from '@components/layout/ErrorState';

/**
 * A screen that displays a grid of all available wallpaper categories.
 * Allows the user to navigate to a detail screen for each category.
 */
export default function CategoryScreen() {
  const { paddingTop } = useSafePadding();
  const navigation = useNavigation<AppNavigationProp>();
  const { colorScheme } = useColorScheme();

  const { categories, loading, refreshing, error, handleRefresh } =
    useCategories();

  /**
   * Memoized navigation handler for when a category card is pressed.
   */
  const handleCategoryPress = useCallback(
    (category: string) => {
      navigation.navigate('CategoryDetail', { category });
    },
    [navigation],
  );

  /**
   * Renders a single category card item for the list.
   */
  const renderItem = ({ item }: { item: CategoryWithImage }) => (
    <View className="p-1.5">
      <CategoryCard
        category={item.name}
        imageUrl={item.imageUrl}
        onPress={() => handleCategoryPress(item.name)}
      />
    </View>
  );

  // --- Render Logic ---

  if (loading) {
    return <LoadingState paddingTop={paddingTop} />;
  }

  if (error) {
    return (
      <ErrorState
        paddingTop={paddingTop}
        errorMessage={error}
        onRetry={handleRefresh}
        refreshing={refreshing}
      />
    );
  }

  return (
    <View
      style={{ paddingTop }}
      className="flex-1 bg-background dark:bg-dark-background"
    >
      {/* Screen Title */}
      <View className="px-4 pb-4">
        <Text className="font-heading text-3xl text-text dark:text-dark-text">
          Categories
        </Text>
      </View>

      {/* Grid of category cards */}
      <FlashList
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.name}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: 4,
          paddingBottom: 90, 
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colorScheme === 'dark' ? '#9CA3AF' : '#64748B'}
          />
        }
      />
    </View>
  );
}
