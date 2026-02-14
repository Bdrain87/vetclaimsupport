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
            radial-gradient(ellipse at 50% 50%, rgba(197,164,66,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 80%, rgba(197,164,66,0.04) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 20%, rgba(197,164,66,0.04) 0%, transparent 40%)
          `,
        }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          opacity: glowOpacity,
          background: 'radial-gradient(circle, rgba(197,164,66,0.06) 0%, transparent 70%)',
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
          Ready to Take Control{' '}
          <span className="block md:inline" style={GOLD_GRADIENT_TEXT}>
            of Your Claim?
          </span>
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl mb-4 text-center"
          style={{ color: '#D1D5DB' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE_SMOOTH }}
        >
          All the preparation tools you need. Zero upfront cost.
        </motion.p>

        <motion.p
          className="text-sm mb-10 text-center"
          style={{ color: '#6B7280' }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE_SMOOTH }}
        >
          Privacy-first &bull; Free plan available &bull; Veteran founded
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
              boxShadow: '0 0 40px rgba(197, 164, 66, 0.35), 0 0 80px rgba(197, 164, 66, 0.15)',
            }}
            whileTap={{ scale: 0.97 }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(197, 164, 66, 0.08)',
                '0 0 40px rgba(197, 164, 66, 0.2)',
                '0 0 20px rgba(197, 164, 66, 0.08)',
              ],
            }}
            transition={{
              boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{ borderRadius: '9999px' }}
          >
            <Link
              to="/app"
              className="inline-block px-12 py-4 text-lg font-semibold text-black no-underline"
              style={{ background: GOLD_GRADIENT, borderRadius: '9999px' }}
            >
              Get Started Free
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-2 flex-wrap mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <p className="text-sm text-center" style={{ color: '#6B7280' }}>
            Premium from
          </p>
          <span className="text-sm" style={{ color: '#6B7280', textDecoration: 'line-through' }}>
            $19.99
          </span>
          <span
            className="text-sm font-semibold"
            style={{
              background: 'linear-gradient(135deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            $9.99
          </span>
          <motion.span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(197,164,66,0.15), rgba(197,164,66,0.05))',
              border: '1px solid rgba(197,164,66,0.3)',
              color: '#C5A442',
            }}
            animate={{
              boxShadow: [
                '0 0 5px rgba(197,164,66,0.2)',
                '0 0 15px rgba(197,164,66,0.5)',
                '0 0 5px rgba(197,164,66,0.2)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            limited launch price
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
