import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  GOLD_GRADIENT,
  GOLD_GRADIENT_TEXT,
  HEADING_H2_STYLE,
  PILL_STYLE,
  EASE_SMOOTH,
} from '@/lib/landing-animations';

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
      className="relative py-12 md:py-16 overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          scale: bgScale,
          background: `
            radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 80%, rgba(212,175,55,0.04) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 20%, rgba(212,175,55,0.04) 0%, transparent 40%)
          `,
        }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          opacity: glowOpacity,
          background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <span style={PILL_STYLE}>Get Started Today</span>
        </motion.div>

        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl text-white mb-6"
          style={HEADING_H2_STYLE}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_SMOOTH }}
        >
          Start Building{' '}
          <span className="block md:inline" style={GOLD_GRADIENT_TEXT}>
            Your Strongest Claim
          </span>
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl mb-10 text-center"
          style={{ color: '#D1D5DB' }}
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
          <motion.div
            className="inline-block"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 40px rgba(212, 175, 55, 0.35), 0 0 80px rgba(212, 175, 55, 0.15)',
            }}
            whileTap={{ scale: 0.97 }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(212, 175, 55, 0.08)',
                '0 0 40px rgba(212, 175, 55, 0.2)',
                '0 0 20px rgba(212, 175, 55, 0.08)',
              ],
            }}
            transition={{
              boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{ borderRadius: '9999px' }}
          >
            <Link
              to="/login"
              className="inline-block px-12 py-4 text-lg font-semibold text-black no-underline"
              style={{ background: GOLD_GRADIENT, borderRadius: '9999px' }}
            >
              Get Started Free
            </Link>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
