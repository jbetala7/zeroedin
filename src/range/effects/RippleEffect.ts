import * as THREE from 'three';
import { COLORS, TIMING, SIZES } from '../utils/constants';

export class RippleEffect {
  private scene: THREE.Scene;
  private rings: THREE.Points[] = [];
  private ringRadii: number[] = [];
  private ringAges: number[] = [];

  private origin: THREE.Vector3;
  private ringCount: number;
  private particlesPerRing: number;
  private maxRadius: number;
  private lifetime: number;

  private spawnInterval: number;
  private timeSinceLastSpawn = 0;
  private ringsSpawned = 0;

  public isComplete = false;

  constructor(
    scene: THREE.Scene,
    origin: THREE.Vector3,
    ringCount = 2,
    particlesPerRing = 32,
    maxRadius = 0.8
  ) {
    this.scene = scene;
    this.origin = origin.clone();
    this.ringCount = ringCount;
    this.particlesPerRing = particlesPerRing;
    this.maxRadius = maxRadius;
    this.lifetime = TIMING.RIPPLE_LIFETIME;
    this.spawnInterval = this.lifetime / (ringCount + 1);

    // Spawn first ring immediately
    this.spawnRing();
  }

  private spawnRing(): void {
    const positions: number[] = [];
    const colors: number[] = [];
    const color = new THREE.Color(COLORS.RIPPLE);

    const angleStep = (Math.PI * 2) / this.particlesPerRing;

    for (let i = 0; i < this.particlesPerRing; i++) {
      // Start at origin, will expand outward
      positions.push(this.origin.x, this.origin.y, this.origin.z);
      colors.push(color.r, color.g, color.b);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)
    );
    geometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3)
    );

    const material = new THREE.PointsMaterial({
      size: SIZES.RIPPLE_PARTICLE,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    this.scene.add(points);

    this.rings.push(points);
    this.ringRadii.push(0);
    this.ringAges.push(0);
    this.ringsSpawned++;
  }

  public update(deltaTime: number): void {
    this.timeSinceLastSpawn += deltaTime;

    // Spawn new rings at intervals
    if (
      this.ringsSpawned < this.ringCount &&
      this.timeSinceLastSpawn >= this.spawnInterval
    ) {
      this.spawnRing();
      this.timeSinceLastSpawn = 0;
    }

    let allComplete = true;
    const angleStep = (Math.PI * 2) / this.particlesPerRing;

    for (let r = 0; r < this.rings.length; r++) {
      this.ringAges[r] += deltaTime;

      const progress = this.ringAges[r] / this.lifetime;

      if (progress >= 1) {
        continue;
      }

      allComplete = false;

      // Expand radius with easing
      const easedProgress = 1 - Math.pow(1 - progress, 2);
      this.ringRadii[r] = easedProgress * this.maxRadius;

      // Update particle positions in ring
      const positions = this.rings[r].geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < this.particlesPerRing; i++) {
        const angle = i * angleStep;
        const i3 = i * 3;

        positions[i3] = this.origin.x + Math.cos(angle) * this.ringRadii[r];
        positions[i3 + 1] = this.origin.y + Math.sin(angle) * this.ringRadii[r];
        positions[i3 + 2] = this.origin.z;
      }

      this.rings[r].geometry.attributes.position.needsUpdate = true;

      // Fade out
      (this.rings[r].material as THREE.PointsMaterial).opacity = 1 - progress;
    }

    if (allComplete && this.ringsSpawned >= this.ringCount) {
      this.isComplete = true;
    }
  }

  public dispose(): void {
    for (const ring of this.rings) {
      this.scene.remove(ring);
      ring.geometry.dispose();
      (ring.material as THREE.Material).dispose();
    }
    this.rings = [];
  }
}
