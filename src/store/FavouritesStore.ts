// src/stores/FavouriteStore.tsx

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message'; // <-- 1. Import Toast
import { PixabayImage } from '@api/index';

interface FavouritesState {
  favourites: PixabayImage[];
  toggleFavourite: (wallpaper: PixabayImage) => void;
  isFavourite: (wallpaperId: number) => boolean;
}

export const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set, get) => ({
      favourites: [],
      toggleFavourite: (wallpaper) => {
        const currentFavourites = get().favourites;
        const isAlreadyFavourite = currentFavourites.some((fav) => fav.id === wallpaper.id);

        if (isAlreadyFavourite) {
          // It's already a favourite, so we are removing it.
          const updatedFavourites = currentFavourites.filter((fav) => fav.id !== wallpaper.id);
          set({ favourites: updatedFavourites });
          // Note: The "removed" toast is handled in FavouritesScreen as requested,
          // because it's a specific UI interaction on that screen.
        } else {
          // --- 2. ADD THE TOAST LOGIC HERE ---
          // It's a new favourite, so we are adding it.
          set({ favourites: [wallpaper, ...currentFavourites] });
          Toast.show({
            type: 'success', // 'success' usually has a green bar
            text1: 'Added to Favourites',
            position: 'top',
            visibilityTime: 2000, // Show for 2 seconds
          });
        }
      },
      isFavourite: (wallpaperId) => {
        const currentFavourites = get().favourites;
        return currentFavourites.some((fav) => fav.id === wallpaperId);
      },
    }),
    {
      name: 'favourites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);