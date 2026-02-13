import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
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
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Health Tracking',
  },
  {
    icon: Heart,
    title: 'Symptom Journal',
    short: 'Daily symptom logging with frequency and severity tracking',
    detail: 'Track your symptoms daily with detailed logs of frequency, severity, triggers, and impact on daily activities.',
    capabilities: ['Daily logging', 'Frequency tracking', 'Severity ratings', 'Trigger identification'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Health Tracking',
  },
  {
    icon: Brain,
    title: 'Migraine Log',
    short: 'Document migraine episodes with triggers and duration',
    detail: 'Specialized tracker for migraine episodes including prostrating status, triggers, duration, and severity—mapped to VA rating criteria.',
    capabilities: ['Episode tracking', 'Prostrating status', 'Trigger documentation', 'Duration logging'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Health Tracking',
  },
  {
    icon: Moon,
    title: 'Sleep Tracker',
    short: 'Track sleep quality, duration, and disturbances',
    detail: 'Log nightly sleep quality, duration, disturbances, and nightmares. Essential for sleep apnea, PTSD, and insomnia claims.',
    capabilities: ['Sleep quality logging', 'Disturbance tracking', 'Nightmare documentation', 'Pattern analysis'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Health Tracking',
  },
  {
    icon: PillIcon,
    title: 'Medication Log',
    short: 'Track prescriptions, dosages, and treatment history',
    detail: 'Comprehensive medication tracker for prescriptions, dosages, side effects, and treatment effectiveness over time.',
    capabilities: ['Prescription management', 'Dosage tracking', 'Side effect logging', 'Treatment history'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Health Tracking',
  },
  {
    icon: Upload,
    title: 'Document Upload',
    short: 'Securely upload and organize all your evidence files',
    detail: 'Upload medical records, service documents, and supporting evidence. Everything encrypted and organized by condition.',
    capabilities: ['Secure file upload', 'Document categorization', 'Evidence organization', 'AES-256 encryption'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Documents',
  },
  {
    icon: Library,
    title: 'Evidence Library',
    short: 'Centralized hub for all your claim documentation',
    detail: 'Access all your uploaded documents, generated statements, and evidence in one organized library with powerful search.',
    capabilities: ['Document library', 'Search and filter', 'Tag organization', 'Quick access'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Documents',
  },
  {
    icon: Users,
    title: 'Buddy Statements',
    short: 'Create structured witness statements from friends and family',
    detail: 'Guided tool for fellow service members, family, and friends to create effective buddy statements with proper structure.',
    capabilities: ['Guided prompts', 'Structured format', 'Multiple statements', 'Print-ready output'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Evidence',
  },
  {
    icon: Clock,
    title: 'Timeline Builder',
    short: 'Visualize your medical and service history chronologically',
    detail: 'Create a visual timeline connecting your service history to medical events, treatments, and symptoms over time.',
    capabilities: ['Chronological view', 'Service connection', 'Medical event tracking', 'Visual history'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Organization',
  },
  {
    icon: Stethoscope,
    title: 'C&P Exam Prep',
    short: 'Condition-specific prep guides for your VA exam',
    detail: 'Comprehensive preparation guides for your Compensation & Pension exam with condition-specific questions and tips.',
    capabilities: ['Exam preparation', 'Condition-specific guides', 'Common questions', 'Day-of tips'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Exam Prep',
  },
  {
    icon: ClipboardCheck,
    title: 'Documents Checklist',
    short: 'Track every required document for your claim',
    detail: 'Comprehensive checklist of all documents needed for your claim with progress tracking and submission readiness.',
    capabilities: ['Document requirements', 'Progress tracking', 'Submission checklist', 'Missing items alerts'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Organization',
  },
  {
    icon: Briefcase,
    title: 'Service History',
    short: 'Document deployments, stations, and duty assignments',
    detail: 'Complete service history tracker for duty stations, deployments, MOSs, and exposure to hazards during service.',
    capabilities: ['Deployment tracking', 'Duty stations', 'MOS documentation', 'Hazard exposure'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Service',
  },
  {
    icon: TrendingUp,
    title: '4-Phase Progress',
    short: 'Track your claim journey from start to decision',
    detail: 'Visual progress tracker through all four phases of the VA claim process with milestone notifications and guidance.',
    capabilities: ['Phase tracking', 'Milestone alerts', 'Progress visualization', 'Next-step guidance'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Organization',
  },
];

/* ────────────────────────────────────────────────
 * Brand Styling
 * ──────────────────────────────────────────────── */

const CARD_BG = 'rgba(15, 23, 42, 0.85)';
const CARD_BORDER = '1px solid rgba(255, 255, 255, 0.2)';
const CARD_SHADOW = '0 4px 16px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.3)';

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
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 0 60px rgba(197,164,66,0.3)',
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
          style={{ backgroundColor: 'rgba(197,164,66,0.15)', border: '1px solid rgba(197,164,66,0.3)' }}
        >
          <Icon size={24} style={{ color: '#C5A442' }} />
        </div>

        <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: '#C5A442' }}>
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
                <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: '#C5A442' }} />
                {cap}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold"
          style={{
            backgroundColor: 'rgba(197,164,66,0.15)',
            color: '#C5A442',
          }}
        >
          {card.plan}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────
 * 3D Stacked Cards — Compact Rotation
 *
 * Cards stack tightly in 3D space with small offsets.
 * Rotates through the stack smoothly.
 * ──────────────────────────────────────────────── */

const N = CARDS.length;
const VISIBLE_CARDS = 5;

function DesktopCarousel({ onSelectCard }: { onSelectCard: (card: CardData) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Get visible cards
  const getVisibleCards = useCallback(() => {
    const visible = [];
    for (let i = 0; i < VISIBLE_CARDS; i++) {
      const cardIndex = (currentIndex + i) % N;
      visible.push({ position: i, cardIndex, card: CARDS[cardIndex] });
    }
    return visible;
  }, [currentIndex]);

  // Calculate compact 3D stack position
  const getCardTransform = (position: number) => {
    const isFront = position === 0;

    // Tight stacking with small offsets
    const x = position * 15; // Small horizontal offset
    const y = position * -10; // Small vertical offset upward
    const z = position * -80; // Depth spacing
    const scale = 1 - position * 0.08; // Gradual scale reduction
    const opacity = 1 - position * 0.15; // Gradual fade
    const rotateY = position * 3; // Slight rotation for depth
    const zIndex = VISIBLE_CARDS - position;

    return { x, y, z, scale, opacity, rotateY, zIndex, isFront };
  };

  // Auto-rotation
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % N);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused]);

  // GSAP animation
  useEffect(() => {
    const visible = getVisibleCards();
    visible.forEach(({ position }, idx) => {
      const cardEl = cardsRef.current[idx];
      if (!cardEl) return;

      const { x, y, z, scale, opacity, rotateY, zIndex } = getCardTransform(position);

      gsap.to(cardEl, {
        x,
        y,
        z,
        scale,
        opacity,
        rotateY,
        zIndex,
        duration: 0.8,
        ease: 'power2.out',
      });
    });
  }, [currentIndex, getVisibleCards]);

  const visibleCards = getVisibleCards();

  return (
    <div
      className="relative"
      style={{
        width: '450px',
        height: '500px',
        perspective: '1500px',
        perspectiveOrigin: 'center center',
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
        {visibleCards.map(({ position, cardIndex, card }, idx) => {
          const { isFront } = getCardTransform(position);
          const Icon = card.icon;

          return (
            <div
              key={`${cardIndex}-${position}`}
              ref={(el) => (cardsRef.current[idx] = el)}
              style={{
                position: 'absolute',
                top: '50px',
                left: 0,
                width: '100%',
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                pointerEvents: 'auto',
              }}
              onClick={() => onSelectCard(card)}
            >
              <div
                className="rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105"
                style={{
                  background: CARD_BG,
                  border: CARD_BORDER,
                  boxShadow: CARD_SHADOW,
                  backdropFilter: 'blur(10px)',
                  minHeight: '380px',
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: 'rgba(197,164,66,0.15)',
                      border: '1px solid rgba(197,164,66,0.3)',
                    }}
                  >
                    <Icon size={20} style={{ color: '#C5A442' }} />
                  </div>
                  <div className="min-w-0">
                    <span
                      className="text-[10px] font-semibold tracking-[0.15em] uppercase block mb-1"
                      style={{ color: '#C5A442' }}
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
                  style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <span
                    className="inline-block rounded-full px-3 py-1 text-[10px] font-semibold"
                    style={{
                      backgroundColor: 'rgba(197,164,66,0.15)',
                      color: '#C5A442',
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
              style={{ backgroundColor: 'rgba(197,164,66,0.15)' }}
            >
              <Icon size={18} style={{ color: '#C5A442' }} />
            </div>
            <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: '#C5A442' }}>
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
 * Text Left, Cards Right
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
        className="relative py-16"
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
            From symptom tracking to exam prep, document management to timeline building — everything you need in one place.
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
      className="relative py-20 lg:py-28"
      style={{ backgroundColor: '#000000', scrollMarginTop: '5rem' }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Text */}
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
              From symptom tracking to exam prep, document management to timeline building — everything you need to build your strongest VA disability claim.
            </p>

            <p
              className="text-base mt-4 leading-relaxed"
              style={{ color: '#6B7280' }}
            >
              Track your health data, organize evidence, prepare for your C&P exam, and understand the VA claims process with 13 specialized tools designed specifically for veterans.
            </p>
          </motion.div>

          {/* Right Column: 3D Card Stack */}
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
