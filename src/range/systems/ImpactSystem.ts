import * as THREE from 'three';
import { BurstEffect } from '../effects/BurstEffect';
import { RippleEffect } from '../effects/RippleEffect';

export class ImpactSystem {
  private scene: THREE.Scene;
  private burstEffects: BurstEffect[] = [];
  private rippleEffects: RippleEffect[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public trigger(point: THREE.Vector3): void {
    // Create burst effect - particles explode outward
    const burst = new BurstEffect(this.scene, point, 50);
    this.burstEffects.push(burst);

    // Create ripple effect - concentric rings expand
    const ripple = new RippleEffect(this.scene, point, 3, 60, 1.2);
    this.rippleEffects.push(ripple);
  }

  public update(deltaTime: number): void {
    // Update and cleanup burst effects
    this.burstEffects = this.burstEffects.filter((effect) => {
      effect.update(deltaTime);

      if (effect.isComplete) {
        effect.dispose();
        return false;
      }

      return true;
    });

    // Update and cleanup ripple effects
    this.rippleEffects = this.rippleEffects.filter((effect) => {
      effect.update(deltaTime);

      if (effect.isComplete) {
        effect.dispose();
        return false;
      }

      return true;
    });
  }

  public dispose(): void {
    for (const effect of this.burstEffects) {
      effect.dispose();
    }
    for (const effect of this.rippleEffects) {
      effect.dispose();
    }
    this.burstEffects = [];
    this.rippleEffects = [];
  }
}
