/**
 * OrbitButton — A single point of gold light continuously traces the button's border.
 * Uses a rotating conic-gradient on an inner div behind the button face.
 */
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MagneticButton } from './MagneticButton';

interface OrbitButtonProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  /** Use pill (9999px) radius instead of default 12px */
  pill?: boolean;
}

export function OrbitButton({ to, children, className = '', pill = false }: OrbitButtonProps) {
  const borderRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const speedRef = useRef(0.5);
  const [hovered, setHovered] = useState(false);

  const radius = pill ? '9999px' : '12px';
  const innerRadius = pill ? '9999px' : '11px';

  useEffect(() => {
    let raf: number;
    const tick = () => {
      // Smoothly interpolate speed
      const target = hovered ? 1.2 : 0.5;
      speedRef.current += (target - speedRef.current) * 0.08;
      angleRef.current = (angleRef.current + speedRef.current) % 360;

      if (borderRef.current) {
        borderRef.current.style.background = `conic-gradient(from ${angleRef.current}deg, transparent 70%, rgba(197,165,90,${hovered ? 0.7 : 0.4}) 85%, ${hovered ? '#D9BE6C' : 'rgba(217,190,108,0.8)'} 95%, transparent 100%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hovered]);

  return (
    <MagneticButton>
      <div
        className="relative"
        style={{ borderRadius: radius }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Rotating conic gradient border */}
        <div
          ref={borderRef}
          className="absolute inset-[-1.5px]"
          style={{ borderRadius: radius }}
        />
        {/* Button face */}
        <Link
          to={to}
          className={`relative z-10 inline-block no-underline text-black font-semibold ${className}`}
          style={{
            background: 'linear-gradient(135deg, #A68B3C, #C5A55A, #D9BE6C, #C5A55A, #A68B3C)',
            borderRadius: innerRadius,
            transition: 'filter 200ms ease',
            filter: hovered ? 'brightness(1.08)' : 'brightness(1)',
          }}
        >
          {children}
        </Link>
      </div>
    </MagneticButton>
  );
}
