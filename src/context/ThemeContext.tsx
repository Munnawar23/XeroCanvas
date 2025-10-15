import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import { storage, ThemeMode } from '@utils/storage';

type ThemeContextType = {
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { colorScheme, setColorScheme } = useNativewindColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    const load = async () => {
      const saved = await storage.getThemeMode();
      setThemeModeState(saved);
    };
    load();
  }, []);

  useEffect(() => {
    // Decide which scheme to set
    let schemeToSet: ThemeMode | undefined;

    if (themeMode === 'light' || themeMode === 'dark') {
      schemeToSet = themeMode;
    } else {
      // 'system' mode: use device colorScheme, or default to 'light'
      schemeToSet = colorScheme ?? 'light';
    }

    // Only call setColorScheme if we have a valid scheme
    if (schemeToSet) {
      setColorScheme(schemeToSet);
    }
  }, [themeMode, colorScheme, setColorScheme]);

  const handleSetThemeMode = (mode: ThemeMode) => {
    storage.setThemeMode(mode).catch(err =>
      console.error('Failed to save theme mode', err)
    );
    setThemeModeState(mode);
  };

  const value: ThemeContextType = {
    themeMode,
    setThemeMode: handleSetThemeMode,
    isDark: colorScheme === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
};
