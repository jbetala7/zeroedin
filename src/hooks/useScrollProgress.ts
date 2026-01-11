'use client';

import { useState, useEffect, useCallback } from 'react';

interface ScrollProgress {
  progress: number; // 0 to 1
  scrollY: number;
  direction: 'up' | 'down' | null;
  velocity: number;
}

export function useScrollProgress(): ScrollProgress {
  const [scrollData, setScrollData] = useState<ScrollProgress>({
    progress: 0,
    scrollY: 0,
    direction: null,
    velocity: 0,
  });

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;

    setScrollData((prev) => ({
      progress,
      scrollY,
      direction: scrollY > prev.scrollY ? 'down' : scrollY < prev.scrollY ? 'up' : prev.direction,
      velocity: Math.abs(scrollY - prev.scrollY),
    }));
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return scrollData;
}
