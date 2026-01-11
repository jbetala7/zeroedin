'use client';

import { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export function TargetRangeLoader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [lightsOn, setLightsOn] = useState<boolean[]>([false, false, false, false, false]);
  const [targetPosition, setTargetPosition] = useState(-50); // percentage from left (starts off-screen)
  const [rangeHot, setRangeHot] = useState(false);
  const [safetyLight, setSafetyLight] = useState<'off' | 'amber' | 'green'>('off');

  useEffect(() => {
    const duration = 3000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const prog = Math.min((elapsed / duration) * 100, 100);
      setProgress(prog);

      // Lights turn on sequentially (0-40% progress)
      const lightsProgress = Math.min(prog / 40, 1);
      const numLightsOn = Math.floor(lightsProgress * 5);
      setLightsOn((prev) => prev.map((_, i) => i < numLightsOn));

      // Target slides in from left to center (20-70% progress)
      if (prog > 20) {
        const targetProg = Math.min((prog - 20) / 50, 1);
        const eased = 1 - Math.pow(1 - targetProg, 3); // ease out cubic
        // Goes from -50 (off-screen left) to 50 (center)
        setTargetPosition(-50 + eased * 100);
      }

      // Safety light changes (60-80% progress)
      if (prog > 60 && prog < 80) {
        setSafetyLight('amber');
      } else if (prog >= 80) {
        setSafetyLight('green');
      }

      // Range hot indicator (90% progress)
      if (prog >= 90) {
        setRangeHot(true);
      }

      if (prog >= 100) {
        setTimeout(onComplete, 500);
      } else {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Ceiling with lights */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#1a1a1a] to-transparent">
        <div className="flex justify-center gap-16 pt-4">
          {lightsOn.map((isOn, i) => (
            <div key={i} className="relative">
              {/* Light fixture */}
              <div className="w-4 h-8 bg-[#2a2a2a] rounded-b-sm" />

              {/* Light bulb */}
              <div
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-3 rounded-b-full transition-all duration-300"
                style={{
                  background: isOn
                    ? 'radial-gradient(ellipse at center, #fff 0%, #ffd700 50%, #ff8c00 100%)'
                    : '#333',
                  boxShadow: isOn
                    ? '0 0 30px rgba(255, 200, 50, 0.8), 0 20px 60px rgba(255, 150, 50, 0.4)'
                    : 'none',
                }}
              />

              {/* Light cone */}
              {isOn && (
                <div
                  className="absolute top-10 left-1/2 transform -translate-x-1/2"
                  style={{
                    width: '80px',
                    height: '200px',
                    background: 'linear-gradient(180deg, rgba(255, 200, 100, 0.15) 0%, transparent 100%)',
                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Range floor */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(40, 20, 10, 0.5) 50%, rgba(30, 15, 8, 0.8) 100%)',
        }}
      >
        {/* Lane markings */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-24 bg-yellow-500/30" />
      </div>

      {/* Target slides from left to center */}
      <div
        className="absolute"
        style={{
          left: `${targetPosition}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'left 0.1s ease-out',
        }}
      >
        {/* Target - matching game style */}
        <div className="relative">
          {/* Glow effect behind target */}
          <div
            className="absolute inset-0 w-32 h-32 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 60, 60, 0.4) 0%, rgba(200, 30, 30, 0.2) 40%, transparent 70%)',
              filter: 'blur(10px)',
              transform: 'scale(1.5)',
            }}
          />

          {/* Target with red/pink rings */}
          <div className="w-32 h-32 rounded-full overflow-hidden relative"
            style={{
              boxShadow: '0 0 30px rgba(255, 60, 60, 0.5), 0 0 60px rgba(200, 40, 40, 0.3)',
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Outer to inner rings - alternating pink shades */}
              <circle cx="50" cy="50" r="50" fill="#ffcccc" />
              <circle cx="50" cy="50" r="47.5" fill="#ff9999" />
              <circle cx="50" cy="50" r="42.5" fill="#ffcccc" />
              <circle cx="50" cy="50" r="37.5" fill="#ff9999" />
              <circle cx="50" cy="50" r="32.5" fill="#ffcccc" />
              <circle cx="50" cy="50" r="27.5" fill="#ff9999" />
              <circle cx="50" cy="50" r="22.5" fill="#ffcccc" />
              <circle cx="50" cy="50" r="17.5" fill="#ff9999" />
              <circle cx="50" cy="50" r="12.5" fill="#ffcccc" />
              <circle cx="50" cy="50" r="7.5" fill="#1a1a1a" />
              <circle cx="50" cy="50" r="4" fill="#0a0a0a" />

              {/* Subtle ring outlines */}
              <circle cx="50" cy="50" r="50" fill="none" stroke="#ff6666" strokeWidth="1.5" opacity="0.6" />
              <circle cx="50" cy="50" r="37.5" fill="none" stroke="#ff6666" strokeWidth="0.5" opacity="0.3" />
              <circle cx="50" cy="50" r="25" fill="none" stroke="#ff6666" strokeWidth="0.5" opacity="0.3" />
              <circle cx="50" cy="50" r="12.5" fill="none" stroke="#ff6666" strokeWidth="0.5" opacity="0.3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Control panel */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-8">
        {/* Safety light */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-6 h-6 rounded-full border-2 border-[#333] transition-all duration-300"
            style={{
              background:
                safetyLight === 'green'
                  ? '#22c55e'
                  : safetyLight === 'amber'
                  ? '#f59e0b'
                  : '#333',
              boxShadow:
                safetyLight === 'green'
                  ? '0 0 20px rgba(50, 255, 100, 0.8)'
                  : safetyLight === 'amber'
                  ? '0 0 20px rgba(255, 180, 50, 0.8)'
                  : 'none',
            }}
          />
          <span className="text-xs text-gray-500 uppercase tracking-wider">Safety</span>
        </div>

        {/* Range Hot indicator */}
        <div
          className={`px-6 py-2 rounded border-2 transition-all duration-300 ${
            rangeHot
              ? 'border-red-500 bg-red-500/20'
              : 'border-[#333] bg-[#1a1a1a]'
          }`}
          style={{
            boxShadow: rangeHot ? '0 0 30px rgba(255, 50, 50, 0.6), inset 0 0 20px rgba(255, 50, 50, 0.2)' : 'none',
          }}
        >
          <span
            className={`text-lg font-bold tracking-widest transition-all duration-300 ${
              rangeHot ? 'text-red-500' : 'text-[#444]'
            }`}
            style={{
              textShadow: rangeHot ? '0 0 10px rgba(255, 50, 50, 0.8)' : 'none',
            }}
          >
            RANGE HOT
          </span>
        </div>

        {/* Ready light */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-6 h-6 rounded-full border-2 border-[#333] transition-all duration-300"
            style={{
              background: rangeHot ? '#22c55e' : '#333',
              boxShadow: rangeHot ? '0 0 20px rgba(50, 255, 100, 0.8)' : 'none',
            }}
          />
          <span className="text-xs text-gray-500 uppercase tracking-wider">Ready</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
        <div
          className="h-1 w-48 rounded-full overflow-hidden"
          style={{ background: 'rgba(100, 20, 20, 0.5)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${progress}%`,
              background: rangeHot
                ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                : 'linear-gradient(90deg, #dc2626, #ef4444)',
              boxShadow: rangeHot
                ? '0 0 10px rgba(50, 255, 100, 0.8)'
                : '0 0 10px rgba(255, 50, 50, 0.8)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
