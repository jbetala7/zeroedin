import type { TargetRing } from '../types';

export const COLORS = {
  BACKGROUND: '#0A0A0F',

  // Bullseye colors (center to outer)
  BULLSEYE_CENTER: '#FFD700',    // Gold - 10 points
  BULLSEYE_RING_1: '#FF8C00',    // Dark orange - 8 points
  BULLSEYE_RING_2: '#FF4500',    // Orange red - 6 points
  BULLSEYE_RING_3: '#DC143C',    // Crimson - 4 points
  BULLSEYE_OUTER: '#8B0000',     // Dark red - 2 points

  // Effect colors
  BURST_PRIMARY: '#FF3030',
  BURST_SECONDARY: '#FF5050',
  RIPPLE: '#FF4040',
} as const;

export const PARTICLE_COUNTS = {
  TARGET_TOTAL: 2000,
  BURST_EFFECT: 50,
  RIPPLE_PER_RING: 32,
  MAX_ACTIVE: 10000,
} as const;

export const SIZES = {
  TARGET_RADIUS: 1.5,
  TARGET_PARTICLE: 0.025,
  BURST_PARTICLE: 0.08,
  RIPPLE_PARTICLE: 0.03,
} as const;

export const TIMING = {
  FRAME_TIME: 1000 / 60,  // 16.67ms for 60fps
  BURST_LIFETIME: 0.3,
  RIPPLE_LIFETIME: 0.4,
  TARGET_REGEN_DELAY: 2.0,
} as const;

export const CAMERA = {
  FOV: 50,
  NEAR: 0.1,
  FAR: 100,
  POSITION_Z: 8,
} as const;

export const TARGET_RINGS: TargetRing[] = [
  { innerRadius: 0.0, outerRadius: 0.2, color: COLORS.BULLSEYE_CENTER, points: 10 },
  { innerRadius: 0.2, outerRadius: 0.4, color: COLORS.BULLSEYE_RING_1, points: 8 },
  { innerRadius: 0.4, outerRadius: 0.6, color: COLORS.BULLSEYE_RING_2, points: 6 },
  { innerRadius: 0.6, outerRadius: 0.8, color: COLORS.BULLSEYE_RING_3, points: 4 },
  { innerRadius: 0.8, outerRadius: 1.0, color: COLORS.BULLSEYE_OUTER, points: 2 },
];
