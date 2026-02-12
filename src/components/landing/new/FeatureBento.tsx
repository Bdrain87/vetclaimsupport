import { motion } from 'framer-motion';
import {
  fadeInUp,
  staggerContainer,
  cardRevealScale,
  HEADING_H2_STYLE,
  PILL_STYLE,
  CARD_STYLE,
  CARD_SHADOW,
  SECTION_TOP_GLOW,
  EASE_SMOOTH,
  hoverLift,
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

interface BentoCard {
  Icon: typeof Brain;
  title: string;
  desc: string;
  span: 1 | 2;
}

const CARDS: BentoCard[] = [
  {
    Icon: Brain,
    title: 'Service History Organizer',
    desc: "Enter your service history and organize your conditions. Our tools cross-reference your entries against our database to surface potential secondary connections for your research.",
    span: 2,
  },
  {
    Icon: Stethoscope,
    title: 'C&P Exam Prep',
    desc: "Review commonly used DBQs, range-of-motion benchmarks, and typical interview questions for your conditions. Walk into your exam prepared and informed.",
    span: 2,
  },
  {
    Icon: PenTool,
    title: 'Document Generators',
    desc: 'Generate draft personal statements, buddy statements, stressor statements, and more. All formatted to help you prepare your claim documentation.',
    span: 1,
  },
  {
    Icon: FileSearch,
    title: 'Secondary Condition Finder',
    desc: 'Search our database of conditions with mapped secondary connections. Discover conditions linked to your primary disabilities that may be worth researching further.',
    span: 1,
  },
  {
    Icon: Target,
    title: 'Health Trackers',
    desc: 'Log symptoms, sleep, migraines, medications, medical visits, and exposures. Every tracker maps to VA rating criteria so your daily logs become organized supporting documentation.',
    span: 2,
  },
  {
    Icon: DollarSign,
    title: 'Compensation Estimator',
    desc: "Estimate potential compensation scenarios based on your effective date, dependents, and projected rating. For informational and educational purposes only.",
    span: 1,
  },
  {
    Icon: Zap,
    title: 'VA-Speak Translator',
    desc: 'Paste any VA letter, CFR section, or rating decision. Get plain English instantly. Finally understand what they actually said.',
    span: 1,
  },
  {
    Icon: Shield,
    title: 'Privacy-First Architecture',
    desc: 'All data stored locally on your device by default. Optional encrypted cloud sync available with a premium account. We never sell your data.',
    span: 2,
  },
];

export function FeatureBento() {
  return (
    <section id="features" className="py-20 md:py-28" style={{ backgroundColor: '#111111', scrollMarginTop: '5rem' }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Pill label */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span style={PILL_STYLE}>Our Toolkit</span>
        </motion.div>

        <motion.h2
          className="text-3xl md:text-4xl text-white text-center mb-4"
          style={HEADING_H2_STYLE}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE_SMOOTH }}
        >
          Tools That Help You Prepare
        </motion.h2>
        <motion.p
          className="text-center mb-16 text-lg max-w-2xl mx-auto"
          style={{ color: '#9CA3AF' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          From evidence organization to document generation — everything you need in one app.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {CARDS.map((card) => (
            <motion.div
              key={card.title}
              variants={cardRevealScale}
              whileHover={{
                y: -6,
                scale: 1.02,
                boxShadow: '0 0 30px rgba(197, 164, 66, 0.12), 0 15px 40px rgba(0, 0, 0, 0.3)',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`relative overflow-hidden group ${
                card.span === 2 ? 'md:col-span-2' : ''
              }`}
              style={{
                ...CARD_STYLE,
                padding: '24px 32px',
                boxShadow: CARD_SHADOW,
              }}
            >
              <div className="relative z-10">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: 'rgba(197, 164, 66, 0.1)',
                    border: '1px solid rgba(197, 164, 66, 0.2)',
                  }}
                >
                  <card.Icon size={20} style={{ color: '#C5A442' }} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#E8C560] transition-colors duration-300">{card.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>
                  {card.desc}
                </p>
              </div>
              {/* Hover glow overlay */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at 50% 100%, rgba(197, 164, 66, 0.06) 0%, transparent 60%)',
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
