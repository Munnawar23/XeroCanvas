import { useState, useEffect, useCallback } from "react";
import { fetchWallpapers, PixabayImage } from "@api/index";
import { storage } from "@utils/storage";

// Define the expected response type for clarity
type PixabayResponse = {
  hits: PixabayImage[];
  total: number;
  totalHits: number;
};

export const useWallpapers = () => {
  const [wallpapers, setWallpapers] = useState<PixabayImage[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Main data loading function with caching and force refresh ---
  const loadWallpapers = useCallback(
    async (pageNum: number = 1, append: boolean = false, forceRefresh: boolean = false) => {
      // Set loading state based on action type
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null); // Reset error on new attempt

      try {
        const cacheKey = `wallpapers_page_${pageNum}`;

        // Try to get data from cache first, unless a force refresh is requested
        if (!forceRefresh) {
          const cachedData = await storage.getCache<PixabayResponse>(cacheKey);
          if (cachedData) {
            if (cachedData.hits.length === 0) setHasMore(false);
            setWallpapers((prev) => (append ? [...prev, ...cachedData.hits] : cachedData.hits));
            return; // Exit early after setting state from cache
          }
        }

        // --- Fetch from API if not in cache or if forced ---
        const data = await fetchWallpapers({ page: pageNum, order: "popular" });
        await storage.setCache(cacheKey, data); // Update cache with fresh data

        if (data?.hits) {
          if (data.hits.length === 0) setHasMore(false);
          setWallpapers((prev) => (append ? [...prev, ...data.hits] : data.hits));
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

  // --- Initial load ---
  useEffect(() => {
    loadWallpapers(1);
  }, [loadWallpapers]);

  // --- Handler for pull-to-refresh ---
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    // Force refresh to bypass cache and get new data for page 1
    loadWallpapers(1, false, true);
  }, [loadWallpapers]);

  // --- Handler for loading more on scroll ---
  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    loadWallpapers(nextPage, true);
  }, [loadingMore, hasMore, page, loadWallpapers]);

  // Return state and handlers for the UI component to use
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