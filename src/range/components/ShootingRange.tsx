'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { RangeEngine } from '../core/RangeEngine';
import { GameStats, GameMode } from '../core/GameState';
import { HUD } from './HUD';
import { ModeSelector } from './ModeSelector';
import { GameOverScreen } from './GameOverScreen';
import { Crosshair } from './Crosshair';
import { PreloaderWrapper } from './preloaders/PreloaderWrapper';

type Screen = 'loading' | 'menu' | 'playing' | 'gameover';

export default function ShootingRange() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<RangeEngine | null>(null);

  const [screen, setScreen] = useState<Screen>('loading');
  const [selectedMode, setSelectedMode] = useState<GameMode>('gridshot');
  const [stats, setStats] = useState<GameStats | null>(null);
  const [finalStats, setFinalStats] = useState<GameStats | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js engine
    const engine = new RangeEngine(containerRef.current);
    engineRef.current = engine;

    // Wire up callbacks
    engine.onStatsUpdate = (newStats) => {
      setStats(newStats);
    };

    engine.onGameEnd = (endStats) => {
      setFinalStats(endStats);
      setScreen('gameover');
    };

    engine.start();

    // Handle window resize
    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  const handleSelectMode = useCallback((mode: GameMode) => {
    setSelectedMode(mode);
    engineRef.current?.setMode(mode);
  }, []);

  const handleStart = useCallback(() => {
    engineRef.current?.setMode(selectedMode);
    engineRef.current?.startGame();
    setScreen('playing');
  }, [selectedMode]);

  const handleRestart = useCallback(() => {
    engineRef.current?.startGame();
    setScreen('playing');
  }, []);

  const handleMenu = useCallback(() => {
    engineRef.current?.stopGame();
    setScreen('menu');
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setScreen('menu');
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Three.js Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ cursor: screen === 'playing' ? 'none' : 'default' }}
      />

      {/* Custom Crosshair - follows mouse */}
      <Crosshair isActive={screen === 'playing'} />

      {/* UI Overlays */}
      {screen === 'loading' && (
        <PreloaderWrapper onComplete={handlePreloaderComplete} />
      )}

      {screen === 'menu' && (
        <ModeSelector
          selectedMode={selectedMode}
          onSelectMode={handleSelectMode}
          onStart={handleStart}
        />
      )}

      {screen === 'playing' && stats && (
        <HUD stats={stats} isPlaying={true} />
      )}

      {screen === 'gameover' && finalStats && (
        <GameOverScreen
          stats={finalStats}
          onRestart={handleRestart}
          onMenu={handleMenu}
        />
      )}
    </div>
  );
}
