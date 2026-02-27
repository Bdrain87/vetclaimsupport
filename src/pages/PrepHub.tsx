import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardCheck, FileText, Users, FileSignature, AlertTriangle,
  BookOpen, ClipboardList, Languages, DollarSign, Package, FileCheck,
  Calculator, Scale, Navigation, Clock, Shield, Wrench, Share2, TrendingUp, Target, FileSearch,
  Search, Briefcase, Stethoscope, HelpCircle, GraduationCap, MapPin, Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageContainer } from '@/components/PageContainer';
import { Input } from '@/components/ui/input';

interface ToolItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  description: string;
}

const MOST_USED: ToolItem[] = [
  { label: 'Rating Calculator', icon: Calculator, route: '/claims/calculator', description: 'Calculate combined VA rating' },
  { label: 'C&P Exam Prep', icon: ClipboardCheck, route: '/prep/exam', description: 'Prepare for your compensation exam' },
  { label: 'Personal Statement', icon: FileText, route: '/prep/personal-statement', description: 'Generate your personal statement' },
  { label: 'Claim Packet Builder', icon: Package, route: '/prep/packet', description: 'Compile your full claim packet' },
];

const toolCategories: { title: string; tools: ToolItem[] }[] = [
  {
    title: 'Documents',
    tools: [
      { label: 'Personal Statement', icon: FileText, route: '/prep/personal-statement', description: 'Generate your personal statement' },
      { label: 'Buddy Statement', icon: Users, route: '/prep/buddy-statement', description: 'Build a buddy/lay statement' },
      { label: 'Doctor Summary', icon: FileSignature, route: '/prep/doctor-summary', description: 'Organize info for your clinician' },
      { label: 'Stressor Statement', icon: AlertTriangle, route: '/prep/stressor', description: 'Document PTSD stressors' },
    ],
  },
  {
    title: 'Exam Prep',
    tools: [
      { label: 'C&P Exam Prep', icon: ClipboardCheck, route: '/prep/exam', description: 'Prepare for your compensation exam' },
      { label: 'DBQ Prep', icon: ClipboardList, route: '/prep/dbq', description: 'Prep your DBQ talking points' },
      { label: 'Exam Day Packet', icon: FileCheck, route: '/prep/exam-day', description: 'Day-of checklist and talking points' },
    ],
  },
  {
    title: 'Calculators',
    tools: [
      { label: 'Rating Calculator', icon: Calculator, route: '/claims/calculator', description: 'Calculate combined VA rating' },
      { label: 'Back Pay Estimator', icon: DollarSign, route: '/prep/back-pay', description: 'Estimate potential back pay' },
      { label: 'Travel Pay', icon: Navigation, route: '/prep/travel-pay', description: 'Estimate VA travel reimbursement' },
    ],
  },
  {
    title: 'Guides',
    tools: [
      { label: 'VA Form Guide', icon: BookOpen, route: '/prep/form-guide', description: 'Step-by-step form filling help' },
      { label: 'Appeals Guide', icon: Scale, route: '/prep/appeals', description: 'Appeal lanes & verified case law' },
      { label: 'BDD Guide', icon: Clock, route: '/prep/bdd-guide', description: 'Pre-discharge filing guide' },
      { label: 'VA-Speak Translator', icon: Languages, route: '/prep/va-speak', description: 'Translate VA jargon to plain English' },
      { label: 'Intent to File', icon: Shield, route: '/claims/itf', description: 'Protect your effective date' },
    ],
  },
  {
    title: 'Analysis',
    tools: [
      { label: 'Evidence Strength', icon: Target, route: '/claims/evidence-strength', description: 'See how your logs match rating criteria' },
      { label: 'Decision Decoder', icon: FileSearch, route: '/claims/decision-decoder', description: 'Understand your VA decision letter' },
      { label: 'Rating Upgrade Paths', icon: TrendingUp, route: '/claims/upgrade-paths', description: 'See criteria to increase low ratings' },
      { label: 'Deadline Tracker', icon: Clock, route: '/claims/deadlines', description: 'Track ITF, appeals, and exam dates' },
    ],
  },
  {
    title: 'Export',
    tools: [
      { label: 'Claim Packet Builder', icon: Package, route: '/prep/packet', description: 'Compile your full claim packet' },
      { label: 'Shareable Summary', icon: Share2, route: '/prep/summary', description: 'Share or export your claims overview' },
      { label: 'VSO/Attorney Packet', icon: Briefcase, route: '/prep/vso-packet', description: 'Full evidence summary for your representative' },
      { label: 'Doctor Prep Packet', icon: Stethoscope, route: '/prep/doctor-packet', description: 'Pre-appointment summary for your clinician' },
    ],
  },
];

const LEARN_TOOLS: ToolItem[] = [
  { label: 'Help Center', icon: HelpCircle, route: '/settings/help', description: 'How to use VCS effectively' },
  { label: 'FAQ', icon: HelpCircle, route: '/settings/faq', description: 'Frequently asked questions' },
  { label: 'Glossary', icon: BookOpen, route: '/settings/glossary', description: 'VA terms & definitions' },
  { label: 'VA Resources', icon: Globe, route: '/settings/resources', description: 'Official VA links & phone numbers' },
  { label: 'Conditions by Conflict', icon: Shield, route: '/reference/conditions-by-conflict', description: 'Common conditions by era of service' },
  { label: 'Condition Guide', icon: GraduationCap, route: '/reference/condition-guide', description: 'Browse 784+ VA conditions' },
  { label: 'Deployment Locations', icon: MapPin, route: '/reference/deployment-locations', description: 'Presumptive conditions by deployment' },
];

export default function PrepHub() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const allCategories = useMemo(() => {
    // Build the full list: Most Used + regular categories + Learn
    const all: { title: string; tools: ToolItem[]; featured?: boolean; muted?: boolean }[] = [
      { title: 'Most Used', tools: MOST_USED, featured: true },
      ...toolCategories,
      { title: 'Learn', tools: LEARN_TOOLS, muted: true },
    ];

    if (!search.trim()) return all;
    const q = search.toLowerCase();
    return all
      .map((cat) => ({
        ...cat,
        tools: cat.tools.filter(
          (t) => t.label.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
        ),
      }))
      .filter((cat) => cat.tools.length > 0);
  }, [search]);

  return (
    <PageContainer className="py-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gold/10 border border-gold/20">
          <Wrench className="h-6 w-6 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tools</h1>
          <p className="text-muted-foreground text-sm">Everything you need to prepare and strengthen your claim.</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10 rounded-xl"
        />
      </div>

      {allCategories.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">No tools match &ldquo;{search}&rdquo;</p>
        </div>
      )}

      {allCategories.map((category) => (
        <div key={category.title} className="space-y-2">
          <h2 className={cn(
            'text-xs font-semibold uppercase tracking-wider px-1',
            category.featured ? 'text-gold' : 'text-muted-foreground'
          )}>
            {category.title}
          </h2>

          {/* Most Used: 2x2 grid with gold border */}
          {category.featured ? (
            <div className="grid grid-cols-2 gap-2">
              {category.tools.map((tool) => (
                <button
                  key={tool.route}
                  onClick={() => navigate(tool.route)}
                  className="flex flex-col items-start gap-2 p-3 rounded-2xl border border-gold/30 bg-gold/5 hover:bg-gold/10 active:scale-[0.98] transition-all text-left"
                >
                  <div className="p-2 rounded-xl bg-gold/10">
                    <tool.icon className="h-5 w-5 text-gold" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-foreground block truncate">{tool.label}</span>
                    <span className="text-[11px] text-muted-foreground block truncate">{tool.description}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-1.5">
              {category.tools.map((tool) => (
                <button
                  key={tool.route}
                  onClick={() => navigate(tool.route)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-2xl border bg-card',
                    'hover:bg-accent/50 active:scale-[0.98] transition-all text-left',
                    category.muted ? 'border-border/50' : 'border-border'
                  )}
                >
                  <div className={cn(
                    'p-2 rounded-xl flex-shrink-0',
                    category.muted ? 'bg-muted' : 'bg-gold/10'
                  )}>
                    <tool.icon className={cn('h-4 w-4', category.muted ? 'text-muted-foreground' : 'text-gold')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground block truncate">{tool.label}</span>
                    <span className="text-xs text-muted-foreground block truncate">{tool.description}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </PageContainer>
  );
}
