import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  APP_STORE_URL,
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
            radial-gradient(ellipse at 20% 50%, rgba(176,153,78,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(176,153,78,0.05) 0%, transparent 50%),
            ${LANDING_BG}
          `,
        }}
      />

      {/* Centered content */}
      <div
        className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex items-center justify-center"
        style={{ minHeight: 'calc(100vh - 4rem)', maxHeight: '900px', paddingTop: '5rem' }}
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
            You served your country.
            <br />
            <span style={GOLD_GRADIENT_TEXT}>Preparing your claim shouldn't feel like a second battle.</span>
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

          {/* Platform badges */}
          <motion.div
            className="mt-5 flex flex-wrap items-center justify-center gap-3"
            variants={fadeInUp}
          >
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
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
            <span
              className="inline-flex items-center opacity-50 cursor-default"
              title="Coming soon to Google Play"
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
            </span>
            <Link
              to="/auth"
              className="inline-flex items-center no-underline"
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
