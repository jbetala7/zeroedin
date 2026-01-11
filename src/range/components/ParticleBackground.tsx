'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle colors - red/orange dust palette
    const colors = [
      'rgba(255, 50, 50, ',    // Bright red
      'rgba(255, 80, 30, ',    // Orange-red
      'rgba(200, 30, 30, ',    // Dark red
      'rgba(255, 100, 50, ',   // Orange
      'rgba(150, 20, 20, ',    // Deep red
      'rgba(255, 60, 40, ',    // Red-orange
    ];

    // Initialize particles
    const createParticle = (x?: number, y?: number): Particle => {
      const size = Math.random() * 3 + 0.5;
      return {
        x: x ?? Math.random() * canvas.width,
        y: y ?? Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.1, // Slight upward drift
        size,
        opacity: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: Math.random() * 500 + 300,
      };
    };

    // Create initial particles - high density
    const particleCount = 500;
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(createParticle());
    }

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8
      );
      gradient.addColorStop(0, 'rgba(40, 10, 10, 1)');
      gradient.addColorStop(0.5, 'rgba(20, 5, 5, 1)');
      gradient.addColorStop(1, 'rgba(5, 2, 2, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add subtle red glow in center
      const centerGlow = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height * 0.4,
        0,
        canvas.width / 2,
        canvas.height * 0.4,
        400
      );
      centerGlow.addColorStop(0, 'rgba(100, 20, 20, 0.3)');
      centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Mouse interaction - particles flow away from cursor
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          particle.vx += Math.cos(angle) * force * 0.5;
          particle.vy += Math.sin(angle) * force * 0.5;
        }

        // Apply velocity with damping
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Add slight random movement (Brownian motion)
        particle.vx += (Math.random() - 0.5) * 0.05;
        particle.vy += (Math.random() - 0.5) * 0.05 - 0.01;

        // Update life
        particle.life++;

        // Fade in/out based on life
        let alpha = particle.opacity;
        if (particle.life < 50) {
          alpha *= particle.life / 50;
        } else if (particle.life > particle.maxLife - 50) {
          alpha *= (particle.maxLife - particle.life) / 50;
        }

        // Wrap around edges or respawn
        if (
          particle.x < -50 ||
          particle.x > canvas.width + 50 ||
          particle.y < -50 ||
          particle.y > canvas.height + 50 ||
          particle.life >= particle.maxLife
        ) {
          particlesRef.current[index] = createParticle(
            Math.random() * canvas.width,
            canvas.height + 20
          );
          return;
        }

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + alpha + ')';
        ctx.fill();

        // Add glow effect for larger particles
        if (particle.size > 1.5) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = particle.color + (alpha * 0.3) + ')';
          ctx.fill();
        }
      });

      // Add some extra bright sparks occasionally
      if (Math.random() < 0.02) {
        const spark = createParticle(
          Math.random() * canvas.width,
          canvas.height + 10
        );
        spark.size = Math.random() * 2 + 1;
        spark.opacity = 0.8;
        spark.vy = -Math.random() * 0.5 - 0.3;
        particlesRef.current.push(spark);
      }

      // Keep particle count in check
      while (particlesRef.current.length > 600) {
        particlesRef.current.shift();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none md:pointer-events-auto"
      style={{ background: '#0a0505' }}
    />
  );
}
