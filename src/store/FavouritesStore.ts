import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { PixabayImage } from '@api/index';

interface FavouritesState {
  favourites: PixabayImage[];
  toggleFavourite: (wallpaper: PixabayImage) => void;
  isFavourite: (wallpaperId: number) => boolean;
  clearAll: () => void;
}

/**
 * Zustand store to manage favourite wallpapers with persistence.
 */
export const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set, get) => ({
      favourites: [],
      toggleFavourite: (wallpaper) => {
        const currentFavourites = get().favourites;
        const isAlreadyFavourite = currentFavourites.some(fav => fav.id === wallpaper.id);

        if (isAlreadyFavourite) {
          // Remove wallpaper from favourites
          const updatedFavourites = currentFavourites.filter(fav => fav.id !== wallpaper.id);
          set({ favourites: updatedFavourites });
        } else {
          // Add wallpaper to favourites and show toast
          set({ favourites: [wallpaper, ...currentFavourites] });
          Toast.show({
            type: 'success',
            text1: 'Added to Favourites',
            position: 'top',
            visibilityTime: 2000,
          });
        }
      },
      isFavourite: (wallpaperId) => {
        return get().favourites.some(fav => fav.id === wallpaperId);
      },
      clearAll: () => {
        set({ favourites: [] });
      },
    }),
    {
      name: 'favourites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
