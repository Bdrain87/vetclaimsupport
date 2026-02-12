import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  HEADING_H2_STYLE,
  PILL_STYLE,
  CARD_STYLE,
  CARD_SHADOW,
  EASE_SMOOTH,
  GOLD_GRADIENT_TEXT,
} from '@/lib/landing-animations';
import {
  Brain,
  Shield,
  FileSearch,
  Stethoscope,
  PenTool,
  DollarSign,
  Target,
  Zap,
} from 'lucide-react';

const CARDS = [
  {
    Icon: Brain,
    title: 'Service History Organizer',
    desc: 'Enter your service history and organize your conditions. Our tools cross-reference your entries against our database to surface potential secondary connections for your research.',
  },
  {
    Icon: Stethoscope,
    title: 'C&P Exam Prep',
    desc: 'Review commonly used DBQs, range-of-motion benchmarks, and typical interview questions for your conditions. Walk into your exam prepared and informed.',
  },
  {
    Icon: PenTool,
    title: 'Document Generators',
    desc: 'Generate draft personal statements, buddy statements, stressor statements, and more. All formatted to help you prepare your claim documentation.',
  },
  {
    Icon: FileSearch,
    title: 'Secondary Condition Finder',
    desc: 'Search our database of conditions with mapped secondary connections. Discover conditions linked to your primary disabilities that may be worth researching further.',
  },
  {
    Icon: Target,
    title: 'Health Trackers',
    desc: 'Log symptoms, sleep, migraines, medications, medical visits, and exposures. Every tracker maps to VA rating criteria so your daily logs become organized supporting documentation.',
  },
  {
    Icon: DollarSign,
    title: 'Compensation Estimator',
    desc: 'Estimate potential compensation scenarios based on your effective date, dependents, and projected rating. For informational and educational purposes only.',
  },
  {
    Icon: Zap,
    title: 'VA-Speak Translator',
    desc: 'Paste any VA letter, CFR section, or rating decision. Get plain English instantly. Finally understand what they actually said.',
  },
  {
    Icon: Shield,
    title: 'Privacy-First Architecture',
    desc: 'All data stored locally on your device by default. Optional encrypted cloud sync available with a premium account. We never sell your data.',
  },
];

/* ────────────────────────────────────────────────
 * Individual stacking card
 * Each card is sticky — as you scroll, the next card
 * slides up and stacks on top of the previous one.
 * Cards scale down slightly once covered, creating depth.
 * ──────────────────────────────────────────────── */
function StackingCard({
  card,
  index,
  total,
}: {
  card: (typeof CARDS)[0];
  index: number;
  total: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start start', 'end start'],
  });

  // Scale down as the NEXT card scrolls over this one (depth effect)
  const targetScale = 1 - (total - index) * 0.015;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div
      ref={cardRef}
      style={{ height: '160px' }} /* scroll spacer — controls pacing between cards */
    >
      <motion.div
        className="sticky group cursor-default"
        style={{
          top: `calc(18vh + ${index * 28}px)`,
          scale,
          transformOrigin: 'top center',
        }}
      >
        <motion.div
          className="relative overflow-hidden rounded-2xl p-6 md:p-8"
          style={{
            ...CARD_STYLE,
            boxShadow: CARD_SHADOW,
          }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: EASE_SMOOTH }}
        >
          <div className="relative z-10 flex items-start gap-5">
            {/* Icon + number */}
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: 'rgba(197,164,66,0.1)',
                  border: '1px solid rgba(197,164,66,0.2)',
                }}
              >
                <card.Icon size={22} style={{ color: '#C5A442' }} />
              </div>
              <span
                className="text-[10px] font-medium tracking-widest uppercase"
                style={{ color: 'rgba(255,255,255,0.25)' }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            {/* Text */}
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-white mb-1.5 group-hover:text-[#E8C560] transition-colors duration-300">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>
                {card.desc}
              </p>
            </div>
          </div>

          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              borderRadius: '24px',
              background:
                'radial-gradient(ellipse at 50% 100%, rgba(197,164,66,0.06) 0%, transparent 60%)',
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ────────────────────────────────────────────────
 * FeatureBento — stacking cards section
 * ──────────────────────────────────────────────── */
export function FeatureBento() {
  return (
    <section
      id="features"
      style={{ backgroundColor: '#000000', scrollMarginTop: '5rem' }}
    >
      {/* Header */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-20 md:pt-28">
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE_SMOOTH }}
        >
          <span style={PILL_STYLE}>Our Toolkit</span>
        </motion.div>

        <motion.h2
          className="text-3xl md:text-5xl text-white mb-3"
          style={HEADING_H2_STYLE}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05, ease: EASE_SMOOTH }}
        >
          Tools That Help You{' '}
          <span style={GOLD_GRADIENT_TEXT}>Prepare</span>
        </motion.h2>

        <motion.p
          className="text-lg max-w-xl mb-12"
          style={{ color: '#9CA3AF' }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE_SMOOTH }}
        >
          From evidence organization to document generation — everything you need in one app.
        </motion.p>
      </div>

      {/* Stacking cards */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pb-[45vh]">
        {CARDS.map((card, i) => (
          <StackingCard
            key={card.title}
            card={card}
            index={i}
            total={CARDS.length}
          />
        ))}
      </div>
    </section>
  );
}
