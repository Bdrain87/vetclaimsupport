import { useEffect } from 'react';
import { MARQUEE_STYLES } from '@/lib/landing-animations';

const ROW_1_ITEMS = [
  'VA Combined Rating Calculator',
  'Personal Statement Builder',
  'Symptom Tracker',
  'C&P Exam Prep',
  'Claim Strategy Wizard',
  'Sleep Tracker',
  'Buddy Statement Builder',
  'VA-Speak Translator',
  'Migraine Tracker',
  'Back Pay Estimator',
  'Document Vault',
  'Interactive Body Map',
  'Secondary Condition Finder',
  'Doctor Summary Outline',
  'Medication Tracker',
  'Claim Packet Builder',
];

const ROW_2_ITEMS = [
  'Medical Visit Logger',
  'DBQ Prep Sheet',
  'Exposure Tracker',
  'Bilateral Calculator',
  'Health Timeline',
  'Stressor Statement Writer',
  'Appeals Guide',
  'VA Form Guide',
  'Claim Checklist',
  '800+ Condition Database',
  'Travel Pay Calculator',
  'Health Summary',
  'BDD Guide',
  'Service History',
  'Intent to File Guide',
  'Claim Journey',
];

function MarqueeRow({ items, direction, speed }: { items: string[]; direction: 'left' | 'right'; speed: number }) {
  const duplicated = [...items, ...items];

  return (
    <div
      className="flex w-max ticker-row"
      style={{
        animation: `marquee-${direction} ${speed}s linear infinite`,
        willChange: 'transform',
        gap: '48px',
      }}
    >
      {duplicated.map((item, i) => (
        <div key={i} className="flex items-center whitespace-nowrap" style={{ gap: '48px' }}>
          <span
            className="font-medium"
            style={{
              color: '#C5A55A',
              fontSize: '1rem',
              fontWeight: 500,
              letterSpacing: '0.01em',
            }}
          >
            {item}
          </span>
          {i < duplicated.length - 1 && (
            <span
              style={{
                color: 'rgba(197, 165, 90, 0.6)',
                fontSize: '0.625rem',
              }}
            >
              ◆
            </span>
          )}
        </div>
      ))}
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
      className="py-8"
      style={{
        backgroundColor: '#0A0A0A',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div
        className="ticker-container"
        style={{
          overflow: 'hidden',
          maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
        }}
      >
        <div className="py-2">
          <MarqueeRow items={ROW_1_ITEMS} direction="left" speed={55} />
        </div>
        <div className="py-2" style={{ marginTop: '12px' }}>
          <MarqueeRow items={ROW_2_ITEMS} direction="right" speed={55} />
        </div>
      </div>
    </section>
  );
}
