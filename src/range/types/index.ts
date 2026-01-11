import * as THREE from 'three';

export interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  size: number;
  life: number;
  maxLife: number;
  active: boolean;
}

export interface HitResult {
  point: THREE.Vector3;
  target: THREE.Object3D;
  distance: number;
  targetId: string;
}

export interface EffectOptions {
  particleCount: number;
  color: THREE.Color;
  size: number;
  lifetime: number;
}

export interface BurstOptions extends EffectOptions {
  speed: number;
  spread: number;
}

export interface RippleOptions extends EffectOptions {
  ringCount: number;
  particlesPerRing: number;
  maxRadius: number;
  expandSpeed: number;
}

export interface TargetRing {
  innerRadius: number;
  outerRadius: number;
  color: string;
  points: number;
}

export interface InputState {
  position: THREE.Vector2;
  isPressed: boolean;
}
