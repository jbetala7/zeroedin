'use client';

interface CrosshairIconProps {
  size?: number;
  className?: string;
  withGlow?: boolean;
}

export function CrosshairIcon({ size = 60, className = '', withGlow = true }: CrosshairIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      className={className}
      style={withGlow ? { filter: 'drop-shadow(0 0 15px rgba(255, 60, 60, 1)) drop-shadow(0 0 30px rgba(255, 40, 40, 0.8))' } : undefined}
    >
      {/* Outer circle */}
      <circle
        cx="30"
        cy="30"
        r="26"
        fill="none"
        stroke="#ef4444"
        strokeWidth="3"
      />
      {/* Horizontal line - left */}
      <line x1="8" y1="30" x2="22" y2="30" stroke="#ef4444" strokeWidth="2" />
      {/* Horizontal line - right */}
      <line x1="38" y1="30" x2="52" y2="30" stroke="#ef4444" strokeWidth="2" />
      {/* Vertical line - top */}
      <line x1="30" y1="8" x2="30" y2="22" stroke="#ef4444" strokeWidth="2" />
      {/* Vertical line - bottom */}
      <line x1="30" y1="38" x2="30" y2="52" stroke="#ef4444" strokeWidth="2" />
      {/* Tick marks - horizontal */}
      {[12, 18, 42, 48].map((x) => (
        <line key={`h-${x}`} x1={x} y1="28" x2={x} y2="32" stroke="rgba(239,68,68,0.7)" strokeWidth="1" />
      ))}
      {/* Tick marks - vertical */}
      {[12, 18, 42, 48].map((y) => (
        <line key={`v-${y}`} x1="28" y1={y} x2="32" y2={y} stroke="rgba(239,68,68,0.7)" strokeWidth="1" />
      ))}
      {/* Center dot */}
      <circle cx="30" cy="30" r="2" fill="#ef4444" />
    </svg>
  );
}
