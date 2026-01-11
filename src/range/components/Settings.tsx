'use client';

import React from 'react';
import { useSettings } from '../hooks/useSettings';
import { PreloaderType, PRELOADER_INFO } from '../types/settings';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRELOADER_ICONS: Record<PreloaderType, React.ReactNode> = {
  scope: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="4" y1="20" x2="14" y2="20" stroke="currentColor" strokeWidth="1.5" />
      <line x1="26" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="1.5" />
      <line x1="20" y1="4" x2="20" y2="14" stroke="currentColor" strokeWidth="1.5" />
      <line x1="20" y1="26" x2="20" y2="36" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="2" fill="currentColor" />
    </svg>
  ),
  rifle: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <path
        d="M 4 22 L 12 20 L 14 18 L 18 18 L 18 24 L 12 24 L 4 26 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect x="18" y="17" width="14" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="32" y="18" width="6" height="4" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M 20 26 Q 22 30, 26 26" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  range: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <rect x="12" y="8" width="16" height="24" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="6" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="20" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="20" cy="20" r="1" fill="currentColor" />
      <line x1="6" y1="6" x2="6" y2="10" stroke="currentColor" strokeWidth="1.5" />
      <line x1="34" y1="6" x2="34" y2="10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  calibration: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
      <circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="6" y1="20" x2="14" y2="20" stroke="currentColor" strokeWidth="1.5" />
      <line x1="26" y1="20" x2="34" y2="20" stroke="currentColor" strokeWidth="1.5" />
      <line x1="20" y1="6" x2="20" y2="14" stroke="currentColor" strokeWidth="1.5" />
      <line x1="20" y1="26" x2="20" y2="34" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="2" fill="currentColor" />
    </svg>
  ),
};

export function Settings({ isOpen, onClose }: SettingsProps) {
  const { settings, setPreloader } = useSettings();

  if (!isOpen) return null;

  const preloaderTypes: PreloaderType[] = ['scope', 'rifle', 'range', 'calibration'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, rgba(35, 12, 12, 0.98) 0%, rgba(18, 6, 6, 0.99) 100%)',
          border: '1px solid rgba(100, 30, 30, 0.4)',
          boxShadow: '0 0 80px rgba(80, 15, 15, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          borderRadius: '24px',
          padding: '32px',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              style={{ width: '40px', height: '40px' }}
            >
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ marginBottom: '24px' }}>
          {/* Section Label */}
          <h3
            className="text-sm font-semibold text-gray-400 uppercase tracking-widest"
            style={{ marginBottom: '20px' }}
          >
            Preloader Animation
          </h3>

          {/* Preloader Grid */}
          <div
            className="grid grid-cols-2"
            style={{ gap: '16px', padding: '5px' }}
          >
            {preloaderTypes.map((type) => {
              const isSelected = settings.preloader === type;
              const info = PRELOADER_INFO[type];

              return (
                <button
                  key={type}
                  onClick={() => setPreloader(type)}
                  className="relative rounded-2xl text-left transition-all duration-300"
                  style={{
                    padding: '10px',
                    background: isSelected
                      ? 'linear-gradient(180deg, rgba(50, 12, 12, 0.95) 0%, rgba(25, 8, 8, 0.98) 100%)'
                      : 'linear-gradient(180deg, rgba(20, 8, 8, 0.8) 0%, rgba(12, 5, 5, 0.9) 100%)',
                    border: isSelected
                      ? '2px solid rgba(200, 60, 60, 0.7)'
                      : '1px solid rgba(50, 20, 20, 0.6)',
                    boxShadow: isSelected
                      ? '0 0 25px rgba(180, 40, 40, 0.25), inset 0 0 20px rgba(180, 40, 40, 0.08)'
                      : 'none',
                  }}
                >
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 mb-4 ${isSelected ? 'text-red-400' : 'text-gray-500'}`}
                    style={isSelected ? { filter: 'drop-shadow(0 0 8px rgba(255, 60, 60, 0.5))' } : {}}
                  >
                    {PRELOADER_ICONS[type]}
                  </div>

                  {/* Name */}
                  <div
                    className={`text-xl font-bold mb-1 ${isSelected ? 'text-red-400' : 'text-gray-200'}`}
                  >
                    {info.name}
                  </div>

                  {/* Description */}
                  <div className="text-sm text-gray-500 leading-relaxed">
                    {info.description}
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <div
                      className="absolute top-4 right-4 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"
                      style={{ boxShadow: '0 0 12px rgba(255, 50, 50, 0.8)' }}
                    >
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{ paddingTop: '8px' }}>
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl font-bold text-lg text-white transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(180deg, rgba(180, 50, 50, 1) 0%, rgba(120, 30, 30, 1) 100%)',
              boxShadow: '0 4px 20px rgba(180, 40, 40, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(200, 60, 60, 0.5)',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
