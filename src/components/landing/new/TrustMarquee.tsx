import { useEffect } from 'react';
import { MARQUEE_STYLES, LANDING_BG, GOLD } from '@/lib/landing-animations';

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
  'C&P Exam Simulator',
  'Evidence Scanner',
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
  'Family Statement Builder',
  'Post-Exam Debrief',
];

const ROW_3_ITEMS = [
  'Zero Percent Optimizer',
  'TDIU Checker',
  'Decision Decoder',
  'Compensation Ladder',
  'Cost Estimator',
  'Work Impact Logger',
  'Health Trends',
  'Quick Log',
  'Exam Day Mode',
  'Nexus Guide',
  'Medication Rule Tool',
  'Evidence Strength Analyzer',
  'Doctor Prep Packet',
  'VSO/Attorney Packet',
  'C&P Exam Packet Generator',
  'Deployment Locations',
  'Condition Guide',
  'Benefits Discovery',
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
              color: GOLD,
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
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);

  return (
    <section
      className="py-8"
      style={{
        backgroundColor: LANDING_BG,
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
          <MarqueeRow items={ROW_1_ITEMS} direction="left" speed={90} />
        </div>
        <div className="py-2" style={{ marginTop: '12px' }}>
          <MarqueeRow items={ROW_2_ITEMS} direction="right" speed={90} />
        </div>
        <div className="py-2" style={{ marginTop: '12px' }}>
          <MarqueeRow items={ROW_3_ITEMS} direction="left" speed={90} />
        </div>
      </div>
    </section>
  );
}
