import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Types ---

export type ThemeMode = 'light' | 'dark' | 'system';

export type DownloadedWallpaper = {
  id: string;           // Image ID
  localUri: string;     // Local file path
  originalUrl: string;  // Original remote URL
  downloadedAt: string; // Download time
  metadata: {
    tags: string;
    user: string;
    dimensions: string;
  };
};

export type UserPreferences = {
  gridColumns: 2 | 3;
  imageQuality: 'medium' | 'high';
  safeSearch: boolean;
};

// --- Storage Keys ---
const KEYS = {
  THEME_MODE: 'theme_mode',
  DOWNLOADS: 'downloads',
  SEARCH_HISTORY: 'search_history',
  PREFERENCES: 'user_preferences',
  CACHE_PREFIX: 'cache_',
};

// --- Storage Helper ---
export const storage = {
  // --- Theme ---
  async getThemeMode(): Promise<ThemeMode> {
    try {
      const mode = await AsyncStorage.getItem(KEYS.THEME_MODE);
      return (mode as ThemeMode) || 'system';
    } catch (error) {
      console.error('getThemeMode error:', error);
      return 'system';
    }
  },

  async setThemeMode(mode: ThemeMode): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.THEME_MODE, mode);
    } catch (error) {
      console.error('setThemeMode error:', error);
    }
  },

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

  // --- Preferences ---
  async getPreferences(): Promise<UserPreferences> {
    const defaults: UserPreferences = {
      gridColumns: 2,
      imageQuality: 'high',
      safeSearch: true,
    };
    try {
      const jsonValue = await AsyncStorage.getItem(KEYS.PREFERENCES);
      return jsonValue ? { ...defaults, ...JSON.parse(jsonValue) } : defaults;
    } catch (error) {
      console.error('getPreferences error:', error);
      return defaults;
    }
  },

  async setPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    try {
      const current = await this.getPreferences();
      const updated = { ...current, ...preferences };
      await AsyncStorage.setItem(KEYS.PREFERENCES, JSON.stringify(updated));
    } catch (error) {
      console.error('setPreferences error:', error);
    }
  },

  // --- Cache ---
  async setCache(key: string, data: any, expiresInMs = 24 * 60 * 60 * 1000): Promise<void> {
    try {
      const cacheData = { data, expiresAt: Date.now() + expiresInMs };
      await AsyncStorage.setItem(`${KEYS.CACHE_PREFIX}${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error(`setCache error (${key}):`, error);
    }
  },

  async getCache(key: string): Promise<any | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(`${KEYS.CACHE_PREFIX}${key}`);
      if (!jsonValue) return null;
      const cache = JSON.parse(jsonValue);
      if (Date.now() > cache.expiresAt) {
        await AsyncStorage.removeItem(`${KEYS.CACHE_PREFIX}${key}`);
        return null;
      }
      return cache.data;
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
