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
  Lock,
  Database,
  Users,
  Clock,
  Stethoscope,
  ClipboardCheck,
  Briefcase,
  TrendingUp,
  X,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Languages,
  FileText,
  Shield,
  BookOpen,
  DollarSign,
  Globe,
  BookMarked,
  Pencil,
  Zap,
  Calendar,
  AlertTriangle,
  BarChart3,
  Compass,
  ClipboardList,
  FileCheck,
  Search,
  Scale,
  Package,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ────────────────────────────────────────────────
 * Card Data — All Tools & Features
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
  // ── Free Tools ──────────────────────────────────
  {
    icon: Calculator,
    title: 'VA Combined Rating Calculator',
    short: 'Calculate your combined VA disability rating instantly',
    detail: 'Enter your individual ratings and see your combined VA disability percentage using the official VA math formula.',
    capabilities: ['VA math formula', 'Multiple condition support', 'Bilateral factor included', 'What-if scenarios'],
    plan: 'Free Forever',
    category: 'Calculators',
  },
  {
    icon: ClipboardCheck,
    title: 'Claim Checklist',
    short: 'Track every step of your claim preparation',
    detail: 'Comprehensive checklist that walks you through each phase of the VA claim process so nothing gets missed.',
    capabilities: ['Step-by-step tracking', 'Progress indicators', 'Phase organization', 'Completion status'],
    plan: 'Free Forever',
    category: 'Claim Management',
  },
  {
    icon: Languages,
    title: 'VA-Speak Translator',
    short: 'Decode VA jargon into plain English',
    detail: 'Paste any VA letter, decision, or notice and get a clear explanation of what it actually means.',
    capabilities: ['Plain English translations', 'Decision letter decoding', 'VA acronym lookup', 'Context explanations'],
    plan: 'Free Forever',
    category: 'Reference',
  },
  {
    icon: FileText,
    title: 'VA Form Guide',
    short: 'Step-by-step help filling out VA forms',
    detail: 'Interactive guides for the most common VA forms with field-by-field instructions and tips for each section.',
    capabilities: ['Field-by-field guidance', 'Common mistake warnings', 'Form selection help', 'Submission tips'],
    plan: 'Free Forever',
    category: 'Reference',
  },
  {
    icon: Shield,
    title: 'Intent to File Guide',
    short: 'Protect your effective date before you\'re ready',
    detail: 'Learn how to lock in your effective date with an Intent to File, giving you up to a year to complete your claim.',
    capabilities: ['Effective date protection', 'Filing instructions', 'Deadline tracking', 'Back pay implications'],
    plan: 'Free Forever',
    category: 'Reference',
  },
  {
    icon: BookOpen,
    title: 'BDD Guide',
    short: 'Pre-discharge filing guide for active duty',
    detail: 'Step-by-step guide for Benefits Delivery at Discharge—file your claim 180–90 days before separation.',
    capabilities: ['Timeline guidance', 'Eligibility check', 'Required documents', 'Process walkthrough'],
    plan: 'Free Forever',
    category: 'Reference',
  },
  {
    icon: DollarSign,
    title: 'Travel Pay Calculator',
    short: 'Estimate your VA travel reimbursement',
    detail: 'Calculate mileage reimbursement for VA medical appointments based on distance and current reimbursement rates.',
    capabilities: ['Mileage calculation', 'Current VA rates', 'Appointment tracking', 'Reimbursement estimates'],
    plan: 'Free Forever',
    category: 'Calculators',
  },
  {
    icon: BookMarked,
    title: 'Glossary',
    short: 'Every VA term defined in plain language',
    detail: 'Searchable glossary of VA disability terms, acronyms, and legal language with clear, veteran-friendly definitions.',
    capabilities: ['Searchable terms', 'Plain language definitions', 'VA acronyms', 'Legal term breakdowns'],
    plan: 'Free Forever',
    category: 'Reference',
  },
  {
    icon: Database,
    title: '800+ Condition Database',
    short: 'Browse every VA-rated disability condition',
    detail: 'Comprehensive database of over 800 VA disability conditions with rating criteria, common symptoms, and evidence tips.',
    capabilities: ['800+ conditions', 'Rating criteria', 'Symptom matching', 'Evidence guidance'],
    plan: 'Free Forever',
    category: 'Reference',
  },
  {
    icon: Globe,
    title: 'Conditions by Conflict',
    short: 'Find conditions common to your era of service',
    detail: 'Reference guide linking military conflicts and service eras to commonly associated VA disability conditions.',
    capabilities: ['Era-specific conditions', 'Conflict mapping', 'Exposure risks', 'Common claims by era'],
    plan: 'Free Forever',
    category: 'Reference',
  },
  // ── Premium: Document Builders ──────────────────
  {
    icon: Pencil,
    title: 'Personal Statement Builder',
    short: 'Generate a compelling personal statement for your claim',
    detail: 'Guided builder that helps you write an effective personal statement connecting your service to your conditions.',
    capabilities: ['Guided prompts', 'Nexus language help', 'Condition-specific templates', 'Export-ready output'],
    plan: 'Premium ($9.99 one-time)',
    category: 'Document Builders',
  },
  {
    icon: Users,
    title: 'Buddy Statement Builder',
    short: 'Create structured witness statements',
    detail: 'Help fellow service members, family, and friends write effective buddy/lay statements with proper structure and language.',
    capabilities: ['Guided prompts', 'Structured format', 'Multiple statements', 'Print-ready output'],
    plan: 'Premium ($9.99 one-time)',
    category: 'Document Builders',
  },
  {
    icon: Stethoscope,
    title: 'Doctor Summary Outline',
    short: 'Organize what to discuss with your clinician',
    detail: 'Create a structured outline for your doctor to help them understand your conditions and provide supporting documentation.',
    capabilities: ['Clinician-friendly format', 'Condition summaries', 'Treatment history', 'Nexus support'],
    plan: 'Premium ($9.99 one-time)',
    category: 'Document Builders',
  },
  {
    icon: Brain,
    title: 'Stressor Statement Writer',
    short: 'Document PTSD stressor events for your claim',
    detail: 'Guided tool for documenting in-service stressor events with the detail and structure required for PTSD claims.',
    capabilities: ['Event documentation', 'Timeline structure', 'Detail prompts', 'VA-compliant format'],
    plan: 'Premium ($9.99 one-time)',
    category: 'Document Builders',
  },
  // ── Premium: Health & Symptom Tracking ──────────
  {
    icon: Activity,
    title: 'Symptom Tracker',
    short: 'Log symptoms with frequency and severity over time',
    detail: 'Track your symptoms daily with detailed logs of frequency, severity, triggers, and impact on daily activities.',
    capabilities: ['Daily logging', 'Severity ratings', 'Trigger identification', 'Trend analysis'],
    plan: 'Premium ($9.99 one-time)',
    category: 'Health Tracking',
  },
  {
    icon: Moon,
    title: 'Sleep Tracker',
    short: 'Track sleep quality, duration, and disturbances',
    detail: 'Log nightly sleep quality, duration, disturbances, and nightmares—essential for sleep apnea, PTSD, and insomnia claims.',
    capabilities: ['Sleep quality logging', 'Disturbance tracking', 'Nightmare documentation', 'Pattern analysis'],
    plan: 'Premium ($9.99 one-time)',
    category: 'Health Tracking',
  },
  {
    icon: Zap,
    title: 'Migraine Tracker',
    short: 'Document migraine episodes with triggers and duration',
    detail: 'Specialized tracker for migraine episodes including prostrating status, triggers, duration, and severity—mapped to VA rating criteria.',
    capabilities: ['Episode tracking', 'Prostrating status', 'Trigger documentation', 'Duration logging'],
    plan: 'Premium ($9.99 one-time)',
    category: 'Health Tracking',
  },
  {
    icon: PillIcon,
    title: 'Medication Tracker',
    short: 'Track prescriptions, dosages, and side effects',
    detail: 'Comprehensive medication tracker for prescriptions, dosages, side effects, and treatment effectiveness over time.',
    capabilities: ['Prescription management', 'Dosage tracking', 'Side effect logging', 'Treatment history'],
    plan: 'Premium ($9.99 one-time)',
    category: 'Health Tracking',
  },
  {
    icon: Calendar,
    title: 'Medical Visit Logger',
    short: 'Record appointments and provider notes',
    detail: 'Log every medical visit with provider details, notes, and outcomes to build a strong treatment history.',
    capabilities: ['Visit logging', 'Provider tracking', 'Notes and outcomes', 'Treatment timeline'],
    plan: 'Premium ($9.99 one-time)',
    category: 'Health Tracking',
  },
  {
    icon: AlertTriangle,
    title: 'Exposure & Hazard Tracker',
    short: 'Document environmental and toxic exposures',
    detail: 'Track exposure to hazardous substances, burn pits, chemicals, and other environmental hazards during service.',
    capabilities: ['Exposure documentation', 'Location tracking', 'Duration logging', 'PACT Act relevance'],
    plan: 'Premium ($9.99 one-time)',
    category: 'Health Tracking',
  },
  {
    icon: BarChart3,
    title: 'Health Summary',
    short: 'Generate a complete health overview from your logs',
    detail: 'Automatically compile all your tracked health data into a comprehensive summary with charts and trend analysis.',
    capabilities: ['Auto-generated summaries', 'Trend charts', 'Symptom patterns', 'Export-ready reports'],
    plan: 'Premium ($9.99 one-time)',
    category: 'Health Tracking',
  },
  {
    icon: Clock,
    title: 'Health Timeline',
    short: 'Unified chronological view of all health events',
    detail: 'See every symptom log, medical visit, medication change, and health event on a single timeline.',
    capabilities: ['Chronological view', 'Cross-tracker integration', 'Event filtering', 'Visual history'],
    plan: 'Premium ($9.99 one-time)',
    category: 'Health Tracking',
  },
  {
    icon: Heart,
    title: 'Interactive Body Map',
    short: 'Visually map conditions to affected body areas',
    detail: 'Tap on body regions to document affected areas and link them to specific conditions and symptoms.',
    capabilities: ['Visual body mapping', 'Condition linking', 'Area-specific notes', 'Pain documentation'],
    plan: 'Premium ($9.99 one-time)',
    category: 'Health Tracking',
  },
  // ── Premium: Strategy & Exam Prep ───────────────
  {
    icon: Compass,
    title: 'Claim Strategy Wizard',
    short: 'Get a personalized claim filing strategy',
    detail: 'Answer guided questions about your conditions and service to receive a tailored strategy for how to approach your claim.',
    capabilities: ['Personalized strategy', 'Filing order guidance', 'Secondary condition tips', 'Priority recommendations'],
    plan: 'Premium ($9.99 one-time)',
    category: 'Strategy',
  },
  {
    icon: ClipboardList,
    title: 'C&P Exam Prep',
    short: 'Condition-specific prep for your VA exam',
    detail: 'Comprehensive preparation guides for your Compensation & Pension exam with condition-specific questions and what to expect.',
    capabilities: ['Exam preparation', 'Condition-specific guides', 'Common questions', 'Day-of tips'],
    plan: 'Premium ($9.99 one-time)',
    category: 'Strategy',
  },
  {
    icon: FileCheck,
    title: 'DBQ Prep Sheet',
    short: 'Prepare for Disability Benefits Questionnaires',
    detail: 'Review the key criteria your examiner will evaluate on the DBQ so you can communicate your symptoms effectively.',
    capabilities: ['DBQ criteria review', 'Rating level breakdowns', 'Symptom communication', 'Condition-specific prep'],
    plan: 'Premium ($9.99 one-time)',
    category: 'Strategy',
  },
  {
    icon: Search,
    title: 'Secondary Condition Finder',
    short: 'Discover conditions secondary to your rated disabilities',
    detail: 'Find medically recognized secondary conditions linked to your already service-connected disabilities.',
    capabilities: ['Secondary connections', 'Medical research links', 'Claim strategy tips', 'Condition pairing'],
    plan: 'Premium ($9.99 one-time)',
    category: 'Strategy',
  },
  {
    icon: Scale,
    title: 'Bilateral Factor Calculator',
    short: 'Calculate the bilateral factor for paired conditions',
    detail: 'When you have disabilities affecting both sides of the body, the bilateral factor can increase your combined rating.',
    capabilities: ['Bilateral math', 'Paired condition detection', 'Rating impact preview', 'VA formula explanation'],
    plan: 'Premium ($9.99 one-time)',
    category: 'Calculators',
  },
  {
    icon: TrendingUp,
    title: 'Back Pay Estimator',
    short: 'Estimate your potential retroactive VA payment',
    detail: 'Calculate how much back pay you could receive based on your expected rating, effective date, and dependents.',
    capabilities: ['Retroactive estimates', 'Dependent adjustments', 'Effective date scenarios', 'Monthly breakdowns'],
    plan: 'Premium ($9.99 one-time)',
    category: 'Calculators',
  },
  // ── Premium: Package & Export ────────────────────
  {
    icon: Package,
    title: 'Claim Packet Builder',
    short: 'Compile your complete claim package for submission',
    detail: 'Gather all your statements, evidence, and documents into a single organized claim packet ready for submission.',
    capabilities: ['Document compilation', 'Organized sections', 'Submission checklist', 'PDF export'],
    plan: 'Premium ($9.99 one-time)',
    category: 'Package & Export',
  },
  {
    icon: Lock,
    title: 'Document Vault',
    short: 'Securely store and organize all your evidence',
    detail: 'Upload medical records, service documents, and supporting evidence—encrypted and sorted by condition.',
    capabilities: ['AES-256 encryption', 'Document categorization', 'Evidence management', 'Secure storage'],
    plan: 'Premium ($9.99 one-time)',
    category: 'Package & Export',
  },
  {
    icon: BookOpen,
    title: 'Appeals & Decision Review Guide',
    short: 'Navigate the appeals process after a denial',
    detail: 'Comprehensive guide to supplemental claims, higher-level reviews, and Board of Veterans Appeals with case law references.',
    capabilities: ['Appeal lane guidance', 'Deadline tracking', 'Case law references', 'Evidence tips'],
    plan: 'Premium ($9.99 one-time)',
    category: 'Package & Export',
  },
  // ── Premium: Claim Management ───────────────────
  {
    icon: Briefcase,
    title: 'Service History',
    short: 'Document deployments, stations, and duty assignments',
    detail: 'Complete service history tracker for duty stations, deployments, MOSs, and exposure to hazards during service.',
    capabilities: ['Deployment tracking', 'Duty stations', 'MOS documentation', 'Hazard exposure'],
    plan: 'Premium ($9.99 one-time)',
    category: 'Claim Management',
  },
  {
    icon: TrendingUp,
    title: 'Claim Journey',
    short: 'Track your claim progress from start to decision',
    detail: 'Visual progress tracker through each phase of the VA claim process with milestone tracking and next-step guidance.',
    capabilities: ['Phase tracking', 'Milestone alerts', 'Progress visualization', 'Next-step guidance'],
    plan: 'Free Forever',
    category: 'Claim Management',
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
          <Icon size={24} style={{ color: 'var(--gold-md)' }} />
        </div>

        <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: 'var(--gold-md)' }}>
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
                <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--gold-md)' }} />
                {cap}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold"
          style={{
            backgroundColor: 'rgba(212,175,55,0.15)',
            color: 'var(--gold-md)',
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
                    <Icon size={20} style={{ color: 'var(--gold-md)' }} />
                  </div>
                  <div className="min-w-0">
                    <span
                      className="text-[10px] font-semibold tracking-[0.15em] uppercase block mb-1"
                      style={{ color: 'var(--gold-md)' }}
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
                      backgroundColor: card.plan.startsWith('Free')
                        ? 'rgba(34,197,94,0.12)'
                        : 'rgba(212,175,55,0.12)',
                      color: card.plan.startsWith('Free')
                        ? '#22C55E'
                        : '#D4AF37',
                    }}
                  >
                    {card.plan.startsWith('Free') ? 'Free' : 'Premium'}
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
              <Icon size={18} style={{ color: 'var(--gold-md)' }} />
            </div>
            <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: 'var(--gold-md)' }}>
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
            Swipe through every tool built into the app—from free calculators to premium document builders. Tap to explore.
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
              Every card is a real tool built into the app—from free calculators to premium document builders. Click to explore.
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
