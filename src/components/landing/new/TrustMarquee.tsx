import { useEffect } from 'react';
import { MARQUEE_STYLES } from '@/lib/landing-animations';

const TRUST_ITEMS = [
  'Built by Veterans',
  'Privacy-First',
  'Offline-Capable',
  '39+ Tools',
  '780+ Conditions',
  'C&P Exam Prep',
  'Statement Generator',
  'Travel Pay Calculator',
  'BDD Countdown',
  'Body Map Explorer',
];

function MarqueeRow({ direction, speed }: { direction: 'left' | 'right'; speed: number }) {
  const items = [...TRUST_ITEMS, ...TRUST_ITEMS];

  return (
    <div className="relative w-full overflow-hidden py-3">
      <div
        className="flex w-max"
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {items.map((item, i) => (
          <div key={i} className="flex items-center mx-5 md:mx-8 whitespace-nowrap">
            <span
              className="text-sm md:text-base font-medium tracking-wide"
              style={{ color: 'rgba(197, 164, 66, 0.6)' }}
            >
              {item}
            </span>
            <span
              className="ml-5 md:ml-8 text-[10px]"
              style={{ color: 'rgba(255, 255, 255, 0.1)' }}
            >
              ◆
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TrustMarquee() {
  useEffect(() => {
    const id = 'marquee-keyframes';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = MARQUEE_STYLES;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <section
      className="py-4 overflow-hidden"
      style={{
        backgroundColor: '#0a0a0a',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <MarqueeRow direction="left" speed={35} />
      <MarqueeRow direction="right" speed={42} />
    </section>
  );
}
