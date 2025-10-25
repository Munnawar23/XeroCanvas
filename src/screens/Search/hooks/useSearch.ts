import { useState, useEffect, useCallback, useRef } from "react";
import HapticFeedback from "react-native-haptic-feedback";
import { fetchWallpapers, PixabayImage } from "@api/index";
import { FilterState } from "@screens/Search/components/FilterModal";

// Debounce utility function
const debounce = (func: Function, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const useSearch = () => {
  // --- State for search parameters ---
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    colors: [],
    editorsChoice: false,
    order: "popular",
  });

  // --- State for data and results ---
  const [wallpapers, setWallpapers] = useState<PixabayImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const hasSearched = useRef(false);

  // --- State for loading, pagination, and refresh ---
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // --- Core data fetching function ---
  const performSearch = useCallback(
    async (query: string, currentFilters: FilterState, pageNum: number, append: boolean) => {
      if (!query.trim()) {
        setWallpapers([]);
        return;
      }
      
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);

      try {
        if (!hasSearched.current) hasSearched.current = true;
        
        const response = await fetchWallpapers({
          q: query,
          colors: currentFilters.colors.join(","),
          editors_choice: currentFilters.editorsChoice || undefined,
          order: currentFilters.order,
          page: pageNum,
        });

        if (response.hits.length === 0) setHasMore(false);
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

  // --- Search trigger with debounce ---
  const startNewSearch = useCallback((query: string, currentFilters: FilterState) => {
    setPage(1);
    setHasMore(true);
    setWallpapers([]);
    performSearch(query, currentFilters, 1, false);
  }, [performSearch]);

  const debouncedSearch = useCallback(debounce(startNewSearch, 500), [startNewSearch]);

  useEffect(() => {
    // Trigger search only if the user has typed or applied filters
    if (searchQuery.trim() || hasSearched.current) {
      debouncedSearch(searchQuery, filters);
    }
  }, [searchQuery, filters, debouncedSearch]);

  // --- UI Handlers ---
  const handleApplyFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    hasSearched.current = true; // Mark as searched when filters are applied
  }, []);

  const handleClearSearch = useCallback(() => {
    // --- FIX #2: Call the trigger method on the imported 'HapticFeedback' object ---
    HapticFeedback.trigger("impactLight");
    setSearchQuery("");
    setWallpapers([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    hasSearched.current = false;
  }, []);

  const handleRefresh = useCallback(() => {
    if (!searchQuery.trim()) {
      setRefreshing(false);
      return;
    }
    setRefreshing(true);
    startNewSearch(searchQuery, filters);
  }, [searchQuery, filters, startNewSearch]);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore || !searchQuery.trim()) return;
    const nextPage = page + 1;
    setPage(nextPage);
    performSearch(searchQuery, filters, nextPage, true);
  }, [loadingMore, hasMore, page, searchQuery, filters, performSearch]);

  return {
    // State for UI
    searchQuery,
    wallpapers,
    loading,
    loadingMore,
    refreshing,
    error,
    hasSearched: hasSearched.current,
    filters,
    // Handlers for UI
    setSearchQuery,
    handleApplyFilters,
    handleClearSearch,
    handleRefresh,
    handleLoadMore,
  };
};