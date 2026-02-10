import { useNavigate } from 'react-router-dom';
import {
  ClipboardCheck, FileText, Users, FileSignature, AlertTriangle,
  BookOpen, ClipboardList, Languages, DollarSign, Package,
} from 'lucide-react';

const prepTools = [
  { label: 'C&P Exam Prep', icon: ClipboardCheck, route: '/prep/exam', description: 'Prepare for your compensation exam' },
  { label: 'VA Form Guide', icon: BookOpen, route: '/prep/form-guide', description: 'Step-by-step form filling help' },
  { label: 'Personal Statement', icon: FileText, route: '/prep/personal-statement', description: 'Generate your personal statement' },
  { label: 'Buddy Statement', icon: Users, route: '/prep/buddy-statement', description: 'Build a buddy/lay statement' },
  { label: 'Nexus Letter', icon: FileSignature, route: '/prep/nexus-letter', description: 'Generate a nexus letter template' },
  { label: 'Stressor Statement', icon: AlertTriangle, route: '/prep/stressor', description: 'Document PTSD stressors' },
  { label: 'DBQ Prep', icon: ClipboardList, route: '/prep/dbq', description: 'Prep your DBQ talking points' },
  { label: 'VA-Speak Translator', icon: Languages, route: '/prep/va-speak', description: 'Translate VA jargon to plain English' },
  { label: 'Back Pay Estimator', icon: DollarSign, route: '/prep/back-pay', description: 'Estimate your potential back pay' },
  { label: 'Claim Packet Builder', icon: Package, route: '/prep/packet', description: 'Compile your full claim packet' },
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
            onClick={() => navigate(tool.route)}
            className="flex flex-col items-start gap-2 p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-left"
          >
            <tool.icon className="h-6 w-6 text-amber-500" />
            <span className="text-sm font-medium text-foreground">{tool.label}</span>
            <span className="text-xs text-muted-foreground line-clamp-2">{tool.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
