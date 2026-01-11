'use client';

import { GameStats } from '../core/GameState';

interface HUDProps {
  stats: GameStats;
  isPlaying: boolean;
}

export function HUD({ stats, isPlaying }: HUDProps) {
  if (!isPlaying) return null;

  const timeRemaining = Math.max(0, stats.timeLimit - stats.timeElapsed);
  const timeProgress = (timeRemaining / stats.timeLimit) * 100;

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Top bar - Score and Time */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start">
        {/* Score - Top Left */}
        <div className="text-left">
          <div
            className="text-5xl font-bold text-white tabular-nums"
            style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}
          >
            {Math.floor(stats.score)}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wider mt-1">
            Score
          </div>
          {/* Red glow line */}
          <div
            className="mt-2 h-0.5 w-32"
            style={{
              background: 'linear-gradient(90deg, rgba(255, 50, 50, 0.8) 0%, transparent 100%)',
              boxShadow: '0 0 10px rgba(255, 50, 50, 0.5)',
            }}
          />
        </div>

        {/* Time - Top Right */}
        <div className="text-right">
          <div
            className={`text-5xl font-bold tabular-nums ${
              timeRemaining <= 5 ? 'text-red-500' : 'text-white'
            }`}
            style={{
              textShadow: timeRemaining <= 5
                ? '0 0 20px rgba(255, 50, 50, 0.8)'
                : '0 0 20px rgba(255, 255, 255, 0.3)',
            }}
          >
            {timeRemaining.toFixed(1)}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wider mt-1">
            Time
          </div>
          {/* Red glow line */}
          <div
            className="mt-2 h-0.5 w-32 ml-auto"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 50, 50, 0.8) 100%)',
              boxShadow: '0 0 10px rgba(255, 50, 50, 0.5)',
            }}
          />
        </div>
      </div>

      {/* Score popup - below timer on right */}
      <div className="absolute top-24 right-6 text-right">
        {stats.lastHitScore !== null && stats.lastHitScore > 0 && (
          <div
            className={`text-2xl font-bold tabular-nums ${
              stats.lastHitXRing ? 'text-yellow-400' :
              stats.lastHitScore >= 10 ? 'text-green-400' :
              stats.lastHitScore >= 8 ? 'text-white' : 'text-red-400'
            }`}
            style={{
              textShadow: stats.lastHitXRing
                ? '0 0 15px rgba(255, 200, 50, 0.6)'
                : '0 0 10px rgba(255, 255, 255, 0.4)',
            }}
          >
            +{stats.lastHitScore.toFixed(1)}
            {stats.lastHitXRing && <span className="text-yellow-400 ml-1 text-sm">X!</span>}
          </div>
        )}
        {stats.streak >= 3 && (
          <div
            className="text-sm font-bold text-red-400 mt-1"
            style={{ textShadow: '0 0 10px rgba(255, 50, 50, 0.5)' }}
          >
            {stats.streak}x STREAK
          </div>
        )}
      </div>

      {/* Bottom section */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Time progress bar */}
        <div className="px-16 mb-4">
          <div
            className="h-1 w-full rounded-full overflow-hidden"
            style={{ background: 'rgba(100, 20, 20, 0.3)' }}
          >
            <div
              className="h-full transition-all duration-100 ease-linear rounded-full"
              style={{
                width: `${timeProgress}%`,
                background: 'linear-gradient(90deg, rgba(200, 30, 30, 1) 0%, rgba(255, 60, 60, 1) 100%)',
                boxShadow: '0 0 15px rgba(255, 50, 50, 0.8), 0 0 30px rgba(255, 50, 50, 0.4)',
              }}
            />
          </div>
        </div>

        {/* Bottom stats bar */}
        <div
          className="px-6 py-4 flex justify-center items-center gap-16"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(10, 5, 5, 0.8) 100%)',
          }}
        >
          {/* Accuracy */}
          <div className="text-center">
            <div
              className="text-2xl font-bold text-red-400 tabular-nums"
              style={{ textShadow: '0 0 10px rgba(255, 50, 50, 0.5)' }}
            >
              {stats.accuracy.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
              Accuracy
            </div>
          </div>

          {/* Hits / Misses */}
          <div className="text-center">
            <div className="text-2xl font-bold tabular-nums">
              <span className="text-white">{stats.hits}</span>
              <span className="text-red-500/60">/</span>
              <span className="text-red-400">{stats.misses}</span>
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
              Hits / Misses
            </div>
          </div>

          {/* Best Streak */}
          <div className="text-center">
            <div
              className="text-2xl font-bold text-white tabular-nums"
              style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }}
            >
              {stats.bestStreak}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
              Best Streak
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
