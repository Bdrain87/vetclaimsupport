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
  FileEdit,
  Users,
  AlertTriangle,
  Scroll,
  Activity,
  Moon,
  Brain,
  Pill,
  Heart,
  Building2,
  Clock,
  MapPin,
  Stethoscope,
  FileBox,
  BookMarked,
  Calculator,
  Percent,
  DollarSign,
  Car,
  ClipboardCheck,
  Map as MapIcon,
  FolderOpen,
  Package,
  Lock,
  Flag,
  Briefcase,
  Biohazard,
  Wrench,
  Landmark,
  Search,
  Library,
  Languages,
  Scale,
  FileText,
  CalendarCheck,
  BookOpenCheck,
  Database,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ────────────────────────────────────────────────
 * Card Data — 37 Tools
 * ──────────────────────────────────────────────── */

interface CardData {
  icon: LucideIcon;
  title: string;
  short: string;
  detail: string;
  capabilities: string[];
  plan: string;
  category: string;
  aiDisclaimer?: boolean;
}

const CARDS: CardData[] = [
  /* ── Generators & Writers ── */
  {
    icon: FileEdit,
    title: 'Personal Statement Writer',
    short: 'Auto-generates your personal statement from your service and condition details',
    detail: 'Generates structured draft personal statements using AI, aligned to VA rating criteria. Covers onset, frequency, severity, and impact on daily life.',
    capabilities: ['Guided prompts for each condition', 'Outputs VA-formatted drafts', 'Covers onset, severity, and daily impact', 'Export as PDF'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Generators & Writers',
    aiDisclaimer: true,
  },
  {
    icon: Users,
    title: 'Buddy Statement Builder',
    short: 'Creates structured buddy/lay statements for supporting evidence',
    detail: 'AI-assisted tool that helps fellow service members, family, and friends write effective buddy statements with guided prompts.',
    capabilities: ['Guided witness prompts', 'Structured output format', 'Multiple statement support', 'Print-ready formatting'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Generators & Writers',
    aiDisclaimer: true,
  },
  {
    icon: AlertTriangle,
    title: 'Stressor Statement Creator',
    short: 'Builds PTSD stressor statements with guided prompts',
    detail: 'AI-powered structured prompts specifically designed for PTSD and mental health stressor statements. Helps document events with the detail the VA requires.',
    capabilities: ['PTSD-specific guided prompts', 'Structured event documentation', 'VA-required detail format', 'Sensitive content handling'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Generators & Writers',
    aiDisclaimer: true,
  },
  {
    icon: Scroll,
    title: 'Nexus Letter Template',
    short: 'Generates nexus letter templates to bring to your doctor',
    detail: 'AI-generated draft nexus letter templates with proper medical-legal language connecting your condition to service. Share with your provider for review and signature.',
    capabilities: ['Medical-legal language templates', 'Condition-to-service connection', 'Doctor-ready format', 'Customizable per condition'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Generators & Writers',
    aiDisclaimer: true,
  },

  /* ── Health Tracking ── */
  {
    icon: Activity,
    title: 'Symptom Tracker',
    short: 'Log frequency, severity, and triggers for every condition',
    detail: 'Track individual symptoms with frequency, severity, and duration. Generates reports showing trends that map to VA diagnostic codes.',
    capabilities: ['Frequency and severity logging', 'Trigger identification', 'Trend reports over time', 'Maps to VA diagnostic codes'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Health Tracking',
  },
  {
    icon: Moon,
    title: 'Sleep Tracker',
    short: 'Track sleep quality, duration, and disturbances nightly',
    detail: 'Log sleep quality, duration, disturbances, and nightmares. Useful for sleep apnea, PTSD, and insomnia documentation.',
    capabilities: ['Nightly sleep quality logging', 'Disturbance tracking', 'Pattern visualization', 'Relevant to sleep apnea and PTSD'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Health Tracking',
  },
  {
    icon: Brain,
    title: 'Migraine Log',
    short: 'Document triggers, duration, and severity of migraines',
    detail: 'Record migraine episodes with duration, severity, triggers, and prostrating status — the key metric for VA migraine ratings.',
    capabilities: ['Episode logging with timestamps', 'Prostrating status tracking', 'Trigger documentation', 'VA rating criteria alignment'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Health Tracking',
  },
  {
    icon: Pill,
    title: 'Medication Tracker',
    short: 'Track prescriptions, dosages, and side effects',
    detail: 'Track all medications, dosages, and side effects. Document how treatments affect your daily functioning and note any adverse reactions.',
    capabilities: ['Prescription management', 'Dosage tracking', 'Side effect documentation', 'Treatment effectiveness notes'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Health Tracking',
  },
  {
    icon: Heart,
    title: 'Health Journal',
    short: 'Daily health log connecting symptoms to conditions',
    detail: 'A free-form journal for capturing how your conditions affect daily life. Write naturally — entries are tagged to relevant conditions automatically.',
    capabilities: ['Daily free-form entries', 'Auto-tagged to conditions', 'Severity ratings', 'Maps to VA rating criteria'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Health Tracking',
  },
  {
    icon: Building2,
    title: 'Medical Visit Log',
    short: 'Record appointments, diagnoses, and treatment plans',
    detail: 'Log every medical appointment with provider details, diagnoses, and follow-up notes. Creates a clear treatment history for your records.',
    capabilities: ['Appointment logging', 'Provider and diagnosis tracking', 'Follow-up reminders', 'Treatment history timeline'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Health Tracking',
  },
  {
    icon: Clock,
    title: 'Medical Timeline',
    short: 'Visual chronological view of your entire medical history',
    detail: 'A chronological timeline of all medical events, treatments, and diagnoses. See your full health journey from service to present.',
    capabilities: ['Chronological event view', 'Service-to-present timeline', 'Treatment and diagnosis tracking', 'Visual history overview'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Health Tracking',
  },
  {
    icon: MapPin,
    title: 'Body Map',
    short: 'Interactive body diagram to mark affected areas',
    detail: 'Tap on a body diagram to pinpoint where you experience pain and symptoms. Visual evidence that shows the full scope of your conditions.',
    capabilities: ['Interactive body diagram', 'Pinpoint pain locations', 'Track changes over time', 'Visual condition documentation'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Health Tracking',
  },

  /* ── Exam Prep ── */
  {
    icon: Stethoscope,
    title: 'C&P Exam Prep',
    short: 'Know what to expect and how to prepare for every exam',
    detail: 'Condition-specific prep guides covering what the examiner evaluates, common questions, range-of-motion tests, and tips for accurately representing your conditions.',
    capabilities: ['Condition-specific guides', 'Common exam questions', 'Range-of-motion benchmarks', 'Exam day tips'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Exam Prep',
  },
  {
    icon: FileBox,
    title: 'C&P Exam Packet',
    short: 'Organized document packet to bring to your exam',
    detail: 'Compile everything you need for exam day: condition summaries, medication lists, symptom logs, and key talking points in one printable packet.',
    capabilities: ['Condition summary sheets', 'Medication and symptom lists', 'Key talking points', 'Print-ready PDF export'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Exam Prep',
  },
  {
    icon: BookMarked,
    title: 'DBQ Reference',
    short: 'Field-by-field breakdown of Disability Benefits Questionnaires',
    detail: 'Review the Disability Benefits Questionnaires examiners use for your conditions. Know exactly what will be measured and documented.',
    capabilities: ['Field-by-field DBQ breakdowns', 'Condition-specific forms', 'Understand what\'s measured', 'Examiner perspective'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Exam Prep',
  },

  /* ── Calculators ── */
  {
    icon: Calculator,
    title: 'Combined Rating Calculator',
    short: 'Calculate your combined VA disability rating using VA math',
    detail: 'Enter your individual ratings and instantly see your combined VA disability rating using the official VA math formula.',
    capabilities: ['Official VA math formula', 'Unlimited rating inputs', 'Instant calculation', 'Bilateral factor support'],
    plan: 'Free',
    category: 'Calculators',
  },
  {
    icon: Percent,
    title: 'Bilateral Factor Calculator',
    short: 'Compute bilateral adjustments for paired conditions',
    detail: 'Calculate the bilateral factor for paired extremity conditions. Understand how bilateral conditions affect your combined rating.',
    capabilities: ['Paired extremity calculations', 'Bilateral factor rules', 'Combined rating impact', 'Educational explanations'],
    plan: 'Free',
    category: 'Calculators',
  },
  {
    icon: DollarSign,
    title: 'Back Pay Estimator',
    short: 'Estimate your potential retroactive compensation',
    detail: 'Estimate potential back pay from your effective date based on rating, dependents, and timeline. For educational and informational purposes only.',
    capabilities: ['Effective date calculations', 'Dependent adjustments', 'Monthly and total estimates', 'Educational purposes only'],
    plan: 'Free',
    category: 'Calculators',
  },
  {
    icon: Car,
    title: 'Travel Pay Calculator',
    short: 'Calculate VA appointment travel reimbursement',
    detail: 'Calculate mileage reimbursement for VA medical appointments. Enter your facility and get an estimate of what you can claim.',
    capabilities: ['Mileage reimbursement rates', 'Facility distance lookup', 'Per-appointment estimates', 'Current VA rates'],
    plan: 'Free',
    category: 'Calculators',
  },

  /* ── Claim Organization ── */
  {
    icon: ClipboardCheck,
    title: 'Claim Checklist',
    short: 'Track every requirement for your claim submission',
    detail: 'A comprehensive checklist that walks you through every step of preparing and filing a VA disability claim, ensuring nothing is missed.',
    capabilities: ['Step-by-step filing guide', 'Progress tracking', 'Requirement checklists', 'Submission readiness check'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Claim Organization',
  },
  {
    icon: MapIcon,
    title: 'Claim Journey',
    short: 'Visual timeline of your claim through the VA system',
    detail: 'Track your claim from Intent to File through decision with a visual timeline. Know exactly where you are in the process and what comes next.',
    capabilities: ['Visual claim timeline', 'Status tracking', 'Next-step guidance', 'Milestone notifications'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Claim Organization',
  },
  {
    icon: FolderOpen,
    title: 'Document Organizer',
    short: 'Manage and organize all your evidence files',
    detail: 'Keep every document organized by condition and type. Tag, search, and manage your medical records, service records, and supporting evidence.',
    capabilities: ['Tag and categorize documents', 'Search by condition or type', 'Medical and service records', 'Evidence organization'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Claim Organization',
  },
  {
    icon: Package,
    title: 'Evidence Packet Builder',
    short: 'Compile everything into one submission-ready package',
    detail: 'Compile all your evidence — statements, medical records, buddy letters, and supporting documents — into an organized packet ready for submission.',
    capabilities: ['Compile all evidence types', 'Organized packet structure', 'PDF export', 'Submission-ready format'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Claim Organization',
  },
  {
    icon: Lock,
    title: 'Document Vault',
    short: 'Secure storage for all your claim documents',
    detail: 'All data stored locally on your device by default. Optional encrypted storage available. Your documents stay private and under your control.',
    capabilities: ['Local-first storage', 'Optional encryption', 'Privacy by default', 'Your data, your device'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Claim Organization',
  },
  {
    icon: Flag,
    title: 'Intent to File Tracker',
    short: 'Create and track your ITF with deadline alerts',
    detail: 'Understand and track your Intent to File date. Protect your effective date while you gather evidence and prepare your claim.',
    capabilities: ['ITF date tracking', 'Deadline countdown', 'Effective date protection', 'Filing reminders'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Claim Organization',
  },

  /* ── Service History ── */
  {
    icon: Briefcase,
    title: 'Service History Log',
    short: 'Record deployments, stations, dates, and duties',
    detail: 'Enter your duty stations, deployments, MOSs, and service dates. Automatically cross-references against known hazard exposures and presumptive conditions.',
    capabilities: ['Deployment tracking', 'Duty station records', 'MOS documentation', 'Exposure cross-referencing'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Service History',
  },
  {
    icon: Biohazard,
    title: 'Exposure Tracker',
    short: 'Document burn pits, Agent Orange, radiation, and other exposures',
    detail: 'Document your exposure to burn pits, Agent Orange, radiation, contaminated water, and other hazards. Maps exposures to presumptive conditions.',
    capabilities: ['Burn pit documentation', 'Agent Orange tracking', 'Radiation exposure logs', 'Presumptive condition mapping'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Service History',
  },
  {
    icon: Wrench,
    title: 'Equipment Tracker',
    short: 'Track prosthetics and assistive devices',
    detail: 'Log military equipment you operated and noise levels you were exposed to. Useful for hearing loss and tinnitus documentation.',
    capabilities: ['Equipment operation logs', 'Noise exposure tracking', 'Hearing loss documentation', 'Tinnitus support'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'Service History',
  },
  {
    icon: Landmark,
    title: 'PACT Act Guide',
    short: 'Check your eligibility under the PACT Act',
    detail: 'Check which PACT Act provisions apply to your service era and locations. Understand new presumptive conditions and expanded eligibility.',
    capabilities: ['Eligibility checker', 'Service era filtering', 'Presumptive condition lists', 'Latest PACT Act updates'],
    plan: 'Free',
    category: 'Service History',
  },

  /* ── VA Reference ── */
  {
    icon: Search,
    title: 'Secondary Condition Finder',
    short: 'Discover related conditions you may not know about',
    detail: 'Search our database of conditions with mapped secondary connections. Discover conditions linked to your primary disabilities for further research.',
    capabilities: ['Secondary condition database', 'Primary-to-secondary mapping', 'Research-grade connections', 'Condition search'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'VA Reference',
  },
  {
    icon: Library,
    title: 'VA Forms Library',
    short: 'Every VA form with instructions and filing guidance',
    detail: 'Search and browse VA forms with plain-English descriptions. Know which forms you need and when to use them.',
    capabilities: ['Searchable form database', 'Plain-English descriptions', 'Filing instructions', 'Form selection guidance'],
    plan: 'Free',
    category: 'VA Reference',
  },
  {
    icon: Languages,
    title: 'VA-Speak Translator',
    short: 'Decode VA jargon and abbreviations',
    detail: 'Paste any VA letter, CFR section, or rating decision and get plain English instantly. Finally understand what they actually said.',
    capabilities: ['VA letter translation', 'CFR section decoder', 'Rating decision interpreter', 'Plain English output'],
    plan: 'Free',
    category: 'VA Reference',
  },
  {
    icon: Scale,
    title: 'Decision Review Guide',
    short: 'Understand your options after a VA decision',
    detail: 'Compare Supplemental Claims, Higher-Level Reviews, and Board Appeals side by side. Know your deadlines and pick the best path forward.',
    capabilities: ['Side-by-side comparison', 'Deadline tracking', 'Path selection guidance', 'Requirements overview'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'VA Reference',
  },
  {
    icon: FileText,
    title: 'Appeals Guide',
    short: 'Step-by-step walkthrough of the appeals process',
    detail: 'Step-by-step guidance through the VA appeals process including timelines, evidence requirements, and what to expect at each stage.',
    capabilities: ['Stage-by-stage guidance', 'Timeline expectations', 'Evidence requirements', 'Process overview'],
    plan: 'Included in Launch Plan ($4.99/mo)',
    category: 'VA Reference',
  },
  {
    icon: CalendarCheck,
    title: 'BDD Guide',
    short: 'Benefits Delivery at Discharge for transitioning members',
    detail: 'A complete guide to filing your claim 180–90 days before separation. Get your rating decision faster by filing before you leave service.',
    capabilities: ['Pre-separation filing guide', '180–90 day timeline', 'BDD requirements', 'Transition checklist'],
    plan: 'Free',
    category: 'VA Reference',
  },
  {
    icon: BookOpenCheck,
    title: 'Condition Guides',
    short: 'How the VA evaluates and rates each condition',
    detail: 'In-depth guides for common VA conditions covering rating criteria, required evidence, C&P exam expectations, and secondary connections.',
    capabilities: ['Rating criteria breakdowns', 'Required evidence lists', 'C&P exam expectations', 'Secondary connections'],
    plan: 'Free',
    category: 'VA Reference',
  },
  {
    icon: Database,
    title: 'Rating Criteria Reference',
    short: 'VA regulations, rating schedules, and procedures',
    detail: 'Search our database of 780+ conditions with diagnostic codes, rating criteria, and mapped secondary connections.',
    capabilities: ['780+ conditions database', 'Diagnostic code lookup', 'Rating schedule reference', 'Secondary condition mapping'],
    plan: 'Free',
    category: 'VA Reference',
  },
];

/* ────────────────────────────────────────────────
 * Shared Styles
 * ──────────────────────────────────────────────── */

const SILVER_GRADIENT = 'linear-gradient(135deg, #E8E8E8 0%, #D0D0D0 25%, #B8B8B8 50%, #D0D0D0 75%, #E8E8E8 100%)';
const SILVER_GRADIENT_LIGHT = 'linear-gradient(135deg, #F0F0F0 0%, #E0E0E0 25%, #CCCCCC 50%, #E0E0E0 75%, #F0F0F0 100%)';

const CARD_SHADOW = '0 1px 3px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.15), 0 12px 24px -8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.4)';
const CARD_SHADOW_ACTIVE = '0 1px 3px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.15), 0 12px 24px -8px rgba(0,0,0,0.2), 0 0 30px rgba(197,164,66,0.15), inset 0 1px 0 rgba(255,255,255,0.5)';

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
          background: SILVER_GRADIENT_LIGHT,
          color: '#0A0A0A',
          border: '1px solid rgba(255,255,255,0.4)',
          boxShadow: '0 0 40px rgba(197,164,66,0.2), inset 0 1px 0 rgba(255,255,255,0.5)',
        }}
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        transition={{ duration: 0.25, ease: EASE_SMOOTH }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.06)', color: '#333' }}
        >
          <X size={16} />
        </button>

        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
          style={{ backgroundColor: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.08)' }}
        >
          <Icon size={24} style={{ color: '#8B7332' }} />
        </div>

        <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: '#8B7332' }}>
          {card.category}
        </span>

        <h3 className="text-xl font-semibold mt-1 mb-2" style={{ color: '#0A0A0A', letterSpacing: '-0.02em' }}>
          {card.title}
        </h3>

        <p className="text-sm mb-5 leading-relaxed" style={{ color: '#333' }}>
          {card.detail}
        </p>

        {card.aiDisclaimer && (
          <p className="text-xs mb-4 italic" style={{ color: '#666' }}>
            Content is AI-generated and should be reviewed for accuracy before use.
          </p>
        )}

        <div className="mb-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#555' }}>
            Key Capabilities
          </h4>
          <ul className="space-y-1.5">
            {card.capabilities.map((cap) => (
              <li key={cap} className="flex items-start gap-2 text-sm" style={{ color: '#333' }}>
                <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: '#8B7332' }} />
                {cap}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold"
          style={{
            backgroundColor: card.plan === 'Free' ? 'rgba(0,0,0,0.06)' : 'rgba(139,115,50,0.12)',
            color: card.plan === 'Free' ? '#333' : '#8B7332',
          }}
        >
          {card.plan}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────
 * Desktop 3D Shuffling Card Deck (GSAP)
 *
 * A stack of large cards with 3D perspective. The front
 * card auto-pops out to the side and flies to the back
 * while the deck shuffles forward. Infinite loop.
 * Every card is clickable for detail modal.
 * ──────────────────────────────────────────────── */

const N = CARDS.length;
const VISIBLE = 7; // cards rendered in the visible stack
const SHUFFLE_MS = 2200; // time between shuffles

// Stack layout: isometric diagonal recession into the background
const stackPos = (i: number) => ({
  y: i * 25,
  x: i * 60,
  scale: 1 - i * 0.06,
  opacity: Math.max(0.15, 1 - i * 0.12),
  rotateZ: 0,
  rotateY: 0,
  zIndex: VISIBLE - i,
});

function DesktopCarousel({ onSelectCard }: { onSelectCard: (card: CardData) => void }) {
  // offset tracks which CARDS index is currently at the front of the stack
  const [offset, setOffset] = useState(0);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isAnimating = useRef(false);
  const isPaused = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // Derive visible cards from offset
  const getCard = (slotIdx: number) => CARDS[(offset + slotIdx) % N];

  // Apply stack positions instantly (called after each shuffle completes)
  const resetPositions = useCallback(() => {
    slotRefs.current.forEach((el, i) => {
      if (!el) return;
      const p = stackPos(i);
      gsap.set(el, {
        x: p.x,
        y: p.y,
        scale: p.scale,
        opacity: p.opacity,
        rotateZ: p.rotateZ,
        rotateY: 0,
      });
      el.style.zIndex = String(p.zIndex);
    });
  }, []);

  // Set positions on mount and whenever offset changes (new cards in slots)
  useEffect(() => {
    resetPositions();
  }, [offset, resetPositions]);

  // The shuffle animation
  const doShuffle = useCallback(() => {
    if (isAnimating.current || isPaused.current) return;
    isAnimating.current = true;

    const frontEl = slotRefs.current[0];
    if (!frontEl) {
      isAnimating.current = false;
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        // Advance the deck — front card's slot gets new data
        setOffset((prev) => (prev + 1) % N);
        isAnimating.current = false;
      },
    });

    // Front card flies out to the left with rotation
    tl.to(frontEl, {
      x: -650,
      rotateZ: -12,
      rotateY: 25,
      opacity: 0,
      scale: 0.8,
      duration: 0.75,
      ease: 'power3.inOut',
    });

    // Simultaneously shift remaining cards forward one stack position
    for (let i = 1; i < VISIBLE; i++) {
      const el = slotRefs.current[i];
      if (!el) continue;
      const newPos = stackPos(i - 1);
      tl.to(
        el,
        {
          x: newPos.x,
          y: newPos.y,
          scale: newPos.scale,
          opacity: newPos.opacity,
          rotateZ: newPos.rotateZ,
          zIndex: newPos.zIndex,
          duration: 0.55,
          ease: 'power2.out',
        },
        '<0.04',
      );
    }
  }, []);

  // Auto-shuffle timer
  useEffect(() => {
    timerRef.current = setInterval(doShuffle, SHUFFLE_MS);
    return () => clearInterval(timerRef.current);
  }, [doShuffle]);

  return (
    <div
      className="relative mx-auto flex items-center justify-center"
      style={{ height: '650px', maxWidth: '1200px' }}
    >
      {/* 3D perspective wrapper */}
      <div
        style={{
          perspective: '2000px',
          perspectiveOrigin: '50% 45%',
        }}
      >
        {/* Isometric 3D tilt for diagonal stack */}
        <div
          style={{
            position: 'relative',
            width: '560px',
            height: '400px',
            transformStyle: 'preserve-3d',
            transform: 'rotateX(10deg) rotateY(-25deg)',
          }}
        >
          {Array.from({ length: VISIBLE }).map((_, slotIdx) => {
            const card = getCard(slotIdx);
            const Icon = card.icon;
            const isFront = slotIdx === 0;

            return (
              <div
                key={`slot-${slotIdx}`}
                ref={(el) => {
                  slotRefs.current[slotIdx] = el;
                }}
                className="absolute inset-0 rounded-2xl cursor-pointer"
                style={{
                  backfaceVisibility: 'hidden',
                  pointerEvents: 'auto',
                  willChange: 'transform, opacity',
                }}
                onClick={() => onSelectCard(card)}
              >
                <div
                  className="w-full h-full rounded-2xl p-8 flex flex-col"
                  style={{
                    background: SILVER_GRADIENT,
                    border: isFront
                      ? '1px solid rgba(197,164,66,0.35)'
                      : '1px solid rgba(255,255,255,0.25)',
                    boxShadow: isFront ? CARD_SHADOW_ACTIVE : CARD_SHADOW,
                  }}
                >
                  {/* Top row: icon + category/title */}
                  <div className="flex items-start gap-5 mb-5">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.06)',
                        border: '1px solid rgba(0,0,0,0.06)',
                      }}
                    >
                      <Icon size={24} style={{ color: '#8B7332' }} />
                    </div>
                    <div className="min-w-0">
                      <span
                        className="text-[10px] font-semibold tracking-[0.15em] uppercase block mb-1"
                        style={{ color: '#8B7332' }}
                      >
                        {card.category}
                      </span>
                      <h4
                        className="text-xl font-semibold leading-tight"
                        style={{ color: '#0A0A0A', letterSpacing: '-0.02em' }}
                      >
                        {card.title}
                      </h4>
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className="text-[15px] leading-relaxed flex-1"
                    style={{ color: '#333' }}
                  >
                    {card.short}
                  </p>

                  {/* Footer */}
                  <div
                    className="flex items-center justify-between mt-4 pt-4"
                    style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
                  >
                    <span
                      className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold"
                      style={{
                        backgroundColor:
                          card.plan === 'Free'
                            ? 'rgba(0,0,0,0.06)'
                            : 'rgba(139,115,50,0.12)',
                        color: card.plan === 'Free' ? '#444' : '#8B7332',
                      }}
                    >
                      {card.plan === 'Free' ? 'Free' : 'Launch Plan'}
                    </span>
                    <span
                      className="text-[11px] font-medium"
                      style={{ color: '#999' }}
                    >
                      Click to explore →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

/* ────────────────────────────────────────────────
 * Mobile Carousel — auto-cycling single card with swipe
 * ──────────────────────────────────────────────── */

function MobileCarousel({ onSelectCard }: { onSelectCard: (card: CardData) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const goTo = useCallback((idx: number) => {
    setCurrentIndex(((idx % N) + N) % N);
  }, []);

  // Auto-advance every 3 seconds
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
              background: SILVER_GRADIENT,
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: CARD_SHADOW_ACTIVE,
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
              style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
            >
              <Icon size={18} style={{ color: '#8B7332' }} />
            </div>
            <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: '#8B7332' }}>
              {card.category}
            </span>
            <h4 className="text-base font-semibold mt-1 mb-2" style={{ color: '#0A0A0A', letterSpacing: '-0.02em' }}>
              {card.title}
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: '#333' }}>
              {card.short}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Nav arrows */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => goTo(currentIndex - 1)}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#9CA3AF' }}
          >
            <ChevronLeft size={18} />
          </button>

          <span className="text-xs tabular-nums" style={{ color: '#6B7280' }}>
            {currentIndex + 1} / {N}
          </span>

          <button
            onClick={() => goTo(currentIndex + 1)}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#9CA3AF' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
 * FeatureBento — Main Export
 * ──────────────────────────────────────────────── */

export function FeatureBento() {
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <section
      id="features"
      className="relative"
      style={{ backgroundColor: '#000000', scrollMarginTop: '5rem' }}
    >
      {/* Header */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-20 md:pt-28 pb-8 md:pb-12">
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
          className="text-3xl md:text-5xl text-white mb-3 text-center"
          style={HEADING_H2_STYLE}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05, ease: EASE_SMOOTH }}
        >
          45+ Tools That Help You{' '}
          <span style={GOLD_GRADIENT_TEXT}>Prepare</span>
        </motion.h2>

        <motion.p
          className="text-lg max-w-2xl mx-auto text-center"
          style={{ color: '#9CA3AF' }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE_SMOOTH }}
        >
          From claim preparation to document generation, health tracking to C&P
          exam prep — everything you need in one place.
        </motion.p>
      </div>

      {/* Carousel */}
      <div className="pb-16 md:pb-24">
        {isMobile ? (
          <MobileCarousel onSelectCard={setSelectedCard} />
        ) : (
          <DesktopCarousel onSelectCard={setSelectedCard} />
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <DetailModal card={selectedCard} onClose={() => setSelectedCard(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
