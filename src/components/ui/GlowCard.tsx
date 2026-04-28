import { useState, useRef, ReactNode, MouseEvent } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * GlowCard Component
 * Following BEM nomenclature:
 * Block: glow-card
 * Element: glow-card__glow
 * Modifier: glow-card--custom
 */
export function GlowCard({ children, className = "" }: GlowCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`glow-card relative overflow-hidden bg-zinc-950 border border-white/10 p-8 hover:border-white/30 transition-colors group ${className}`}
    >
      {/* Glow effect */}
      <div
        className="glow-card__glow pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      <div className="glow-card__content relative z-10 h-full flex flex-col">
        {children}
      </div>
    </div>
  );
}
