import * as THREE from 'three';
import { GameModeBase } from './GameModeBase';
import { GameState } from '../core/GameState';

// Microshot: Small targets for precision training, multiple visible
export class MicroshotMode extends GameModeBase {
  private maxVisibleTargets = 5;
  private targetLifetime = 3; // seconds - longer for precision
  private targetTimers: Map<string, number> = new Map();
  private minSpacing = 1.5; // Minimum distance between targets

  constructor(scene: THREE.Scene, gameState: GameState) {
    super(scene, gameState);
  }

  public start(): void {
    this.isActive = true;
    this.targetTimers.clear();

    // Spawn initial targets
    for (let i = 0; i < this.maxVisibleTargets; i++) {
      this.spawnRandomTarget();
    }
  }

  private getValidPosition(): THREE.Vector3 | null {
    const existingPositions = Array.from(this.targets.values()).map((t) => t.position);

    for (let attempt = 0; attempt < 20; attempt++) {
      const pos = this.getRandomPosition(this.visibleBounds);

      // Check distance from all existing targets
      let valid = true;
      for (const existing of existingPositions) {
        if (pos.distanceTo(existing) < this.minSpacing) {
          valid = false;
          break;
        }
      }

      if (valid) return pos;
    }

    return null;
  }

  private spawnRandomTarget(): void {
    if (!this.isActive) return;
    if (this.gameState.targetsSpawned >= this.gameState.config.totalTargets) return;

    const pos = this.getValidPosition();
    if (!pos) return;

    // Microshot uses smaller targets (handled by config.targetSize)
    const target = this.spawnTarget(pos, 0.5);
    this.targetTimers.set(target.id, 0);
  }

  public update(deltaTime: number): void {
    if (!this.isActive) return;

    // Update target timers
    for (const [id, time] of this.targetTimers) {
      const newTime = time + deltaTime;

      if (newTime >= this.targetLifetime) {
        // Target expired - only counts as miss if target still existed
        const wasRemoved = this.removeTarget(id);
        this.targetTimers.delete(id);

        if (wasRemoved) {
          this.gameState.recordMiss();
        }

        // Spawn replacement
        if (this.gameState.status === 'playing') {
          setTimeout(() => this.spawnRandomTarget(), this.gameState.config.spawnDelay);
        }
      } else {
        this.targetTimers.set(id, newTime);

        // Make target pulse/glow when about to expire
        const target = this.targets.get(id);
        if (target && newTime > this.targetLifetime * 0.7) {
          // Could add visual warning here
        }
      }
    }

    // Update existing targets
    for (const target of this.targets.values()) {
      target.update(deltaTime);
    }
  }

  public onHit(targetId: string, hitPoint: THREE.Vector3): number {
    const target = this.targets.get(targetId);
    if (!target) return 0;

    const result = target.getPointsAtPosition(hitPoint);

    // Precision bonus - smaller targets = more points (multiplier on score)
    const precisionMultiplier = 1.5;
    const enhancedResult = {
      score: result.score * precisionMultiplier,
      isXRing: result.isXRing,
      bonus: result.bonus * precisionMultiplier,
    };

    this.gameState.recordHit(enhancedResult);

    // Remove target
    this.removeTarget(targetId);
    this.targetTimers.delete(targetId);

    // Spawn replacement after delay
    if (this.gameState.status === 'playing') {
      setTimeout(() => this.spawnRandomTarget(), this.gameState.config.spawnDelay);
    }

    return enhancedResult.score + enhancedResult.bonus;
  }

  public onMiss(): void {
    this.gameState.recordMiss();
  }
}
