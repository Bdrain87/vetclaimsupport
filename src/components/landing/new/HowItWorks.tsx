import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  GOLD_GRADIENT_TEXT,
  HEADING_H2_STYLE,
  HEADING_H3_STYLE,
  PILL_STYLE,
  CARD_STYLE,
  CARD_SHADOW,
  SECTION_TOP_GLOW_GOLD,
  EASE_SMOOTH,
  cardRevealRotate,
  staggerContainerSlow,
  hoverLift,
} from '@/lib/landing-animations';

const STEPS = [
  {
    num: '01',
    title: 'Enter Your Service Details',
    desc: 'MOS, duty stations, deployments, combat zones, and exposures. We help you organize your service history and identify conditions you may want to research further.',
  },
  {
    num: '02',
    title: 'Organize Your Documentation',
    desc: 'For each condition, organize your medical records, buddy statements, and supporting documents in one place.',
  },
  {
    num: '03',
    title: 'Prep, Track & Generate',
    desc: 'Use health trackers to log symptoms mapped to rating criteria. Generate supporting documents and statements. Prepare for your C&P exam.',
  },
  {
    num: '04',
    title: 'Export and Review',
    desc: 'Export your organized notes, drafted statements, and tracked health data to review with a VA-accredited VSO or representative before filing.',
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const bgNumY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="relative py-12 md:py-16 overflow-hidden"
      style={{ backgroundColor: '#000000', scrollMarginTop: '5rem' }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[200px] pointer-events-none"
        style={{ background: SECTION_TOP_GLOW_GOLD }}
      />

      <motion.div
        className="relative z-10 text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: EASE_SMOOTH }}
      >
        <span style={PILL_STYLE}>How It Works</span>
      </motion.div>

      <motion.h2
        className="relative z-10 text-4xl md:text-5xl lg:text-6xl text-white text-center mb-4"
        style={HEADING_H2_STYLE}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE_SMOOTH }}
      >
        From Overwhelmed to{' '}
        <span style={GOLD_GRADIENT_TEXT}>Organized</span>
      </motion.h2>

      <motion.p
        className="relative z-10 text-center text-lg md:text-xl mb-20 max-w-2xl mx-auto px-4"
        style={{ color: '#9CA3AF' }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1, ease: EASE_SMOOTH }}
      >
        Get organized before you even sit down with a representative.
      </motion.p>

      <motion.div
        className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6"
        variants={staggerContainerSlow}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {STEPS.map((step) => (
          <motion.div
            key={step.num}
            variants={cardRevealRotate}
            whileHover={hoverLift}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden cursor-default group"
            style={{
              ...CARD_STYLE,
              padding: '32px',
              boxShadow: CARD_SHADOW,
            }}
          >
            <motion.span
              className="absolute -right-2 -top-4 text-[120px] md:text-[150px] font-black leading-none pointer-events-none select-none"
              style={{
                color: 'transparent',
                WebkitTextStroke: '1px rgba(255, 255, 255, 0.04)',
                y: bgNumY,
              }}
            >
              {step.num}
            </motion.span>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(191, 149, 63, 0.1)',
                    border: '1px solid rgba(191, 149, 63, 0.2)',
                  }}
                >
                  <span className="text-sm font-semibold" style={{ color: '#BF953F' }}>
                    {step.num}
                  </span>
                </div>
                <span
                  className="text-xs font-medium tracking-widest uppercase"
                  style={{ color: 'rgba(255, 255, 255, 0.4)' }}
                >
                  Step {step.num}
                </span>
              </div>

              <h3
                className="text-xl md:text-2xl text-white mb-3 group-hover:text-[#FCF6BA] transition-colors duration-300"
                style={HEADING_H3_STYLE}
              >
                {step.title}
              </h3>
              <p className="text-[15px] leading-relaxed" style={{ color: '#9CA3AF' }}>
                {step.desc}
              </p>
            </div>

            <div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(191, 149, 63, 0.2), transparent)' }}
            />

            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                borderRadius: '24px',
                background: 'radial-gradient(ellipse at 50% 100%, rgba(191, 149, 63, 0.04) 0%, transparent 60%)',
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
