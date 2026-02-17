import { useEffect } from 'react';
import { MARQUEE_STYLES } from '@/lib/landing-animations';

const TRUST_ITEMS = [
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
              style={{
                background: 'linear-gradient(135deg, #E8E8E8 0%, #B0B0B0 30%, #F0F0F0 50%, #A8A8A8 70%, #D0D0D0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
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
      className="py-8 overflow-hidden"
      style={{
        backgroundColor: '#0a0a0a',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <MarqueeRow direction="left" speed={45} />
      <MarqueeRow direction="right" speed={52} />
    </section>
  );
}
