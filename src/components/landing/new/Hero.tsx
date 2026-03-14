import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  GOLD_GRADIENT_TEXT,
  HEADING_H1_STYLE,
  PILL_STYLE,
  LANDING_BG,
  fadeInUp,
  fadeInRight,
  staggerContainer,
} from '@/lib/landing-animations';
import { OrbitButton } from './OrbitButton';

/* ------------------------------------------------------------------ */
/*  BrowserFrame — CSS-rendered product mockup                         */
/* ------------------------------------------------------------------ */

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', active: true },
  { label: 'My Claims', active: false },
  { label: 'DBQ Forms', active: false },
  { label: 'Health Log', active: false },
  { label: 'AI Tools', active: false },
];

const STAT_CARDS = [
  { label: 'Claims in Progress', value: '3', color: '#D4AF37' },
  { label: 'DBQs Completed', value: '12', color: '#60A5FA' },
  { label: 'Health Entries', value: '47', color: '#34D399' },
  { label: 'AI Reports', value: '8', color: '#F472B6' },
];

function BrowserFrame() {
  return (
    <div
      className="w-full max-w-[520px] select-none"
      style={{
        perspective: '1200px',
      }}
    >
      <div
        style={{
          transform: 'rotateY(-2deg) rotateX(1deg)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow:
            '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(197,165,90,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Chrome bar */}
        <div
          className="flex items-center gap-2 px-4 py-2.5"
          style={{ backgroundColor: '#1a1a1a' }}
        >
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c940]" />
          </div>
          <div
            className="flex-1 mx-3 px-3 py-1 rounded-md text-xs"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'monospace',
              fontSize: '11px',
            }}
          >
            vetclaimsupport.com/dashboard
          </div>
        </div>

        {/* App body */}
        <div
          className="flex"
          style={{ backgroundColor: '#0f0f0f', minHeight: '280px' }}
        >
          {/* Sidebar */}
          <div
            className="hidden sm:flex flex-col gap-0.5 py-3 px-2"
            style={{
              width: '140px',
              borderRight: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {SIDEBAR_ITEMS.map((item) => (
              <div
                key={item.label}
                className="px-3 py-2 rounded-lg text-xs font-medium"
                style={{
                  backgroundColor: item.active
                    ? 'rgba(197,165,90,0.12)'
                    : 'transparent',
                  color: item.active
                    ? '#D4AF37'
                    : 'rgba(255,255,255,0.4)',
                  fontSize: '12px',
                }}
              >
                {item.label}
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-4">
            <div
              className="text-sm font-semibold mb-3"
              style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}
            >
              Dashboard
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {STAT_CARDS.map((card) => (
                <div
                  key={card.label}
                  className="rounded-lg p-3"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div
                    className="text-xs mb-1"
                    style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}
                  >
                    {card.label}
                  </div>
                  <div
                    className="text-xl font-bold"
                    style={{ color: card.color, fontSize: '22px' }}
                  >
                    {card.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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

      {/* Two-column grid */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center"
        style={{ minHeight: 'calc(100vh - 4rem)', maxHeight: '900px' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_0.82fr] gap-8 md:gap-12 items-center w-full py-16 md:py-0">

          {/* LEFT — Text column */}
          <motion.div
            className="flex flex-col items-start"
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
                fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)',
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
              className="max-w-lg mb-8"
              style={{
                color: 'rgba(255, 255, 255, 0.70)',
                fontSize: 'clamp(1rem, 1.3vw, 1.25rem)',
                lineHeight: 1.6,
              }}
              variants={fadeInUp}
            >
              All 70 VA DBQs, health tracking, and AI-powered claim preparation in one place.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-start gap-3"
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

          {/* RIGHT — Browser frame (desktop only) */}
          <motion.div
            className="hidden md:flex justify-end"
            variants={fadeInRight}
            initial="hidden"
            animate="visible"
          >
            <BrowserFrame />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
