import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  GOLD_GRADIENT_TEXT,
  cardRevealRotate,
  staggerContainerSlow,
} from '@/lib/landing-animations';

const STEPS = [
  {
    num: '01',
    title: 'Enter Your Service Details',
    desc: 'MOS, duty stations, deployments, combat zones, and exposures. We help you organize your service history and identify conditions you may want to research further.',
    icon: '\u{1F396}\uFE0F',
    accent: '#C5A442',
  },
  {
    num: '02',
    title: 'Build Your Evidence Strategy',
    desc: 'For each condition, identify the medical records, buddy statements, and supporting documents that may strengthen your claim.',
    icon: '\u{1F4CB}',
    accent: '#22C55E',
  },
  {
    num: '03',
    title: 'Prep, Track & Generate',
    desc: 'Use health trackers to log symptoms mapped to rating criteria. Generate supporting documents and statements. Prepare for your C&P exam.',
    icon: '\u26A1',
    accent: '#3B82F6',
  },
  {
    num: '04',
    title: 'Submit with Confidence',
    desc: 'Export your organized evidence, formatted statements, and tracked health data. Everything in one place, ready for submission.',
    icon: '\u{1F3C6}',
    accent: '#C5A442',
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const bgNumY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="relative py-28 md:py-36 overflow-hidden"
      style={{
        backgroundColor: '#000000',
        scrollMarginTop: '5rem',
      }}
    >
      {/* Section pill label */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span
          className="inline-block px-5 py-2 rounded-full text-sm font-semibold tracking-wide uppercase"
          style={{
            background: 'rgba(197, 164, 66, 0.12)',
            color: '#C5A442',
            border: '1px solid rgba(197, 164, 66, 0.2)',
          }}
        >
          How It Works
        </span>
      </motion.div>

      {/* Main heading */}
      <motion.h2
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        From Overwhelmed to{' '}
        <span style={GOLD_GRADIENT_TEXT}>Organized</span>
      </motion.h2>

      <motion.p
        className="text-center text-lg md:text-xl mb-20 max-w-2xl mx-auto px-4"
        style={{ color: '#9CA3AF' }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        What takes months with a lawyer takes minutes with VCS.
      </motion.p>

      {/* Cards grid */}
      <motion.div
        className="mx-auto max-w-6xl px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        variants={staggerContainerSlow}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {STEPS.map((step) => (
          <motion.div
            key={step.num}
            variants={cardRevealRotate}
            whileHover={{
              y: -8,
              scale: 1.02,
              boxShadow: '0 0 40px rgba(197, 164, 66, 0.15), 0 20px 60px rgba(0, 0, 0, 0.4)',
              transition: { duration: 0.3 },
            }}
            className="relative rounded-2xl p-8 md:p-10 overflow-hidden cursor-default group"
            style={{
              backgroundColor: '#111111',
              border: '1px solid rgba(197, 164, 66, 0.15)',
            }}
          >
            {/* Large background number */}
            <motion.span
              className="absolute -right-4 -top-6 text-[120px] md:text-[160px] font-black leading-none pointer-events-none select-none"
              style={{
                color: 'transparent',
                WebkitTextStroke: '1px rgba(197, 164, 66, 0.08)',
                y: bgNumY,
              }}
            >
              {step.num}
            </motion.span>

            {/* Content */}
            <div className="relative z-10">
              {/* Icon + number row */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{
                    background: 'rgba(197, 164, 66, 0.1)',
                    border: '1px solid rgba(197, 164, 66, 0.2)',
                  }}
                >
                  {step.icon}
                </div>
                <span
                  className="text-sm font-bold tracking-widest uppercase"
                  style={{ color: step.accent }}
                >
                  Step {step.num}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-[#E8C560] transition-colors duration-300">
                {step.title}
              </h3>
              <p className="leading-relaxed" style={{ color: '#9CA3AF' }}>
                {step.desc}
              </p>
            </div>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${step.accent}, transparent)`,
                opacity: 0.4,
              }}
            />

            {/* Hover glow overlay */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 120%, rgba(197, 164, 66, 0.06) 0%, transparent 60%)',
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Connecting line between cards on desktop */}
      <div
        className="hidden md:block absolute left-1/2 top-[280px] bottom-[80px] w-px"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(197,164,66,0.15), transparent)' }}
      />
    </section>
  );
}
