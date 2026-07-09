'use client';

import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'leadsense-theme';

const getSystemTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const applyTheme = (theme: Theme): void => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
};

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial = stored === 'light' || stored === 'dark' ? stored : getSystemTheme();
    applyTheme(initial);
    setThemeState(initial);
    setReady(true);
  }, []);

  const setTheme = useCallback((next: Theme): void => {
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback((): void => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [setTheme, theme]);

  return { theme, setTheme, toggleTheme, ready };
};
