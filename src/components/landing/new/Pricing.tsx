import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer, GOLD_GRADIENT_TEXT, GOLD_GRADIENT, EASE_SMOOTH, HEADING_H2_STYLE } from '@/lib/landing-animations';
import { Check, Shield, ChevronDown } from 'lucide-react';

const INCLUDED_FEATURES = [
  {
    category: 'Guides & Tools',
    features: ['Claim Checklist', 'VA Form Guide', 'Intent to File Guide', 'Travel Pay Calculator', 'VA-Speak Translator'],
  },
  {
    category: 'Document Builders',
    features: ['Personal Statement Builder', 'Buddy Statement Builder', 'Doctor Summary Outline', 'Stressor Statement Writer'],
  },
  {
    category: 'Health & Symptom Tracking',
    features: ['Symptom Tracker', 'Sleep Tracker', 'Migraine Tracker', 'Medication Tracker', 'Medical Visit Logger', 'Exposure & Hazard Tracker'],
  },
  {
    category: 'Strategy & Exam Prep',
    features: ['Claim Strategy Wizard', 'C&P Exam Prep', 'DBQ Prep Sheet', 'Secondary Condition Finder', 'Bilateral Factor Calculator', 'Back Pay Estimator'],
  },
  {
    category: 'Package & Export',
    features: ['Full Claim Packet Builder', 'Document Vault', 'Health Summary & Timeline', 'Interactive Body Map', 'Appeals & Decision Review Guide'],
  },
];

export function Pricing() {
  const [showFeatures, setShowFeatures] = useState(false);

  return (
    <section id="pricing" className="py-[120px] px-4" style={{ backgroundColor: '#0A0A0A' }}>
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
          style={{ color: '#9CA3AF' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Most veterans don't realize they have options.
        </motion.p>

        {/* Three-column comparison */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          {/* Claim Companies */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -4 }}
            className="rounded-2xl p-px"
            style={{
              background: 'linear-gradient(135deg, rgba(107,114,128,0.3), rgba(107,114,128,0.08), rgba(107,114,128,0.3))',
            }}
          >
            <div className="rounded-[15px] h-full p-6" style={{ backgroundColor: '#111111' }}>
              <h3 className="text-base font-semibold mb-3" style={{ color: '#6B7280' }}>Claim Companies</h3>
              <div className="mb-3">
                <span className="text-2xl font-bold text-white">$4,000–$6,000</span>
                <span className="text-xs ml-2" style={{ color: '#6B7280' }}>typical cost</span>
              </div>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
                  <span style={{ color: '#6B7280' }}>&#10005;</span> Large upfront fees
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
                  <span style={{ color: '#6B7280' }}>&#10005;</span> No guaranteed outcomes
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
                  <span style={{ color: '#6B7280' }}>&#10005;</span> Unregulated industry
                </li>
              </ul>
            </div>
          </motion.div>

          {/* VCS — highlighted center */}
          <motion.div
            variants={fadeInUp}
            whileHover={{
              y: -6,
              boxShadow: '0 0 30px rgba(191,149,63,0.4), 0 0 60px rgba(191,149,63,0.2)',
            }}
            className="relative rounded-2xl p-px overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(191,149,63,0.6), rgba(191,149,63,0.15), rgba(191,149,63,0.6))',
            }}
          >
            <motion.div
              className="absolute -inset-px rounded-2xl pointer-events-none"
              animate={{
                boxShadow: [
                  '0 0 15px rgba(191,149,63,0.2), 0 0 35px rgba(191,149,63,0.08)',
                  '0 0 25px rgba(191,149,63,0.4), 0 0 60px rgba(191,149,63,0.15)',
                  '0 0 15px rgba(191,149,63,0.2), 0 0 35px rgba(191,149,63,0.08)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative rounded-[15px] h-full p-6" style={{ backgroundColor: '#111111' }}>
              <div
                className="absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-bl-lg rounded-tr-[15px]"
                style={{ background: GOLD_GRADIENT, color: '#000' }}
              >
                Best Value
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Shield size={18} style={{ color: '#D4AF37' }} />
                <h3 className="text-base font-semibold" style={GOLD_GRADIENT_TEXT}>Vet Claim Support</h3>
              </div>
              <div className="mb-3">
                <span
                  className="text-2xl font-bold"
                  style={GOLD_GRADIENT_TEXT}
                >
                  $9.99
                </span>
                <span className="text-xs ml-2" style={{ color: '#9CA3AF' }}>/mo</span>
              </div>
              <ul className="space-y-1.5 mb-5">
                <li className="flex items-center gap-2 text-sm" style={{ color: '#D1D5DB' }}>
                  <Check size={14} className="shrink-0" style={{ color: '#D4AF37' }} /> 800+ VA conditions
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: '#D1D5DB' }}>
                  <Check size={14} className="shrink-0" style={{ color: '#D4AF37' }} /> Guided statements
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: '#D1D5DB' }}>
                  <Check size={14} className="shrink-0" style={{ color: '#D4AF37' }} /> Document vault
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: '#D1D5DB' }}>
                  <Check size={14} className="shrink-0" style={{ color: '#D4AF37' }} /> Symptom trackers
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: '#D1D5DB' }}>
                  <Check size={14} className="shrink-0" style={{ color: '#D4AF37' }} /> Cancel anytime
                </li>
              </ul>
              <Link
                to="/auth"
                className="block text-center rounded-full px-6 py-2.5 text-sm font-semibold text-black no-underline"
                style={{ background: GOLD_GRADIENT }}
              >
                Get Started — $9.99/mo
              </Link>
            </div>
          </motion.div>

          {/* Private Attorneys */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ y: -4 }}
            className="rounded-2xl p-px"
            style={{
              background: 'linear-gradient(135deg, rgba(107,114,128,0.3), rgba(107,114,128,0.08), rgba(107,114,128,0.3))',
            }}
          >
            <div className="rounded-[15px] h-full p-6" style={{ backgroundColor: '#111111' }}>
              <h3 className="text-base font-semibold mb-3" style={{ color: '#6B7280' }}>Private Attorneys</h3>
              <div className="mb-3">
                <span className="text-2xl font-bold text-white">20–33%</span>
                <span className="text-xs ml-2" style={{ color: '#6B7280' }}>of back pay</span>
              </div>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
                  <span style={{ color: '#6B7280' }}>&#10005;</span> Contingency fees from your award
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
                  <span style={{ color: '#6B7280' }}>&#10005;</span> Can total thousands of dollars
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
                  <span style={{ color: '#6B7280' }}>&#10005;</span> Minimal help organizing evidence
                </li>
              </ul>
            </div>
          </motion.div>
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
            style={{ color: '#D4AF37' }}
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
                        style={{ color: '#D4AF37' }}
                      >
                        {group.category}
                      </p>
                      <ul className="space-y-1.5">
                        {group.features.map((f) => (
                          <li key={f} className="flex items-center gap-2.5 text-sm">
                            <Check size={14} className="shrink-0" style={{ color: '#D4AF37' }} />
                            <span style={{ color: '#D1D5DB' }}>{f}</span>
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
