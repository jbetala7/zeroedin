import * as THREE from 'three';
import { Target } from '../entities/Target';

export class TargetSystem {
  private scene: THREE.Scene;
  private targets: Map<string, Target> = new Map();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public spawnTarget(position: THREE.Vector3, radius?: number): Target {
    const target = new Target(this.scene, position, radius);
    this.targets.set(target.id, target);
    return target;
  }

  public removeTarget(id: string): void {
    const target = this.targets.get(id);
    if (target) {
      target.dispose(this.scene);
      this.targets.delete(id);
    }
  }

  public getHitTestObjects(): THREE.Object3D[] {
    return Array.from(this.targets.values()).map((t) => t.hitMesh);
  }

  public onHit(targetId: string, hitPoint: THREE.Vector3): { score: number; isXRing: boolean; bonus: number } {
    const target = this.targets.get(targetId);
    if (!target) return { score: 0, isXRing: false, bonus: 0 };

    // Get points for this hit location
    const result = target.getPointsAtPosition(hitPoint);

    // Disperse particles at hit point
    target.disperseAt(hitPoint, this.scene);

    return result;
  }

  public update(deltaTime: number): void {
    for (const target of this.targets.values()) {
      target.update(deltaTime);
    }
  }

  public dispose(): void {
    for (const target of this.targets.values()) {
      target.dispose(this.scene);
    }
    this.targets.clear();
  }
}
