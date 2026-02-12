import { useEffect } from 'react';
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
  'Priority Support',
];

const SHIMMER_CSS = `
@keyframes shimmer-border {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
`;

function FreeCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{
        y: -4,
        boxShadow: '0 0 20px rgba(34,197,94,0.15), 0 12px 40px rgba(0,0,0,0.3)',
      }}
      transition={{ duration: 0.25 }}
      className="relative rounded-2xl p-px"
      style={{
        background: 'linear-gradient(135deg, rgba(34,197,94,0.3), rgba(34,197,94,0.08), rgba(34,197,94,0.3))',
      }}
    >
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
        y: -4,
        boxShadow: '0 0 30px rgba(197,164,66,0.2), 0 12px 40px rgba(0,0,0,0.3)',
      }}
      transition={{ duration: 0.25 }}
      className="relative rounded-2xl p-px overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(197,164,66,0.5), rgba(197,164,66,0.12), rgba(197,164,66,0.5))',
      }}
    >
      {/* Shimmer sweep across border */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, transparent 35%, rgba(245,214,128,0.5) 50%, transparent 65%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer-border 4s ease-in-out infinite',
        }}
      />
      {/* Soft breathing glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: [
            '0 0 15px rgba(197,164,66,0.08)',
            '0 0 30px rgba(197,164,66,0.18)',
            '0 0 15px rgba(197,164,66,0.08)',
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
    <section id="pricing" className="py-20 px-4" style={{ backgroundColor: '#000000' }}>
      <div className="max-w-4xl mx-auto">

        <motion.h2
          className="text-center text-3xl md:text-5xl text-white mb-4"
          style={{
            letterSpacing: '-0.025em',
            fontWeight: 500,
            lineHeight: 1.15,
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Simple, Transparent Pricing
        </motion.h2>
        <motion.p
          className="text-center mb-12 text-lg"
          style={{ color: '#9CA3AF' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Affordable preparation tools, with a free plan to get started.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Free plan */}
          <FreeCard>
            <div className="p-6 flex flex-col h-full">
              <h3 className="text-xl font-semibold text-white mb-1">Free</h3>
              <div className="mb-5">
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
              <ul className="space-y-2.5 mb-6">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check size={16} style={{ color: '#22C55E' }} className="shrink-0" />
                    <span style={{ color: '#D1D5DB' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/app"
                className="mt-auto block text-center rounded-full px-5 py-2.5 text-sm font-semibold no-underline"
                style={{
                  background: 'linear-gradient(135deg, #4ade80 0%, #22C55E 50%, #16a34a 100%)',
                  color: '#000000',
                }}
              >
                Get Started Free
              </Link>
            </div>
          </FreeCard>

          {/* Premium plan */}
          <PremiumCard>
            <div className="p-6 flex flex-col h-full relative">
              <div
                className="absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-bl-lg rounded-tr-[15px]"
                style={{
                  background: 'linear-gradient(135deg, #E8C560 0%, #C5A442 40%, #A38A35 70%, #C5A442 100%)',
                  color: '#000000',
                }}
              >
                Best Value
              </div>

              <motion.div
                className="absolute top-3 left-0 px-2.5 py-0.5 text-[10px] font-bold uppercase"
                style={{
                  background: '#EF4444',
                  color: '#FFFFFF',
                  borderRadius: '0 4px 4px 0',
                }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                Launch Sale
              </motion.div>

              <h3 className="text-xl font-semibold text-white mb-1 mt-1">Premium</h3>
              <div className="mb-5">
                <span
                  className="text-base line-through mr-2"
                  style={{ color: '#6B7280' }}
                >
                  $19.99
                </span>
                <span
                  className="text-3xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #E8C560 0%, #C5A442 40%, #A38A35 70%, #C5A442 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  $4.99
                </span>
                <span className="text-sm ml-2" style={{ color: '#9CA3AF' }}>/mo</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {PREMIUM_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check size={16} style={{ color: '#C5A442' }} className="shrink-0" />
                    <span style={{ color: '#D1D5DB' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/app"
                className="mt-auto block text-center rounded-full px-5 py-2.5 text-sm font-semibold text-black no-underline"
                style={{
                  background: 'linear-gradient(135deg, #E8C560 0%, #C5A442 40%, #A38A35 70%, #C5A442 100%)',
                }}
              >
                Go Premium — $4.99/mo
              </Link>
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
          VCS is an educational and organizational tool, not a law firm, claims agent, or filing service.
          We do not file claims on your behalf and do not guarantee any outcomes.
          Always consult a free VA-accredited VSO or attorney for claims filing assistance.
        </motion.p>

      </div>
    </section>
  );
}
