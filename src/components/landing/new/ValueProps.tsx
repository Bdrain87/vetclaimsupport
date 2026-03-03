import { motion } from 'motion/react';
import {
  staggerContainer,
  cardRevealScale,
  HEADING_H2_STYLE,
  PILL_STYLE,
  EASE_SMOOTH,
  LANDING_BG_CARD,
  LANDING_BG_CARD_HOVER,
  TEXT_SECONDARY,
} from '@/lib/landing-animations';

function ClipboardIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C5A55A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

function TranslateIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C5A55A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8l6 6" />
      <path d="M4 14l6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="M22 22l-5-10-5 10" />
      <path d="M14 18h6" />
    </svg>
  );
}

function CalculatorIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C5A55A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="16" y1="14" x2="16" y2="18" />
      <line x1="8" y1="10" x2="8" y2="10.01" />
      <line x1="12" y1="10" x2="12" y2="10.01" />
      <line x1="16" y1="10" x2="16" y2="10.01" />
      <line x1="8" y1="14" x2="8" y2="14.01" />
      <line x1="12" y1="14" x2="12" y2="14.01" />
      <line x1="8" y1="18" x2="8" y2="18.01" />
      <line x1="12" y1="18" x2="12" y2="18.01" />
    </svg>
  );
}

const PROPS = [
  {
    Icon: ClipboardIcon,
    title: 'Build Your Case',
    desc: 'Track your conditions, log symptoms daily, and keep everything in one place. Built-in health trackers map directly to VA rating criteria.',
  },
  {
    Icon: TranslateIcon,
    title: 'Learn About VA Processes',
    desc: 'Use our tools to help interpret VA letters and decisions. Access our condition database and learn about the VA claims process.',
  },
  {
    Icon: CalculatorIcon,
    title: 'Estimate Your Rating',
    desc: 'Calculate your combined disability rating, estimate potential compensation, and understand how VA math works with bilateral factors.',
  },
];

export function ValueProps() {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: LANDING_BG_CARD }}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Pill label */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span style={PILL_STYLE}>Why Veterans Choose VCS</span>
        </motion.div>

        <motion.h2
          className="text-3xl md:text-4xl text-white text-center mb-4"
          style={HEADING_H2_STYLE}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE_SMOOTH }}
        >
          Prepare With Confidence
        </motion.h2>
        <motion.p
          className="text-center mb-16 text-lg max-w-2xl mx-auto"
          style={{ color: TEXT_SECONDARY }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Three ways to strengthen your claim — on your schedule, at your pace.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          {PROPS.map(({ Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={cardRevealScale}
              whileHover={{
                y: -6,
                scale: 1.02,
                boxShadow: '0 0 30px rgba(197, 165, 90, 0.12), 0 15px 40px rgba(0, 0, 0, 0.3)',
              }}
              className="relative text-center rounded-2xl p-8 overflow-hidden group"
              style={{
                backgroundColor: LANDING_BG_CARD_HOVER,
                border: '1px solid rgba(197, 165, 90, 0.1)',
              }}
            >
              <div className="relative z-10">
                <div className="flex justify-center mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                      background: 'rgba(197, 165, 90, 0.1)',
                      border: '1px solid rgba(197, 165, 90, 0.2)',
                    }}
                  >
                    <Icon />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#D9BE6C] transition-colors duration-300">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_SECONDARY }}>
                  {desc}
                </p>
              </div>
              {/* Hover glow overlay */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at 50% 100%, rgba(197, 165, 90, 0.06) 0%, transparent 60%)',
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
