import { useEffect } from 'react';
import { motion } from 'motion/react';
import { LANDING_BG, TEXT_SECONDARY, GOLD } from '@/lib/landing-animations';

const CURATED_TOOLS = [
  'Rating Calculator',
  'C&P Exam Simulator',
  'Personal Statement Builder',
  '790+ Conditions',
  'Claim Strategy Wizard',
  'AI DBQ Analyzer',
  'Evidence Scanner',
  'Secondary Condition Finder',
  'Health Tracking',
  'Back Pay Estimator',
  'PACT Act Checker',
  'TDIU Checker',
  'Document Vault',
  'Body Map',
  'Ask Intel',
];

const SHIMMER_CSS = `
@keyframes trust-shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@media (prefers-reduced-motion: reduce) {
  .trust-pill { animation: none !important; }
}
`;

const pillContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const pillItem = {
  hidden: { opacity: 0, scale: 0.85, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export function TrustMarquee() {
  useEffect(() => {
    const id = 'trust-shimmer-css';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = SHIMMER_CSS;
      document.head.appendChild(style);
    }
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);

  return (
    <section
      className="py-5 md:py-6"
      style={{
        backgroundColor: LANDING_BG,
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Label */}
        <motion.p
          className="text-center mb-4"
          style={{
            color: GOLD,
            fontSize: '0.6875rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          85+ Tools Including
        </motion.p>

        {/* Pill grid */}
        <motion.div
          className="flex flex-wrap justify-center gap-2"
          variants={pillContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {CURATED_TOOLS.map((tool) => (
            <motion.span
              key={tool}
              variants={pillItem}
              className="trust-pill inline-block px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap"
              style={{
                color: TEXT_SECONDARY,
                border: '1px solid rgba(255, 255, 255, 0.06)',
                background: `
                  linear-gradient(90deg,
                    transparent 0%,
                    rgba(197, 165, 90, 0.08) 45%,
                    rgba(197, 165, 90, 0.15) 50%,
                    rgba(197, 165, 90, 0.08) 55%,
                    transparent 100%
                  )
                `,
                backgroundSize: '200% 100%',
                backgroundPosition: '-200% center',
                animation: 'trust-shimmer 4s ease-in-out infinite',
                animationDelay: `${Math.random() * 3}s`,
              }}
            >
              {tool}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
