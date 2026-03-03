import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer, GOLD_GRADIENT_TEXT, GOLD_GRADIENT, EASE_SMOOTH, HEADING_H2_STYLE, LANDING_BG_ELEVATED, LANDING_BG, TEXT_TERTIARY, TEXT_DIM, TEXT_SECONDARY, TEXT_PRIMARY, TEXT_BRIGHT, GOLD } from '@/lib/landing-animations';
import { Check, Shield, ChevronDown } from 'lucide-react';

const INCLUDED_FEATURES = [
  {
    category: 'Guides & Tools',
    features: ['Claim Checklist', 'VA Form Guide', 'Intent to File Guide', 'Travel Pay Calculator', 'VA-Speak Translator', 'BDD Guide', 'Glossary'],
  },
  {
    category: 'Document Builders',
    features: ['Personal Statement Builder', 'Buddy Statement Builder', 'Doctor Summary Outline', 'Stressor Statement Writer', 'Shareable Summary', 'C&P Exam Packet Generator'],
  },
  {
    category: 'Health & Symptom Tracking',
    features: ['Symptom Tracker', 'Sleep Tracker', 'Migraine Tracker', 'Medication Tracker', 'Medical Visit Logger', 'Exposure & Hazard Tracker'],
  },
  {
    category: 'Strategy & Exam Prep',
    features: ['Claim Strategy Wizard', 'C&P Exam Prep', 'DBQ Prep Sheet', 'Secondary Condition Finder', 'Bilateral Factor Calculator', 'Back Pay Estimator', 'Rating Calculator', 'Zero Percent Optimizer', 'PACT Act Checker'],
  },
  {
    category: 'Research & Reference',
    features: ['800+ Condition Database', 'Conditions by Conflict', 'Condition Guide', 'Deployment Locations'],
  },
  {
    category: 'Package & Export',
    features: ['Full Claim Packet Builder', 'Document Vault', 'Health Summary & Timeline', 'Interactive Body Map', 'Appeals & Decision Review Guide', 'Deadlines Tracker', 'Service History Manager', 'Claim Journey Tracker'],
  },
];

/**
 * Animated rotating conic-gradient border for the featured card.
 * Uses CSS @property for smooth angle animation via requestAnimationFrame.
 */
function RotatingBorderCard({ children }: { children: React.ReactNode }) {
  const borderRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      angleRef.current = (angleRef.current + 0.4) % 360;
      if (borderRef.current) {
        borderRef.current.style.background = `conic-gradient(from ${angleRef.current}deg, rgba(197,165,90,0.05), rgba(197,165,90,0.7), rgba(197,165,90,0.9), rgba(197,165,90,0.7), rgba(197,165,90,0.05), rgba(197,165,90,0.02), rgba(197,165,90,0.05))`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      }}
      className="relative rounded-2xl"
    >
      {/* Outer glow */}
      <motion.div
        className="absolute -inset-1 rounded-3xl pointer-events-none"
        animate={{
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(197,165,90,0.15), transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
      {/* Rotating border */}
      <div
        ref={borderRef}
        className="relative rounded-2xl p-[1.5px]"
      >
        {/* Inner card */}
        <div className="relative rounded-[15px] overflow-hidden" style={{ backgroundColor: LANDING_BG_ELEVATED }}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

function CompetitorCard({
  title,
  price,
  priceLabel,
  items,
}: {
  title: string;
  price: string;
  priceLabel: string;
  items: string[];
}) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{
        y: -4,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      }}
      className="group relative rounded-2xl p-[1px]"
      style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02), rgba(255,255,255,0.05))',
      }}
    >
      {/* Hover border brighten */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.15), rgba(255,255,255,0.03), rgba(255,255,255,0.10))',
        }}
      />
      <div
        className="relative rounded-[15px] h-full p-7"
        style={{
          backgroundColor: LANDING_BG_ELEVATED,
        }}
      >
        <h3 className="text-base font-semibold mb-4" style={{ color: TEXT_TERTIARY }}>{title}</h3>
        <div className="mb-5">
          <span className="text-3xl font-bold text-white">{price}</span>
          <span className="text-xs ml-2" style={{ color: TEXT_TERTIARY }}>{priceLabel}</span>
        </div>
        <ul className="space-y-2.5">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: TEXT_TERTIARY }}>
              <span className="mt-0.5 text-xs" style={{ color: TEXT_DIM }}>&#10005;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export function Pricing() {
  const [showFeatures, setShowFeatures] = useState(false);

  return (
    <section id="pricing" className="py-16 md:py-24 px-4" style={{ backgroundColor: LANDING_BG }}>
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-center text-3xl md:text-5xl text-white mb-4"
          style={HEADING_H2_STYLE}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Know What You're Paying For
        </motion.h2>
        <motion.p
          className="text-center mb-14 text-lg"
          style={{ color: TEXT_SECONDARY }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Most veterans don't realize they have options.
        </motion.p>

        {/* Three-column comparison */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:items-center mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          {/* Claim Companies */}
          <CompetitorCard
            title="Claim Companies"
            price="$4,000–$6,000"
            priceLabel="typical cost"
            items={[
              'Large upfront fees',
              'Limited transparency',
              'No standardized oversight',
            ]}
          />

          {/* VCS — highlighted center with rotating border */}
          <RotatingBorderCard>
            <div className="relative p-7">
              {/* Best Value badge */}
              <div
                className="absolute top-0 right-0 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl"
                style={{ background: GOLD_GRADIENT, color: '#000' }}
              >
                Best Value
              </div>

              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'rgba(197, 165, 90, 0.12)',
                    border: '1px solid rgba(197, 165, 90, 0.2)',
                  }}
                >
                  <Shield size={16} style={{ color: GOLD }} />
                </div>
                <h3 className="text-base font-semibold" style={GOLD_GRADIENT_TEXT}>Vet Claim Support</h3>
              </div>

              <div className="mb-5">
                <span
                  className="text-4xl font-bold"
                  style={GOLD_GRADIENT_TEXT}
                >
                  $9.99
                </span>
                <span className="text-xs ml-2" style={{ color: TEXT_SECONDARY }}>one-time</span>
              </div>

              <ul className="space-y-2.5 mb-6">
                {[
                  '800+ VA conditions',
                  'Guided statements',
                  'Document vault',
                  'Symptom trackers',
                  'No subscription required',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm" style={{ color: TEXT_PRIMARY }}>
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'rgba(197, 165, 90, 0.15)',
                      }}
                    >
                      <Check size={10} style={{ color: GOLD }} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <motion.div
                whileHover={{
                  boxShadow: '0 4px 20px rgba(197,165,90,0.35)',
                }}
                style={{ borderRadius: '9999px' }}
              >
                <Link
                  to="/auth"
                  className="block text-center rounded-full px-6 py-3 text-sm font-semibold text-black no-underline"
                  style={{ background: GOLD_GRADIENT }}
                >
                  Get Started — $9.99
                </Link>
              </motion.div>
            </div>
          </RotatingBorderCard>

          {/* Private Attorneys */}
          <CompetitorCard
            title="Private Attorneys"
            price="20–33%"
            priceLabel="of back pay"
            items={[
              'Contingency fees from your award',
              'Can total thousands of dollars',
              'Minimal help organizing evidence',
            ]}
          />
        </motion.div>

        {/* Expandable feature list */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button
            onClick={() => setShowFeatures(!showFeatures)}
            className="inline-flex items-center gap-2 bg-transparent border-none cursor-pointer text-sm font-medium transition-colors"
            style={{ color: GOLD }}
          >
            What's included in Premium?
            <motion.span
              animate={{ rotate: showFeatures ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} />
            </motion.span>
          </button>

          <AnimatePresence>
            {showFeatures && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: EASE_SMOOTH }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 mt-8 text-left max-w-3xl mx-auto">
                  {INCLUDED_FEATURES.map((group) => (
                    <div key={group.category}>
                      <p
                        className="text-[10px] font-bold uppercase tracking-widest mb-2"
                        style={{ color: GOLD }}
                      >
                        {group.category}
                      </p>
                      <ul className="space-y-1.5">
                        {group.features.map((f) => (
                          <li key={f} className="flex items-center gap-2.5 text-sm">
                            <Check size={14} className="shrink-0" style={{ color: GOLD }} />
                            <span style={{ color: TEXT_BRIGHT }}>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
