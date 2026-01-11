export type GameMode = 'gridshot' | 'spidershot' | 'microshot';
export type GameStatus = 'idle' | 'countdown' | 'playing' | 'ended';

export interface ShotResult {
  score: number;      // Decimal score (1.0-10.9)
  isXRing: boolean;   // Did it hit the X-ring (inner bullseye)?
  bonus: number;      // X-ring bonus points
}

export interface GameStats {
  score: number;
  hits: number;
  misses: number;
  accuracy: number;
  streak: number;
  bestStreak: number;
  xRingHits: number;          // Number of X-ring (perfect center) hits
  averageScore: number;       // Average score per hit (decimal)
  targetsRemaining: number;
  totalTargets: number;
  timeElapsed: number;
  timeLimit: number;
  averageReactionTime: number;
  lastHitScore: number | null; // Most recent hit score for display
  lastHitXRing: boolean;       // Was last hit an X-ring?
}

export interface RoundConfig {
  mode: GameMode;
  timeLimit: number;
  totalTargets: number;
  targetSize: number;
  spawnDelay: number;
}

const DEFAULT_CONFIGS: Record<GameMode, RoundConfig> = {
  gridshot: {
    mode: 'gridshot',
    timeLimit: 30,
    totalTargets: 30,
    targetSize: 1,
    spawnDelay: 0,
  },
  spidershot: {
    mode: 'spidershot',
    timeLimit: 30,
    totalTargets: 30,
    targetSize: 1,
    spawnDelay: 100,
  },
  microshot: {
    mode: 'microshot',
    timeLimit: 30,
    totalTargets: 25,
    targetSize: 0.5,
    spawnDelay: 200,
  },
};

export class GameState {
  // Current state
  public status: GameStatus = 'idle';
  public mode: GameMode = 'gridshot';
  public config: RoundConfig = DEFAULT_CONFIGS.gridshot;

  // Stats
  public score = 0;
  public hits = 0;
  public misses = 0;
  public streak = 0;
  public bestStreak = 0;
  public xRingHits = 0;
  public targetsRemaining = 0;
  public targetsSpawned = 0;
  public timeElapsed = 0;

  // Score tracking
  private shotScores: number[] = [];
  public lastHitScore: number | null = null;
  public lastHitXRing = false;

  // Reaction time tracking
  private reactionTimes: number[] = [];
  private lastTargetSpawnTime = 0;

  // Callbacks
  public onStateChange: ((stats: GameStats) => void) | null = null;
  public onGameEnd: ((stats: GameStats) => void) | null = null;

  public setMode(mode: GameMode): void {
    this.mode = mode;
    this.config = { ...DEFAULT_CONFIGS[mode] };
  }

  public startRound(): void {
    this.status = 'playing';
    this.score = 0;
    this.hits = 0;
    this.misses = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.xRingHits = 0;
    this.targetsRemaining = 0;
    this.targetsSpawned = 0;
    this.timeElapsed = 0;
    this.shotScores = [];
    this.lastHitScore = null;
    this.lastHitXRing = false;
    this.reactionTimes = [];
    this.lastTargetSpawnTime = performance.now();
    this.notifyChange();
  }

  public endRound(): void {
    this.status = 'ended';
    this.onGameEnd?.(this.getStats());
  }

  public recordHit(result: ShotResult): void {
    this.hits++;
    this.shotScores.push(result.score);
    this.lastHitScore = result.score;
    this.lastHitXRing = result.isXRing;

    // Calculate total points: decimal score + X-ring bonus + streak bonus
    const streakMultiplier = 1 + Math.floor(this.streak / 5) * 0.1;
    const totalPoints = (result.score + result.bonus) * streakMultiplier;
    this.score += totalPoints;

    if (result.isXRing) {
      this.xRingHits++;
    }

    this.streak++;
    if (this.streak > this.bestStreak) {
      this.bestStreak = this.streak;
    }

    // Record reaction time
    const reactionTime = performance.now() - this.lastTargetSpawnTime;
    this.reactionTimes.push(reactionTime);

    this.notifyChange();
  }

  public recordMiss(): void {
    this.misses++;
    this.streak = 0;
    this.lastHitScore = null;
    this.lastHitXRing = false;
    this.notifyChange();
  }

  public targetSpawned(): void {
    this.targetsSpawned++;
    this.targetsRemaining++;
    this.lastTargetSpawnTime = performance.now();
    this.notifyChange();
  }

  public targetDestroyed(): void {
    this.targetsRemaining--;
    this.notifyChange();
  }

  public update(deltaTime: number): void {
    if (this.status !== 'playing') return;

    this.timeElapsed += deltaTime;

    if (this.timeElapsed >= this.config.timeLimit) {
      this.endRound();
    }

    this.notifyChange();
  }

  public getStats(): GameStats {
    const totalShots = this.hits + this.misses;
    const accuracy = totalShots > 0 ? (this.hits / totalShots) * 100 : 0;
    const avgReaction = this.reactionTimes.length > 0
      ? this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length
      : 0;
    const avgScore = this.shotScores.length > 0
      ? this.shotScores.reduce((a, b) => a + b, 0) / this.shotScores.length
      : 0;

    return {
      score: Math.round(this.score * 10) / 10,
      hits: this.hits,
      misses: this.misses,
      accuracy: Math.round(accuracy * 10) / 10,
      streak: this.streak,
      bestStreak: this.bestStreak,
      xRingHits: this.xRingHits,
      averageScore: Math.round(avgScore * 10) / 10,
      targetsRemaining: this.targetsRemaining,
      totalTargets: this.config.totalTargets,
      timeElapsed: Math.round(this.timeElapsed * 10) / 10,
      timeLimit: this.config.timeLimit,
      averageReactionTime: Math.round(avgReaction),
      lastHitScore: this.lastHitScore,
      lastHitXRing: this.lastHitXRing,
    };
  }

  public getTimeRemaining(): number {
    return Math.max(0, this.config.timeLimit - this.timeElapsed);
  }

  private notifyChange(): void {
    this.onStateChange?.(this.getStats());
  }
}
