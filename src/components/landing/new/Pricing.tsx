import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer } from '@/lib/landing-animations';
import { Check, AlertTriangle } from 'lucide-react';

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

/* ── Animated border wrapper ──
   Uses a spinning conic-gradient behind a 2px "gap" to create
   an animated glowing border that rotates continuously. */
function AnimatedBorderCard({
  children,
  color,
  className = '',
  hoverScale = false,
}: {
  children: React.ReactNode;
  color: 'red' | 'green' | 'gold';
  className?: string;
  hoverScale?: boolean;
}) {
  const gradients = {
    red: 'conic-gradient(from 0deg, transparent 0%, #EF4444 12%, #FF6B6B 25%, transparent 37%, transparent 62%, #EF4444 75%, #FF6B6B 87%, transparent 100%)',
    green: 'conic-gradient(from 0deg, transparent 0%, #22C55E 12%, #4ADE80 25%, transparent 37%, transparent 62%, #22C55E 75%, #4ADE80 87%, transparent 100%)',
    gold: 'conic-gradient(from 0deg, transparent 0%, #C5A442 10%, #F5D680 20%, #E8C560 30%, transparent 40%, transparent 60%, #C5A442 70%, #F5D680 80%, #E8C560 90%, transparent 100%)',
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
    gold: {
      boxShadow: [
        '0 0 20px rgba(197,164,66,0.25), 0 0 40px rgba(197,164,66,0.1)',
        '0 0 35px rgba(197,164,66,0.5), 0 0 70px rgba(197,164,66,0.2)',
        '0 0 20px rgba(197,164,66,0.25), 0 0 40px rgba(197,164,66,0.1)',
      ],
    },
  };

  const speeds = { red: 4, green: 5, gold: 3.5 };

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={hoverScale ? { scale: 1.02 } : undefined}
      transition={hoverScale ? { type: 'spring', stiffness: 300, damping: 20 } : undefined}
      className={`relative rounded-2xl p-[2px] overflow-hidden ${className}`}
    >
      {/* Spinning conic gradient — the animated border */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: '-40%',
          background: gradients[color],
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: speeds[color], repeat: Infinity, ease: 'linear' }}
      />
      {/* Outer glow pulse */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={glows[color]}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Inner content */}
      <div className="relative rounded-[14px] h-full" style={{ backgroundColor: '#1a1a1a' }}>
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
          className="text-center text-3xl md:text-4xl font-bold mb-4"
          style={{
            background: 'linear-gradient(135deg, #F5D680 0%, #C5A442 50%, #A38A35 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          The VA Claims Industry Exposed
        </motion.h2>
        <motion.p
          className="text-center mb-16 text-lg"
          style={{ color: '#9CA3AF' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Every year, veterans spend thousands on services that profit from confusion. There&apos;s a better way.
        </motion.p>

        {/* ── Competitor cards (RED animated borders) ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Claim Shark card */}
          <AnimatedBorderCard color="red">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={20} style={{ color: '#EF4444' }} />
                <h3 className="text-lg font-bold" style={{ color: '#EF4444' }}>Claim Shark</h3>
              </div>
              <p className="text-sm mb-4" style={{ color: '#9CA3AF' }}>
                Unaccredited claim filing companies that charge premium prices for basic paperwork assistance.
              </p>
              <div className="mb-3">
                <span className="text-3xl font-bold text-white">$4,000–$6,000</span>
                <span className="text-sm ml-2" style={{ color: '#9CA3AF' }}>typical cost</span>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm" style={{ color: '#9CA3AF' }}>
                  <span style={{ color: '#EF4444' }}>&#10005;</span> Often unaccredited by the VA
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: '#9CA3AF' }}>
                  <span style={{ color: '#EF4444' }}>&#10005;</span> Large upfront fees required
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: '#9CA3AF' }}>
                  <span style={{ color: '#EF4444' }}>&#10005;</span> No guarantee of better results
                </li>
              </ul>
            </div>
          </AnimatedBorderCard>

          {/* VA Attorney card */}
          <AnimatedBorderCard color="red">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={20} style={{ color: '#EF4444' }} />
                <h3 className="text-lg font-bold" style={{ color: '#EF4444' }}>VA Attorney</h3>
              </div>
              <p className="text-sm mb-4" style={{ color: '#9CA3AF' }}>
                Attorneys who take a percentage of your retroactive back pay after your claim is approved.
              </p>
              <div className="mb-3">
                <span className="text-3xl font-bold text-white">20–33%</span>
                <span className="text-sm ml-2" style={{ color: '#9CA3AF' }}>of your back pay</span>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm" style={{ color: '#9CA3AF' }}>
                  <span style={{ color: '#EF4444' }}>&#10005;</span> Takes a cut of money you earned
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: '#9CA3AF' }}>
                  <span style={{ color: '#EF4444' }}>&#10005;</span> Can cost thousands in back pay
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: '#9CA3AF' }}>
                  <span style={{ color: '#EF4444' }}>&#10005;</span> You do the prep work anyway
                </li>
              </ul>
            </div>
          </AnimatedBorderCard>
        </motion.div>

        {/* ── "OR" divider ── */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-12"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="h-px flex-1 max-w-[120px]" style={{ background: 'linear-gradient(to right, transparent, #C5A442)' }} />
          <span
            className="text-xl font-bold px-4 py-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #E8C560 0%, #C5A442 40%, #A38A35 70%, #C5A442 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            &mdash; OR &mdash;
          </span>
          <div className="h-px flex-1 max-w-[120px]" style={{ background: 'linear-gradient(to left, transparent, #C5A442)' }} />
        </motion.div>

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

          {/* Premium plan — GOLD animated border + BEST VALUE badge */}
          <AnimatedBorderCard color="gold" hoverScale className="flex flex-col">
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
          </AnimatedBorderCard>
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
          Competitor pricing reflects typical industry ranges based on publicly available information.
          Vet Claim Support is a preparation tool, not a law firm or claims filing service.
          We do not file claims on your behalf.
        </motion.p>

      </div>
    </section>
  );
}
