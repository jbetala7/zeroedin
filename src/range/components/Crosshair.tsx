'use client';

import { useEffect, useState } from 'react';

interface CrosshairProps {
  isActive: boolean;
}

export function Crosshair({ isActive }: CrosshairProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isActive]);

  if (!isActive) return null;

  const size = 60;
  const halfSize = size / 2;
  const lineColor = 'rgba(255, 50, 50, 0.9)';
  const tickColor = 'rgba(255, 50, 50, 0.7)';

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Outer circle */}
        <circle
          cx={halfSize}
          cy={halfSize}
          r={halfSize - 2}
          fill="none"
          stroke={lineColor}
          strokeWidth="1.5"
        />

        {/* Horizontal line - left */}
        <line
          x1="4"
          y1={halfSize}
          x2={halfSize - 4}
          y2={halfSize}
          stroke={lineColor}
          strokeWidth="1"
        />

        {/* Horizontal line - right */}
        <line
          x1={halfSize + 4}
          y1={halfSize}
          x2={size - 4}
          y2={halfSize}
          stroke={lineColor}
          strokeWidth="1"
        />

        {/* Vertical line - top */}
        <line
          x1={halfSize}
          y1="4"
          x2={halfSize}
          y2={halfSize - 4}
          stroke={lineColor}
          strokeWidth="1"
        />

        {/* Vertical line - bottom */}
        <line
          x1={halfSize}
          y1={halfSize + 4}
          x2={halfSize}
          y2={size - 4}
          stroke={lineColor}
          strokeWidth="1"
        />

        {/* Tick marks - horizontal */}
        {[10, 15, 20, 40, 45, 50].map((x) => (
          <line
            key={`h-${x}`}
            x1={x}
            y1={halfSize - 2}
            x2={x}
            y2={halfSize + 2}
            stroke={tickColor}
            strokeWidth="1"
          />
        ))}

        {/* Tick marks - vertical */}
        {[10, 15, 20, 40, 45, 50].map((y) => (
          <line
            key={`v-${y}`}
            x1={halfSize - 2}
            y1={y}
            x2={halfSize + 2}
            y2={y}
            stroke={tickColor}
            strokeWidth="1"
          />
        ))}

        {/* Center dot */}
        <circle
          cx={halfSize}
          cy={halfSize}
          r="1.5"
          fill={lineColor}
        />
      </svg>
    </div>
  );
}
