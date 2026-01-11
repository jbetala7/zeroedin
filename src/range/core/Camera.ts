import * as THREE from 'three';
import { CAMERA } from '../utils/constants';

export interface VisibleBounds {
  x: number;
  y: number;
}

export class Camera {
  public instance: THREE.PerspectiveCamera;

  constructor(container: HTMLElement) {
    const aspect = container.clientWidth / container.clientHeight;

    this.instance = new THREE.PerspectiveCamera(
      CAMERA.FOV,
      aspect,
      CAMERA.NEAR,
      CAMERA.FAR
    );

    this.instance.position.set(0, 0, CAMERA.POSITION_Z);
    this.instance.lookAt(0, 0, 0);
  }

  public resize(container: HTMLElement): void {
    const aspect = container.clientWidth / container.clientHeight;
    this.instance.aspect = aspect;
    this.instance.updateProjectionMatrix();
  }

  /**
   * Calculate the visible bounds at z=0 (where targets spawn)
   * Returns half-width and half-height for spawn area with padding
   */
  public getVisibleBounds(padding: number = 0.85): VisibleBounds {
    const distance = CAMERA.POSITION_Z;
    const fovRad = (this.instance.fov * Math.PI) / 180;
    const visibleHeight = 2 * Math.tan(fovRad / 2) * distance;
    const visibleWidth = visibleHeight * this.instance.aspect;

    // Return half-bounds with padding to keep targets fully visible
    return {
      x: (visibleWidth / 2) * padding,
      y: (visibleHeight / 2) * padding,
    };
  }

  // Micro-shake for recoil effect
  public shake(intensity: number = 0.02, duration: number = 0.1): void {
    const originalPosition = this.instance.position.clone();
    const startTime = performance.now();

    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      const progress = elapsed / duration;

      if (progress >= 1) {
        this.instance.position.copy(originalPosition);
        return;
      }

      // Decay shake over time
      const decay = 1 - progress;
      const offsetX = (Math.random() - 0.5) * intensity * decay;
      const offsetY = (Math.random() - 0.5) * intensity * decay;

      this.instance.position.x = originalPosition.x + offsetX;
      this.instance.position.y = originalPosition.y + offsetY;

      requestAnimationFrame(animate);
    };

    animate();
  }
}
