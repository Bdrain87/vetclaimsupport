import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GOLD_GRADIENT_TEXT, HEADING_H1_STYLE } from '@/lib/landing-animations';

const ROTATING_WORDS = ['Organized', 'Prepared', 'Confident', 'Ready'];
const CYCLE_MS = 3000;

const TRUST_ITEMS = [
  'YOUR DATA STAYS PRIVATE',
  'VETERAN-BUILT',
  '50+ CLAIM TOOLS',
  'ONE-TIME PURCHASE',
];

function AppStoreBadge() {
  return (
    <a
      href="https://apps.apple.com/us/app/vet-claim-support/id6744254580"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center opacity-70 hover:opacity-100 transition-opacity"
    >
      <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="40" rx="6" fill="#000" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <g fill="#fff">
          <path d="M24.769 20.3a4.949 4.949 0 0 1 2.356-4.152 5.066 5.066 0 0 0-3.99-2.158c-1.68-.176-3.308 1.005-4.164 1.005-.872 0-2.19-.988-3.608-.958a5.315 5.315 0 0 0-4.473 2.728c-1.934 3.348-.491 8.269 1.361 10.976.927 1.325 2.01 2.805 3.428 2.753 1.387-.058 1.905-.885 3.58-.885 1.658 0 2.144.885 3.59.852 1.489-.025 2.426-1.332 3.32-2.669a10.962 10.962 0 0 0 1.52-3.092 4.782 4.782 0 0 1-2.92-4.4zM22.037 12.21a4.872 4.872 0 0 0 1.115-3.49 4.957 4.957 0 0 0-3.208 1.66 4.636 4.636 0 0 0-1.144 3.36 4.1 4.1 0 0 0 3.237-1.53z" />
          <text x="38" y="15" fontSize="8" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="400" fill="rgba(255,255,255,0.8)" letterSpacing="0.03em">Download on the</text>
          <text x="38" y="28" fontSize="14" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" letterSpacing="-0.01em">App Store</text>
        </g>
      </svg>
    </a>
  );
}

function GooglePlayBadge() {
  return (
    <a
      href="#"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center opacity-70 hover:opacity-100 transition-opacity"
    >
      <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="40" rx="6" fill="#000" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <g>
          <path d="M21.2 18.07l-7.49-7.52a1.61 1.61 0 0 0-.47 1.14v16.62a1.6 1.6 0 0 0 .47 1.14l.08.07 8.38-8.38v-.2l-.97-.87z" fill="#4285F4" />
          <path d="M24.37 21.24l-3.17-3.17v-.2l3.17-3.17.07.04 3.76 2.13c1.07.61 1.07 1.61 0 2.22l-3.76 2.13-.07.02z" fill="#FBBC04" />
          <path d="M24.44 21.22l-3.24-3.24-7.96 7.96c.35.38.93.42 1.59.05l9.61-4.77" fill="#EA4335" />
          <path d="M24.44 14.74l-9.61-4.77c-.66-.37-1.24-.33-1.59.05l7.96 7.96 3.24-3.24z" fill="#34A853" />
          <text x="38" y="15" fontSize="8" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="400" fill="rgba(255,255,255,0.8)" letterSpacing="0.03em">GET IT ON</text>
          <text x="38" y="28" fontSize="13" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" fill="#fff" letterSpacing="-0.01em">Google Play</text>
        </g>
      </svg>
    </a>
  );
}

function WebAppBadge() {
  return (
    <Link
      to="/auth"
      className="inline-flex items-center opacity-70 hover:opacity-100 transition-opacity no-underline"
    >
      <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="40" rx="6" fill="#000" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <g fill="#fff">
          <circle cx="22" cy="20" r="9" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
          <ellipse cx="22" cy="20" rx="4" ry="9" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
          <line x1="13" y1="20" x2="31" y2="20" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
          <text x="38" y="15" fontSize="8" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="400" fill="rgba(255,255,255,0.8)" letterSpacing="0.03em">Available on the</text>
          <text x="38" y="28" fontSize="14" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" letterSpacing="-0.01em">Web</text>
        </g>
      </svg>
    </Link>
  );
}

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
      style={{ backgroundColor: '#0A0A0A' }}
    >
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: bgY,
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(197,165,90,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(197,165,90,0.05) 0%, transparent 50%),
            #0A0A0A
          `,
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center py-16 md:py-20">
        {/* Intro line */}
        <motion.p
          className="uppercase tracking-[0.25em] text-sm font-medium mb-6"
          style={{
            background: 'linear-gradient(90deg, #A68B3C 0%, #C5A55A 25%, #D9BE6C 50%, #C5A55A 75%, #A68B3C 100%)',
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

        {/* Main heading — Option A */}
        <motion.h1
          className="text-white mb-6"
          style={{
            ...HEADING_H1_STYLE,
            fontSize: 'clamp(2.75rem, 5.5vw, 5.375rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            fontWeight: 700,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Claims Built for Those Who Served.{' '}
          <br className="hidden sm:inline" />
          Be{' '}
          <span className="relative inline-block w-[160px] sm:w-[220px] text-left align-baseline">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={ROTATING_WORDS[index]}
                style={{
                  display: 'inline-block',
                  ...GOLD_GRADIENT_TEXT,
                }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24, position: 'absolute', left: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {ROTATING_WORDS[index]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="max-w-2xl mx-auto mb-10"
          style={{
            color: 'rgba(255, 255, 255, 0.80)',
            fontSize: 'clamp(1.125rem, 1.5vw, 1.375rem)',
            lineHeight: 1.6,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Organize your evidence. Build your case. Be prepared.
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
              y: -2,
              boxShadow: '0 8px 24px rgba(197, 165, 90, 0.35)',
            }}
            whileTap={{ y: 0 }}
            style={{ borderRadius: '12px' }}
          >
            <Link
              to="/auth"
              className="inline-block px-8 py-3.5 text-base font-semibold text-black no-underline"
              style={{
                background: 'linear-gradient(135deg, #A68B3C, #C5A55A, #D9BE6C, #C5A55A, #A68B3C)',
                borderRadius: '12px',
              }}
            >
              Get Started — $9.99
            </Link>
          </motion.div>
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

        {/* Trust Bar */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          {TRUST_ITEMS.map((item, i) => (
            <span
              key={item}
              className="flex items-center gap-2"
              style={{
                color: 'rgba(255, 255, 255, 0.55)',
                fontSize: '0.8125rem',
                lineHeight: 1.4,
                letterSpacing: '0.04em',
                fontWeight: 500,
              }}
            >
              {i > 0 && (
                <span style={{ color: 'rgba(255, 255, 255, 0.55)' }}>
                  &middot;
                </span>
              )}
              {item}
            </span>
          ))}
        </motion.div>

        {/* App Store Badges */}
        <motion.div
          className="flex items-center justify-center gap-3 mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <AppStoreBadge />
          <GooglePlayBadge />
          <WebAppBadge />
        </motion.div>
      </div>
    </section>
  );
}
