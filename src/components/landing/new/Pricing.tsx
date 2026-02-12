import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer } from '@/lib/landing-animations';
import { Check } from 'lucide-react';

const FREE_FEATURES = [
  'Rating Calculator',
  'VA-Speak Translator',
  'Claim Checklist',
  'Basic Condition Tracking',
];

const PREMIUM_FEATURES = [
  'Everything in Free',
  'Unlimited Conditions',
  'C&P Exam Prep',
  'Doctor Summary Generator',
  'Stressor Statement Builder',
  'Export to PDF',
  'Encrypted Cloud Sync',
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28" style={{ backgroundColor: '#000000', scrollMarginTop: '5rem' }}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Simple, Transparent Pricing
        </motion.h2>
        <motion.p
          className="text-center mb-16 text-lg"
          style={{ color: '#9CA3AF' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Start for free. Upgrade when you&apos;re ready.
        </motion.p>

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
            whileHover={{
              scale: 1.02,
              boxShadow: '0 0 25px rgba(197,164,66,0.25), 0 0 50px rgba(197,164,66,0.1)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="rounded-2xl p-8 relative overflow-hidden flex flex-col"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            {/* Gold glowing border */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ border: '2px solid #A38A35' }}
              animate={{
                boxShadow: [
                  '0 0 10px rgba(197,164,66,0.2), inset 0 0 10px rgba(197,164,66,0.03)',
                  '0 0 20px rgba(197,164,66,0.35), inset 0 0 15px rgba(197,164,66,0.06)',
                  '0 0 10px rgba(197,164,66,0.2), inset 0 0 10px rgba(197,164,66,0.03)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative flex flex-col flex-1">
              <h3 className="text-2xl font-bold text-white mb-1">Free</h3>
              <div className="mb-6">
                <span
                  className="text-4xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #E8C560 0%, #C5A442 40%, #A38A35 70%, #C5A442 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  $0
                </span>
                <span className="text-sm ml-2" style={{ color: '#9CA3AF' }}>forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <Check size={18} style={{ color: '#C5A442' }} className="shrink-0" />
                    <span style={{ color: '#D1D5DB' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/app"
                className="mt-auto block text-center rounded-full px-6 py-3 font-semibold text-black no-underline"
                style={{
                  background: 'linear-gradient(135deg, #E8C560 0%, #C5A442 40%, #A38A35 70%, #C5A442 100%)',
                }}
              >
                Get Started Free
              </Link>
            </div>
          </motion.div>

          {/* Premium */}
          <motion.div
            variants={fadeInUp}
            whileHover={{
              scale: 1.02,
              boxShadow: '0 0 30px rgba(197,164,66,0.35), 0 0 60px rgba(197,164,66,0.15)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="rounded-2xl p-8 relative overflow-hidden flex flex-col"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            {/* Brighter gold glowing border */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ border: '2px solid #C5A442' }}
              animate={{
                boxShadow: [
                  '0 0 12px rgba(197,164,66,0.3), 0 0 30px rgba(197,164,66,0.1), inset 0 0 12px rgba(197,164,66,0.05)',
                  '0 0 24px rgba(197,164,66,0.5), 0 0 50px rgba(197,164,66,0.2), inset 0 0 20px rgba(197,164,66,0.1)',
                  '0 0 12px rgba(197,164,66,0.3), 0 0 30px rgba(197,164,66,0.1), inset 0 0 12px rgba(197,164,66,0.05)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative flex flex-col flex-1">
              <h3 className="text-2xl font-bold text-white mb-1">Premium</h3>
              <div className="mb-6">
                <span
                  className="text-4xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #E8C560 0%, #C5A442 40%, #A38A35 70%, #C5A442 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  $9.99
                </span>
                <span style={{ color: '#9CA3AF' }}>/mo</span>
              </div>
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
                className="mt-auto block text-center rounded-full px-6 py-3 font-semibold text-black no-underline"
                style={{
                  background: 'linear-gradient(135deg, #E8C560 0%, #C5A442 40%, #A38A35 70%, #C5A442 100%)',
                }}
              >
                Go Premium — $9.99/mo
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Legal disclaimer */}
        <motion.p
          className="text-center text-xs mt-8"
          style={{ color: '#4B5563' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Prices may change. Subscriptions can be cancelled anytime. See Terms of Service for details.
        </motion.p>
      </div>
    </section>
  );
}
