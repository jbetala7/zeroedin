import * as THREE from 'three';

// Generate a unique ID (fallback for browsers without crypto.randomUUID)
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers/mobile Safari
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Red/pink glowing target rings - matching the game UI style
const TARGET_RINGS = [
  { innerRadius: 0.00, outerRadius: 0.08, color: '#0a0a0a' },  // Center black
  { innerRadius: 0.08, outerRadius: 0.15, color: '#1a1a1a' },  // Inner dark ring
  { innerRadius: 0.15, outerRadius: 0.25, color: '#ffcccc' },  // Light pink
  { innerRadius: 0.25, outerRadius: 0.35, color: '#ff9999' },  // Pink
  { innerRadius: 0.35, outerRadius: 0.45, color: '#ffcccc' },  // Light pink
  { innerRadius: 0.45, outerRadius: 0.55, color: '#ff9999' },  // Pink
  { innerRadius: 0.55, outerRadius: 0.65, color: '#ffcccc' },  // Light pink
  { innerRadius: 0.65, outerRadius: 0.75, color: '#ff9999' },  // Pink
  { innerRadius: 0.75, outerRadius: 0.85, color: '#ffcccc' },  // Light pink
  { innerRadius: 0.85, outerRadius: 0.95, color: '#ff9999' },  // Pink
  { innerRadius: 0.95, outerRadius: 1.00, color: '#ffcccc' },  // Outer light pink
];

// X-ring threshold (percentage of radius) - hitting this close to center = X-ring bonus
const X_RING_THRESHOLD = 0.08;
const X_RING_BONUS = 2;

export class Target {
  public id: string;
  public position: THREE.Vector3;
  public radius: number;

  // Visual elements
  private group: THREE.Group;
  private ringMeshes: THREE.Mesh[] = [];
  private outlineRings: THREE.Line[] = [];
  private glowSprite!: THREE.Sprite;

  // For hit detection (invisible mesh)
  public hitMesh!: THREE.Mesh;

  // Particle burst on hit
  private burstParticles: THREE.Points | null = null;
  private burstVelocities: THREE.Vector3[] = [];
  private burstAge = 0;
  private isBursting = false;

  constructor(scene: THREE.Scene, position: THREE.Vector3, radius: number = 0.8) {
    this.id = generateId();
    this.position = position.clone();
    this.radius = radius;
    this.group = new THREE.Group();
    this.group.position.copy(position);

    this.createGlow();
    this.createRings();
    this.createHitMesh();

    scene.add(this.group);
  }

  private createGlow(): void {
    // Create a red glow effect behind the target
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Create radial gradient for glow
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 60, 60, 0.6)');
    gradient.addColorStop(0.3, 'rgba(255, 40, 40, 0.4)');
    gradient.addColorStop(0.6, 'rgba(200, 30, 30, 0.2)');
    gradient.addColorStop(1, 'rgba(150, 20, 20, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.glowSprite = new THREE.Sprite(material);
    this.glowSprite.scale.set(this.radius * 3, this.radius * 3, 1);
    this.glowSprite.position.set(0, 0, -0.01);
    this.group.add(this.glowSprite);
  }

  private createRings(): void {
    // Create filled rings from outer to inner
    for (let i = TARGET_RINGS.length - 1; i >= 0; i--) {
      const ring = TARGET_RINGS[i];
      const geometry = new THREE.RingGeometry(
        ring.innerRadius * this.radius,
        ring.outerRadius * this.radius,
        64
      );
      const material = new THREE.MeshBasicMaterial({
        color: ring.color,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      this.ringMeshes.push(mesh);
      this.group.add(mesh);

      // Add subtle outline ring between alternating colors
      if (i > 0 && i % 2 === 0) {
        const outlineGeometry = new THREE.BufferGeometry();
        const points: number[] = [];
        const segments = 64;

        for (let j = 0; j <= segments; j++) {
          const angle = (j / segments) * Math.PI * 2;
          points.push(
            Math.cos(angle) * ring.innerRadius * this.radius,
            Math.sin(angle) * ring.innerRadius * this.radius,
            0.001
          );
        }

        outlineGeometry.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(points, 3)
        );

        const outlineMaterial = new THREE.LineBasicMaterial({
          color: '#ff6666',
          linewidth: 1,
          transparent: true,
          opacity: 0.3,
        });

        const outline = new THREE.Line(outlineGeometry, outlineMaterial);
        this.outlineRings.push(outline);
        this.group.add(outline);
      }
    }

    // Add outer border with glow
    const borderGeometry = new THREE.BufferGeometry();
    const borderPoints: number[] = [];
    const segments = 64;

    for (let j = 0; j <= segments; j++) {
      const angle = (j / segments) * Math.PI * 2;
      borderPoints.push(
        Math.cos(angle) * this.radius,
        Math.sin(angle) * this.radius,
        0.001
      );
    }

    borderGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(borderPoints, 3)
    );

    const borderMaterial = new THREE.LineBasicMaterial({
      color: '#ff6666',
      linewidth: 2,
    });

    const border = new THREE.Line(borderGeometry, borderMaterial);
    this.group.add(border);
  }

  private createHitMesh(): void {
    const hitGeometry = new THREE.CircleGeometry(this.radius, 32);
    const hitMaterial = new THREE.MeshBasicMaterial({
      visible: false,
      side: THREE.DoubleSide,
    });

    this.hitMesh = new THREE.Mesh(hitGeometry, hitMaterial);
    this.hitMesh.position.copy(this.position);
    this.hitMesh.userData.targetId = this.id;
    this.group.add(this.hitMesh);

    // Reset hitMesh position since it's in the group
    this.hitMesh.position.set(0, 0, 0);
  }

  /**
   * Calculate score based on distance from center (decimal scoring)
   * Returns: { score: decimal score (1.0-10.9), isXRing: boolean, bonus: number }
   */
  public getPointsAtPosition(hitPoint: THREE.Vector3): { score: number; isXRing: boolean; bonus: number } {
    const localHit = hitPoint.clone().sub(this.position);
    const distance = Math.sqrt(localHit.x * localHit.x + localHit.y * localHit.y);
    const normalizedDist = distance / this.radius;

    // Decimal scoring: 10.9 at dead center, decreasing to 1.0 at edge
    // Each 0.1 of radius = roughly 1 point decrease
    // Within a ring, decimal indicates precision (e.g., 10.0-10.9 within ring 10)

    let baseScore: number;
    let decimal: number;

    if (normalizedDist <= 0.10) {
      // Ring 10 (0-10% of radius)
      baseScore = 10;
      decimal = 0.9 - (normalizedDist / 0.10) * 0.9; // 10.9 at center, 10.0 at edge of ring
    } else if (normalizedDist <= 0.20) {
      baseScore = 9;
      decimal = 0.9 - ((normalizedDist - 0.10) / 0.10) * 0.9;
    } else if (normalizedDist <= 0.30) {
      baseScore = 8;
      decimal = 0.9 - ((normalizedDist - 0.20) / 0.10) * 0.9;
    } else if (normalizedDist <= 0.40) {
      baseScore = 7;
      decimal = 0.9 - ((normalizedDist - 0.30) / 0.10) * 0.9;
    } else if (normalizedDist <= 0.50) {
      baseScore = 6;
      decimal = 0.9 - ((normalizedDist - 0.40) / 0.10) * 0.9;
    } else if (normalizedDist <= 0.60) {
      baseScore = 5;
      decimal = 0.9 - ((normalizedDist - 0.50) / 0.10) * 0.9;
    } else if (normalizedDist <= 0.70) {
      baseScore = 4;
      decimal = 0.9 - ((normalizedDist - 0.60) / 0.10) * 0.9;
    } else if (normalizedDist <= 0.80) {
      baseScore = 3;
      decimal = 0.9 - ((normalizedDist - 0.70) / 0.10) * 0.9;
    } else if (normalizedDist <= 0.90) {
      baseScore = 2;
      decimal = 0.9 - ((normalizedDist - 0.80) / 0.10) * 0.9;
    } else if (normalizedDist <= 1.00) {
      baseScore = 1;
      decimal = 0.9 - ((normalizedDist - 0.90) / 0.10) * 0.9;
    } else {
      // Outside target
      return { score: 0, isXRing: false, bonus: 0 };
    }

    const score = Math.round((baseScore + decimal) * 10) / 10; // Round to 1 decimal
    const isXRing = normalizedDist <= X_RING_THRESHOLD;
    const bonus = isXRing ? X_RING_BONUS : 0;

    return { score, isXRing, bonus };
  }

  // Create particle burst effect when hit
  public disperseAt(hitPoint: THREE.Vector3, scene: THREE.Scene): void {
    if (this.isBursting) return;
    this.isBursting = true;
    this.burstAge = 0;

    const particleCount = 30;
    const positions: number[] = [];
    const colors: number[] = [];
    this.burstVelocities = [];

    const localHit = hitPoint.clone().sub(this.position);

    for (let i = 0; i < particleCount; i++) {
      positions.push(localHit.x, localHit.y, 0.01);

      // Red particles to match target
      colors.push(1.0, 0.1 + Math.random() * 0.2, 0.1 + Math.random() * 0.2);

      // Random velocity outward
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      this.burstVelocities.push(
        new THREE.Vector3(
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          (Math.random() - 0.5) * 2
        )
      );
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.burstParticles = new THREE.Points(geometry, material);
    this.group.add(this.burstParticles);
  }

  public update(deltaTime: number): void {
    if (!this.isBursting || !this.burstParticles) return;

    this.burstAge += deltaTime;

    if (this.burstAge > 0.5) {
      // Clean up burst
      this.group.remove(this.burstParticles);
      this.burstParticles.geometry.dispose();
      (this.burstParticles.material as THREE.Material).dispose();
      this.burstParticles = null;
      this.isBursting = false;
      return;
    }

    const positions = this.burstParticles.geometry.attributes.position.array as Float32Array;
    const progress = this.burstAge / 0.5;

    for (let i = 0; i < this.burstVelocities.length; i++) {
      const i3 = i * 3;
      const vel = this.burstVelocities[i];

      positions[i3] += vel.x * deltaTime;
      positions[i3 + 1] += vel.y * deltaTime;
      positions[i3 + 2] += vel.z * deltaTime;

      // Apply gravity
      positions[i3 + 1] -= 5 * deltaTime * progress;
    }

    this.burstParticles.geometry.attributes.position.needsUpdate = true;
    (this.burstParticles.material as THREE.PointsMaterial).opacity = 1 - progress;
  }

  public dispose(scene: THREE.Scene): void {
    // Clean up all meshes and materials
    for (const mesh of this.ringMeshes) {
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    }

    for (const outline of this.outlineRings) {
      outline.geometry.dispose();
      (outline.material as THREE.Material).dispose();
    }

    if (this.burstParticles) {
      this.burstParticles.geometry.dispose();
      (this.burstParticles.material as THREE.Material).dispose();
    }

    // Dispose glow sprite
    if (this.glowSprite) {
      (this.glowSprite.material as THREE.SpriteMaterial).map?.dispose();
      (this.glowSprite.material as THREE.Material).dispose();
    }

    this.hitMesh.geometry.dispose();
    (this.hitMesh.material as THREE.Material).dispose();

    scene.remove(this.group);
  }
}
