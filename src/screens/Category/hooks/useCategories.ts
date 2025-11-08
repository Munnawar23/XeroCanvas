import { useState, useEffect, useCallback } from "react";
import { CATEGORIES, fetchCategoryPreview } from "@api/index";
import { storage } from "@utils/storage";
import { SettingsStore } from "@store/SettingsStore";

export type CategoryWithImage = {
  name: string;
  imageUrl: string | null;
};

/**
 * Custom hook to fetch all categories with a preview image.
 * Handles caching, pull-to-refresh, and error state.
 */
export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load categories with optional force refresh to bypass cache.
   */
  const loadCategories = useCallback(async (forceRefresh: boolean = false) => {
    if (!forceRefresh) setLoading(true);
    setError(null);

    try {
      const cacheKey = "categories_with_images";

      // Try to load cached categories first
      if (!forceRefresh) {
        const cachedData = await storage.getCache<CategoryWithImage[]>(cacheKey);
        if (cachedData) {
          setCategories(cachedData);
          return;
        }
      }

      // Get latest safe search setting
      const safeSearch = await SettingsStore.getSafeSearch();

      // Fetch preview image for each category
      const fetchedCategories = await Promise.all(
        CATEGORIES.map(async (category) => {
          const preview = await fetchCategoryPreview(category, safeSearch);
          return { name: category, imageUrl: preview?.webformatURL || null };
        })
      );

      setCategories(fetchedCategories);
      await storage.setCache(cacheKey, fetchedCategories, 24 * 60 * 60 * 1000); // cache 24h
    } catch (err) {
      console.error("Failed to load categories:", err);
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Pull-to-refresh handler
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadCategories(true);
  }, [loadCategories]);

  return { categories, loading, refreshing, error, handleRefresh };
};
