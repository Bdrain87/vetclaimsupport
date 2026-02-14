import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GOLD_GRADIENT_TEXT, HEADING_H1_STYLE } from '@/lib/landing-animations';

const ROTATING_WORDS = ['Confidence', 'Clarity', 'Precision', 'Evidence'];
const CYCLE_MS = 3000;

export function Hero() {
  const [index, setIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const advance = useCallback(() => {
    setIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(advance, CYCLE_MS);
    return () => clearInterval(timer);
  }, [advance]);

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: bgY,
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(191,149,63,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(191,149,63,0.05) 0%, transparent 50%),
            #000000
          `,
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center py-16 md:py-20">
        {/* Intro line */}
        <motion.p
          className="uppercase tracking-[0.25em] text-sm font-medium mb-6"
          style={{
            background: 'linear-gradient(135deg, #FCF6BA 0%, #BF953F 40%, #AA771C 70%, #BF953F 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Built for Those Who Served
        </motion.p>

        {/* Main heading */}
        <motion.h1
          className="text-4xl md:text-6xl leading-tight text-white mb-6"
          style={HEADING_H1_STYLE}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Prepare Your VA Claim with{' '}
          <span className="inline-block" style={{ minWidth: '280px' }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={ROTATING_WORDS[index]}
                style={{
                  display: 'inline-block',
                  ...GOLD_GRADIENT_TEXT,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {ROTATING_WORDS[index]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10"
          style={{ color: '#D1D5DB' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Evidence packets, statement builders, exam prep, symptom tracking, and VA math. 45+ tools in one place. One workflow. One system. Generate shareable PDF packets in a click.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/app"
              className="inline-block rounded-full px-8 py-3 text-lg font-semibold text-black no-underline"
              style={{
                background:
                  'linear-gradient(135deg, #FCF6BA 0%, #BF953F 40%, #AA771C 70%, #BF953F 100%)',
              }}
            >
              Get Started Free
            </Link>
          </motion.div>
          <motion.button
            onClick={scrollToHowItWorks}
            className="inline-block rounded-full px-8 py-3 text-lg font-semibold text-white bg-transparent border border-white/30 cursor-pointer hover:border-white/60 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            See How It Works
          </motion.button>
        </motion.div>

        {/* Premium pricing box with dual glow */}
        <motion.div
          className="relative inline-block"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.9, type: 'spring', stiffness: 200 }}
        >
          <motion.div
            className="inline-flex flex-col items-center gap-2 px-8 py-4 rounded-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(191,149,63,0.08) 0%, rgba(191,149,63,0.02) 100%)',
              border: '1px solid rgba(191,149,63,0.2)',
            }}
            animate={{
              boxShadow: [
                '0 0 10px rgba(191,149,63,0.2), 0 0 25px rgba(191,149,63,0.12), 0 0 50px 8px rgba(255,255,255,0.04), 0 0 80px 16px rgba(255,255,255,0.02)',
                '0 0 18px rgba(191,149,63,0.35), 0 0 40px rgba(191,149,63,0.18), 0 0 65px 12px rgba(255,255,255,0.08), 0 0 100px 24px rgba(255,255,255,0.04)',
                '0 0 10px rgba(191,149,63,0.2), 0 0 25px rgba(191,149,63,0.12), 0 0 50px 8px rgba(255,255,255,0.04), 0 0 80px 16px rgba(255,255,255,0.02)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="relative z-10 flex items-center gap-3">
              <span className="text-sm font-medium" style={{ color: '#D1D5DB' }}>
                Get Premium
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-medium line-through" style={{ color: '#6B7280', textDecorationColor: '#EF4444' }}>
                  $19.99
                </span>
                <span className="text-lg" style={{ color: '#BF953F' }}>→</span>
                <span
                  className="text-xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #FCF6BA 0%, #BF953F 50%, #FCF6BA 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  $9.99
                </span>
              </div>
            </div>
            <span className="relative z-10 text-xs px-3 py-1 rounded-full" style={{
              background: 'linear-gradient(135deg, rgba(191,149,63,0.2), rgba(191,149,63,0.05))',
              border: '1px solid rgba(191,149,63,0.3)',
              color: '#E8C560',
              fontWeight: 600,
            }}>
              Limited Launch Price
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
