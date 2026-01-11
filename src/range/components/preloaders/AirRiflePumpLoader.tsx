'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

interface PreloaderProps {
  onComplete: () => void;
}

export function AirRiflePumpLoader({ onComplete }: PreloaderProps) {
  const [psi, setPsi] = useState(0);
  const [barrelAngle, setBarrelAngle] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const hasCompletedRef = useRef(false);
  const targetPsi = 100;

  useEffect(() => {
    // Prevent re-running if already completed
    if (hasCompletedRef.current) return;

    const pumpDuration = 3000; // 3 seconds total
    let animationFrame: number;
    const startTime = Date.now();

    const animate = () => {
      if (hasCompletedRef.current) return;

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / pumpDuration, 1);

      if (progress >= 1) {
        // Pump complete - barrel back to horizontal
        setBarrelAngle(0);
        setPsi(targetPsi);
        setIsComplete(true);
        hasCompletedRef.current = true;
        // TEMP: Disabled for testing - uncomment to enable transition
        setTimeout(onComplete, 600);
        return;
      }

      // Break-barrel animation: down then back up
      // First half: barrel breaks down (0 to 35 degrees)
      // Second half: barrel returns (35 to 0 degrees)
      let angle: number;
      if (progress < 0.6) {
        // Breaking down (60% of time)
        const downProgress = progress / 0.6;
        const eased = 1 - Math.pow(1 - downProgress, 3); // ease-out
        angle = eased * 35;
      } else {
        // Returning up (40% of time)
        const upProgress = (progress - 0.6) / 0.4;
        const eased = upProgress * upProgress; // ease-in
        angle = 35 * (1 - eased);
      }

      setBarrelAngle(angle);

      // PSI builds up throughout the animation
      const psiEased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      setPsi(Math.round(psiEased * targetPsi));

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [onComplete]);

  // PSI gauge percentage
  const psiPercent = (psi / targetPsi) * 100;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(30, 8, 8, 1) 0%, rgba(10, 2, 2, 1) 70%, rgba(5, 1, 1, 1) 100%)',
      }}
    >
      {/* PSI Gauge above rifle */}
      <div className="mb-8">
        <svg width="200" height="50" viewBox="0 0 200 50">
          <defs>
            <linearGradient id="gaugeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff6b6b" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#ff6b6b" />
            </linearGradient>
          </defs>

          {/* Pressure tank outline */}
          <ellipse
            cx="100"
            cy="25"
            rx="90"
            ry="20"
            fill="none"
            stroke="url(#gaugeGlow)"
            strokeWidth="2"
            strokeDasharray="4 3"
            opacity="0.5"
          />

          {/* Gauge background */}
          <rect
            x="30"
            y="15"
            width="140"
            height="20"
            rx="4"
            fill="rgba(20, 5, 5, 0.9)"
            stroke="url(#gaugeGlow)"
            strokeWidth="1.5"
          />

          {/* Gauge fill */}
          <rect
            x="33"
            y="18"
            width={Math.max(0, (psiPercent / 100) * 134)}
            height="14"
            rx="3"
            fill={isComplete ? '#22c55e' : '#ef4444'}
            style={{
              filter: isComplete
                ? 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.8))'
                : 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))',
              transition: 'width 0.1s ease-out',
            }}
          />
        </svg>
      </div>

      {/* Air Rifle Image Container */}
      <div
        className="relative w-full max-w-2xl px-4"
        style={{
          filter: 'drop-shadow(0 0 25px rgba(255, 60, 60, 0.5))',
        }}
      >
        {/* Rifle body (stock and receiver) - stays static */}
        <div
          className="relative"
          style={{
            clipPath: 'polygon(0 0, 60% 0, 60% 100%, 0 100%)',
          }}
        >
          <Image
            src="/air-rifle-outline.png"
            alt="Air Rifle"
            width={800}
            height={200}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Barrel section - animated */}
        <div
          className="absolute top-0 left-0 w-full"
          style={{
            clipPath: 'polygon(60% 0, 100% 0, 100% 100%, 60% 100%)',
            transformOrigin: '60% 50%',
            transform: `rotate(${barrelAngle}deg)`,
          }}
        >
          <Image
            src="/air-rifle-outline.png"
            alt="Air Rifle Barrel"
            width={800}
            height={200}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      {/* PSI Text Display */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-center">
        <div
          className={`text-4xl font-bold font-mono tabular-nums transition-colors duration-300 ${
            isComplete ? 'text-green-400' : 'text-red-400'
          }`}
          style={{
            textShadow: isComplete
              ? '0 0 20px rgba(34, 197, 94, 0.8)'
              : '0 0 20px rgba(239, 68, 68, 0.6)',
          }}
        >
          {psi} PSI
        </div>
        <div
          className={`mt-2 text-sm font-semibold tracking-widest transition-colors duration-300 ${
            isComplete ? 'text-green-400' : 'text-red-400/70'
          }`}
        >
          {isComplete ? 'READY TO FIRE' : 'PRESSURIZING...'}
        </div>
      </div>
    </div>
  );
}
