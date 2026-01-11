import * as THREE from 'three';
import { Target } from '../entities/Target';
import { GameState } from '../core/GameState';
import type { VisibleBounds } from '../core/Camera';

export abstract class GameModeBase {
  protected scene: THREE.Scene;
  protected gameState: GameState;
  protected targets: Map<string, Target> = new Map();
  protected isActive = false;
  protected visibleBounds: VisibleBounds = { x: 4, y: 3 }; // Default fallback

  constructor(scene: THREE.Scene, gameState: GameState) {
    this.scene = scene;
    this.gameState = gameState;
  }

  public setVisibleBounds(bounds: VisibleBounds): void {
    this.visibleBounds = bounds;
  }

  public abstract start(): void;
  public abstract update(deltaTime: number): void;
  public abstract onHit(targetId: string, hitPoint: THREE.Vector3): number;
  public abstract onMiss(): void;

  public getHitTestObjects(): THREE.Object3D[] {
    return Array.from(this.targets.values()).map((t) => t.hitMesh);
  }

  public stop(): void {
    this.isActive = false;
    // Clean up all targets
    for (const target of this.targets.values()) {
      target.dispose(this.scene);
    }
    this.targets.clear();
  }

  protected spawnTarget(position: THREE.Vector3, size: number = 1): Target {
    // Base target size is 0.6, modified by mode and config
    const baseSize = 0.6;
    const finalSize = baseSize * size * this.gameState.config.targetSize;
    const target = new Target(this.scene, position, finalSize);
    this.targets.set(target.id, target);
    this.gameState.targetSpawned();
    return target;
  }

  protected removeTarget(id: string): boolean {
    const target = this.targets.get(id);
    if (target) {
      target.dispose(this.scene);
      this.targets.delete(id);
      this.gameState.targetDestroyed();
      return true;
    }
    return false;
  }

  protected getRandomPosition(bounds: { x: number; y: number }): THREE.Vector3 {
    const x = (Math.random() - 0.5) * bounds.x * 2;
    const y = (Math.random() - 0.5) * bounds.y * 2;
    return new THREE.Vector3(x, y, 0);
  }
}
