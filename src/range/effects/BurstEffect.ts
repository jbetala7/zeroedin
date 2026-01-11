import * as THREE from 'three';
import { COLORS, TIMING, SIZES } from '../utils/constants';
import { randomRange } from '../utils/math';

export class BurstEffect {
  private scene: THREE.Scene;
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private points: THREE.Points;

  private velocities: THREE.Vector3[] = [];
  private lifetime: number;
  private age = 0;

  public isComplete = false;

  constructor(
    scene: THREE.Scene,
    origin: THREE.Vector3,
    particleCount = 50
  ) {
    this.scene = scene;
    this.lifetime = TIMING.BURST_LIFETIME;

    const positions: number[] = [];
    const colors: number[] = [];
    const baseColor = new THREE.Color(COLORS.BURST_PRIMARY);
    const secondaryColor = new THREE.Color(COLORS.BURST_SECONDARY);

    for (let i = 0; i < particleCount; i++) {
      // Start at impact point
      positions.push(origin.x, origin.y, origin.z);

      // Color gradient from primary to secondary
      const t = Math.random();
      const color = baseColor.clone().lerp(secondaryColor, t);
      colors.push(color.r, color.g, color.b);

      // Random velocity in hemisphere (facing camera)
      const theta = Math.random() * Math.PI; // 0 to PI for hemisphere
      const phi = Math.random() * Math.PI * 2;
      const speed = randomRange(4, 10);

      this.velocities.push(
        new THREE.Vector3(
          Math.sin(theta) * Math.cos(phi) * speed,
          Math.sin(theta) * Math.sin(phi) * speed,
          Math.abs(Math.cos(theta)) * speed * 0.3 // Positive Z only, reduced
        )
      );
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)
    );
    this.geometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3)
    );

    this.material = new THREE.PointsMaterial({
      size: SIZES.BURST_PARTICLE,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    scene.add(this.points);
  }

  public update(deltaTime: number): void {
    this.age += deltaTime;

    if (this.age >= this.lifetime) {
      this.isComplete = true;
      return;
    }

    const positions = this.geometry.attributes.position.array as Float32Array;
    const progress = this.age / this.lifetime;

    // Ease out cubic for deceleration
    const ease = 1 - Math.pow(1 - progress, 3);
    const drag = 1 - ease;

    for (let i = 0; i < this.velocities.length; i++) {
      const i3 = i * 3;
      const vel = this.velocities[i];

      // Apply velocity with drag
      positions[i3] += vel.x * deltaTime * drag;
      positions[i3 + 1] += vel.y * deltaTime * drag;
      positions[i3 + 2] += vel.z * deltaTime * drag;

      // Add slight gravity
      positions[i3 + 1] -= 2 * deltaTime * progress;
    }

    this.geometry.attributes.position.needsUpdate = true;

    // Fade out
    this.material.opacity = 1 - ease;

    // Shrink particles
    this.material.size = SIZES.BURST_PARTICLE * (1 - ease * 0.5);
  }

  public dispose(): void {
    this.scene.remove(this.points);
    this.geometry.dispose();
    this.material.dispose();
  }
}
