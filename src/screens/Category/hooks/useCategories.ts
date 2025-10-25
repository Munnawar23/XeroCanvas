import { useState, useEffect, useCallback } from "react";
import { CATEGORIES, fetchCategoryPreview } from "@api/index";
import { storage } from "@utils/storage";

export type CategoryWithImage = { name: string; imageUrl: string | null };

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async (forceRefresh: boolean = false) => {
    if (!forceRefresh) setLoading(true);
    setError(null);

    try {
      const cacheKey = "categories_with_images";
      if (!forceRefresh) {
        const cachedData = await storage.getCache<CategoryWithImage[]>(cacheKey);
        if (cachedData) {
          setCategories(cachedData);
          return;
        }
      }

      const fetchedCategories = await Promise.all(
        CATEGORIES.map(async (category) => {
          const preview = await fetchCategoryPreview(category);
          return { name: category, imageUrl: preview?.webformatURL || null };
        })
      );

      setCategories(fetchedCategories);
      await storage.setCache(cacheKey, fetchedCategories, 24 * 60 * 60 * 1000);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadCategories(true);
  }, [loadCategories]);

  return { categories, loading, refreshing, error, handleRefresh };
};