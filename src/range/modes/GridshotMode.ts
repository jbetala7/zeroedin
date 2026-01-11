import * as THREE from 'three';
import { GameModeBase } from './GameModeBase';
import { GameState } from '../core/GameState';

// Gridshot: Multiple targets in a grid pattern, 3 visible at a time
export class GridshotMode extends GameModeBase {
  private gridPositions: THREE.Vector3[] = [];
  private maxVisibleTargets = 3;
  private targetLifetime = 2; // seconds before target disappears
  private targetTimers: Map<string, number> = new Map();
  private lastBoundsKey = '';

  constructor(scene: THREE.Scene, gameState: GameState) {
    super(scene, gameState);
  }

  private initGridPositions(): void {
    this.gridPositions = [];

    // Determine grid size based on aspect ratio
    const aspectRatio = this.visibleBounds.x / this.visibleBounds.y;
    const isMobile = aspectRatio < 1; // Portrait mode

    // Adjust grid for mobile vs desktop
    const cols = isMobile ? 2 : 5;
    const rows = isMobile ? 4 : 4;

    // Calculate spacing to fit within visible bounds
    const spacingX = (this.visibleBounds.x * 2 * 0.85) / Math.max(cols - 1, 1);
    const spacingY = (this.visibleBounds.y * 2 * 0.85) / Math.max(rows - 1, 1);
    const offsetX = ((cols - 1) * spacingX) / 2;
    const offsetY = ((rows - 1) * spacingY) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        this.gridPositions.push(
          new THREE.Vector3(
            col * spacingX - offsetX,
            row * spacingY - offsetY,
            0
          )
        );
      }
    }
  }

  private ensureGridInitialized(): void {
    const boundsKey = `${this.visibleBounds.x.toFixed(2)}_${this.visibleBounds.y.toFixed(2)}`;
    if (boundsKey !== this.lastBoundsKey) {
      this.initGridPositions();
      this.lastBoundsKey = boundsKey;
    }
  }

  public start(): void {
    this.isActive = true;
    this.targetTimers.clear();

    // Ensure grid is initialized with current bounds
    this.ensureGridInitialized();

    // Spawn initial targets
    for (let i = 0; i < this.maxVisibleTargets; i++) {
      this.spawnRandomTarget();
    }
  }

  private spawnRandomTarget(): void {
    if (!this.isActive) return;
    if (this.gameState.targetsSpawned >= this.gameState.config.totalTargets) return;

    // Find available positions (not currently occupied)
    const occupiedPositions = new Set(
      Array.from(this.targets.values()).map((t) =>
        `${t.position.x.toFixed(1)},${t.position.y.toFixed(1)}`
      )
    );

    const availablePositions = this.gridPositions.filter(
      (pos) => !occupiedPositions.has(`${pos.x.toFixed(1)},${pos.y.toFixed(1)}`)
    );

    if (availablePositions.length === 0) return;

    // Pick random position
    const pos = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    const target = this.spawnTarget(pos.clone(), 1.0);
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

        // Spawn replacement if game still active
        if (this.gameState.status === 'playing') {
          this.spawnRandomTarget();
        }
      } else {
        this.targetTimers.set(id, newTime);
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
    this.gameState.recordHit(result);

    // Remove hit target
    this.removeTarget(targetId);
    this.targetTimers.delete(targetId);

    // Spawn replacement
    if (this.gameState.status === 'playing') {
      this.spawnRandomTarget();
    }

    return result.score + result.bonus;
  }

  public onMiss(): void {
    this.gameState.recordMiss();
  }
}
