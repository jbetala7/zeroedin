import * as THREE from 'three';

export class Renderer {
  public instance: THREE.WebGLRenderer;
  public domElement: HTMLCanvasElement;

  constructor(container: HTMLElement) {
    this.instance = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });

    this.domElement = this.instance.domElement;

    // Set size to container
    this.instance.setSize(container.clientWidth, container.clientHeight);

    // Limit pixel ratio for performance
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Enable tone mapping for better colors
    this.instance.toneMapping = THREE.ACESFilmicToneMapping;
    this.instance.toneMappingExposure = 1.0;
  }

  public resize(container: HTMLElement): void {
    this.instance.setSize(container.clientWidth, container.clientHeight);
  }

  public render(scene: THREE.Scene, camera: THREE.Camera): void {
    this.instance.render(scene, camera);
  }

  public dispose(): void {
    this.instance.dispose();
    this.domElement.remove();
  }
}
