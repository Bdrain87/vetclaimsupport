import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer } from '@/lib/landing-animations';
import { Check } from 'lucide-react';

const FREE_FEATURES = [
  'Rating Calculator',
  '3 Condition Limit',
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

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-black text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Start Free. Upgrade When You&apos;re Ready.
        </motion.h2>

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
            className="rounded-2xl border border-gray-200 p-8 bg-white"
          >
            <h3 className="text-2xl font-bold text-black mb-1">Free</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-black">$0</span>
            </div>
            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <Check size={18} style={{ color: '#6B7280' }} className="shrink-0" />
                  <span style={{ color: '#374151' }}>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/app"
              className="block text-center rounded-full px-6 py-3 font-semibold text-black bg-white border border-black no-underline hover:bg-gray-50 transition-colors"
            >
              Get Started
            </Link>
          </motion.div>

          {/* Premium */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="rounded-2xl p-8 border relative"
            style={{
              backgroundColor: '#1a1a1a',
              borderColor: 'rgba(197,164,66,0.3)',
              boxShadow: '0 0 40px rgba(197,164,66,0.08)',
            }}
          >
            {/* Badge */}
            <span
              className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-black"
              style={{
                background:
                  'linear-gradient(135deg, #E8C560 0%, #C5A442 40%, #A38A35 70%, #C5A442 100%)',
              }}
            >
              RECOMMENDED
            </span>

            <h3 className="text-2xl font-bold text-white mb-1">Premium</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$9.99</span>
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
              className="block text-center rounded-full px-6 py-3 font-semibold text-black no-underline"
              style={{
                background:
                  'linear-gradient(135deg, #E8C560 0%, #C5A442 40%, #A38A35 70%, #C5A442 100%)',
              }}
            >
              Go Premium
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
