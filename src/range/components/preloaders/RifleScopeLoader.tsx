'use client';

import { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export function RifleScopeLoader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'focusing' | 'locked'>('focusing');

  useEffect(() => {
    const duration = 2500; // 2.5 seconds total
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        setPhase('locked');
        setTimeout(onComplete, 600);
      } else {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [onComplete]);

  // Calculate blur based on progress (10px -> 0px)
  const blur = Math.max(0, 10 - (progress / 100) * 10);

  // Distance countdown (100m -> 10m)
  const distance = Math.round(100 - (progress / 100) * 90);

  // Crosshair opacity (appears in last 30%)
  const crosshairOpacity = progress > 70 ? (progress - 70) / 30 : 0;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black overflow-hidden">
      {/* Scope vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.95) 50%, black 60%)`,
        }}
      />

      {/* Blurred scope view */}
      <div
        className="relative w-80 h-80 rounded-full overflow-hidden"
        style={{
          filter: `blur(${blur}px)`,
          transition: 'filter 0.1s ease-out',
        }}
      >
        {/* Scope interior - dark red gradient */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at center,
              rgba(40, 10, 10, 1) 0%,
              rgba(20, 5, 5, 1) 60%,
              rgba(10, 2, 2, 1) 100%)`,
          }}
        />

        {/* Grid lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Horizontal line */}
          <div
            className="absolute w-full h-px"
            style={{ background: 'rgba(255, 50, 50, 0.3)' }}
          />
          {/* Vertical line */}
          <div
            className="absolute h-full w-px"
            style={{ background: 'rgba(255, 50, 50, 0.3)' }}
          />
        </div>

        {/* Mil-dot markers */}
        {[-60, -30, 30, 60].map((offset) => (
          <div key={`h-${offset}`}>
            <div
              className="absolute w-2 h-px bg-red-500/50"
              style={{
                left: `calc(50% + ${offset}px)`,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
            <div
              className="absolute h-2 w-px bg-red-500/50"
              style={{
                top: `calc(50% + ${offset}px)`,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
          </div>
        ))}
      </div>

      {/* Crosshair overlay (fades in) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: crosshairOpacity }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120">
          {/* Outer circle */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(255, 60, 60, 0.8))',
            }}
          />
          {/* Cross lines */}
          <line x1="20" y1="60" x2="45" y2="60" stroke="#ef4444" strokeWidth="2" />
          <line x1="75" y1="60" x2="100" y2="60" stroke="#ef4444" strokeWidth="2" />
          <line x1="60" y1="20" x2="60" y2="45" stroke="#ef4444" strokeWidth="2" />
          <line x1="60" y1="75" x2="60" y2="100" stroke="#ef4444" strokeWidth="2" />
          {/* Center dot */}
          <circle
            cx="60"
            cy="60"
            r="3"
            fill="#ef4444"
            style={{
              filter: 'drop-shadow(0 0 5px rgba(255, 60, 60, 1))',
            }}
          />
        </svg>
      </div>

      {/* Distance readout */}
      <div
        className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2"
        style={{
          filter: `blur(${blur * 0.5}px)`,
        }}
      >
        <div
          className="text-red-500 font-mono text-lg tabular-nums"
          style={{ textShadow: '0 0 10px rgba(255, 50, 50, 0.8)' }}
        >
          {distance}m
        </div>
      </div>

      {/* Status text */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
        <div
          className={`text-xl font-bold tracking-widest transition-all duration-300 ${
            phase === 'locked' ? 'text-green-400' : 'text-red-400'
          }`}
          style={{
            textShadow: phase === 'locked'
              ? '0 0 20px rgba(50, 255, 100, 0.8)'
              : '0 0 20px rgba(255, 50, 50, 0.6)',
          }}
        >
          {phase === 'locked' ? 'TARGET ACQUIRED' : 'ZEROING IN...'}
        </div>

        {/* Progress bar */}
        <div
          className="mt-4 h-1 w-48 mx-auto rounded-full overflow-hidden"
          style={{ background: 'rgba(100, 20, 20, 0.5)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${progress}%`,
              background: phase === 'locked'
                ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                : 'linear-gradient(90deg, #dc2626, #ef4444)',
              boxShadow: phase === 'locked'
                ? '0 0 10px rgba(50, 255, 100, 0.8)'
                : '0 0 10px rgba(255, 50, 50, 0.8)',
            }}
          />
        </div>
      </div>

      {/* Scope edge ring */}
      <div
        className="absolute w-80 h-80 rounded-full pointer-events-none"
        style={{
          border: '4px solid rgba(30, 30, 30, 0.9)',
          boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 0, 0, 0.5)',
        }}
      />
    </div>
  );
}
