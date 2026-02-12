import { useEffect } from 'react';
import { MARQUEE_STYLES } from '@/lib/landing-animations';

const TRUST_ITEMS = [
  '\u{1F396}\uFE0F Built by Veterans',
  '\u{1F512} Privacy-First',
  '\u{1F4F1} Works Offline',
  '\u2B50 39+ Tools',
  '\u{1F4CB} 780+ Conditions',
  '\u{1F3E5} C&P Exam Prep',
  '\u{1F4C4} Statement Generator',
  '\u{1F4B0} Travel Pay Calculator',
  '\u{1F3AF} BDD Countdown',
  '\u{1F5FA}\uFE0F Body Map Explorer',
];

function MarqueeRow({ direction, speed }: { direction: 'left' | 'right'; speed: number }) {
  const items = [...TRUST_ITEMS, ...TRUST_ITEMS];

  return (
    <div className="relative w-full overflow-hidden py-3">
      <div
        className="flex w-max will-change-transform"
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center mx-4 md:mx-6 whitespace-nowrap"
          >
            <span
              className="text-sm md:text-base font-medium"
              style={{ color: 'rgba(197, 164, 66, 0.7)' }}
            >
              {item}
            </span>
            <span
              className="ml-4 md:ml-6 text-xs"
              style={{ color: 'rgba(197, 164, 66, 0.2)' }}
            >
              &#9670;
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
        borderTop: '1px solid rgba(197, 164, 66, 0.08)',
        borderBottom: '1px solid rgba(197, 164, 66, 0.08)',
      }}
    >
      <MarqueeRow direction="left" speed={35} />
      <MarqueeRow direction="right" speed={40} />
    </section>
  );
}
