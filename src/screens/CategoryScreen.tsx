import React, { useState, useEffect } from "react";
import { View, Text, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";

// Hooks, utils, and types
import { useSafePadding } from "@hooks/useSafePadding";
import { useTheme } from "@context/ThemeContext";
import { CATEGORIES, fetchCategoryPreview } from "@services/pixabay";
import { storage } from "@utils/storage";
import { AppNavigationProp } from "@navigation/types";

// Components
import { CategoryCard } from "@components/CategoryCard";
import { LoadingCard } from "@components/LoadingCard";

type CategoryWithImage = { name: string; imageUrl: string | null };

export default function CategoryScreen() {
  const { paddingTop } = useSafePadding();
  const { isDark } = useTheme();
  const navigation = useNavigation<AppNavigationProp>();

  const [categories, setCategories] = useState<CategoryWithImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const cacheKey = "categories_with_images";
      try {
        let data = await storage.getCache<CategoryWithImage[]>(cacheKey);
        if (!data) {
          const fetched = await Promise.all(
            CATEGORIES.map(async (category) => {
              const preview = await fetchCategoryPreview(category);
              return {
                name: category,
                imageUrl: preview?.webformatURL || null,
              };
            })
          );
          data = fetched;
          await storage.setCache(cacheKey, data, 24 * 60 * 60 * 1000);
        }
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleCategoryPress = (category: string) => {
    navigation.navigate("CategoryDetail", { category });
  };

  const renderItem = ({ item }: { item: CategoryWithImage }) => (
    <View className="flex-1 p-1.5 mb-3">
      <CategoryCard
        category={item.name}
        imageUrl={item.imageUrl}
        onPress={() => handleCategoryPress(item.name)}
      />
    </View>
  );

  const LoadingState = () => (
    <View className="mt-4 flex-row flex-wrap justify-between px-2">
      {[...Array(8)].map((_, i) => (
        <View key={i} className="w-[49%] p-1.5">
          <LoadingCard aspectRatio={1} />
        </View>
      ))}
    </View>
  );

  return (
    <View
      style={{ paddingTop }}
      className="flex-1 bg-light-background dark:bg-dark-background"
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-4 pb-4">
        <Text className="font-heading text-3xl text-light-text dark:text-dark-text">
          Categories
        </Text>
      </View>

      {loading ? (
        <LoadingState />
      ) : (
        <FlashList
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          numColumns={2}
          masonry
          contentContainerStyle={{ paddingHorizontal: 4 }}
        />
      )}
    </View>
  );
}
