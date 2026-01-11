import * as THREE from 'three';
import { GameModeBase } from './GameModeBase';
import { GameState } from '../core/GameState';

// Spidershot: One target at a time, random positions, tests reaction + flick aim
export class SpidershotMode extends GameModeBase {
  private currentTargetId: string | null = null;
  private targetLifetime = 1.5; // seconds before miss
  private targetTimer = 0;
  private spawnCooldown = 0;
  private lastPosition: THREE.Vector3 | null = null;
  private minDistance = 2; // Minimum distance between consecutive targets

  constructor(scene: THREE.Scene, gameState: GameState) {
    super(scene, gameState);
  }

  public start(): void {
    this.isActive = true;
    this.currentTargetId = null;
    this.targetTimer = 0;
    this.spawnCooldown = 0;
    this.lastPosition = null;

    // Spawn first target
    this.spawnNextTarget();
  }

  private spawnNextTarget(): void {
    if (!this.isActive) return;
    if (this.gameState.targetsSpawned >= this.gameState.config.totalTargets) return;

    // Get position that's far enough from last position
    let pos: THREE.Vector3;
    let attempts = 0;

    do {
      pos = this.getRandomPosition(this.visibleBounds);
      attempts++;
    } while (
      this.lastPosition &&
      pos.distanceTo(this.lastPosition) < this.minDistance &&
      attempts < 10
    );

    this.lastPosition = pos.clone();

    const target = this.spawnTarget(pos, 0.9);
    this.currentTargetId = target.id;
    this.targetTimer = 0;
  }

  public update(deltaTime: number): void {
    if (!this.isActive) return;

    // Handle spawn cooldown
    if (this.spawnCooldown > 0) {
      this.spawnCooldown -= deltaTime;
      if (this.spawnCooldown <= 0 && !this.currentTargetId) {
        this.spawnNextTarget();
      }
      return;
    }

    // Update target timer
    if (this.currentTargetId) {
      this.targetTimer += deltaTime;

      if (this.targetTimer >= this.targetLifetime) {
        // Target expired - only counts as miss if target still existed
        const wasRemoved = this.removeTarget(this.currentTargetId);
        this.currentTargetId = null;

        if (wasRemoved) {
          this.gameState.recordMiss();
        }

        // Start cooldown before next spawn
        this.spawnCooldown = this.gameState.config.spawnDelay / 1000;
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

    // Bonus points for fast reaction (added to the score before recording)
    const reactionBonus = Math.max(0, (this.targetLifetime - this.targetTimer) * 0.5);
    const enhancedResult = {
      score: result.score + reactionBonus,
      isXRing: result.isXRing,
      bonus: result.bonus,
    };

    this.gameState.recordHit(enhancedResult);

    // Remove target
    this.removeTarget(targetId);
    this.currentTargetId = null;

    // Start cooldown before next spawn
    if (this.gameState.status === 'playing') {
      this.spawnCooldown = this.gameState.config.spawnDelay / 1000;
    }

    return enhancedResult.score + enhancedResult.bonus;
  }

  public onMiss(): void {
    this.gameState.recordMiss();
  }
}
