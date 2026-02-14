import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HEADING_H2_STYLE,
  PILL_STYLE,
  EASE_SMOOTH,
  GOLD_GRADIENT_TEXT,
} from '@/lib/landing-animations';
import {
  Activity,
  Heart,
  Brain,
  Moon,
  Pill as PillIcon,
  Upload,
  Library,
  Users,
  Clock,
  Stethoscope,
  ClipboardCheck,
  Briefcase,
  TrendingUp,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ────────────────────────────────────────────────
 * Card Data — 13 Core Tools
 * ──────────────────────────────────────────────── */

interface CardData {
  icon: LucideIcon;
  title: string;
  short: string;
  detail: string;
  capabilities: string[];
  plan: string;
  category: string;
}

const CARDS: CardData[] = [
  {
    icon: Activity,
    title: 'Symptom Checker',
    short: 'Match symptoms to conditions and understand VA rating criteria',
    detail: 'Interactive tool that helps you identify and document symptoms, matching them to specific VA disability conditions with rating criteria.',
    capabilities: ['Symptom-to-condition matching', 'VA rating criteria', 'Severity tracking', 'Evidence guidance'],
    plan: 'Included in Launch Plan ($9.99)',
    category: 'Health Tracking',
  },
  {
    icon: Heart,
    title: 'Symptom Journal',
    short: 'Daily symptom logging with frequency and severity tracking',
    detail: 'Track your symptoms daily with detailed logs of frequency, severity, triggers, and impact on daily activities.',
    capabilities: ['Daily logging', 'Frequency tracking', 'Severity ratings', 'Trigger identification'],
    plan: 'Included in Launch Plan ($9.99)',
    category: 'Health Tracking',
  },
  {
    icon: Brain,
    title: 'Migraine Log',
    short: 'Document migraine episodes with triggers and duration',
    detail: 'Specialized tracker for migraine episodes including prostrating status, triggers, duration, and severity—mapped to VA rating criteria.',
    capabilities: ['Episode tracking', 'Prostrating status', 'Trigger documentation', 'Duration logging'],
    plan: 'Included in Launch Plan ($9.99)',
    category: 'Health Tracking',
  },
  {
    icon: Moon,
    title: 'Sleep Tracker',
    short: 'Track sleep quality, duration, and disturbances',
    detail: 'Log nightly sleep quality, duration, disturbances, and nightmares. Essential for sleep apnea, PTSD, and insomnia claims.',
    capabilities: ['Sleep quality logging', 'Disturbance tracking', 'Nightmare documentation', 'Pattern analysis'],
    plan: 'Included in Launch Plan ($9.99)',
    category: 'Health Tracking',
  },
  {
    icon: PillIcon,
    title: 'Medication Log',
    short: 'Track prescriptions, dosages, and treatment history',
    detail: 'Comprehensive medication tracker for prescriptions, dosages, side effects, and treatment effectiveness over time.',
    capabilities: ['Prescription management', 'Dosage tracking', 'Side effect logging', 'Treatment history'],
    plan: 'Included in Launch Plan ($9.99)',
    category: 'Health Tracking',
  },
  {
    icon: Upload,
    title: 'Document Upload',
    short: 'Securely upload and organize all your evidence files',
    detail: 'Upload medical records, service documents, and supporting evidence. Everything encrypted and organized by condition.',
    capabilities: ['Secure file upload', 'Document categorization', 'Evidence organization', 'AES-256 encryption'],
    plan: 'Included in Launch Plan ($9.99)',
    category: 'Documents',
  },
  {
    icon: Library,
    title: 'Evidence Library',
    short: 'Centralized hub for all your claim documentation',
    detail: 'Access all your uploaded documents, generated statements, and evidence in one organized library with powerful search.',
    capabilities: ['Document library', 'Search and filter', 'Tag organization', 'Quick access'],
    plan: 'Included in Launch Plan ($9.99)',
    category: 'Documents',
  },
  {
    icon: Users,
    title: 'Buddy Statements',
    short: 'Create structured witness statements from friends and family',
    detail: 'Guided tool for fellow service members, family, and friends to create effective buddy statements with proper structure.',
    capabilities: ['Guided prompts', 'Structured format', 'Multiple statements', 'Print-ready output'],
    plan: 'Included in Launch Plan ($9.99)',
    category: 'Evidence',
  },
  {
    icon: Clock,
    title: 'Timeline Builder',
    short: 'Visualize your medical and service history chronologically',
    detail: 'Create a visual timeline connecting your service history to medical events, treatments, and symptoms over time.',
    capabilities: ['Chronological view', 'Service connection', 'Medical event tracking', 'Visual history'],
    plan: 'Included in Launch Plan ($9.99)',
    category: 'Organization',
  },
  {
    icon: Stethoscope,
    title: 'C&P Exam Prep',
    short: 'Condition-specific prep guides for your VA exam',
    detail: 'Comprehensive preparation guides for your Compensation & Pension exam with condition-specific questions and tips.',
    capabilities: ['Exam preparation', 'Condition-specific guides', 'Common questions', 'Day-of tips'],
    plan: 'Included in Launch Plan ($9.99)',
    category: 'Exam Prep',
  },
  {
    icon: ClipboardCheck,
    title: 'Documents Checklist',
    short: 'Track every required document for your claim',
    detail: 'Comprehensive checklist of all documents needed for your claim with progress tracking and submission readiness.',
    capabilities: ['Document requirements', 'Progress tracking', 'Submission checklist', 'Missing items alerts'],
    plan: 'Included in Launch Plan ($9.99)',
    category: 'Organization',
  },
  {
    icon: Briefcase,
    title: 'Service History',
    short: 'Document deployments, stations, and duty assignments',
    detail: 'Complete service history tracker for duty stations, deployments, MOSs, and exposure to hazards during service.',
    capabilities: ['Deployment tracking', 'Duty stations', 'MOS documentation', 'Hazard exposure'],
    plan: 'Included in Launch Plan ($9.99)',
    category: 'Service',
  },
  {
    icon: TrendingUp,
    title: '4-Phase Progress',
    short: 'Track your claim journey from start to decision',
    detail: 'Visual progress tracker through all four phases of the VA claim process with milestone notifications and guidance.',
    capabilities: ['Phase tracking', 'Milestone alerts', 'Progress visualization', 'Next-step guidance'],
    plan: 'Included in Launch Plan ($9.99)',
    category: 'Organization',
  },
];

/* ────────────────────────────────────────────────
 * Card Styling - Dark theme
 * ──────────────────────────────────────────────── */

const CARD_BG = 'rgba(30, 30, 30, 0.95)'; // Very dark gray
const CARD_BORDER = '1px solid rgba(255, 255, 255, 0.15)';
const CARD_SHADOW = '0 8px 32px rgba(0,0,0,0.6)';

/* ────────────────────────────────────────────────
 * Detail Modal
 * ──────────────────────────────────────────────── */

function DetailModal({ card, onClose }: { card: CardData; onClose: () => void }) {
  const Icon = card.icon;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative z-10 w-[90%] max-w-[500px] rounded-3xl p-8 sm:p-10"
        style={{
          background: CARD_BG,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 0 60px rgba(212,175,55,0.3)',
        }}
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        transition={{ duration: 0.25, ease: EASE_SMOOTH }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
        >
          <X size={16} />
        </button>

        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
          style={{ backgroundColor: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}
        >
          <Icon size={24} style={{ color: '#D4AF37' }} />
        </div>

        <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: '#D4AF37' }}>
          {card.category}
        </span>

        <h3 className="text-xl font-semibold mt-1 mb-2" style={{ color: '#fff', letterSpacing: '-0.02em' }}>
          {card.title}
        </h3>

        <p className="text-sm mb-5 leading-relaxed" style={{ color: '#E2E8F0' }}>
          {card.detail}
        </p>

        <div className="mb-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#CBD5E1' }}>
            Key Capabilities
          </h4>
          <ul className="space-y-1.5">
            {card.capabilities.map((cap) => (
              <li key={cap} className="flex items-start gap-2 text-sm" style={{ color: '#E2E8F0' }}>
                <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: '#D4AF37' }} />
                {cap}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold"
          style={{
            backgroundColor: 'rgba(212,175,55,0.15)',
            color: '#D4AF37',
          }}
        >
          {card.plan}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────
 * Angled Card Stack - Smooth Rotation Animation
 *
 * Professional-grade card carousel with elegant cycling
 * ──────────────────────────────────────────────── */

const N = CARDS.length;
const VISIBLE_CARDS = 6;

// Animation constants - tuned for smooth, elegant motion
const ANIMATION_CONFIG = {
  duration: 1.6,
  stagger: 0.08,
  ease: 'power3.inOut', // Smooth acceleration and deceleration
  rotationInterval: 4000,
} as const;

// Card transform calculation - defines the angled stack geometry
function calculateCardTransform(stackPosition: number) {
  const isVisible = stackPosition < VISIBLE_CARDS;

  // Angular fan-out
  const baseAngle = -12;
  const angleStep = 4;
  const rotation = baseAngle + (stackPosition * angleStep);

  // Spatial positioning
  const xOffset = stackPosition * 40;
  const yOffset = Math.abs(stackPosition - 2.5) * 10; // Subtle arc
  const zOffset = stackPosition * -60; // Depth layering

  // Visual properties
  const scale = Math.max(0.7, 1 - (stackPosition * 0.05));
  const opacity = isVisible ? Math.max(0.3, 1 - (stackPosition * 0.12)) : 0;
  const zIndex = VISIBLE_CARDS - stackPosition;

  return {
    x: xOffset,
    y: yOffset,
    z: zOffset,
    rotation,
    scale,
    opacity,
    zIndex,
  };
}

function DesktopCarousel({ onSelectCard }: { onSelectCard: (card: CardData) => void }) {
  const [rotationOffset, setRotationOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const cardsRef = useRef<Map<number, HTMLDivElement>>(new Map());
  const gsapRef = useRef<typeof import('gsap')['default'] | null>(null);
  const timelineRef = useRef<ReturnType<typeof import('gsap')['default']['timeline']> | null>(null);

  useEffect(() => {
    let mounted = true;
    import('gsap').then((mod) => {
      if (mounted) gsapRef.current = mod.default;
    });
    return () => { mounted = false; };
  }, []);

  // Auto-advance rotation
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setRotationOffset((prev) => (prev + 1) % N);
    }, ANIMATION_CONFIG.rotationInterval);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Orchestrate smooth card transitions
  useEffect(() => {
    // Kill any existing animation
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const gsap = gsapRef.current;
    if (!gsap) return;

    const tl = gsap.timeline();

    CARDS.forEach((_, cardIndex) => {
      const cardElement = cardsRef.current.get(cardIndex);
      if (!cardElement) return;

      // Calculate card's position in the visual stack
      const stackPosition = (cardIndex - rotationOffset + N * 100) % N;
      const transform = calculateCardTransform(stackPosition);
      const isInteractive = stackPosition < VISIBLE_CARDS;

      // Animate with stagger for cascade effect
      tl.to(
        cardElement,
        {
          x: transform.x,
          y: transform.y,
          z: transform.z,
          rotateZ: transform.rotation,
          scale: transform.scale,
          opacity: transform.opacity,
          zIndex: transform.zIndex,
          duration: ANIMATION_CONFIG.duration,
          ease: ANIMATION_CONFIG.ease,
          onStart: () => {
            // Update interactivity
            cardElement.style.pointerEvents = isInteractive ? 'auto' : 'none';
          },
        },
        cardIndex * ANIMATION_CONFIG.stagger // Stagger timing
      );
    });

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [rotationOffset]);

  return (
    <div
      className="relative"
      style={{
        width: '500px',
        height: '550px',
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
        }}
      >
        {CARDS.map((card, cardIndex) => {
          const Icon = card.icon;
          const stackPosition = (cardIndex - rotationOffset + N * 100) % N;
          const isInteractive = stackPosition < VISIBLE_CARDS;

          return (
            <div
              key={cardIndex}
              ref={(el) => {
                if (el) cardsRef.current.set(cardIndex, el);
              }}
              style={{
                position: 'absolute',
                top: '60px',
                left: '20px',
                width: '420px',
                transformStyle: 'preserve-3d',
                transformOrigin: 'center bottom',
                willChange: 'transform, opacity',
                cursor: isInteractive ? 'pointer' : 'default',
              }}
              onClick={() => isInteractive && onSelectCard(card)}
            >
              <div
                className="rounded-2xl p-6 transition-all duration-300 hover:scale-105"
                style={{
                  background: CARD_BG,
                  border: CARD_BORDER,
                  boxShadow: CARD_SHADOW,
                  backdropFilter: 'blur(12px)',
                  minHeight: '360px',
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: 'rgba(212,175,55,0.12)',
                      border: '1px solid rgba(212,175,55,0.25)',
                    }}
                  >
                    <Icon size={20} style={{ color: '#D4AF37' }} />
                  </div>
                  <div className="min-w-0">
                    <span
                      className="text-[10px] font-semibold tracking-[0.15em] uppercase block mb-1"
                      style={{ color: '#D4AF37' }}
                    >
                      {card.category}
                    </span>
                    <h4
                      className="text-lg font-semibold leading-tight"
                      style={{ color: '#fff', letterSpacing: '-0.02em' }}
                    >
                      {card.title}
                    </h4>
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-4" style={{ color: '#E2E8F0' }}>
                  {card.short}
                </p>

                <div
                  className="flex items-center justify-between pt-3 mt-auto"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <span
                    className="inline-block rounded-full px-3 py-1 text-[10px] font-semibold"
                    style={{
                      backgroundColor: 'rgba(212,175,55,0.12)',
                      color: '#D4AF37',
                    }}
                  >
                    Launch Plan
                  </span>
                  <span className="text-[10px] font-medium" style={{ color: '#94A3B8' }}>
                    Click to explore →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
 * Mobile Carousel
 * ──────────────────────────────────────────────── */

function MobileCarousel({ onSelectCard }: { onSelectCard: (card: CardData) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const goTo = useCallback((idx: number) => {
    setCurrentIndex(((idx % N) + N) % N);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setTimeout(() => goTo(currentIndex + 1), 3000);
    return () => clearTimeout(timerRef.current);
  }, [currentIndex, isPaused, goTo]);

  const card = CARDS[currentIndex];
  const Icon = card.icon;

  return (
    <div className="px-4">
      <div
        className="relative mx-auto max-w-sm"
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="cursor-pointer rounded-[20px] p-6"
            style={{
              background: CARD_BG,
              border: CARD_BORDER,
              boxShadow: CARD_SHADOW,
            }}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3, ease: EASE_SMOOTH }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x > 50) goTo(currentIndex - 1);
              else if (info.offset.x < -50) goTo(currentIndex + 1);
            }}
            onClick={() => onSelectCard(card)}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
              style={{ backgroundColor: 'rgba(212,175,55,0.15)' }}
            >
              <Icon size={18} style={{ color: '#D4AF37' }} />
            </div>
            <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: '#D4AF37' }}>
              {card.category}
            </span>
            <h4 className="text-base font-semibold mt-1 mb-2" style={{ color: '#fff', letterSpacing: '-0.02em' }}>
              {card.title}
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: '#E2E8F0' }}>
              {card.short}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => goTo(currentIndex - 1)}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#9CA3AF' }}
          >
            <ChevronLeft size={18} />
          </button>

          <span className="text-xs tabular-nums" style={{ color: '#6B7280' }}>
            {currentIndex + 1} / {N}
          </span>

          <button
            onClick={() => goTo(currentIndex + 1)}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#9CA3AF' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
 * FeatureBento — Two Column Layout
 * ──────────────────────────────────────────────── */

export function FeatureBento() {
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (isMobile) {
    return (
      <section
        id="features"
        className="relative py-12"
        style={{ backgroundColor: '#000000', scrollMarginTop: '5rem' }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            className="mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE_SMOOTH }}
          >
            <span style={PILL_STYLE}>Our Toolkit</span>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl text-white mb-3 text-center"
            style={HEADING_H2_STYLE}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05, ease: EASE_SMOOTH }}
          >
            Core Tools That Help You{' '}
            <span style={GOLD_GRADIENT_TEXT}>Prepare</span>
          </motion.h2>

          <motion.p
            className="text-base max-w-xl mx-auto text-center mb-12"
            style={{ color: '#9CA3AF' }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE_SMOOTH }}
          >
            Every card below is a tool built for a specific part of your claim preparation. Tap to explore.
          </motion.p>

          <MobileCarousel onSelectCard={setSelectedCard} />
        </div>

        <AnimatePresence>
          {selectedCard && (
            <DetailModal card={selectedCard} onClose={() => setSelectedCard(null)} />
          )}
        </AnimatePresence>
      </section>
    );
  }

  return (
    <section
      id="features"
      className="relative py-12 lg:py-16"
      style={{ backgroundColor: '#000000', scrollMarginTop: '5rem' }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_SMOOTH }}
          >
            <span style={PILL_STYLE}>Our Toolkit</span>

            <h2
              className="text-4xl lg:text-5xl xl:text-6xl text-white mt-6 mb-4"
              style={HEADING_H2_STYLE}
            >
              Core Tools That Help You{' '}
              <span style={GOLD_GRADIENT_TEXT}>Prepare</span>
            </h2>

            <p
              className="text-lg lg:text-xl leading-relaxed"
              style={{ color: '#9CA3AF' }}
            >
              Every card below is a tool built for a specific part of your claim preparation. Tap to explore.
            </p>
          </motion.div>

          {/* Right: Angled Card Stack */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_SMOOTH, delay: 0.2 }}
          >
            <DesktopCarousel onSelectCard={setSelectedCard} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedCard && (
          <DetailModal card={selectedCard} onClose={() => setSelectedCard(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
