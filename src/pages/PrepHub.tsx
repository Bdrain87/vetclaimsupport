import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardCheck, FileText, Users, FileSignature, AlertTriangle, Heart,
  BookOpen, ClipboardList, Languages, DollarSign, Package, FileCheck, Pill,
  Calculator, Scale, Navigation, Clock, Shield, Wrench, Share2, TrendingUp, Target, FileSearch,
  Search, Briefcase, Stethoscope, HelpCircle, GraduationCap, MapPin, Globe, Camera, Scan, Compass,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageContainer } from '@/components/PageContainer';
import { Input } from '@/components/ui/input';
import { useRecommendedTools } from '@/hooks/useRecommendedTools';
import { useSmartReminders } from '@/hooks/useSmartReminders';

interface ToolItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  description: string;
}

const MOST_USED: ToolItem[] = [
  { label: 'Rating Calculator', icon: Calculator, route: '/claims/calculator', description: 'Calculate combined VA rating' },
  { label: 'C&P Exam Prep', icon: ClipboardCheck, route: '/prep/exam', description: 'Prepare for your compensation exam' },
  { label: 'Scan Document', icon: Camera, route: '/claims/vault', description: 'Scan or photo medical records & evidence' },
  { label: 'Claim Packet Builder', icon: Package, route: '/prep/packet', description: 'Compile your full claim packet' },
];

const toolCategories: { title: string; tools: ToolItem[] }[] = [
  {
    title: 'Documents',
    tools: [
      { label: 'Personal Statement', icon: FileText, route: '/prep/personal-statement', description: 'Generate your personal statement' },
      { label: 'Buddy Statement', icon: Users, route: '/prep/buddy-statement', description: 'Build a buddy/lay statement' },
      { label: 'Doctor Summary Builder', icon: FileSignature, route: '/prep/doctor-summary', description: 'Medical evidence outline for your physician' },
      { label: 'Stressor Statement', icon: AlertTriangle, route: '/prep/stressor', description: 'Document PTSD stressors' },
      { label: 'Family Statement', icon: Heart, route: '/prep/family-statement', description: 'Family lay statements' },
    ],
  },
  {
    title: 'Exam Prep',
    tools: [
      { label: 'C&P Exam Prep', icon: ClipboardCheck, route: '/prep/exam', description: 'Prepare for your compensation exam' },
      { label: 'C&P Simulator', icon: Shield, route: '/prep/exam-simulator', description: 'Practice C&P exam questions' },
      { label: 'Post-Exam Debrief', icon: ClipboardList, route: '/prep/post-debrief', description: 'Analyze how your exam went' },
      { label: 'DBQ Self-Assessment', icon: ClipboardList, route: '/prep/dbq-analyzer', description: 'Estimate your rating level per DBQ' },
      { label: 'AI DBQ Analyzer', icon: ClipboardList, route: '/prep/interactive-dbq', description: 'AI-powered rating alignment with photo upload' },
      { label: 'DBQ Prep Sheet', icon: ClipboardList, route: '/prep/dbq', description: 'Organize talking points for your exam' },
      { label: 'Exam Day Packet', icon: FileCheck, route: '/prep/exam-day', description: 'Day-of checklist and talking points' },
    ],
  },
  {
    title: 'Calculators',
    tools: [
      { label: 'Rating Calculator', icon: Calculator, route: '/claims/calculator', description: 'Calculate combined VA rating' },
      { label: 'Back Pay Estimator', icon: DollarSign, route: '/prep/back-pay', description: 'Estimate potential back pay' },
      { label: 'Lifetime Benefits', icon: TrendingUp, route: '/prep/cost-estimate', description: 'Project total compensation over time' },
      { label: 'Compensation Ladder', icon: TrendingUp, route: '/prep/compensation', description: 'See monthly rates at each rating level' },
      { label: 'Travel Pay', icon: Navigation, route: '/prep/travel-pay', description: 'Estimate VA travel reimbursement' },
      { label: 'TDIU Checker', icon: Target, route: '/prep/tdiu', description: 'Check TDIU eligibility criteria' },
    ],
  },
  {
    title: 'Research & Discovery',
    tools: [
      { label: 'Military Job Hazard Identifier', icon: Briefcase, route: '/prep/mos-hazards', description: 'Find conditions linked to your military job' },
      { label: 'PACT Act Checker', icon: Shield, route: '/prep/pact-act', description: 'Check presumptive benefit eligibility' },
      { label: 'State Benefits Finder', icon: MapPin, route: '/prep/state-benefits', description: 'State-specific veteran benefits' },
      { label: 'Find a VSO', icon: Users, route: '/prep/vso-locator', description: 'Get free accredited representation' },
      { label: 'C-File Intel', icon: FileSearch, route: '/prep/cfile-intel', description: 'AI analysis of your VA Claims File' },
      { label: 'Evidence Analyzer', icon: Scan, route: '/prep/evidence-scanner', description: 'AI-powered document analysis' },
      { label: 'Benefits Discovery', icon: Compass, route: '/prep/benefits', description: 'Discover benefits you may qualify for' },
      { label: 'Medication Side Effects', icon: Pill, route: '/prep/medication-rule', description: 'Check medication secondary claim links' },
    ],
  },
  {
    title: 'Guides',
    tools: [
      { label: 'VA Form Guide', icon: BookOpen, route: '/prep/form-guide', description: 'Step-by-step form filling help' },
      { label: 'Appeals Guide', icon: Scale, route: '/prep/appeals', description: 'Appeal lanes & verified case law' },
      { label: 'Pre-Discharge Filing Guide', icon: Clock, route: '/prep/bdd-guide', description: 'BDD filing before separation' },
      { label: 'Nexus Guide', icon: FileSignature, route: '/prep/nexus-guide', description: 'Understand nexus letters and evidence links' },
      { label: 'VA Jargon Decoder', icon: Languages, route: '/prep/va-speak', description: 'Translate VA-speak to plain English' },
      { label: 'Intent to File', icon: Shield, route: '/claims/itf', description: 'Protect your effective date' },
    ],
  },
  {
    title: 'Analysis',
    tools: [
      { label: 'Rating Evidence Checker', icon: Target, route: '/claims/evidence-strength', description: 'See how your logs match rating criteria' },
      { label: 'Decision Letter Analyzer', icon: FileSearch, route: '/claims/decision-decoder', description: 'Understand your VA decision letter' },
      { label: 'How to Increase Your Rating', icon: TrendingUp, route: '/claims/upgrade-paths', description: 'See criteria to increase low ratings' },
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
  { label: 'Service-Related Conditions', icon: Shield, route: '/reference/conditions-by-conflict', description: 'Common conditions by era of service' },
  { label: 'Condition Guide', icon: GraduationCap, route: '/reference/condition-guide', description: 'Browse 800+ VA conditions' },
  { label: 'Deployment Locations', icon: MapPin, route: '/reference/deployment-locations', description: 'Presumptive conditions by deployment' },
];

export default function PrepHub() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const recommendedTools = useRecommendedTools();
  const allReminders = useSmartReminders();
  const prepReminders = useMemo(() => {
    const prepIds = new Set(['itf-expiring', 'bdd-window', 'missing-docs']);
    const prepCategories = new Set(['deadline', 'exam', 'evidence']);
    return allReminders.filter((r) => prepIds.has(r.id) || prepCategories.has(r.category) || r.id.startsWith('exam-prep-') || r.id.startsWith('deadline-') || r.id.startsWith('buddy-followup-')).slice(0, 3);
  }, [allReminders]);

  // Map recommended tools to ToolItem format with matching icons
  const ROUTE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    '/prep/stressor': AlertTriangle,
    '/health/migraines': Heart,
    '/prep/exam': ClipboardCheck,
    '/prep/buddy-statement': Users,
    '/health/symptoms': Heart,
    '/health/sleep': ClipboardList,
    '/health/visits': Stethoscope,
    '/claims/evidence-strength': Target,
    '/health/medications': Pill,
    '/claims/decision-decoder': FileSearch,
    '/claims': Shield,
  };

  const smartRecommended: ToolItem[] = useMemo(() => {
    if (recommendedTools.length === 0) return MOST_USED;
    return recommendedTools.map((rt) => ({
      label: rt.label,
      icon: ROUTE_ICON_MAP[rt.route] || Sparkles,
      route: rt.route,
      description: rt.reason,
    }));
  }, [recommendedTools]); // eslint-disable-line react-hooks/exhaustive-deps

  const allCategories = useMemo(() => {
    const featuredTitle = recommendedTools.length > 0 ? 'Recommended For You' : 'Most Used';
    // Build the full list: Smart recommendations + regular categories + Learn
    const all: { title: string; tools: ToolItem[]; featured?: boolean; muted?: boolean }[] = [
      { title: featuredTitle, tools: smartRecommended, featured: true },
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
    <PageContainer className="py-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gold/10 border border-gold/20">
          <Wrench className="h-6 w-6 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tools</h1>
          <p className="text-muted-foreground text-sm">Everything you need to prepare and strengthen your claim.</p>
        </div>
      </div>

      {/* Prep Reminders */}
      {prepReminders.length > 0 && (
        <div className="space-y-1.5">
          {prepReminders.map((r) => (
            <button
              key={r.id}
              onClick={() => r.actionRoute && navigate(r.actionRoute)}
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-gold/20 bg-gold/5 hover:bg-gold/10 transition-colors text-left"
            >
              {r.id.startsWith('exam-prep-') ? (
                <Clock className="h-3.5 w-3.5 shrink-0 text-destructive" />
              ) : (
                <AlertTriangle className={`h-3.5 w-3.5 shrink-0 ${r.priority === 'high' ? 'text-destructive' : 'text-gold'}`} />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{r.title}</p>
              </div>
              {r.actionRoute && <Compass className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
            </button>
          ))}
        </div>
      )}

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
                  <div className="min-w-0 w-full">
                    <span className="text-sm font-medium text-foreground block truncate">{tool.label}</span>
                    <span className="text-[11px] text-muted-foreground block leading-tight">{tool.description}</span>
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
                    'p-2 rounded-xl shrink-0',
                    category.muted ? 'bg-muted' : 'bg-gold/10'
                  )}>
                    <tool.icon className={cn('h-4 w-4', category.muted ? 'text-muted-foreground' : 'text-gold')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground block truncate">{tool.label}</span>
                    <span className="text-xs text-muted-foreground block leading-tight">{tool.description}</span>
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
