import { useState, useEffect, useCallback } from "react";
import { fetchWallpapers, PixabayImage, PixabayResponse } from "@api/index";
import { storage } from "@utils/storage";


/**
 * Custom hook to fetch wallpapers for a specific category.
 * Supports pagination, caching, pull-to-refresh, and infinite scroll.
 */
export const useCategoryWallpapers = (category: string) => {
  const [wallpapers, setWallpapers] = useState<PixabayImage[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load wallpapers with optional pagination and force refresh.
   */
  const loadWallpapers = useCallback(
    async (pageNum: number = 1, append: boolean = false, forceRefresh: boolean = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);

      try {
        const cacheKey = `wallpapers_${category}_page_${pageNum}`;

        // Load from cache if available and not forced
        if (!forceRefresh) {
          const cachedData = await storage.getCache<PixabayResponse>(cacheKey);
          if (cachedData) {
            if (cachedData.hits.length === 0) setHasMore(false);
            setWallpapers((prev) => (append ? [...prev, ...cachedData.hits] : cachedData.hits));
            return;
          }
        }

        // Fetch from API
        const data = await fetchWallpapers({ category, page: pageNum, order: "popular" });
        await storage.setCache(cacheKey, data);

        if (data?.hits) {
          if (data.hits.length === 0) setHasMore(false);
          setWallpapers((prev) => (append ? [...prev, ...data.hits] : data.hits));
        }
      } catch (err) {
        console.error("Failed to load category wallpapers:", err);
        setError("Failed to load wallpapers. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [category]
  );

  // Load wallpapers on mount
  useEffect(() => {
    loadWallpapers(1);
  }, [loadWallpapers]);

  // Pull-to-refresh handler
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    loadWallpapers(1, false, true);
  }, [loadWallpapers]);

  // Load more for infinite scroll
  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    loadWallpapers(nextPage, true);
  }, [loadingMore, hasMore, page, loadWallpapers]);

  return {
    wallpapers,
    loading,
    loadingMore,
    refreshing,
    error,
    handleRefresh,
    handleLoadMore,
  };
};
