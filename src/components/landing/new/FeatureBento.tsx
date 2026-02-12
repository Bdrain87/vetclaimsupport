import { useState, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  HEADING_H2_STYLE,
  PILL_STYLE,
  EASE_SMOOTH,
  GOLD_GRADIENT,
  GOLD_GRADIENT_TEXT,
} from '@/lib/landing-animations';
import {
  ClipboardCheck,
  Map,
  Wand2,
  Flag,
  Scale,
  FileText,
  Search,
  LayoutGrid,
  FileEdit,
  Users,
  AlertTriangle,
  Scroll,
  Package,
  FolderOpen,
  Download,
  Heart,
  Activity,
  Moon,
  Brain,
  Pill,
  Building2,
  BookOpen,
  Clock,
  MapPin,
  Calculator,
  Percent,
  DollarSign,
  Car,
  Stethoscope,
  FileBox,
  BookMarked,
  Briefcase,
  Biohazard,
  Wrench,
  Landmark,
  Library,
  Globe,
  Languages,
  CalendarCheck,
  BookOpenCheck,
  Database,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ────────────────────────────────────────────────
 * Data
 * ──────────────────────────────────────────────── */

interface Tool {
  icon: LucideIcon;
  title: string;
  short: string;
  detail: string;
  category: string;
}

interface Category {
  name: string;
  tools: Omit<Tool, 'category'>[];
}

const CATEGORIES: Category[] = [
  {
    name: 'Claim Management',
    tools: [
      { icon: ClipboardCheck, title: 'Claim Checklist', short: 'Step-by-step filing checklist', detail: 'A comprehensive checklist that walks you through every step of preparing and filing a VA disability claim, ensuring nothing falls through the cracks.' },
      { icon: Map, title: 'Claim Journey', short: 'Visual claim timeline tracker', detail: 'Track your claim from Intent to File through decision with a visual timeline. Know exactly where you are in the process and what comes next.' },
      { icon: Wand2, title: 'Strategy Wizard', short: 'Personalized claim strategy', detail: 'Answer a few questions about your situation and get a tailored claim strategy — whether to file standard, FDC, or BDD, and in what order.' },
      { icon: Flag, title: 'Intent to File', short: 'Lock in your effective date', detail: 'Understand and track your Intent to File date. Protect your effective date while you gather evidence and prepare your claim.' },
      { icon: Scale, title: 'Decision Review', short: 'Appeal & review options', detail: 'Compare Supplemental Claims, Higher-Level Reviews, and Board Appeals side by side. Know your deadlines and pick the best path forward.' },
      { icon: FileText, title: 'Appeals Guide', short: 'Navigate the appeals process', detail: 'Step-by-step guidance through the VA appeals process including timelines, evidence requirements, and what to expect at each stage.' },
      { icon: Search, title: 'Secondary Condition Finder', short: 'Discover linked conditions', detail: 'Search our database of conditions with mapped secondary connections. Discover conditions linked to your primary disabilities that may be worth researching further.' },
      { icon: LayoutGrid, title: 'Claim Tools Hub', short: 'Central dashboard for all tools', detail: 'Your central hub for managing claims. Quick access to every tool, organized by where you are in the process.' },
    ],
  },
  {
    name: 'Documents & Statements',
    tools: [
      { icon: FileEdit, title: 'Personal Statement Generator', short: 'Draft your personal statement', detail: 'Generate a structured draft personal statement with prompts aligned to VA rating criteria. Covers onset, frequency, severity, and impact on daily life.' },
      { icon: Users, title: 'Buddy Statement Organizer', short: 'Organize lay evidence', detail: 'Create and organize buddy statements from fellow service members, family, and friends. Includes guided prompts so witnesses know exactly what to include.' },
      { icon: AlertTriangle, title: 'Stressor Statement Generator', short: 'Document PTSD stressors', detail: 'Structured prompts specifically designed for PTSD and mental health stressor statements. Helps you document events with the detail the VA requires.' },
      { icon: Scroll, title: 'Nexus Letter Generator', short: 'Draft nexus letter templates', detail: 'Generate a draft nexus letter template with proper medical-legal language connecting your condition to service. Share with your provider for review and signature.' },
      { icon: Package, title: 'Evidence Packet Builder', short: 'Compile submission-ready packets', detail: 'Compile all your evidence — statements, medical records, buddy letters, and supporting documents — into an organized packet ready for submission.' },
      { icon: FolderOpen, title: 'Document Organizer', short: 'Manage all claim documents', detail: 'Keep every document organized by condition and type. Tag, search, and manage your medical records, service records, and supporting evidence in one place.' },
      { icon: Download, title: 'Export System', short: 'Export documents as PDF', detail: 'Export any document, statement, or packet as a clean PDF formatted for VA submission. Print-ready and professional.' },
    ],
  },
  {
    name: 'Health Tracking',
    tools: [
      { icon: Heart, title: 'Health Hub', short: 'Central health dashboard', detail: 'Your central health dashboard showing trends across all trackers. See patterns in symptoms, sleep, and medications at a glance.' },
      { icon: Activity, title: 'Health Log', short: 'Daily health journal', detail: 'Log daily health entries with severity ratings that map directly to VA rating criteria. Build a consistent record of your condition over time.' },
      { icon: ClipboardCheck, title: 'Symptom Tracker', short: 'Track symptom frequency & severity', detail: 'Track individual symptoms with frequency, severity, and duration. Generates reports showing trends that map to VA diagnostic codes.' },
      { icon: Moon, title: 'Sleep Tracker', short: 'Log sleep patterns & disturbances', detail: 'Log sleep quality, duration, disturbances, and nightmares. Particularly useful for sleep apnea, PTSD, and insomnia claims.' },
      { icon: Brain, title: 'Migraine Tracker', short: 'Record migraine episodes', detail: 'Record migraine episodes with duration, severity, triggers, and prostrating status — the key metric for VA migraine ratings.' },
      { icon: Pill, title: 'Medication Tracker', short: 'Track medications & side effects', detail: 'Track all medications, dosages, and side effects. Document how treatments affect your daily functioning and note any adverse reactions.' },
      { icon: Building2, title: 'Medical Visits Log', short: 'Log provider appointments', detail: 'Log every medical appointment with provider details, diagnoses, and follow-up notes. Creates a clear treatment history for your claim.' },
      { icon: BookOpen, title: 'Symptom Journal', short: 'Free-form symptom diary', detail: 'A free-form journal for capturing how your conditions affect daily life. Write naturally — entries are tagged to relevant conditions automatically.' },
      { icon: Clock, title: 'Medical Timeline', short: 'Visualize your medical history', detail: 'A chronological timeline of all medical events, treatments, and diagnoses. See your full health journey from service to present.' },
      { icon: MapPin, title: 'Body Map', short: 'Visual pain & symptom mapping', detail: 'Tap on a body diagram to pinpoint where you experience pain and symptoms. Visual evidence that shows the full scope of your conditions.' },
    ],
  },
  {
    name: 'Calculators',
    tools: [
      { icon: Calculator, title: 'Combined Rating Calculator', short: 'Calculate VA combined rating', detail: 'Enter your individual ratings and instantly see your combined VA disability rating using the official VA math formula.' },
      { icon: Percent, title: 'Bilateral Factor Calculator', short: 'Calculate bilateral adjustments', detail: 'Calculate the bilateral factor for paired extremity conditions. Understand how bilateral conditions affect your combined rating.' },
      { icon: DollarSign, title: 'Back Pay Estimator', short: 'Estimate retroactive pay', detail: 'Estimate potential back pay from your effective date based on rating, dependents, and timeline. For educational purposes only.' },
      { icon: Car, title: 'Travel Pay Calculator', short: 'Calculate VA travel reimbursement', detail: 'Calculate mileage reimbursement for VA medical appointments. Enter your facility and get an estimate of what you can claim.' },
    ],
  },
  {
    name: 'C&P Exam Prep',
    tools: [
      { icon: Stethoscope, title: 'C&P Exam Prep Guide', short: 'Prepare for your exam', detail: 'Condition-specific prep guides covering what the examiner will evaluate, common questions, range-of-motion tests, and tips for accurately representing your worst days.' },
      { icon: FileBox, title: 'C&P Exam Packet', short: 'Build your exam-day packet', detail: 'Compile everything you need for exam day: condition summaries, medication lists, symptom logs, and key talking points in one printable packet.' },
      { icon: BookMarked, title: 'DBQ Guide', short: 'Understand DBQ forms', detail: 'Review the Disability Benefits Questionnaires examiners use for your conditions. Know exactly what will be measured and documented.' },
    ],
  },
  {
    name: 'Service History & Exposures',
    tools: [
      { icon: Briefcase, title: 'Service History Tracker', short: 'Organize service records', detail: 'Enter your duty stations, deployments, MOSs, and service dates. Automatically cross-references against known hazard exposures and presumptive conditions.' },
      { icon: Biohazard, title: 'Exposure Tracker', short: 'Document toxic exposures', detail: 'Document your exposure to burn pits, Agent Orange, radiation, contaminated water, and other hazards. Maps exposures to presumptive conditions.' },
      { icon: Wrench, title: 'Equipment Tracker', short: 'Track equipment & noise exposure', detail: 'Log military equipment you operated and noise levels you were exposed to. Particularly useful for hearing loss and tinnitus claims.' },
      { icon: Landmark, title: 'PACT Act Guide', short: 'PACT Act eligibility info', detail: 'Check which PACT Act provisions apply to your service era and locations. Understand new presumptive conditions and expanded eligibility.' },
    ],
  },
  {
    name: 'VA Reference & Education',
    tools: [
      { icon: Library, title: 'VA Forms Library', short: 'Find the right VA forms', detail: 'Search and browse VA forms with plain-English descriptions. Know which forms you need and when to use them.' },
      { icon: Globe, title: 'VA Resources Directory', short: 'Curated VA resource links', detail: 'A curated directory of official VA resources, VSO contacts, crisis lines, and benefit programs — all verified and up to date.' },
      { icon: Languages, title: 'VA-Speak Translator', short: 'Decode VA jargon instantly', detail: 'Paste any VA letter, CFR section, or rating decision and get plain English instantly. Finally understand what they actually said.' },
      { icon: CalendarCheck, title: 'BDD Guide', short: 'Benefits Delivery at Discharge', detail: 'A complete guide to filing your claim 180–90 days before separation. Get your rating decision faster by filing before you leave service.' },
      { icon: BookOpenCheck, title: 'Condition Guides', short: 'Condition-specific info', detail: 'In-depth guides for common VA conditions covering rating criteria, required evidence, C&P exam expectations, and secondary connections.' },
      { icon: Database, title: 'Reference Database', short: 'Searchable conditions database', detail: 'Search our database of 780+ conditions with diagnostic codes, rating criteria, and mapped secondary connections.' },
    ],
  },
];

const ALL_CATEGORY_NAMES = ['All', ...CATEGORIES.map((c) => c.name)];

/* Flatten all tools with category tag */
const ALL_TOOLS: Tool[] = CATEGORIES.flatMap((cat) =>
  cat.tools.map((t) => ({ ...t, category: cat.name })),
);

/* ────────────────────────────────────────────────
 * Category Filter Pills
 * ──────────────────────────────────────────────── */

function CategoryFilter({
  active,
  onChange,
}: {
  active: string;
  onChange: (name: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
      {ALL_CATEGORY_NAMES.map((name) => {
        const isActive = active === name;
        return (
          <button
            key={name}
            onClick={() => onChange(name)}
            className="flex-shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium tracking-wide uppercase transition-all duration-200"
            style={
              isActive
                ? { background: GOLD_GRADIENT, color: '#000', border: '1px solid transparent' }
                : { background: 'transparent', color: '#BF953F', border: '1px solid rgba(191, 149, 63, 0.25)' }
            }
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}

/* ────────────────────────────────────────────────
 * Detail Modal (appears on card click)
 * ──────────────────────────────────────────────── */

function DetailModal({
  tool,
  onClose,
}: {
  tool: Tool;
  onClose: () => void;
}) {
  const Icon = tool.icon;
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Card */}
      <motion.div
        className="relative z-10 w-full max-w-md rounded-2xl p-6"
        style={{
          backgroundColor: '#111',
          border: '1px solid rgba(191, 149, 63, 0.3)',
          boxShadow: '0 0 60px rgba(191, 149, 63, 0.1), 0 25px 50px rgba(0, 0, 0, 0.5)',
        }}
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        transition={{ duration: 0.25, ease: EASE_SMOOTH }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#6B7280' }}
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
          style={{
            backgroundColor: 'rgba(191, 149, 63, 0.1)',
            border: '1px solid rgba(191, 149, 63, 0.2)',
          }}
        >
          <Icon size={24} style={{ color: '#BF953F' }} />
        </div>

        {/* Category badge */}
        <span
          className="text-[10px] font-medium tracking-widest uppercase"
          style={{ color: 'rgba(191, 149, 63, 0.6)' }}
        >
          {tool.category}
        </span>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mt-1 mb-2">{tool.title}</h3>

        {/* Short */}
        <p className="text-sm mb-4" style={{ color: '#BF953F' }}>{tool.short}</p>

        {/* Detail */}
        <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>{tool.detail}</p>
      </motion.div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────
 * 3D Perspective Card
 * ──────────────────────────────────────────────── */

function PerspectiveCard({
  tool,
  index,
  onClick,
}: {
  tool: Tool;
  index: number;
  onClick: () => void;
}) {
  const Icon = tool.icon;
  const delay = Math.min(index * 0.02, 0.8);

  return (
    <motion.div
      className="cursor-pointer group"
      style={{ transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.4, delay, ease: EASE_SMOOTH }}
      whileHover={{
        z: 50,
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
      onClick={onClick}
    >
      <div
        className="rounded-xl p-4 h-full transition-all duration-200 group-hover:shadow-[0_0_30px_rgba(191,149,63,0.15)]"
        style={{
          backgroundColor: 'rgba(17, 17, 17, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
          style={{
            backgroundColor: 'rgba(191, 149, 63, 0.08)',
            border: '1px solid rgba(191, 149, 63, 0.15)',
          }}
        >
          <Icon size={18} style={{ color: '#BF953F' }} />
        </div>

        {/* Title */}
        <h4 className="text-sm font-semibold text-white leading-tight mb-1 group-hover:text-[#FCF6BA] transition-colors duration-200">
          {tool.title}
        </h4>

        {/* Short desc */}
        <p className="text-xs leading-snug" style={{ color: '#6B7280' }}>
          {tool.short}
        </p>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────
 * FeatureBento — 3D Perspective Grid
 * ──────────────────────────────────────────────── */
export function FeatureBento() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  /* Scroll-linked 3D transform */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  /* As section scrolls into view: dramatic angle → flatter */
  const rotateX = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [55, 25, 12, 35]);
  const rotateZ = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [-18, -8, -3, -10]);
  const gridScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.75, 0.85, 0.88, 0.8]);
  const gridY = useTransform(scrollYProgress, [0, 0.3, 0.5], [120, 0, -20]);

  /* Filter tools by active category */
  const filteredTools = useMemo(() => {
    if (activeCategory === 'All') return ALL_TOOLS;
    return ALL_TOOLS.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  function handleCategoryChange(name: string) {
    setActiveCategory(name);
    setSelectedTool(null);
  }

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative overflow-hidden"
      style={{ backgroundColor: '#000000', scrollMarginTop: '5rem' }}
    >
      {/* Header — sits above the 3D grid, flat/normal */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-20 md:pt-28">
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
          className="text-lg max-w-2xl mx-auto mb-10 text-center"
          style={{ color: '#9CA3AF' }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE_SMOOTH }}
        >
          From claim strategy to document generation, health tracking to C&P
          exam prep — everything you need organized across 7 categories.
        </motion.p>

        {/* Category filter */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15, ease: EASE_SMOOTH }}
        >
          <CategoryFilter active={activeCategory} onChange={handleCategoryChange} />
        </motion.div>
      </div>

      {/* 3D Perspective Grid Container */}
      <div
        className="relative pb-20 md:pb-32"
        style={{ perspective: '1800px', perspectiveOrigin: '50% 30%' }}
      >
        <motion.div
          className="mx-auto max-w-7xl px-4 sm:px-6"
          style={{
            rotateX,
            rotateZ,
            scale: gridScale,
            y: gridY,
            transformStyle: 'preserve-3d',
            transformOrigin: 'center center',
          }}
        >
          {/* Card grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <AnimatePresence mode="popLayout">
              {filteredTools.map((tool, i) => (
                <PerspectiveCard
                  key={tool.title}
                  tool={tool}
                  index={i}
                  onClick={() => setSelectedTool(tool)}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Bottom fade to black */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #000000 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedTool && (
          <DetailModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
