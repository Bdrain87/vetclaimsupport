import { motion } from 'framer-motion';
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
} from '@/lib/landing-animations';

const STEPS = [
  {
    num: '01',
    title: 'Enter Your Service Details',
    desc: 'Job codes, duty stations, deployments, combat zones, and exposures. We help you document your service history and identify conditions you may want to research further.',
  },
  {
    num: '02',
    title: 'Upload & Link Documentation',
    desc: 'For each condition, link your medical records, buddy statements, and supporting documents in one place.',
  },
  {
    num: '03',
    title: 'Prep, Track & Generate',
    desc: 'Use health trackers to log symptoms mapped to rating criteria. Generate supporting documents and statements. Prepare for your C&P exam.',
  },
  {
    num: '04',
    title: 'Export and Review',
    desc: 'Export your notes, drafted statements, and tracked health data. Review everything before you file.',
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-[120px] overflow-hidden"
      style={{ backgroundColor: '#000000', scrollMarginTop: '5rem' }}
    >
      <motion.h2
        className="relative z-10 text-4xl md:text-5xl lg:text-6xl text-white text-center mb-16 px-4"
        style={HEADING_H2_STYLE}
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
              padding: '32px',
              boxShadow: CARD_SHADOW,
            }}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(191, 149, 63, 0.1)',
                    border: '1px solid rgba(191, 149, 63, 0.2)',
                  }}
                >
                  <span className="text-sm font-semibold" style={{ background: 'var(--gold-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {step.num}
                  </span>
                </div>
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
