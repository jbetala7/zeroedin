'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameSettings, DEFAULT_SETTINGS, PreloaderType } from '../types/settings';

const STORAGE_KEY = 'zeroedin-settings';

export function useSettings() {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<GameSettings>;
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch {
      // Use defaults if localStorage fails
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage
  const saveSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  }, []);

  // Convenience method for preloader
  const setPreloader = useCallback((preloader: PreloaderType) => {
    saveSettings({ preloader });
  }, [saveSettings]);

  return {
    settings,
    isLoaded,
    saveSettings,
    setPreloader,
  };
}
