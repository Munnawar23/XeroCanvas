import AsyncStorage from '@react-native-async-storage/async-storage';

const SAFE_SEARCH_KEY = '@safe_search';

export const SettingsStore = {
  async getSafeSearch(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(SAFE_SEARCH_KEY);
      return value === 'true';
    } catch (error) {
      console.error('Error loading safe search:', error);
      return false;
    }
  },

  async setSafeSearch(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(SAFE_SEARCH_KEY, enabled.toString());
    } catch (error) {
      console.error('Error saving safe search:', error);
    }
  },
};
