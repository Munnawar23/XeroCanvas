import React, { useCallback } from "react";
import { View, Text, StatusBar, RefreshControl, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";

// Hooks, types, and reusable components
import { useSafePadding } from "@hooks/useSafePadding";
import { useCategories, CategoryWithImage } from "@screens/Category/hooks/useCategories";
import { AppNavigationProp } from "@navigation/types";
import { CategoryCard } from "@screens/Category/components/CategoryCard";
import { LoadingState } from "@components/layout/LoadingState";
import { ErrorState } from "@components/layout/ErrorState";

export default function CategoryScreen() {
  const { paddingTop } = useSafePadding();
  const navigation = useNavigation<AppNavigationProp>();

  const { categories, loading, refreshing, error, handleRefresh } = useCategories();

  const handleCategoryPress = useCallback(
    (category: string) => {
      navigation.navigate("CategoryDetail", { category });
    },
    [navigation]
  );

  const renderItem = ({ item }: { item: CategoryWithImage }) => (
    <View className="flex-1 p-1.5 mb-3">
      <CategoryCard
        category={item.name}
        imageUrl={item.imageUrl}
        onPress={() => handleCategoryPress(item.name)}
      />
    </View>
  );

  if (loading) {
    return <LoadingState paddingTop={paddingTop} />;
  }

  if (error) {
    return (
      <ErrorState
        paddingTop={paddingTop}
        errorMessage={error}
        onRetry={handleRefresh}
        refreshing={false}
      />
    );
  }

  return (
    <View style={{ paddingTop }} className="flex-1 bg-background">
      <View className="px-4 pb-4">
        <Text className="font-heading text-3xl text-text">Categories</Text>
      </View>

      <FlashList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: 4,
          paddingBottom: Platform.OS === "ios" ? 100 : 80, 
        }}
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
