import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GOLD_GRADIENT_TEXT, HEADING_H1_STYLE, GOLD_GRADIENT } from '@/lib/landing-animations';

const ROTATING_WORDS = ['Organized', 'Documented', 'Prepared', 'Ready'];
const CYCLE_MS = 3000;

const TRUST_ITEMS = [
  'Built by a 100% P&T Veteran',
  '800+ VA Conditions Covered',
  'Bank-Level Encryption',
  'No Data Sold',
];

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
      className="relative flex flex-col items-center justify-center overflow-hidden"
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
            background: 'linear-gradient(90deg, #C8A020 0%, #ECC440 20%, #FFE566 50%, #ECC440 80%, #C8A020 100%)',
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

        {/* Main heading — outcome-driven */}
        <motion.h1
          className="text-4xl md:text-6xl leading-tight text-white mb-6"
          style={HEADING_H1_STYLE}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Organize Your Evidence.{' '}
          <br className="hidden sm:inline" />
          File Your Claim{' '}
          <span className="inline-block min-w-[160px] sm:min-w-[220px]">
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

        {/* Subtitle — contrasts VCS against $4K–$6K claim companies */}
        <motion.p
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10"
          style={{ color: '#D1D5DB' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Track symptoms, generate statements, and build your claim packet — for $9.99 instead of the $4,000–$6,000 that claim companies charge.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 30px rgba(236,196,64,0.5), 0 0 60px rgba(236,196,64,0.2)',
            }}
            whileTap={{ scale: 0.97 }}
            style={{ borderRadius: '9999px' }}
          >
            <Link
              to="/auth"
              className="inline-block rounded-full px-10 py-4 text-lg font-semibold text-black no-underline"
              style={{
                background: GOLD_GRADIENT,
                boxShadow: '0 0 20px rgba(236,196,64,0.3)',
              }}
            >
              Get Started — $9.99
            </Link>
          </motion.div>
          <motion.button
            onClick={scrollToHowItWorks}
            className="inline-block rounded-full px-8 py-4 text-lg font-semibold text-white bg-transparent border border-white/30 cursor-pointer hover:border-white/60 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            See How It Works
          </motion.button>
        </motion.div>

        {/* Trust Bar */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          {TRUST_ITEMS.map((item, i) => (
            <span key={item} className="flex items-center gap-2 text-xs sm:text-sm" style={{ color: '#9CA3AF' }}>
              {i > 0 && (
                <span
                  className="hidden sm:inline-block w-1 h-1 rounded-full"
                  style={{ backgroundColor: '#D4AF37' }}
                />
              )}
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
