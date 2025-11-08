import { useState, useEffect, useCallback, useRef } from "react";
import HapticFeedback from "react-native-haptic-feedback";
import { fetchWallpapers, PixabayImage } from "@api/index";
import { FilterState } from "@screens/Search/components/FilterModal";
import { SettingsStore } from "@store/SettingsStore";

/**
 * Debounce utility to prevent excessive API calls while typing.
 * @param func Function to debounce
 * @param wait Delay in milliseconds
 */
const debounce = (func: Function, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Custom hook to manage search state, filters, pagination, and API calls.
 */
export const useSearch = () => {
  // --- Search state ---
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    colors: [],
    editorsChoice: false,
    order: "popular",
  });

  // --- Data state ---
  const [wallpapers, setWallpapers] = useState<PixabayImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const hasSearched = useRef(false); // Track if user has initiated a search

  // --- Loading, pagination, refresh state ---
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  /**
   * Core function to fetch wallpapers from API
   * @param query Search string
   * @param currentFilters Applied filters
   * @param pageNum Current page
   * @param append Whether to append results to existing list
   */
  const performSearch = useCallback(
    async (query: string, currentFilters: FilterState, pageNum: number, append: boolean) => {
      if (!query.trim()) {
        setWallpapers([]);
        return;
      }

      // Set appropriate loading state
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);

      try {
        if (!hasSearched.current) hasSearched.current = true;

        // Get latest safe search setting
        const safeSearch = await SettingsStore.getSafeSearch();

        const response = await fetchWallpapers({
          q: query,
          colors: currentFilters.colors.join(","),
          editors_choice: currentFilters.editorsChoice || undefined,
          order: currentFilters.order,
          page: pageNum,
          safesearch: safeSearch,
        });

        // Check if there are more results
        if (response.hits.length === 0) setHasMore(false);

        // Update wallpapers list
        setWallpapers((prev) => (append ? [...prev, ...response.hits] : response.hits));

      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to fetch results. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    []
  );

  /**
   * Trigger a new search, resets page and results
   */
  const startNewSearch = useCallback((query: string, currentFilters: FilterState) => {
    setPage(1);
    setHasMore(true);
    setWallpapers([]);
    performSearch(query, currentFilters, 1, false);
  }, [performSearch]);

  // Debounced search to avoid excessive API calls while typing
  const debouncedSearch = useCallback(debounce(startNewSearch, 500), [startNewSearch]);

  // Trigger search on query or filters change
  useEffect(() => {
    if (searchQuery.trim() || hasSearched.current) {
      debouncedSearch(searchQuery, filters);
    }
  }, [searchQuery, filters, debouncedSearch]);

  // --- UI Handlers ---

  /**
   * Apply new filters to the search
   */
  const handleApplyFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    hasSearched.current = true;
  }, []);

  /**
   * Clear the current search and reset state
   */
  const handleClearSearch = useCallback(() => {
    HapticFeedback.trigger("impactLight"); // Provide tactile feedback
    setSearchQuery("");
    setWallpapers([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    hasSearched.current = false;
  }, []);

  /**
   * Pull-to-refresh handler
   */
  const handleRefresh = useCallback(() => {
    if (!searchQuery.trim()) {
      setRefreshing(false);
      return;
    }
    setRefreshing(true);
    startNewSearch(searchQuery, filters);
  }, [searchQuery, filters, startNewSearch]);

  /**
   * Load more results when user scrolls to bottom
   */
  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore || !searchQuery.trim()) return;
    const nextPage = page + 1;
    setPage(nextPage);
    performSearch(searchQuery, filters, nextPage, true);
  }, [loadingMore, hasMore, page, searchQuery, filters, performSearch]);

  return {
    // State
    searchQuery,
    wallpapers,
    loading,
    loadingMore,
    refreshing,
    error,
    hasSearched: hasSearched.current,
    filters,
    // Handlers
    setSearchQuery,
    handleApplyFilters,
    handleClearSearch,
    handleRefresh,
    handleLoadMore,
  };
};
