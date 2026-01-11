'use client';

import { GameStats } from '../core/GameState';

interface GameOverScreenProps {
  stats: GameStats;
  onRestart: () => void;
  onMenu: () => void;
}

export function GameOverScreen({ stats, onRestart, onMenu }: GameOverScreenProps) {
  // Grading structure
  const GRADE_REQUIREMENTS = [
    { grade: 'S+', avgScore: 10, accuracy: 95, color: 'text-yellow-400', glow: 'rgba(255, 200, 50, 0.8)' },
    { grade: 'S', avgScore: 9.5, accuracy: 90, color: 'text-yellow-400', glow: 'rgba(255, 200, 50, 0.6)' },
    { grade: 'A', avgScore: 9, accuracy: 85, color: 'text-green-400', glow: 'rgba(50, 255, 100, 0.6)' },
    { grade: 'B', avgScore: 8, accuracy: 75, color: 'text-blue-400', glow: 'rgba(50, 150, 255, 0.6)' },
    { grade: 'C', avgScore: 7, accuracy: 65, color: 'text-white', glow: 'rgba(255, 255, 255, 0.4)' },
    { grade: 'D', avgScore: 5, accuracy: 50, color: 'text-red-400', glow: 'rgba(255, 80, 80, 0.5)' },
    { grade: 'F', avgScore: 0, accuracy: 0, color: 'text-red-500', glow: 'rgba(255, 50, 50, 0.5)' },
  ];

  // Calculate grade based on average score and accuracy
  const getGrade = () => {
    const avgScore = stats.averageScore;
    const accuracy = stats.accuracy;

    for (const req of GRADE_REQUIREMENTS) {
      if (avgScore >= req.avgScore && accuracy >= req.accuracy) {
        return { grade: req.grade, color: req.color, glow: req.glow };
      }
    }
    return GRADE_REQUIREMENTS[GRADE_REQUIREMENTS.length - 1];
  };

  const { grade, color, glow } = getGrade();

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#0a0204] via-[#0d0306] to-[#120208]">
      {/* Ambient glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 50% 50%, rgba(100, 20, 20, 0.2) 0%, transparent 60%)
          `,
        }}
      />

      <div className="relative z-10 text-center max-w-2xl px-8">
        {/* Grade */}
        <div
          className={`text-9xl font-black ${color} mb-4`}
          style={{ textShadow: `0 0 60px ${glow}, 0 0 120px ${glow}` }}
        >
          {grade}
        </div>

        {/* Score */}
        <div
          className="text-5xl font-bold text-white mb-10"
          style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.3)', marginBottom: '20px' }}
        >
          {stats.score.toFixed(1)} pts
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {/* Accuracy */}
          <div
            className="rounded-xl p-4"
            style={{
              padding: '5px',
              background: 'linear-gradient(180deg, rgba(30, 10, 10, 0.8) 0%, rgba(15, 5, 5, 0.9) 100%)',
              border: '1px solid rgba(100, 30, 30, 0.4)',
              boxShadow: '0 0 15px rgba(100, 20, 20, 0.2)',
            }}
          >
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Accuracy</div>
            <div
              className={`text-2xl font-bold tabular-nums ${
                stats.accuracy >= 80 ? 'text-green-400' :
                stats.accuracy >= 50 ? 'text-white' : 'text-red-400'
              }`}
            >
              {stats.accuracy.toFixed(1)}%
            </div>
          </div>

          {/* Hits / Misses */}
          <div
            className="rounded-xl p-4"
            style={{
              padding: '5px',
              background: 'linear-gradient(180deg, rgba(30, 10, 10, 0.8) 0%, rgba(15, 5, 5, 0.9) 100%)',
              border: '1px solid rgba(100, 30, 30, 0.4)',
              boxShadow: '0 0 15px rgba(100, 20, 20, 0.2)',
            }}
          >
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Hits / Misses</div>
            <div className="text-2xl font-bold tabular-nums">
              <span className="text-green-400">{stats.hits}</span>
              <span className="text-gray-600 mx-1">/</span>
              <span className="text-red-400">{stats.misses}</span>
            </div>
          </div>

          {/* Avg Score */}
          <div
            className="rounded-xl p-4"
            style={{
              padding: '5px',
              background: 'linear-gradient(180deg, rgba(30, 10, 10, 0.8) 0%, rgba(15, 5, 5, 0.9) 100%)',
              border: '1px solid rgba(100, 30, 30, 0.4)',
              boxShadow: '0 0 15px rgba(100, 20, 20, 0.2)',
            }}
          >
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Avg Score</div>
            <div
              className={`text-2xl font-bold tabular-nums ${
                stats.averageScore >= 9 ? 'text-green-400' :
                stats.averageScore >= 7 ? 'text-white' : 'text-red-400'
              }`}
            >
              {stats.averageScore.toFixed(1)}
            </div>
          </div>

          {/* X-Ring Hits */}
          <div
            className="rounded-xl p-4"
            style={{
              padding: '5px',
              background: 'linear-gradient(180deg, rgba(30, 10, 10, 0.8) 0%, rgba(15, 5, 5, 0.9) 100%)',
              border: '1px solid rgba(100, 30, 30, 0.4)',
              boxShadow: '0 0 15px rgba(100, 20, 20, 0.2)',
            }}
          >
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">X-Ring Hits</div>
            <div
              className="text-2xl font-bold text-yellow-400 tabular-nums"
              style={{ textShadow: '0 0 10px rgba(255, 200, 50, 0.5)' }}
            >
              {stats.xRingHits}
            </div>
          </div>

          {/* Best Streak */}
          <div
            className="rounded-xl p-4"
            style={{
              padding: '5px',
              background: 'linear-gradient(180deg, rgba(30, 10, 10, 0.8) 0%, rgba(15, 5, 5, 0.9) 100%)',
              border: '1px solid rgba(100, 30, 30, 0.4)',
              boxShadow: '0 0 15px rgba(100, 20, 20, 0.2)',
            }}
          >
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Best Streak</div>
            <div
              className="text-2xl font-bold text-red-400 tabular-nums"
              style={{ textShadow: '0 0 10px rgba(255, 80, 80, 0.5)' }}
            >
              {stats.bestStreak}x
            </div>
          </div>

          {/* Avg Reaction */}
          <div
            className="rounded-xl p-4"
            style={{
              padding: '5px',
              background: 'linear-gradient(180deg, rgba(30, 10, 10, 0.8) 0%, rgba(15, 5, 5, 0.9) 100%)',
              border: '1px solid rgba(100, 30, 30, 0.4)',
              boxShadow: '0 0 15px rgba(100, 20, 20, 0.2)',
            }}
          >
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Avg Reaction</div>
            <div
              className="text-2xl font-bold text-cyan-400 tabular-nums"
              style={{ textShadow: '0 0 10px rgba(50, 200, 255, 0.5)' }}
            >
              {stats.averageReactionTime}ms
            </div>
          </div>
        </div>

        {/* Grading Structure */}
        <div
          className="mb-6 rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(20, 8, 8, 0.6) 0%, rgba(10, 4, 4, 0.8) 100%)',
            border: '1px solid rgba(80, 25, 25, 0.4)',
          }}
        >
          <div className="text-xs text-gray-500 uppercase tracking-wider py-2 px-4 border-b border-gray-800/50">
            Grading Requirements
          </div>
          <div className="grid grid-cols-7 text-center text-xs">
            {GRADE_REQUIREMENTS.map((req, index) => (
              <div
                key={req.grade}
                className={`py-2 px-1 ${grade === req.grade ? 'bg-white/5' : ''}`}
                style={{
                  borderRight: index < GRADE_REQUIREMENTS.length - 1 ? '1px solid rgba(80, 25, 25, 0.3)' : 'none',
                }}
              >
                <div
                  className={`text-base font-bold ${req.color} ${grade === req.grade ? 'scale-110' : 'opacity-60'}`}
                  style={grade === req.grade ? { textShadow: `0 0 10px ${req.glow}` } : {}}
                >
                  {req.grade}
                </div>
                <div className="text-gray-500 mt-1">
                  {req.grade !== 'F' ? (
                    <>
                      <div>{req.avgScore}+</div>
                      <div>{req.accuracy}%+</div>
                    </>
                  ) : (
                    <div>Below D</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-6 justify-center mt-4">
          <button
            onClick={onRestart}
            className="relative px-10 py-4 rounded-xl text-lg font-bold text-white transition-all duration-300 hover:scale-105"
            style={{
              marginTop: '10px',
              padding: '10px',
              background: 'linear-gradient(180deg, rgba(180, 40, 40, 1) 0%, rgba(120, 25, 25, 1) 100%)',
              boxShadow: '0 0 25px rgba(200, 50, 50, 0.5), 0 4px 15px rgba(150, 30, 30, 0.4)',
              border: '1px solid rgba(220, 70, 70, 0.6)',
            }}
          >
            PLAY AGAIN
          </button>
          <button
            onClick={onMenu}
            className="relative px-10 py-4 rounded-xl text-lg font-bold text-gray-300 transition-all duration-300 hover:scale-105 hover:text-white"
            style={{
              marginTop: '10px',
              padding: '10px',
              background: 'linear-gradient(180deg, rgba(40, 15, 15, 0.8) 0%, rgba(25, 10, 10, 0.9) 100%)',
              boxShadow: '0 0 15px rgba(80, 20, 20, 0.3)',
              border: '1px solid rgba(100, 30, 30, 0.5)',
            }}
          >
            CHANGE MODE
          </button>
        </div>
      </div>
    </div>
  );
}
