'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface ParticleHeroProps {
  scrollProgress: number;
}

export default function ParticleHero({ scrollProgress }: ParticleHeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#0A0A12]">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={() => setIsLoaded(true)}
      >
        <color attach="background" args={['#0A0A12']} />
        <fog attach="fog" args={['#0A0A12', 8, 25]} />

        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#FF6B00" />

        <ParticleRifle scrollProgress={scrollProgress} />
        <AmbientParticles />
        <CircuitLines />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          rotateSpeed={0.5}
        />
      </Canvas>

      {/* Vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_20%,rgba(10,10,18,0.8)_100%)]" />
    </div>
  );
}

// Main particle rifle component
function ParticleRifle({ scrollProgress }: { scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.Points>(null);
  const muzzleRef = useRef<THREE.Points>(null);

  // Generate rifle shape particles
  const { positions, colors, sizes } = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];

    const particleCount = 15000;

    // Rifle shape definition (2D outline that we'll fill with particles)
    const rifleShape = [
      // Stock (back part)
      { xMin: -4, xMax: -2.5, yMin: -0.8, yMax: 0.5, density: 1.2 },
      { xMin: -3.5, xMax: -2.5, yMin: -1.2, yMax: -0.8, density: 1 }, // Stock bottom curve
      { xMin: -4.2, xMax: -3.5, yMin: -0.2, yMax: 0.3, density: 1 }, // Stock back
      // Grip
      { xMin: -2.2, xMax: -1.5, yMin: -1.5, yMax: -0.3, density: 1.5 },
      // Trigger guard (hollow area)
      { xMin: -2.0, xMax: -1.3, yMin: -0.8, yMax: -0.3, density: 0.3 },
      // Receiver/Action
      { xMin: -2.5, xMax: 0.5, yMin: -0.3, yMax: 0.4, density: 1.4 },
      // Barrel
      { xMin: 0.5, xMax: 3.5, yMin: -0.15, yMax: 0.25, density: 1.5 },
      // Barrel tip/muzzle
      { xMin: 3.5, xMax: 4.0, yMin: -0.2, yMax: 0.3, density: 1.8 },
      // Magazine
      { xMin: -1.0, xMax: -0.3, yMin: -1.0, yMax: -0.3, density: 1.3 },
    ];

    // Color palette (orange/gold gradient)
    const colorPalette = [
      new THREE.Color('#FF4D00'),
      new THREE.Color('#FF6B00'),
      new THREE.Color('#FF8C00'),
      new THREE.Color('#FFAA00'),
      new THREE.Color('#FFD700'),
    ];

    let generated = 0;

    while (generated < particleCount) {
      for (const shape of rifleShape) {
        if (generated >= particleCount) break;

        const particlesForShape = Math.floor(
          (particleCount / rifleShape.length) * shape.density
        );

        for (let i = 0; i < particlesForShape && generated < particleCount; i++) {
          const x = shape.xMin + Math.random() * (shape.xMax - shape.xMin);
          const y = shape.yMin + Math.random() * (shape.yMax - shape.yMin);
          const z = (Math.random() - 0.5) * 0.4; // Slight depth

          positions.push(x, y, z);

          // Color based on position (warmer near edges)
          const edgeFactor = Math.min(
            Math.abs(x - shape.xMin) / (shape.xMax - shape.xMin),
            Math.abs(shape.xMax - x) / (shape.xMax - shape.xMin)
          );
          const colorIndex = Math.floor(edgeFactor * 4);
          const color = colorPalette[colorIndex] || colorPalette[0];
          colors.push(color.r, color.g, color.b);

          // Size variation
          sizes.push(0.03 + Math.random() * 0.04);

          generated++;
        }
      }
    }

    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      sizes: new Float32Array(sizes),
    };
  }, []);

  // Glow particles (larger, more transparent)
  const glowData = useMemo(() => {
    const glowPositions: number[] = [];
    const glowColors: number[] = [];

    for (let i = 0; i < positions.length; i += 3) {
      if (Math.random() > 0.7) {
        glowPositions.push(
          positions[i] + (Math.random() - 0.5) * 0.1,
          positions[i + 1] + (Math.random() - 0.5) * 0.1,
          positions[i + 2] + (Math.random() - 0.5) * 0.1
        );
        glowColors.push(1, 0.4, 0);
      }
    }

    return {
      positions: new Float32Array(glowPositions),
      colors: new Float32Array(glowColors),
    };
  }, [positions]);

  // Muzzle flash particles
  const muzzleData = useMemo(() => {
    const muzzlePositions: number[] = [];
    const muzzleColors: number[] = [];
    const muzzleSizes: number[] = [];

    for (let i = 0; i < 500; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 1.5;
      const spread = Math.random();

      muzzlePositions.push(
        4.2 + spread * 2,
        Math.sin(angle) * radius * spread * 0.5,
        Math.cos(angle) * radius * spread * 0.5
      );

      // White to orange gradient
      const t = spread;
      muzzleColors.push(
        1,
        0.5 + t * 0.5,
        t * 0.3
      );

      muzzleSizes.push(0.05 + Math.random() * 0.15);
    }

    return {
      positions: new Float32Array(muzzlePositions),
      colors: new Float32Array(muzzleColors),
      sizes: new Float32Array(muzzleSizes),
    };
  }, []);

  // Animation
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (pointsRef.current) {
      // Subtle floating animation
      pointsRef.current.rotation.y = Math.sin(time * 0.2) * 0.05;
      pointsRef.current.position.y = Math.sin(time * 0.5) * 0.05;

      // Particle shimmer effect
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += Math.sin(time * 2 + i) * 0.0005;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (glowRef.current) {
      glowRef.current.rotation.y = Math.sin(time * 0.2) * 0.05;
      glowRef.current.position.y = Math.sin(time * 0.5) * 0.05;
    }

    // Muzzle flash pulsing
    if (muzzleRef.current) {
      muzzleRef.current.rotation.y = Math.sin(time * 0.2) * 0.05;
      muzzleRef.current.position.y = Math.sin(time * 0.5) * 0.05;
      const scale = 0.8 + Math.sin(time * 3) * 0.2;
      muzzleRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Main rifle particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Glow layer */}
      <points ref={glowRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[glowData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[glowData.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.3}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Muzzle flash */}
      <points ref={muzzleRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[muzzleData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[muzzleData.colors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[muzzleData.sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

    </group>
  );
}

// Ambient floating particles
function AmbientParticles() {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];

    for (let i = 0; i < 2000; i++) {
      positions.push(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );

      // Orange to dim colors
      const brightness = 0.3 + Math.random() * 0.7;
      colors.push(brightness, brightness * 0.4, 0);
    }

    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
    };
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;

      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Circuit/tech lines in background
function CircuitLines() {
  const ref = useRef<THREE.Line>(null);

  const { positions } = useMemo(() => {
    const positions: number[] = [];

    // Create circuit-like lines
    for (let i = 0; i < 20; i++) {
      const startX = (Math.random() - 0.5) * 20;
      const startY = (Math.random() - 0.5) * 15 - 5;
      const startZ = -8 - Math.random() * 5;

      positions.push(startX, startY, startZ);

      // Create connected segments
      let x = startX, y = startY, z = startZ;
      for (let j = 0; j < 5; j++) {
        if (Math.random() > 0.5) {
          x += (Math.random() - 0.5) * 4;
        } else {
          y += (Math.random() - 0.5) * 3;
        }
        positions.push(x, y, z);
      }
    }

    return { positions: new Float32Array(positions) };
  }, []);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#1a3a5c"
        transparent
        opacity={0.3}
      />
    </lineSegments>
  );
}
