import * as THREE from 'three';
import type { HitResult } from '../types';

export class RaycastManager {
  private raycaster: THREE.Raycaster;
  private camera: THREE.PerspectiveCamera;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.raycaster = new THREE.Raycaster();
    this.raycaster.near = 0.1;
    this.raycaster.far = 100;
  }

  public cast(screenPosition: THREE.Vector2, targets: THREE.Object3D[]): HitResult | null {
    if (targets.length === 0) return null;

    // Convert screen position to NDC (-1 to 1)
    const ndc = new THREE.Vector2(
      (screenPosition.x / window.innerWidth) * 2 - 1,
      -(screenPosition.y / window.innerHeight) * 2 + 1
    );

    this.raycaster.setFromCamera(ndc, this.camera);

    const intersects = this.raycaster.intersectObjects(targets, false);

    if (intersects.length > 0) {
      const hit = intersects[0];
      return {
        point: hit.point.clone(),
        target: hit.object,
        distance: hit.distance,
        targetId: hit.object.userData.targetId as string,
      };
    }

    return null;
  }

  // For projectile collision detection
  public castRay(
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    targets: THREE.Object3D[],
    maxDistance: number
  ): HitResult | null {
    this.raycaster.set(origin, direction.clone().normalize());
    this.raycaster.far = maxDistance;

    const intersects = this.raycaster.intersectObjects(targets, false);

    if (intersects.length > 0) {
      const hit = intersects[0];
      return {
        point: hit.point.clone(),
        target: hit.object,
        distance: hit.distance,
        targetId: hit.object.userData.targetId as string,
      };
    }

    return null;
  }
}
