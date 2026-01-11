'use client';

import { useState, useEffect } from 'react';
import { PreloaderType, DEFAULT_SETTINGS } from '../../types/settings';
import { RifleScopeLoader } from './RifleScopeLoader';
import { AirRiflePumpLoader } from './AirRiflePumpLoader';
import { TargetRangeLoader } from './TargetRangeLoader';
import { CrosshairCalibLoader } from './CrosshairCalibLoader';

interface PreloaderWrapperProps {
  onComplete: () => void;
}

const PRELOADER_COMPONENTS: Record<PreloaderType, React.ComponentType<{ onComplete: () => void }>> = {
  scope: RifleScopeLoader,
  rifle: AirRiflePumpLoader,
  range: TargetRangeLoader,
  calibration: CrosshairCalibLoader,
};

const STORAGE_KEY = 'zeroedin-settings';

export function PreloaderWrapper({ onComplete }: PreloaderWrapperProps) {
  const [preloaderType, setPreloaderType] = useState<PreloaderType | null>(null);

  // Read settings synchronously on mount to avoid showing wrong preloader
  useEffect(() => {
    let selectedPreloader: PreloaderType = DEFAULT_SETTINGS.preloader;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.preloader) {
          selectedPreloader = parsed.preloader;
        }
      }
    } catch {
      // Use default
    }
    setPreloaderType(selectedPreloader);
  }, []);

  // Show black screen while determining which preloader to use
  if (!preloaderType) {
    return <div className="absolute inset-0 bg-black" />;
  }

  const PreloaderComponent = PRELOADER_COMPONENTS[preloaderType];
  return <PreloaderComponent onComplete={onComplete} />;
}
