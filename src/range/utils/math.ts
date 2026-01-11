import * as THREE from 'three';

// Easing functions
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
export const easeOutQuad = (t: number): number => 1 - (1 - t) * (1 - t);
export const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// Random helpers
export const randomRange = (min: number, max: number): number =>
  min + Math.random() * (max - min);

export const randomInCircle = (radius: number): THREE.Vector2 => {
  const angle = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * radius;
  return new THREE.Vector2(Math.cos(angle) * r, Math.sin(angle) * r);
};

export const randomInRing = (innerRadius: number, outerRadius: number): THREE.Vector2 => {
  const angle = Math.random() * Math.PI * 2;
  const r = innerRadius + Math.random() * (outerRadius - innerRadius);
  return new THREE.Vector2(Math.cos(angle) * r, Math.sin(angle) * r);
};

// Vector helpers
export const screenToNDC = (screenX: number, screenY: number, width: number, height: number): THREE.Vector2 => {
  return new THREE.Vector2(
    (screenX / width) * 2 - 1,
    -(screenY / height) * 2 + 1
  );
};

// Clamp value between min and max
export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

// Linear interpolation
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

// Vector3 lerp
export const lerpVector3 = (a: THREE.Vector3, b: THREE.Vector3, t: number): THREE.Vector3 => {
  return new THREE.Vector3(
    lerp(a.x, b.x, t),
    lerp(a.y, b.y, t),
    lerp(a.z, b.z, t)
  );
};
