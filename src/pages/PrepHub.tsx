import { useNavigate } from 'react-router-dom';
import {
  ClipboardCheck, FileText, Users, FileSignature, AlertTriangle,
  BookOpen, ClipboardList, Languages, DollarSign, Package, FileCheck,
  Calculator, Scale, Navigation, Clock, Shield, Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageContainer } from '@/components/PageContainer';

interface ToolItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  description: string;
}

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
      { label: 'C&P Exam Packet', icon: FileCheck, route: '/cp-exam-packet', description: 'Build your exam preparation packet' },
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
      { label: 'Intent to File', icon: Shield, route: '/settings/itf', description: 'Protect your effective date' },
    ],
  },
  {
    title: 'Export',
    tools: [
      { label: 'Claim Packet Builder', icon: Package, route: '/prep/packet', description: 'Compile your full claim packet' },
    ],
  },
];

export default function PrepHub() {
  const navigate = useNavigate();

  return (
    <PageContainer className="py-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10">
          <Wrench className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tools</h1>
          <p className="text-muted-foreground text-sm">Everything you need to prepare and strengthen your claim.</p>
        </div>
      </div>

      {toolCategories.map((category) => (
        <div key={category.title} className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
            {category.title}
          </h2>
          <div className="space-y-1">
            {category.tools.map((tool) => (
              <button
                key={tool.route}
                onClick={() => navigate(tool.route)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card',
                  'hover:bg-accent/50 transition-colors text-left'
                )}
              >
                <div className="p-2 rounded-lg bg-gold/10 flex-shrink-0">
                  <tool.icon className="h-4 w-4 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground block truncate">{tool.label}</span>
                  <span className="text-xs text-muted-foreground block truncate">{tool.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </PageContainer>
  );
}
