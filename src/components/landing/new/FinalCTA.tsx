import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  GOLD_GRADIENT,
  GOLD_GRADIENT_TEXT,
  HEADING_H2_STYLE,
  PILL_STYLE,
  EASE_SMOOTH,
  LANDING_BG,
  TEXT_BRIGHT,
} from '@/lib/landing-animations';
import { MagneticButton } from './MagneticButton';

export function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.1]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 0.5, 0.7, 0.2]);

  return (
    <section
      ref={sectionRef}
      className="relative py-14 md:py-20 overflow-hidden"
      style={{ backgroundColor: LANDING_BG }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          scale: bgScale,
          background: `
            radial-gradient(ellipse at 50% 50%, rgba(197,165,90,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 80%, rgba(197,165,90,0.04) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 20%, rgba(197,165,90,0.04) 0%, transparent 40%)
          `,
        }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          opacity: glowOpacity,
          background: 'radial-gradient(circle, rgba(197,165,90,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, duration: 0.8 }}
        >
          <span style={PILL_STYLE}>Get Started Today</span>
        </motion.div>

        <motion.h2
          className="text-4xl md:text-5xl text-white mb-6"
          style={HEADING_H2_STYLE}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE_SMOOTH }}
        >
          Start Building{' '}
          <span className="block md:inline" style={GOLD_GRADIENT_TEXT}>
            Your Strongest Claim
          </span>
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl mb-10 text-center"
          style={{ color: TEXT_BRIGHT }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE_SMOOTH }}
        >
          Your strongest claim starts with preparation. Start building yours today.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <MagneticButton>
            <motion.div
              className="inline-block"
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 40px rgba(197, 165, 90, 0.35), 0 0 80px rgba(197, 165, 90, 0.15)',
              }}
              whileTap={{ scale: 0.97 }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(197, 165, 90, 0.08)',
                  '0 0 40px rgba(197, 165, 90, 0.2)',
                  '0 0 20px rgba(197, 165, 90, 0.08)',
                ],
              }}
              transition={{
                boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              }}
              style={{ borderRadius: '9999px' }}
            >
              <Link
                to="/auth"
                className="inline-block px-12 py-4 text-lg font-semibold text-black no-underline"
                style={{ background: GOLD_GRADIENT, borderRadius: '9999px' }}
              >
                Start Free
              </Link>
            </motion.div>
          </MagneticButton>
        </motion.div>

        <motion.p
          className="text-center mt-5 text-sm"
          style={{ color: TEXT_BRIGHT, opacity: 0.6 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          $14.99/mo for full access. Cancel anytime.
        </motion.p>

      </div>
    </section>
  );
}
