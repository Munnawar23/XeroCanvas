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

// --- Storage Keys ---
const KEYS = {
  DOWNLOADS: 'downloads',
  SEARCH_HISTORY: 'search_history',
  CACHE_PREFIX: 'cache_',
};

// --- Storage Helper ---
export const storage = {
  // --- Downloads ---
  async getDownloads(): Promise<DownloadedWallpaper[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(KEYS.DOWNLOADS);
      return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('getDownloads error:', error);
      return [];
    }
  },

  async addDownload(wallpaper: DownloadedWallpaper): Promise<void> {
    try {
      const existing = await this.getDownloads();
      const updated = [wallpaper, ...existing];
      await AsyncStorage.setItem(KEYS.DOWNLOADS, JSON.stringify(updated));
    } catch (error) {
      console.error('addDownload error:', error);
    }
  },

  async removeDownload(id: string): Promise<void> {
    try {
      const downloads = await this.getDownloads();
      const updated = downloads.filter(d => d.id !== id);
      await AsyncStorage.setItem(KEYS.DOWNLOADS, JSON.stringify(updated));
    } catch (error) {
      console.error('removeDownload error:', error);
    }
  },

  // --- Search History ---
  async getSearchHistory(): Promise<string[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(KEYS.SEARCH_HISTORY);
      return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('getSearchHistory error:', error);
      return [];
    }
  },

  async addSearchHistory(query: string): Promise<void> {
    try {
      const history = await this.getSearchHistory();
      const filtered = history.filter(q => q.toLowerCase() !== query.toLowerCase());
      const updated = [query, ...filtered].slice(0, 10);
      await AsyncStorage.setItem(KEYS.SEARCH_HISTORY, JSON.stringify(updated));
    } catch (error) {
      console.error('addSearchHistory error:', error);
    }
  },

  // --- Cache ---
  async setCache<T>(key: string, data: T, expiresInMs = 24 * 60 * 60 * 1000): Promise<void> {
    try {
      const cacheData = { data, expiresAt: Date.now() + expiresInMs };
      await AsyncStorage.setItem(`${KEYS.CACHE_PREFIX}${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error(`setCache error (${key}):`, error);
    }
  },

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