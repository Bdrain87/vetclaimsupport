import { motion } from 'motion/react';
import {
  GOLD_GRADIENT_TEXT,
  HEADING_H2_STYLE,
  HEADING_H3_STYLE,
  CARD_STYLE,
  CARD_SHADOW,
  EASE_SMOOTH,
  cardRevealRotate,
  staggerContainerSlow,
  hoverLift,
  LANDING_BG,
  LANDING_BG_SUBTLE,
} from '@/lib/landing-animations';

const STEPS = [
  {
    num: '01',
    title: 'Map Your Service',
    desc: 'Enter your service history, conditions, and exposures. Document duty stations, deployments, and job codes in one place.',
  },
  {
    num: '02',
    title: 'Build Your Case',
    desc: 'Your evidence is organized by condition with supporting documentation. Link medical records, buddy statements, and personal statements.',
  },
  {
    num: '03',
    title: 'Prepare for the C&P Exam',
    desc: 'Practice questions, know what to expect, walk in feeling confident. Use health trackers to log symptoms mapped to rating criteria.',
  },
  {
    num: '04',
    title: 'Export Your Packet',
    desc: 'Everything organized, nothing missed. Export your complete packet and review it before bringing it to your VSO or representative.',
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-16 md:py-24 overflow-hidden"
      style={{ backgroundColor: LANDING_BG, scrollMarginTop: '5rem' }}
    >
      <motion.h2
        className="relative z-10 text-white text-center mb-16 px-4"
        style={{
          ...HEADING_H2_STYLE,
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE_SMOOTH }}
      >
        From First Login to{' '}
        <span style={GOLD_GRADIENT_TEXT}>Finished Packet</span>
      </motion.h2>

      <motion.div
        className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6"
        variants={staggerContainerSlow}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
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
              background: LANDING_BG_SUBTLE,
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: CARD_SHADOW,
              transition: 'border-color 200ms ease-out, transform 200ms ease-out, box-shadow 200ms ease-out',
            }}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(197, 165, 90, 0.1)',
                    border: '1px solid rgba(197, 165, 90, 0.2)',
                  }}
                >
                  <span className="text-sm font-semibold" style={{ background: 'linear-gradient(90deg, #A68B3C 0%, #C5A55A 25%, #D9BE6C 50%, #C5A55A 75%, #A68B3C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {step.num}
                  </span>
                </div>
              </div>

              <h3
                className="text-xl md:text-2xl text-white mb-3 group-hover:text-[#D9BE6C] transition-colors duration-300"
                style={HEADING_H3_STYLE}
              >
                {step.title}
              </h3>
              <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.80)' }}>
                {step.desc}
              </p>
            </div>

            <div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(197, 165, 90, 0.2), transparent)' }}
            />

            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                borderRadius: '16px',
                background: 'radial-gradient(ellipse at 50% 100%, rgba(197, 165, 90, 0.04) 0%, transparent 60%)',
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
