'use client';

import { useState } from 'react';
import { GameMode } from '../core/GameState';
import { ParticleBackground } from './ParticleBackground';
import { SettingsButton } from './SettingsButton';
import { Settings } from './Settings';

interface ModeSelectorProps {
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onStart: () => void;
}

const MODES: { id: GameMode; name: string; description: string }[] = [
  {
    id: 'gridshot',
    name: 'Gridshot',
    description: 'Classic aim trainer. 3 targets at a time in a grid pattern.',
  },
  {
    id: 'spidershot',
    name: 'Spidershot',
    description: 'Single target at random positions. Tests reaction & flick aim.',
  },
  {
    id: 'microshot',
    name: 'Microshot',
    description: 'Small targets for precision training. Multiple visible.',
  },
];

export function ModeSelector({ selectedMode, onSelectMode, onStart }: ModeSelectorProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Canvas-based particle background */}
      <ParticleBackground />

      {/* Settings button */}
      <SettingsButton onClick={() => setIsSettingsOpen(true)} />

      {/* Settings modal */}
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl px-4 md:px-8 overflow-y-auto max-h-[100dvh] py-6 md:py-0">
        {/* Title with glow */}
        <div className="relative mb-2 md:mb-3">
          <h1
            className="text-3xl md:text-6xl font-black tracking-wider flex items-center justify-center"
          >
            <span className="text-white">ZER</span>
            {/* Crosshair as "O" */}
            <svg
              width="36"
              height="36"
              viewBox="0 0 60 60"
              className="inline-block mx-0.5 md:mx-1 md:w-[60px] md:h-[60px]"
              style={{ filter: 'drop-shadow(0 0 15px rgba(255, 60, 60, 1)) drop-shadow(0 0 30px rgba(255, 40, 40, 0.8))' }}
            >
              {/* Outer circle */}
              <circle
                cx="30"
                cy="30"
                r="26"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
              />
              {/* Horizontal line - left */}
              <line x1="8" y1="30" x2="22" y2="30" stroke="#ef4444" strokeWidth="2" />
              {/* Horizontal line - right */}
              <line x1="38" y1="30" x2="52" y2="30" stroke="#ef4444" strokeWidth="2" />
              {/* Vertical line - top */}
              <line x1="30" y1="8" x2="30" y2="22" stroke="#ef4444" strokeWidth="2" />
              {/* Vertical line - bottom */}
              <line x1="30" y1="38" x2="30" y2="52" stroke="#ef4444" strokeWidth="2" />
              {/* Tick marks - horizontal */}
              {[12, 18, 42, 48].map((x) => (
                <line key={`h-${x}`} x1={x} y1="28" x2={x} y2="32" stroke="rgba(239,68,68,0.7)" strokeWidth="1" />
              ))}
              {/* Tick marks - vertical */}
              {[12, 18, 42, 48].map((y) => (
                <line key={`v-${y}`} x1="28" y1={y} x2="32" y2={y} stroke="rgba(239,68,68,0.7)" strokeWidth="1" />
              ))}
              {/* Center dot */}
              <circle cx="30" cy="30" r="2" fill="#ef4444" />
            </svg>
            <span className="text-white">ED</span>
            <span className="text-red-500" style={{ textShadow: '0 0 30px rgba(255, 60, 60, 0.8), 0 0 60px rgba(255, 40, 40, 0.5)' }}>IN</span>
          </h1>
        </div>
        <p className="text-gray-400 text-sm md:text-lg mb-6 md:mb-16" style={{ textShadow: '0 0 20px rgba(150, 30, 30, 0.3)' }}>
          Select a training mode
        </p>

        {/* Mode buttons with glowing borders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-14">
          {MODES.map((mode) => {
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onSelectMode(mode.id)}
                className="relative rounded-xl transition-all duration-300"
                style={{
                  padding: '12px 16px',
                  background: isSelected
                    ? 'linear-gradient(180deg, rgba(40, 5, 5, 0.9) 0%, rgba(20, 2, 2, 0.95) 100%)'
                    : 'linear-gradient(180deg, rgba(20, 5, 5, 0.7) 0%, rgba(10, 2, 2, 0.8) 100%)',
                  border: isSelected ? '2px solid rgba(200, 60, 60, 0.8)' : '2px solid rgba(80, 20, 20, 0.5)',
                  boxShadow: isSelected
                    ? `0 0 20px rgba(200, 40, 40, 0.4), 0 0 40px rgba(150, 30, 30, 0.2), inset 0 0 30px rgba(200, 40, 40, 0.1)`
                    : '0 0 10px rgba(100, 20, 20, 0.2)',
                }}
              >
                {/* Inner glow overlay for selected */}
                {isSelected && (
                  <div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      background: 'linear-gradient(180deg, rgba(200, 50, 50, 0.15) 0%, transparent 50%)',
                    }}
                  />
                )}

                <div className="relative z-10">
                  <div
                    className={`text-lg md:text-2xl font-bold mb-1 md:mb-3 ${isSelected ? 'text-red-400' : 'text-gray-200'}`}
                    style={isSelected ? { textShadow: '0 0 20px rgba(255, 80, 80, 0.6)' } : {}}
                  >
                    {mode.name}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 leading-relaxed">
                    {mode.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Start button with intense glow */}
        <div className="relative inline-block" style={{ marginTop: '10px', marginBottom: '10px' }}>
          {/* Horizontal flare below button */}
          <div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-8"
            style={{
              width: '140%',
              background: 'radial-gradient(ellipse 50% 100% at 50% 0%, rgba(200, 50, 50, 0.6) 0%, transparent 70%)',
              filter: 'blur(8px)',
            }}
          />
          {/* Outer glow */}
          <div
            className="absolute -inset-2 rounded-full"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(200, 40, 40, 0.4) 0%, transparent 70%)',
              filter: 'blur(15px)',
            }}
          />
          <button
            onClick={onStart}
            className="relative rounded-full text-xl font-bold text-white transition-all duration-300 hover:scale-105"
            style={{
              padding: '10px 40px',
              background: 'linear-gradient(180deg, rgba(180, 40, 40, 1) 0%, rgba(100, 20, 20, 1) 100%)',
              boxShadow: `
                0 0 30px rgba(200, 50, 50, 0.5),
                0 4px 20px rgba(150, 30, 30, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.15),
                inset 0 -2px 0 rgba(0, 0, 0, 0.3)
              `,
              border: '1px solid rgba(220, 70, 70, 0.6)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            START TRAINING
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-4 md:mt-14 text-gray-500 text-xs md:text-sm tracking-wide px-4">
          Tap to shoot | Hit the center for max points | 30 second rounds
        </div>
      </div>

    </div>
  );
}
