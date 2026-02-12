import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GOLD_GRADIENT, GOLD_GRADIENT_TEXT } from '@/lib/landing-animations';

export function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.1]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 0.6, 0.8, 0.3]);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-36 overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Animated radial gradient background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          scale: bgScale,
          background: `
            radial-gradient(ellipse at 50% 50%, rgba(197,164,66,0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 80%, rgba(197,164,66,0.06) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 20%, rgba(197,164,66,0.06) 0%, transparent 40%)
          `,
        }}
      />

      {/* Animated glow ring */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          opacity: glowOpacity,
          background: 'radial-gradient(circle, rgba(197,164,66,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 text-center">
        {/* Pill label */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <span
            className="inline-block px-5 py-2 rounded-full text-sm font-semibold tracking-wide uppercase"
            style={{
              background: 'rgba(197, 164, 66, 0.12)',
              color: '#C5A442',
              border: '1px solid rgba(197, 164, 66, 0.25)',
            }}
          >
            Get Started Today
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Ready to Take Control{' '}
          <span className="block md:inline" style={GOLD_GRADIENT_TEXT}>
            of Your Claim?
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl mb-4 text-center"
          style={{ color: '#D1D5DB' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          All the preparation tools you need. Zero upfront cost.
        </motion.p>

        <motion.p
          className="text-sm mb-10 text-center"
          style={{ color: '#6B7280' }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Privacy-first &bull; Free plan available &bull; Veteran founded
        </motion.p>

        {/* CTA Button — with glow pulse */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <motion.div
            className="inline-block"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 40px rgba(197, 164, 66, 0.4), 0 0 80px rgba(197, 164, 66, 0.2)',
            }}
            whileTap={{ scale: 0.97 }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(197, 164, 66, 0.1)',
                '0 0 40px rgba(197, 164, 66, 0.25)',
                '0 0 20px rgba(197, 164, 66, 0.1)',
              ],
            }}
            transition={{
              boxShadow: {
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
            style={{ borderRadius: '9999px' }}
          >
            <Link
              to="/app"
              className="inline-block rounded-full px-12 py-4 text-xl font-bold text-black no-underline"
              style={{ background: GOLD_GRADIENT }}
            >
              Get Started Free
            </Link>
          </motion.div>
        </motion.div>

        <motion.p
          className="text-sm mt-8 text-center"
          style={{ color: '#9CA3AF' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Free plan available &bull; Premium from $4.99/mo
        </motion.p>
      </div>
    </section>
  );
}
