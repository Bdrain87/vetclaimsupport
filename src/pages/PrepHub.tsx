import { useNavigate } from 'react-router-dom';
import {
  ClipboardCheck, FileText, Users, FileSignature, AlertTriangle,
  BookOpen, ClipboardList, Languages, DollarSign, Package, FileCheck,
  Calculator,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PageContainer } from '@/components/PageContainer';

const prepTools = [
  { label: 'Rating Calculator', icon: Calculator, route: '/claims/calculator', description: 'Calculate combined VA rating' },
  { label: 'C&P Exam Prep', icon: ClipboardCheck, route: '/prep/exam', description: 'Prepare for your compensation exam' },
  { label: 'VA Form Guide', icon: BookOpen, route: '/prep/form-guide', description: 'Step-by-step form filling help', highlight: true },
  { label: 'Personal Statement', icon: FileText, route: '/prep/personal-statement', description: 'Generate your personal statement' },
  { label: 'Buddy Statement', icon: Users, route: '/prep/buddy-statement', description: 'Build a buddy/lay statement' },
  { label: 'Doctor Summary', icon: FileSignature, route: '/prep/nexus-letter', description: 'Create a summary for your doctor' },
  { label: 'Stressor Statement', icon: AlertTriangle, route: '/prep/stressor', description: 'Document PTSD stressors' },
  { label: 'DBQ Prep', icon: ClipboardList, route: '/prep/dbq', description: 'Prep your DBQ talking points' },
  { label: 'VA-Speak Translator', icon: Languages, route: '/prep/va-speak', description: 'Translate VA jargon to plain English' },
  { label: 'Back Pay Estimator', icon: DollarSign, route: '/prep/back-pay', description: 'Estimate your potential back pay' },
  { label: 'Claim Packet Builder', icon: Package, route: '/prep/packet', description: 'Compile your full claim packet' },
  { label: 'C&P Exam Packet', icon: FileCheck, route: '/cp-exam-packet', description: 'Build your exam preparation packet', highlight: true },
];

export default function PrepHub() {
  const navigate = useNavigate();

  return (
    <PageContainer className="py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Claim Prep</h1>
        <p className="text-muted-foreground text-sm mt-1">Tools to prepare and strengthen your claim.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {prepTools.map((tool) => (
          <button
            key={tool.route}
            onClick={() => navigate(tool.route)}
            className={cn(
              'flex flex-col items-start gap-2 p-4 rounded-xl border bg-card transition-colors text-left hover:bg-accent/50',
              tool.highlight
                ? 'border-blue-500/40 ring-1 ring-blue-500/20'
                : 'border-border'
            )}
          >
            <div className="flex items-center gap-2 w-full">
              <tool.icon className="h-6 w-6 text-blue-500" />
              {tool.highlight && (
                <Badge className="ml-auto text-[9px] bg-blue-500/20 text-blue-500 border-blue-500/30 px-1.5 py-0">
                  NEW
                </Badge>
              )}
            </div>
            <span className="text-sm font-medium text-foreground">{tool.label}</span>
            <span className="text-xs text-muted-foreground line-clamp-2">
              {tool.description}
            </span>
          </button>
        ))}
      </div>
    </PageContainer>
  );
}
