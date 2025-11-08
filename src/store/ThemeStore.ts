import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@app_theme';

export type ThemeMode = 'light' | 'dark';

export const ThemeStore = {
  async getTheme(): Promise<ThemeMode> {
    try {
      const theme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      return (theme as ThemeMode) || 'light'; 
    } catch (error) {
      console.error('Error loading theme:', error);
      return 'light';
    }
  },

  async setTheme(theme: ThemeMode): Promise<void> {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  },
};
