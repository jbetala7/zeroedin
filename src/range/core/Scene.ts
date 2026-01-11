import * as THREE from 'three';
import { COLORS } from '../utils/constants';

export class Scene {
  public instance: THREE.Scene;

  constructor() {
    this.instance = new THREE.Scene();
    this.instance.background = new THREE.Color(COLORS.BACKGROUND);

    // Add subtle fog for depth
    this.instance.fog = new THREE.Fog(COLORS.BACKGROUND, 8, 25);
  }

  public add(object: THREE.Object3D): void {
    this.instance.add(object);
  }

  public remove(object: THREE.Object3D): void {
    this.instance.remove(object);
  }

  public dispose(): void {
    // Traverse and dispose all objects
    this.instance.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry?.dispose();
        if (object.material instanceof THREE.Material) {
          object.material.dispose();
        } else if (Array.isArray(object.material)) {
          object.material.forEach((m) => m.dispose());
        }
      }
      if (object instanceof THREE.Points) {
        object.geometry?.dispose();
        if (object.material instanceof THREE.Material) {
          object.material.dispose();
        }
      }
    });
  }
}
