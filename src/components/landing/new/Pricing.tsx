import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer, GOLD_GRADIENT_TEXT } from '@/lib/landing-animations';
import { Check, AlertTriangle } from 'lucide-react';

const FREE_FEATURES = [
  'VA Combined Rating Calculator',
  'Claim Checklist',
  'VA-Speak Translator',
  'VA Form Guide',
  'Intent to File Guide',
  'Glossary & FAQ',
  '800+ Condition Database',
  'Travel Pay Calculator',
];

interface FeatureGroup {
  category: string;
  features: string[];
}

const PREMIUM_FEATURE_GROUPS: FeatureGroup[] = [
  {
    category: 'Document Builders',
    features: [
      'Personal Statement Builder',
      'Buddy Statement Builder',
      'Doctor Summary Outline',
      'Stressor Statement Writer',
    ],
  },
  {
    category: 'Health & Symptom Tracking',
    features: [
      'Symptom Tracker',
      'Sleep Tracker',
      'Migraine Tracker',
      'Medication Tracker',
      'Medical Visit Logger',
      'Exposure & Hazard Tracker',
    ],
  },
  {
    category: 'Strategy & Exam Prep',
    features: [
      'Claim Strategy Wizard',
      'C&P Exam Prep',
      'DBQ Prep Sheet',
      'Secondary Condition Finder',
      'Bilateral Factor Calculator',
      'Back Pay Estimator',
    ],
  },
  {
    category: 'Package & Export',
    features: [
      'Full Claim Packet Builder',
      'Document Vault',
      'Health Summary & Timeline',
      'Interactive Body Map',
      'Appeals & Decision Review Guide',
    ],
  },
];

const SHIMMER_CSS = `
@keyframes shimmer-border {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
`;

function RedCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{
        y: -4,
        boxShadow: '0 0 25px rgba(239,68,68,0.4), 0 0 50px rgba(239,68,68,0.2), 0 0 80px rgba(239,68,68,0.08)',
      }}
      className="relative rounded-2xl p-px"
      style={{
        background: 'linear-gradient(135deg, rgba(239,68,68,0.4), rgba(239,68,68,0.08), rgba(239,68,68,0.4))',
      }}
    >
      <motion.div
        className="absolute -inset-px rounded-2xl pointer-events-none"
        animate={{
          boxShadow: [
            '0 0 8px rgba(239,68,68,0.12), 0 0 20px rgba(239,68,68,0.06), 0 0 40px rgba(239,68,68,0.03)',
            '0 0 15px rgba(239,68,68,0.3), 0 0 35px rgba(239,68,68,0.15), 0 0 60px rgba(239,68,68,0.06)',
            '0 0 8px rgba(239,68,68,0.12), 0 0 20px rgba(239,68,68,0.06), 0 0 40px rgba(239,68,68,0.03)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative rounded-[15px] h-full" style={{ backgroundColor: '#111111' }}>
        {children}
      </div>
    </motion.div>
  );
}

function FreeCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{
        y: -6,
        boxShadow: '0 0 25px rgba(34,197,94,0.5), 0 0 50px rgba(34,197,94,0.25), 0 0 100px rgba(34,197,94,0.12)',
      }}
      className="relative rounded-2xl p-px"
      style={{
        background: 'linear-gradient(135deg, rgba(34,197,94,0.4), rgba(34,197,94,0.1), rgba(34,197,94,0.4))',
      }}
    >
      {/* Neon glow — breathing animation */}
      <motion.div
        className="absolute -inset-px rounded-2xl pointer-events-none"
        animate={{
          boxShadow: [
            '0 0 10px rgba(34,197,94,0.15), 0 0 25px rgba(34,197,94,0.08), 0 0 50px rgba(34,197,94,0.04)',
            '0 0 20px rgba(34,197,94,0.35), 0 0 45px rgba(34,197,94,0.18), 0 0 80px rgba(34,197,94,0.08)',
            '0 0 10px rgba(34,197,94,0.15), 0 0 25px rgba(34,197,94,0.08), 0 0 50px rgba(34,197,94,0.04)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative rounded-[15px] h-full" style={{ backgroundColor: '#111111' }}>
        {children}
      </div>
    </motion.div>
  );
}

function PremiumCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{
        y: -6,
        boxShadow: '0 0 30px rgba(191,149,63,0.6), 0 0 60px rgba(191,149,63,0.3), 0 0 120px rgba(191,149,63,0.15)',
      }}
      className="relative rounded-2xl p-px overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(191,149,63,0.6), rgba(191,149,63,0.15), rgba(191,149,63,0.6))',
      }}
    >
      {/* Shimmer sweep across border */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, transparent 35%, rgba(252,246,186,0.5) 50%, transparent 65%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer-border 4s ease-in-out infinite',
        }}
      />
      {/* Neon glow — breathing animation (stronger than Free) */}
      <motion.div
        className="absolute -inset-px rounded-2xl pointer-events-none"
        animate={{
          boxShadow: [
            '0 0 15px rgba(191,149,63,0.25), 0 0 35px rgba(191,149,63,0.12), 0 0 70px rgba(191,149,63,0.06)',
            '0 0 25px rgba(191,149,63,0.5), 0 0 60px rgba(191,149,63,0.25), 0 0 120px rgba(191,149,63,0.1)',
            '0 0 15px rgba(191,149,63,0.25), 0 0 35px rgba(191,149,63,0.12), 0 0 70px rgba(191,149,63,0.06)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative rounded-[15px] h-full" style={{ backgroundColor: '#111111' }}>
        {children}
      </div>
    </motion.div>
  );
}

export function Pricing() {
  useEffect(() => {
    const id = 'shimmer-border-keyframes';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = SHIMMER_CSS;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <section id="pricing" className="py-12 px-4" style={{ backgroundColor: '#000000' }}>
      <div className="max-w-4xl mx-auto">

        <motion.h2
          className="text-center text-3xl md:text-5xl mb-4"
          style={{
            letterSpacing: '-0.025em',
            fontWeight: 500,
            lineHeight: 1.15,
            ...GOLD_GRADIENT_TEXT,
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Know What You're Paying For
        </motion.h2>
        <motion.p
          className="text-center mb-12 text-lg"
          style={{ color: '#9CA3AF' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Most veterans don't realize they have options. Here's how costs compare.
        </motion.p>

        {/* Competitor comparison cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <RedCard>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={18} style={{ color: '#EF4444' }} />
                <h3 className="text-base font-semibold" style={{ color: '#EF4444' }}>Claim Companies</h3>
              </div>
              <p className="text-sm mb-3" style={{ color: '#9CA3AF' }}>
                Third-party companies that charge veterans for claim preparation assistance.
              </p>
              <div className="mb-3">
                <span className="text-2xl font-bold text-white">$4,000–$6,000</span>
                <span className="text-xs ml-2" style={{ color: '#9CA3AF' }}>typical cost</span>
              </div>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2 text-sm" style={{ color: '#9CA3AF' }}>
                  <span style={{ color: '#EF4444' }}>&#10005;</span> Large upfront fees
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: '#9CA3AF' }}>
                  <span style={{ color: '#EF4444' }}>&#10005;</span> No guaranteed outcomes
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: '#9CA3AF' }}>
                  <span style={{ color: '#EF4444' }}>&#10005;</span> Unregulated industry
                </li>
              </ul>
            </div>
          </RedCard>

          <RedCard>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={18} style={{ color: '#EF4444' }} />
                <h3 className="text-base font-semibold" style={{ color: '#EF4444' }}>Private Attorneys</h3>
              </div>
              <p className="text-sm mb-3" style={{ color: '#9CA3AF' }}>
                Attorneys who typically take a percentage of retroactive back pay after approval.
              </p>
              <div className="mb-3">
                <span className="text-2xl font-bold text-white">20–33%</span>
                <span className="text-xs ml-2" style={{ color: '#9CA3AF' }}>of back pay</span>
              </div>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2 text-sm" style={{ color: '#9CA3AF' }}>
                  <span style={{ color: '#EF4444' }}>&#10005;</span> Contingency fees from your award
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: '#9CA3AF' }}>
                  <span style={{ color: '#EF4444' }}>&#10005;</span> Can total thousands of dollars
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: '#9CA3AF' }}>
                  <span style={{ color: '#EF4444' }}>&#10005;</span> Minimal help organizing your evidence
                </li>
              </ul>
            </div>
          </RedCard>
        </motion.div>

        {/* OR divider */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-10"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="h-px flex-1 max-w-[100px]" style={{ background: 'linear-gradient(to right, transparent, #BF953F)' }} />
          <span
            className="text-lg font-semibold px-3"
            style={GOLD_GRADIENT_TEXT}
          >
            &mdash; OR &mdash;
          </span>
          <div className="h-px flex-1 max-w-[100px]" style={{ background: 'linear-gradient(to left, transparent, #BF953F)' }} />
        </motion.div>

        <motion.div
          className="space-y-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Free plan */}
          <FreeCard>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Free</h3>
                  <div className="mb-3 md:mb-0">
                    <span
                      className="text-3xl font-bold"
                      style={{
                        background: 'linear-gradient(135deg, #4ade80 0%, #22C55E 50%, #16a34a 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      $0
                    </span>
                    <span className="text-sm ml-2" style={{ color: '#9CA3AF' }}>forever</span>
                  </div>
                </div>
                <Link
                  to="/login"
                  className="block text-center rounded-full px-6 py-2.5 text-sm font-semibold no-underline whitespace-nowrap md:ml-6"
                  style={{
                    background: 'linear-gradient(135deg, #4ade80 0%, #22C55E 50%, #16a34a 100%)',
                    color: '#000000',
                  }}
                >
                  Get Started Free
                </Link>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check size={16} style={{ color: '#22C55E' }} className="shrink-0" />
                    <span style={{ color: '#D1D5DB' }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FreeCard>

          {/* Premium plan */}
          <PremiumCard>
            <div className="p-6 relative">
              <motion.div
                className="absolute top-0 right-0 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-bl-lg rounded-tr-[15px]"
                style={{
                  background: '#EF4444',
                  color: '#FFFFFF',
                }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                Launch Sale
              </motion.div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1 mt-1">Premium</h3>
                  <div className="mb-3 md:mb-0">
                    <span
                      className="text-base line-through mr-2"
                      style={{ color: '#6B7280' }}
                    >
                      $19.99/mo
                    </span>
                    <span
                      className="text-3xl font-bold"
                      style={{
                        background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      $9.99<span className="text-base font-normal" style={{ WebkitTextFillColor: '#9CA3AF' }}>/mo</span>
                    </span>
                  </div>
                </div>
                <Link
                  to="/login"
                  className="block text-center rounded-full px-6 py-2.5 text-sm font-semibold text-black no-underline whitespace-nowrap md:ml-6"
                  style={{
                    background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)',
                  }}
                >
                  Get Started
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {PREMIUM_FEATURE_GROUPS.map((group) => (
                  <div key={group.category}>
                    <p
                      className="text-[10px] font-bold uppercase tracking-widest mb-2"
                      style={{ color: '#D4AF37' }}
                    >
                      {group.category}
                    </p>
                    <ul className="space-y-1.5">
                      {group.features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-sm">
                          <Check size={14} style={{ color: '#BF953F' }} className="shrink-0" />
                          <span style={{ color: '#D1D5DB' }}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </PremiumCard>
        </motion.div>

        <motion.p
          className="text-center text-xs mt-6"
          style={{ color: '#4B5563' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Pricing shown reflects typical industry ranges based on publicly available information.
          VCS is an educational and organizational tool, not a law firm, claims agent, or filing service.
          We do not file claims on your behalf and do not guarantee any outcomes.
          Free VA-accredited VSOs are available at{' '}
          <a href="https://www.va.gov/vso" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#6B7280' }}>va.gov/vso</a>.
        </motion.p>

      </div>
    </section>
  );
}
