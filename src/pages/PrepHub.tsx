import { useNavigate } from 'react-router-dom';
import {
  ClipboardCheck, FileText, Users, FileSignature, AlertTriangle,
  BookOpen, ClipboardList, Languages, DollarSign, Package,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const prepTools = [
  { label: 'C&P Exam Prep', icon: ClipboardCheck, route: '/prep/exam', description: 'Prepare for your compensation exam', placeholder: false },
  { label: 'VA Form Guide', icon: BookOpen, route: '/prep/form-guide', description: 'Step-by-step form filling help', placeholder: false, highlight: true },
  { label: 'Personal Statement', icon: FileText, route: '/prep/personal-statement', description: 'Generate your personal statement', placeholder: false },
  { label: 'Buddy Statement', icon: Users, route: '/prep/buddy-statement', description: 'Build a buddy/lay statement', placeholder: false },
  { label: 'Nexus Letter', icon: FileSignature, route: '/prep/nexus-letter', description: 'Generate a nexus letter template', placeholder: false },
  { label: 'Stressor Statement', icon: AlertTriangle, route: '/prep/stressor', description: 'Document PTSD stressors', placeholder: true },
  { label: 'DBQ Prep', icon: ClipboardList, route: '/prep/dbq', description: 'Prep your DBQ talking points', placeholder: false },
  { label: 'VA-Speak Translator', icon: Languages, route: '/prep/va-speak', description: 'Translate VA jargon to plain English', placeholder: true },
  { label: 'Back Pay Estimator', icon: DollarSign, route: '/prep/back-pay', description: 'Estimate your potential back pay', placeholder: true },
  { label: 'Claim Packet Builder', icon: Package, route: '/prep/packet', description: 'Compile your full claim packet', placeholder: false },
];

export default function PrepHub() {
  const navigate = useNavigate();

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Claim Prep</h1>
        <p className="text-muted-foreground text-sm mt-1">Tools to prepare and strengthen your claim.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {prepTools.map((tool) => (
          <button
            key={tool.route}
            onClick={() => !tool.placeholder && navigate(tool.route)}
            disabled={tool.placeholder}
            className={cn(
              'flex flex-col items-start gap-2 p-4 rounded-xl border bg-card transition-colors text-left',
              tool.placeholder
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:bg-accent/50',
              tool.highlight
                ? 'border-blue-500/40 ring-1 ring-blue-500/20'
                : 'border-border'
            )}
          >
            <div className="flex items-center gap-2 w-full">
              <tool.icon className={cn('h-6 w-6', tool.placeholder ? 'text-muted-foreground' : 'text-blue-500')} />
              {tool.highlight && (
                <Badge className="ml-auto text-[9px] bg-blue-500/20 text-blue-500 border-blue-500/30 px-1.5 py-0">
                  NEW
                </Badge>
              )}
            </div>
            <span className="text-sm font-medium text-foreground">{tool.label}</span>
            <span className="text-xs text-muted-foreground line-clamp-2">
              {tool.placeholder ? `${tool.description} (Coming Soon)` : tool.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
