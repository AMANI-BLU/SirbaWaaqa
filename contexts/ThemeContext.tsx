import { useState, useEffect, useCallback } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import Colors from '@/constants/colors';

const THEME_KEY = '@sirba_theme';

type ThemeMode = 'light' | 'dark' | 'system';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(Appearance.getColorScheme());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
    
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme);
    });
    
    return () => subscription.remove();
  }, []);

  const loadTheme = async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_KEY);
      if (stored && (stored === 'light' || stored === 'dark' || stored === 'system')) {
        setThemeMode(stored as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTheme = async (newMode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, newMode);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
    saveTheme(mode);
  }, []);
  
  const getActiveTheme = (): 'light' | 'dark' => {
    if (themeMode === 'system') {
      return systemTheme === 'dark' ? 'dark' : 'light';
    }
    return themeMode;
  };

  const theme = getActiveTheme();
  const colors = theme === 'light' ? Colors.light : Colors.dark;

  return {
    theme,
    themeMode,
    colors,
    setTheme,
    isLoading,
  };
});
