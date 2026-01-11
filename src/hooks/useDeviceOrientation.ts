'use client';

import { useState, useEffect, useCallback } from 'react';

interface DeviceOrientation {
  alpha: number | null; // z-axis rotation [0, 360)
  beta: number | null;  // x-axis rotation [-180, 180)
  gamma: number | null; // y-axis rotation [-90, 90)
  isSupported: boolean;
}

export function useDeviceOrientation(): DeviceOrientation {
  const [orientation, setOrientation] = useState<DeviceOrientation>({
    alpha: null,
    beta: null,
    gamma: null,
    isSupported: false,
  });

  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    setOrientation({
      alpha: e.alpha,
      beta: e.beta,
      gamma: e.gamma,
      isSupported: true,
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      // Check if permission is needed (iOS 13+)
      if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
        // Will need to request permission on user interaction
        setOrientation((prev) => ({ ...prev, isSupported: true }));
      } else {
        window.addEventListener('deviceorientation', handleOrientation, { passive: true });
        setOrientation((prev) => ({ ...prev, isSupported: true }));
      }
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [handleOrientation]);

  return orientation;
}

export async function requestOrientationPermission(): Promise<boolean> {
  if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
    try {
      const permission = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }
  return true;
}
