import { useState, useEffect, useCallback } from "react";
import { fetchWallpapers, PixabayImage } from "@api/index";
import { storage } from "@utils/storage";


// Response type for clarity and type safety
type PixabayResponse = {
  hits: PixabayImage[];
  total: number;
  totalHits: number;
};

/**
 * Custom hook to manage wallpapers fetching, caching, and pagination.
 */
export const useWallpapers = () => {
  // --- State variables ---
  const [wallpapers, setWallpapers] = useState<PixabayImage[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);


  /**
   * Load wallpapers from cache or API.
   * @param pageNum - Page number to load
   * @param append - Whether to append results to existing list
   * @param forceRefresh - Whether to bypass cache
   */
  const loadWallpapers = useCallback(
    async (pageNum: number = 1, append: boolean = false, forceRefresh: boolean = false) => {
      // Set appropriate loading state
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setError(null); // Reset previous error

      try {
        const cacheKey = `wallpapers_page_${pageNum}`;

        // Try to use cached data first
        if (!forceRefresh) {
          const cachedData = await storage.getCache<PixabayResponse>(cacheKey);
          if (cachedData) {
            if (cachedData.hits.length === 0) setHasMore(false);
            setWallpapers(prev => (append ? [...prev, ...cachedData.hits] : cachedData.hits));
            return; // Exit after setting state from cache
          }
        }

        // Fetch data from API
        const data = await fetchWallpapers({ page: pageNum, order: "popular" });
        await storage.setCache(cacheKey, data); // Update cache with fresh data

        if (data?.hits) {
          if (data.hits.length === 0) setHasMore(false);
          setWallpapers(prev => (append ? [...prev, ...data.hits] : data.hits));
        }
      } catch (err) {
        console.error("Failed to load wallpapers:", err);
        setError("Failed to load wallpapers. Please try again.");
      } finally {
        // Reset all loading states
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    []
  );

  // --- Initial load on mount ---
  useEffect(() => {
    loadWallpapers(1);
  }, [loadWallpapers]);

  /**
   * Handler for pull-to-refresh.
   * Forces a refresh and resets page to 1.
   */
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    loadWallpapers(1, false, true); // Force refresh
  }, [loadWallpapers]);

  /**
   * Handler for infinite scroll / load more.
   */
  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    loadWallpapers(nextPage, true);
  }, [loadingMore, hasMore, page, loadWallpapers]);

  // Return all state and handlers for UI
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
