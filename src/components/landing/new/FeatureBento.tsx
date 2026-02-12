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

export function FeatureBento() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Map vertical scroll → horizontal card translation
  const x = useTransform(scrollYProgress, [0, 1], ['2%', '-62%']);
  // Fade heading in at top, out at end
  const headerOpacity = useTransform(scrollYProgress, [0, 0.05, 0.85, 1], [0, 1, 1, 0]);
  // Progress bar width
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      id="features"
      ref={containerRef}
      className="relative"
      style={{ height: '280vh', backgroundColor: '#000000', scrollMarginTop: '5rem' }}
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* Header — fixed in place while cards scroll */}
        <motion.div
          className="px-6 sm:px-10 mb-8"
          style={{ opacity: headerOpacity }}
        >
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
            className="text-lg max-w-xl"
            style={{ color: '#9CA3AF' }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE_SMOOTH }}
          >
            From evidence organization to document generation — everything you need in one app.
          </motion.p>

          {/* Scroll progress bar */}
          <div
            className="mt-6 h-px w-48 rounded-full overflow-hidden"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                width: progressWidth,
                background: 'linear-gradient(90deg, #C5A442, #E8C560)',
              }}
            />
          </div>
        </motion.div>

        {/* Horizontal scrolling cards */}
        <motion.div
          className="flex gap-5 pl-6 sm:pl-10 pr-[20vw]"
          style={{ x }}
        >
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              className="flex-shrink-0 w-[300px] md:w-[360px] relative overflow-hidden group cursor-default"
              style={{
                ...CARD_STYLE,
                padding: '28px',
                boxShadow: CARD_SHADOW,
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: EASE_SMOOTH }}
              whileHover={{
                y: -8,
                scale: 1.03,
                boxShadow: '0 0 30px rgba(197,164,66,0.15), 0 20px 50px rgba(0,0,0,0.4)',
              }}
            >
              <div className="relative z-10">
                {/* Number badge */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(197,164,66,0.1)',
                      border: '1px solid rgba(197,164,66,0.2)',
                    }}
                  >
                    <card.Icon size={20} style={{ color: '#C5A442' }} />
                  </div>
                  <span
                    className="text-xs font-medium tracking-widest uppercase"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#E8C560] transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>
                  {card.desc}
                </p>
              </div>

              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  borderRadius: '24px',
                  background: 'radial-gradient(ellipse at 50% 100%, rgba(197,164,66,0.06) 0%, transparent 60%)',
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
