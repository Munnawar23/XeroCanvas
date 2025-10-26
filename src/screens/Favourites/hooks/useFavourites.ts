import { useFavouritesStore } from "@store/FavouritesStore"; 
export const useFavourites = () => {
  const favourites = useFavouritesStore((state) => state.favourites);
  const toggleFavourite = useFavouritesStore((state) => state.toggleFavourite);
  const loading = false;
  const refreshing = false;

  const handleRefresh = () => {
    console.log("Attempted to refresh local favourites.");
  };

  return {
    favourites,
    loading,
    refreshing,
    handleRefresh,
    toggleFavourite, 
  };
};