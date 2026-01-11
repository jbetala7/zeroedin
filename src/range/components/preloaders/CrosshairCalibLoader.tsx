'use client';

import { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export function CrosshairCalibLoader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [ticksVisible, setTicksVisible] = useState(0);
  const [windage, setWindage] = useState(0);
  const [elevation, setElevation] = useState(0);
  const [isCalibrated, setIsCalibrated] = useState(false);

  useEffect(() => {
    const duration = 2500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const prog = Math.min((elapsed / duration) * 100, 100);
      setProgress(prog);

      // Rotation animation (continuous but slowing down)
      const rotSpeed = Math.max(0, 360 - (prog / 100) * 360);
      setRotation((prev) => prev + rotSpeed * 0.016); // ~60fps

      // Tick marks appear one by one (0-60% progress)
      const tickProgress = Math.min(prog / 60, 1);
      setTicksVisible(Math.floor(tickProgress * 8));

      // Windage/elevation adjustments (oscillate then settle)
      const settleProgress = Math.min(prog / 80, 1);
      const oscillation = Math.sin(prog * 0.2) * (1 - settleProgress);
      setWindage(oscillation * 10);
      setElevation(oscillation * 8);

      // Calibrated at 95%
      if (prog >= 95 && !isCalibrated) {
        setIsCalibrated(true);
        setWindage(0);
        setElevation(0);
      }

      if (prog >= 100) {
        setTimeout(onComplete, 500);
      } else {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [onComplete, isCalibrated]);

  const tickPositions = [
    { x: 12, horizontal: true },
    { x: 18, horizontal: true },
    { x: 42, horizontal: true },
    { x: 48, horizontal: true },
    { y: 12, horizontal: false },
    { y: 18, horizontal: false },
    { y: 42, horizontal: false },
    { y: 48, horizontal: false },
  ];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0204] via-[#0d0306] to-[#120208]">
      {/* Ambient glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(150, 30, 30, 0.2) 0%, transparent 60%)',
        }}
      />

      {/* Crosshair container */}
      <div className="relative mb-8">
        {/* Outer decorative ring (rotates) */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle
              cx="90"
              cy="90"
              r="85"
              fill="none"
              stroke="rgba(239, 68, 68, 0.2)"
              strokeWidth="1"
              strokeDasharray="10 5"
            />
          </svg>
        </div>

        {/* Main crosshair SVG */}
        <svg
          width="160"
          height="160"
          viewBox="0 0 60 60"
          style={{
            filter: isCalibrated
              ? 'drop-shadow(0 0 20px rgba(50, 255, 100, 0.8))'
              : 'drop-shadow(0 0 15px rgba(255, 60, 60, 0.8))',
            transform: `translate(${windage}px, ${elevation}px)`,
            transition: isCalibrated ? 'transform 0.3s ease-out, filter 0.3s ease-out' : 'none',
          }}
        >
          {/* Outer circle */}
          <circle
            cx="30"
            cy="30"
            r="26"
            fill="none"
            stroke={isCalibrated ? '#22c55e' : '#ef4444'}
            strokeWidth="2"
            className="transition-colors duration-300"
          />

          {/* Horizontal line - left */}
          <line
            x1="8"
            y1="30"
            x2="22"
            y2="30"
            stroke={isCalibrated ? '#22c55e' : '#ef4444'}
            strokeWidth="2"
            className="transition-colors duration-300"
          />

          {/* Horizontal line - right */}
          <line
            x1="38"
            y1="30"
            x2="52"
            y2="30"
            stroke={isCalibrated ? '#22c55e' : '#ef4444'}
            strokeWidth="2"
            className="transition-colors duration-300"
          />

          {/* Vertical line - top */}
          <line
            x1="30"
            y1="8"
            x2="30"
            y2="22"
            stroke={isCalibrated ? '#22c55e' : '#ef4444'}
            strokeWidth="2"
            className="transition-colors duration-300"
          />

          {/* Vertical line - bottom */}
          <line
            x1="30"
            y1="38"
            x2="30"
            y2="52"
            stroke={isCalibrated ? '#22c55e' : '#ef4444'}
            strokeWidth="2"
            className="transition-colors duration-300"
          />

          {/* Tick marks (appear one by one) */}
          {tickPositions.map((tick, i) => (
            <line
              key={i}
              x1={tick.horizontal ? tick.x : 28}
              y1={tick.horizontal ? 28 : tick.y}
              x2={tick.horizontal ? tick.x : 32}
              y2={tick.horizontal ? 32 : tick.y}
              stroke={isCalibrated ? 'rgba(50, 255, 100, 0.7)' : 'rgba(239, 68, 68, 0.7)'}
              strokeWidth="1"
              style={{
                opacity: i < ticksVisible ? 1 : 0,
                transition: 'opacity 0.2s ease-out',
              }}
            />
          ))}

          {/* Center dot (pulses) */}
          <circle
            cx="30"
            cy="30"
            r="2"
            fill={isCalibrated ? '#22c55e' : '#ef4444'}
            className="transition-colors duration-300"
            style={{
              animation: isCalibrated ? 'none' : 'pulse 1s ease-in-out infinite',
            }}
          />
        </svg>

        {/* Adjustment indicators */}
        <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 text-right">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Windage</div>
          <div
            className={`text-sm font-mono tabular-nums ${isCalibrated ? 'text-green-400' : 'text-red-400'}`}
          >
            {windage >= 0 ? '+' : ''}{windage.toFixed(1)}
          </div>
        </div>

        <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 text-left">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Elevation</div>
          <div
            className={`text-sm font-mono tabular-nums ${isCalibrated ? 'text-green-400' : 'text-red-400'}`}
          >
            {elevation >= 0 ? '+' : ''}{elevation.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Status text */}
      <div className="text-center">
        <div
          className={`text-xl font-bold tracking-widest transition-all duration-300 ${
            isCalibrated ? 'text-green-400' : 'text-red-400'
          }`}
          style={{
            textShadow: isCalibrated
              ? '0 0 20px rgba(50, 255, 100, 0.8)'
              : '0 0 20px rgba(255, 50, 50, 0.6)',
          }}
        >
          {isCalibrated ? 'CALIBRATION COMPLETE' : 'CALIBRATING OPTICS...'}
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
              background: isCalibrated
                ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                : 'linear-gradient(90deg, #dc2626, #ef4444)',
              boxShadow: isCalibrated
                ? '0 0 10px rgba(50, 255, 100, 0.8)'
                : '0 0 10px rgba(255, 50, 50, 0.8)',
            }}
          />
        </div>
      </div>

      {/* CSS for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}
