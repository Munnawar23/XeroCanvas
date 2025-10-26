import AsyncStorage from '@react-native-async-storage/async-storage';

export type DownloadedWallpaper = {
  id: string;
  localUri: string;
  originalUrl: string;
  downloadedAt: string;
  metadata: {
    tags: string;
    user: string;
    dimensions: string;
  };
};

// Storage keys
const KEYS = {
  DOWNLOADS: 'downloads',
  CACHE_PREFIX: 'cache_',
};

/**
 * Storage helper to manage downloads and cached data in AsyncStorage.
 */
export const storage = {
  /** Get all downloaded wallpapers */
  async getDownloads(): Promise<DownloadedWallpaper[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(KEYS.DOWNLOADS);
      return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('getDownloads error:', error);
      return [];
    }
  },

  /** Add a wallpaper to downloads */
  async addDownload(wallpaper: DownloadedWallpaper): Promise<void> {
    try {
      const existing = await this.getDownloads();
      const updated = [wallpaper, ...existing];
      await AsyncStorage.setItem(KEYS.DOWNLOADS, JSON.stringify(updated));
    } catch (error) {
      console.error('addDownload error:', error);
    }
  },

  /** Remove a wallpaper from downloads by ID */
  async removeDownload(id: string): Promise<void> {
    try {
      const downloads = await this.getDownloads();
      const updated = downloads.filter(d => d.id !== id);
      await AsyncStorage.setItem(KEYS.DOWNLOADS, JSON.stringify(updated));
    } catch (error) {
      console.error('removeDownload error:', error);
    }
  },

  /** Set cached data with optional expiry */
  async setCache<T>(key: string, data: T, expiresInMs = 24 * 60 * 60 * 1000): Promise<void> {
    try {
      const cacheData = { data, expiresAt: Date.now() + expiresInMs };
      await AsyncStorage.setItem(`${KEYS.CACHE_PREFIX}${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error(`setCache error (${key}):`, error);
    }
  },

  /** Get cached data if not expired */
  async getCache<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(`${KEYS.CACHE_PREFIX}${key}`);
      if (!jsonValue) return null;

      const cache = JSON.parse(jsonValue);
      if (Date.now() > cache.expiresAt) {
        await AsyncStorage.removeItem(`${KEYS.CACHE_PREFIX}${key}`);
        return null;
      }

      return cache.data as T;
    } catch (error) {
      console.error(`getCache error (${key}):`, error);
      return null;
    }
  },

  /** Clear all cached data */
  async clearAllCache(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(k => k.startsWith(KEYS.CACHE_PREFIX));
      if (cacheKeys.length > 0) await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('clearAllCache error:', error);
    }
  },
};
