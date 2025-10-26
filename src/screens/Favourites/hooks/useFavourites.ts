import { useFavouritesStore } from "@store/FavouritesStore";

/**
 * Custom hook to access and manage user favourites.
 * Wraps Zustand store logic with a simple interface for components.
 */
export const useFavourites = () => {
  // --- Access global state from Zustand store ---
  const favourites = useFavouritesStore((state) => state.favourites);
  const toggleFavourite = useFavouritesStore((state) => state.toggleFavourite);

  // --- Local state placeholders ---
  // Currently there is no async operation, so loading and refreshing are always false
  const loading = false;
  const refreshing = false;

  /**
   * Pull-to-refresh handler placeholder.
   * Since favourites are stored locally, this currently just logs an action.
   */
  const handleRefresh = () => {
    console.log("Attempted to refresh local favourites.");
    // Optionally, you could add logic to re-fetch favourites from AsyncStorage or server if needed
  };

  // --- Return structured interface for components ---
  return {
    favourites,
    loading,
    refreshing,
    handleRefresh,
    toggleFavourite,
  };
};
