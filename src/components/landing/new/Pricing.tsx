import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer } from '@/lib/landing-animations';
import { Check, X, AlertTriangle } from 'lucide-react';

const FREE_FEATURES = [
  'Rating Calculator',
  '1 Condition Limit',
  'Basic VA-Speak Translation',
  'Claim Checklist',
];

const PREMIUM_FEATURES = [
  'Everything in Free',
  'Unlimited Conditions',
  'AI Claim Intelligence',
  'C&P Exam Prep',
  'Statement Generator',
  'Back Pay Estimator',
  'Encrypted Cloud Sync',
];

const SHARK_DOWNSIDES = [
  '$3,000 – $10,000+ upfront fees',
  'No guarantee of results',
  'Often unlicensed, unaccredited',
  'Pressure tactics and upsells',
];

const LAWYER_DOWNSIDES = [
  'Up to 33.3% of your back pay',
  'Can cost thousands on a winning claim',
  'Long wait times to get started',
  'You still do most of the prep work',
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28" style={{ backgroundColor: '#000000', scrollMarginTop: '5rem' }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Stop Overpaying. Start Preparing.
        </motion.h2>
        <motion.p
          className="text-center mb-16 text-lg"
          style={{ color: '#9CA3AF' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          See how we compare to the alternatives.
        </motion.p>

        {/* ── Competitor cards row ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Claim Sharks */}
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ border: '2px solid #EF4444' }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={20} style={{ color: '#EF4444' }} />
                <h3 className="text-xl font-bold text-white">&ldquo;Claim Sharks&rdquo;</h3>
              </div>
              <p className="text-sm mb-5" style={{ color: '#EF4444' }}>Unaccredited claim filing companies</p>
              <div className="mb-5">
                <span className="text-3xl font-bold" style={{ color: '#EF4444' }}>$3K–$10K+</span>
                <span className="text-sm ml-2" style={{ color: '#9CA3AF' }}>upfront</span>
              </div>
              <ul className="space-y-2.5">
                {SHARK_DOWNSIDES.map((d) => (
                  <li key={d} className="flex items-start gap-2.5">
                    <X size={16} style={{ color: '#EF4444' }} className="shrink-0 mt-0.5" />
                    <span className="text-sm" style={{ color: '#9CA3AF' }}>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* VA Lawyers */}
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ border: '2px solid #EF4444' }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            />
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={20} style={{ color: '#EF4444' }} />
                <h3 className="text-xl font-bold text-white">VA Lawyers</h3>
              </div>
              <p className="text-sm mb-5" style={{ color: '#EF4444' }}>Accredited attorneys</p>
              <div className="mb-5">
                <span className="text-3xl font-bold" style={{ color: '#EF4444' }}>Up to 33.3%</span>
                <span className="text-sm ml-2" style={{ color: '#9CA3AF' }}>of your back pay</span>
              </div>
              <ul className="space-y-2.5">
                {LAWYER_DOWNSIDES.map((d) => (
                  <li key={d} className="flex items-start gap-2.5">
                    <X size={16} style={{ color: '#EF4444' }} className="shrink-0 mt-0.5" />
                    <span className="text-sm" style={{ color: '#9CA3AF' }}>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Our pricing row ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Free */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="rounded-2xl p-8 relative overflow-hidden"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            {/* Green pulsing border */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ border: '2px solid #22C55E' }}
              animate={{
                boxShadow: [
                  '0 0 8px rgba(34,197,94,0.2)',
                  '0 0 20px rgba(34,197,94,0.4)',
                  '0 0 8px rgba(34,197,94,0.2)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative">
              <h3 className="text-2xl font-bold text-white mb-1">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold" style={{ color: '#22C55E' }}>$0</span>
                <span className="text-sm ml-2" style={{ color: '#9CA3AF' }}>forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <Check size={18} style={{ color: '#22C55E' }} className="shrink-0" />
                    <span style={{ color: '#D1D5DB' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/app"
                className="block text-center rounded-full px-6 py-3 font-semibold text-black no-underline"
                style={{
                  background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                }}
              >
                Get Started Free
              </Link>
            </div>
          </motion.div>

          {/* Premium */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="rounded-2xl p-8 relative overflow-hidden"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            {/* Gold pulsing border */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ border: '2px solid #C5A442' }}
              animate={{
                boxShadow: [
                  '0 0 8px rgba(197,164,66,0.2)',
                  '0 0 20px rgba(197,164,66,0.4)',
                  '0 0 8px rgba(197,164,66,0.2)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Sale ribbon */}
            <div
              className="absolute -right-8 top-5 rotate-45 px-10 py-1 text-xs font-bold text-black text-center"
              style={{
                background: 'linear-gradient(135deg, #E8C560 0%, #C5A442 40%, #A38A35 70%, #C5A442 100%)',
              }}
            >
              LAUNCH SALE
            </div>

            <div className="relative">
              {/* Badge */}
              <span
                className="inline-block rounded-full px-3 py-0.5 text-xs font-bold text-black mb-4"
                style={{
                  background: 'linear-gradient(135deg, #E8C560 0%, #C5A442 40%, #A38A35 70%, #C5A442 100%)',
                }}
              >
                BEST VALUE
              </span>

              <h3 className="text-2xl font-bold text-white mb-1">Premium</h3>
              <div className="mb-6 flex items-baseline gap-3">
                <span
                  className="text-xl line-through"
                  style={{ color: '#6B7280' }}
                >
                  $19.99
                </span>
                <span className="text-4xl font-bold" style={{ color: '#C5A442' }}>$9.99</span>
                <span style={{ color: '#9CA3AF' }}>/mo</span>
              </div>
              <p className="text-xs mb-5" style={{ color: '#C5A442' }}>
                Limited launch pricing
              </p>
              <ul className="space-y-3 mb-8">
                {PREMIUM_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <Check size={18} style={{ color: '#C5A442' }} className="shrink-0" />
                    <span style={{ color: '#D1D5DB' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/app"
                className="block text-center rounded-full px-6 py-3 font-semibold text-black no-underline"
                style={{
                  background: 'linear-gradient(135deg, #E8C560 0%, #C5A442 40%, #A38A35 70%, #C5A442 100%)',
                }}
              >
                Go Premium — $9.99/mo
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
