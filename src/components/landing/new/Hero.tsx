import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: bgY,
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(197,164,66,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(197,164,66,0.05) 0%, transparent 50%),
            #000000
          `,
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center py-32">
        {/* Intro line */}
        <motion.p
          className="uppercase tracking-[0.25em] text-sm font-medium mb-6"
          style={{
            background: 'linear-gradient(135deg, #E8C560 0%, #C5A442 40%, #A38A35 70%, #C5A442 100%)',
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
          className="text-4xl md:text-6xl font-bold leading-tight text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Prepare Your VA Claim with{' '}
          <span className="relative inline-block" style={{ minWidth: '280px', height: '1.2em' }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={ROTATING_WORDS[index]}
                className="absolute left-0 inline-block"
                style={{
                  background: 'linear-gradient(135deg, #F5D680 0%, #C5A442 50%, #A38A35 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
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
          The privacy-first toolkit that helps you organize evidence, understand
          VA language, and prepare the strongest possible claim.
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
                  'linear-gradient(135deg, #E8C560 0%, #C5A442 40%, #A38A35 70%, #C5A442 100%)',
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

        {/* Trust line */}
        <motion.p
          className="text-sm"
          style={{ color: '#9CA3AF' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          Free plan available &bull; Premium from $4.99/mo &bull; Veteran founded
        </motion.p>
      </div>
    </section>
  );
}
