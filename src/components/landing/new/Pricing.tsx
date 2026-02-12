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

/* ── Standard animated border (red / green) ── */
function AnimatedBorderCard({
  children,
  color,
  className = '',
  hoverScale = false,
}: {
  children: React.ReactNode;
  color: 'red' | 'green';
  className?: string;
  hoverScale?: boolean;
}) {
  const gradients = {
    red: 'conic-gradient(from 0deg, transparent 0%, #EF4444 12%, #FF6B6B 25%, transparent 37%, transparent 62%, #EF4444 75%, #FF6B6B 87%, transparent 100%)',
    green: 'conic-gradient(from 0deg, transparent 0%, #22C55E 12%, #4ADE80 25%, transparent 37%, transparent 62%, #22C55E 75%, #4ADE80 87%, transparent 100%)',
  };
  const glows = {
    red: {
      boxShadow: [
        '0 0 15px rgba(239,68,68,0.2), 0 0 30px rgba(239,68,68,0.08)',
        '0 0 25px rgba(239,68,68,0.4), 0 0 50px rgba(239,68,68,0.15)',
        '0 0 15px rgba(239,68,68,0.2), 0 0 30px rgba(239,68,68,0.08)',
      ],
    },
    green: {
      boxShadow: [
        '0 0 15px rgba(34,197,94,0.15), 0 0 30px rgba(34,197,94,0.06)',
        '0 0 25px rgba(34,197,94,0.35), 0 0 50px rgba(34,197,94,0.12)',
        '0 0 15px rgba(34,197,94,0.15), 0 0 30px rgba(34,197,94,0.06)',
      ],
    },
  };
  const speeds = { red: 4, green: 5 };

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={hoverScale ? { scale: 1.02 } : undefined}
      transition={hoverScale ? { type: 'spring', stiffness: 300, damping: 20 } : undefined}
      className={`relative rounded-2xl p-[2px] overflow-hidden flex flex-col ${className}`}
    >
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ inset: '-40%', background: gradients[color] }}
        animate={{ rotate: 360 }}
        transition={{ duration: speeds[color], repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={glows[color]}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative rounded-[14px] flex-1 flex flex-col" style={{ backgroundColor: '#1a1a1a' }}>
        {children}
      </div>
    </motion.div>
  );
}

/* ── Premium animated border (gold) — spotlight comet sweep ──
   A concentrated bright white-gold comet chases around the border
   over a dim gold base. Completely different from the dual-beam
   spin used on the other cards. */
function PremiumBorderCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative rounded-2xl p-[2.5px] overflow-hidden flex flex-col ${className}`}
    >
      {/* Dim gold base border — always visible */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ border: '2.5px solid rgba(197,164,66,0.25)' }}
      />
      {/* Bright comet — single concentrated spotlight that sweeps */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: '-40%',
          background: 'conic-gradient(from 0deg, transparent 0%, transparent 60%, #A38A35 72%, #C5A442 80%, #F5D680 88%, #FFFFFF 93%, #F5D680 96%, transparent 100%)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
      />
      {/* Second comet offset — creates trailing afterglow */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: '-40%',
          background: 'conic-gradient(from 180deg, transparent 0%, transparent 70%, #C5A442 82%, #F5D680 90%, #E8C560 95%, transparent 100%)',
          opacity: 0.5,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
      />
      {/* Breathing glow — stronger than other cards */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: [
            '0 0 20px rgba(197,164,66,0.2), 0 0 40px rgba(197,164,66,0.08), inset 0 0 20px rgba(197,164,66,0.03)',
            '0 0 40px rgba(197,164,66,0.5), 0 0 80px rgba(197,164,66,0.2), inset 0 0 30px rgba(197,164,66,0.06)',
            '0 0 20px rgba(197,164,66,0.2), 0 0 40px rgba(197,164,66,0.08), inset 0 0 20px rgba(197,164,66,0.03)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative rounded-[14px] flex-1 flex flex-col" style={{ backgroundColor: '#1a1a1a' }}>
        {children}
      </div>
    </motion.div>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4" style={{ backgroundColor: '#000000' }}>
      <div className="max-w-6xl mx-auto">

        {/* ── Section heading ── */}
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
          className="text-center mb-16 text-lg"
          style={{ color: '#9CA3AF' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Affordable preparation tools, with a free plan to get started.
        </motion.p>

        {/* ── Plan cards (Green + Gold animated borders) ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Free plan — GREEN animated border */}
          <AnimatedBorderCard color="green" hoverScale className="flex flex-col">
            <div className="p-8 flex flex-col flex-1">
              <h3 className="text-2xl font-bold text-white mb-1">Free</h3>
              <div className="mb-6">
                <span
                  className="text-4xl font-bold"
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
                className="mt-auto block text-center rounded-full px-6 py-3 font-semibold no-underline"
                style={{
                  background: 'linear-gradient(135deg, #4ade80 0%, #22C55E 50%, #16a34a 100%)',
                  color: '#000000',
                }}
              >
                Get Started Free
              </Link>
            </div>
          </AnimatedBorderCard>

          {/* Premium plan — GOLD spotlight comet border + BEST VALUE badge */}
          <PremiumBorderCard>
            <div className="p-8 flex flex-col flex-1 relative">
              {/* BEST VALUE badge */}
              <div
                className="absolute top-0 right-0 px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-bl-xl rounded-tr-[14px]"
                style={{
                  background: 'linear-gradient(135deg, #E8C560 0%, #C5A442 40%, #A38A35 70%, #C5A442 100%)',
                  color: '#000000',
                }}
              >
                Best Value
              </div>

              {/* Sale ribbon */}
              <motion.div
                className="absolute top-4 left-0 px-3 py-1 text-xs font-bold uppercase"
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

              <h3 className="text-2xl font-bold text-white mb-1 mt-2">Premium</h3>
              <div className="mb-6">
                <span
                  className="text-lg line-through mr-2"
                  style={{ color: '#6B7280' }}
                >
                  $19.99
                </span>
                <span
                  className="text-4xl font-bold"
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
                Go Premium — $4.99/mo
              </Link>
            </div>
          </PremiumBorderCard>
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
          VCS is an educational and organizational tool, not a law firm, claims agent, or filing service.
          We do not file claims on your behalf and do not guarantee any outcomes.
          Always consult a free VA-accredited VSO or attorney for claims filing assistance.
        </motion.p>

      </div>
    </section>
  );
}
