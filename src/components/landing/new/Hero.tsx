import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  GOLD_GRADIENT_TEXT,
  HEADING_H1_STYLE,
  PILL_STYLE,
  LANDING_BG,
  fadeInUp,
  staggerContainer,
} from '@/lib/landing-animations';
import { OrbitButton } from './OrbitButton';

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: LANDING_BG,
        minHeight: 'calc(100vh - 4rem)',
        maxHeight: '900px',
      }}
    >
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: bgY,
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(197,165,90,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(197,165,90,0.05) 0%, transparent 50%),
            ${LANDING_BG}
          `,
        }}
      />

      {/* Centered content */}
      <div
        className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex items-center justify-center"
        style={{ minHeight: 'calc(100vh - 4rem)', maxHeight: '900px' }}
      >
        <motion.div
          className="flex flex-col items-center text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Pill */}
          <motion.div variants={fadeInUp}>
            <span style={PILL_STYLE}>
              VETERAN-BUILT&nbsp;&nbsp;&middot;&nbsp;&nbsp;85+ AI TOOLS
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-white mt-6 mb-4"
            style={{
              ...HEADING_H1_STYLE,
              fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              fontWeight: 700,
            }}
            variants={fadeInUp}
          >
            Prepare your VA claim
            <br />
            <span style={GOLD_GRADIENT_TEXT}>with confidence.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="max-w-2xl mb-10"
            style={{
              color: 'rgba(255, 255, 255, 0.70)',
              fontSize: 'clamp(1.05rem, 1.4vw, 1.3rem)',
              lineHeight: 1.6,
            }}
            variants={fadeInUp}
          >
            All 70 VA DBQs, health tracking, and AI-powered claim preparation in one place.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-3"
            variants={fadeInUp}
          >
            <OrbitButton to="/auth" className="px-8 py-3.5 text-base">
              Start Free
            </OrbitButton>
            <motion.button
              onClick={scrollToHowItWorks}
              className="inline-block px-8 py-3.5 text-base font-semibold text-white bg-transparent cursor-pointer"
              style={{
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.20)',
                transition: 'border-color 150ms ease-out',
              }}
              whileHover={{
                y: -2,
                borderColor: 'rgba(255, 255, 255, 0.40)',
              }}
              whileTap={{ y: 0 }}
            >
              See How It Works
            </motion.button>
          </motion.div>

          {/* Micro-text */}
          <motion.p
            className="mt-4 text-sm"
            style={{ color: 'rgba(255, 255, 255, 0.40)' }}
            variants={fadeInUp}
          >
            No credit card required&nbsp;&nbsp;&middot;&nbsp;&nbsp;From $14.99/mo
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
