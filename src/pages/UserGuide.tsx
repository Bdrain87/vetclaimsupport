import { useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  Shield,
  FileText,
  Activity,
  Users,
  Clock,
  Download,
  Settings,
  HelpCircle,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  steps: {
    title: string;
    content: string;
    tip?: string;
  }[];
}

const guideSections: GuideSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: <BookOpen className="h-5 w-5" />,
    description: 'Learn the basics of using Service Evidence Tracker',
    steps: [
      {
        title: 'Accept the Terms',
        content:
          'When you first open the app, you\'ll see a liability acceptance screen. Read and accept to continue. This app is an educational tool - always consult with a VSO for official advice.',
        tip: 'The app works entirely offline after initial load. Your data never leaves your device.',
      },
      {
        title: 'Complete the Onboarding',
        content:
          'The onboarding wizard helps you set up your profile. You can add your service dates, primary conditions, and customize the app to your needs.',
        tip: 'You can always change these settings later in the Settings page.',
      },
      {
        title: 'Explore the Dashboard',
        content:
          'Your dashboard shows a summary of your tracked data, quick actions, and your claim readiness score. Use the navigation menu to access different sections.',
      },
    ],
  },
  {
    id: 'tracking-health',
    title: 'Tracking Your Health',
    icon: <Activity className="h-5 w-5" />,
    description: 'Document symptoms, migraines, sleep, and medications',
    steps: [
      {
        title: 'Symptom Journal',
        content:
          'Log your symptoms with date, severity (1-10), frequency, and how they impact your daily activities. The more detail you provide, the stronger your evidence.',
        tip: 'Track symptoms right when they happen for the most accurate record.',
      },
      {
        title: 'Migraine Log',
        content:
          'If you suffer from migraines, use the dedicated migraine tracker. It\'s designed around VA rating criteria (38 CFR 4.124a DC 8100) to capture relevant details.',
        tip: 'Note prostrating attacks (can\'t function) vs. non-prostrating for accurate ratings.',
      },
      {
        title: 'Sleep Tracker',
        content:
          'Track your sleep patterns, especially if you have sleep apnea. The tracker aligns with VA criteria (38 CFR 4.97 DC 6847).',
        tip: 'Log CPAP usage if prescribed - it\'s important for your rating.',
      },
      {
        title: 'Medication Log',
        content:
          'Keep a record of all medications, dosages, and any side effects. This shows the VA the treatment burden of your conditions.',
      },
    ],
  },
  {
    id: 'building-evidence',
    title: 'Building Your Evidence',
    icon: <FileText className="h-5 w-5" />,
    description: 'Organize documents and statements for your claim',
    steps: [
      {
        title: 'Upload Documents',
        content:
          'Upload medical records, service records, and other documents. Organize them by type and condition for easy retrieval.',
        tip: 'Name files clearly: "2024-01_MRI_Knee_Results.pdf" is better than "scan.pdf".',
      },
      {
        title: 'Track Buddy Statements',
        content:
          'Buddy statements from fellow service members or family can support your claim. Add contacts, track who you\'ve asked, and note when statements are received.',
        tip: 'Former roommates, supervisors, and family members make good witnesses.',
      },
      {
        title: 'Build Your Timeline',
        content:
          'Create a visual timeline of your service history, injuries, and medical events. This helps establish when conditions began.',
      },
      {
        title: 'Use the Evidence Library',
        content:
          'The Evidence Library is your central hub for all claim-related documents. Filter by category, search, and ensure nothing is missing.',
      },
    ],
  },
  {
    id: 'claim-tools',
    title: 'Using Claim Tools',
    icon: <Shield className="h-5 w-5" />,
    description: 'Prepare for exams and calculate ratings',
    steps: [
      {
        title: 'C&P Exam Prep',
        content:
          'Before your Compensation & Pension exam, use the Exam Prep tool. It provides condition-specific questions you might be asked and tips for communicating your symptoms.',
        tip: 'Be honest but thorough. Describe your worst days, not just average days.',
      },
      {
        title: 'Documents Checklist',
        content:
          'Use the checklist to ensure you have all required forms and documents before filing. Check items off as you gather them.',
      },
      {
        title: 'Rating Calculator',
        content:
          'Estimate your combined VA disability rating using the calculator. Remember: VA math isn\'t simple addition - the calculator shows you how ratings combine.',
        tip: 'This is an estimate only. Actual ratings are determined by VA raters.',
      },
      {
        title: 'Reference Database',
        content:
          'Search 785+ VA conditions with their rating criteria, required evidence, and common secondary conditions. Use this to understand what the VA is looking for.',
      },
    ],
  },
  {
    id: 'buddy-contacts',
    title: 'Managing Contacts',
    icon: <Users className="h-5 w-5" />,
    description: 'Track witnesses and get buddy statements',
    steps: [
      {
        title: 'Add Contacts',
        content:
          'Add people who can provide buddy statements - fellow service members, family, supervisors, medical providers. Include how they know you and what they witnessed.',
      },
      {
        title: 'Track Statement Status',
        content:
          'Mark contacts as "Not Asked", "Pending", or "Received". Follow up with those who haven\'t responded.',
        tip: 'Make it easy for them - provide a template and clear instructions.',
      },
    ],
  },
  {
    id: 'service-history',
    title: 'Service History',
    icon: <Clock className="h-5 w-5" />,
    description: 'Document your military service',
    steps: [
      {
        title: 'Duty Stations',
        content:
          'List all duty stations with dates. This is important for establishing exposures and service connection.',
      },
      {
        title: 'Deployments & Combat',
        content:
          'Document deployments, combat tours, and hazardous duty. Include locations, dates, and any incidents.',
        tip: 'Combat veterans have relaxed evidence requirements for certain conditions.',
      },
      {
        title: 'Exposures',
        content:
          'Track potential toxic exposures: burn pits, Agent Orange, contaminated water, radiation, etc. Note locations and duration.',
      },
    ],
  },
  {
    id: 'data-management',
    title: 'Managing Your Data',
    icon: <Download className="h-5 w-5" />,
    description: 'Backup, export, and protect your information',
    steps: [
      {
        title: 'Export Your Data',
        content:
          'Use Settings > Data Backup to export all your data as a JSON file. This creates a complete backup you can restore later.',
        tip: 'Export before clearing browser data or switching devices.',
      },
      {
        title: 'Import/Restore',
        content:
          'Restore a previous backup by importing the JSON file. This overwrites current data, so export first if needed.',
      },
      {
        title: 'Privacy',
        content:
          'All data is stored locally on your device. We never send your information to external servers (except optional AI features, which are clearly disclosed).',
      },
    ],
  },
  {
    id: 'ai-features',
    title: 'AI-Powered Analysis',
    icon: <HelpCircle className="h-5 w-5" />,
    description: 'Optional AI assistance for your claim',
    steps: [
      {
        title: 'Disability Analyzer',
        content:
          'The AI analyzer reviews your tracked symptoms and evidence to suggest potential conditions and identify gaps in your documentation.',
        tip: 'AI suggestions are starting points - verify everything with official VA criteria.',
      },
      {
        title: 'Privacy with AI',
        content:
          'AI features only activate when you explicitly request them. Your data is sent securely and not stored on external servers.',
      },
      {
        title: 'Limitations',
        content:
          'AI cannot diagnose conditions or guarantee claim outcomes. It\'s a research tool to help you prepare - not medical or legal advice.',
      },
    ],
  },
];

export default function UserGuide() {
  const [expandedSection, setExpandedSection] = useState<string | null>('getting-started');

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="section-header">
        <div className="section-icon">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Guide</h1>
          <p className="text-muted-foreground">Learn how to use Service Evidence Tracker effectively</p>
        </div>
      </div>

      {/* Quick Tips */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Quick Tips for Success
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Track symptoms <strong>daily</strong> - consistency builds credible evidence</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Document your <strong>worst days</strong>, not just average ones</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Get <strong>buddy statements</strong> to corroborate your experiences</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Use the <strong>Reference Database</strong> to understand rating criteria</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span><strong>Export your data</strong> regularly as a backup</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Warning Card */}
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Important Disclaimer</h3>
              <p className="text-sm text-muted-foreground">
                This app is an educational tool to help you organize your claim. It does not provide legal, medical, or VA advice.
                Always consult with a qualified Veterans Service Officer (VSO) or attorney for official guidance on your claim.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guide Sections */}
      <div className="space-y-4">
        {guideSections.map((section) => (
          <Card key={section.id}>
            <CardHeader
              className="cursor-pointer"
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {section.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
                <ChevronRight
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    expandedSection === section.id ? 'rotate-90' : ''
                  }`}
                />
              </div>
            </CardHeader>
            {expandedSection === section.id && (
              <CardContent className="pt-0">
                <Accordion type="single" collapsible className="w-full">
                  {section.steps.map((step, index) => (
                    <AccordionItem key={index} value={`step-${index}`}>
                      <AccordionTrigger className="text-sm">
                        <span className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                            {index + 1}
                          </span>
                          {step.title}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground pl-8">
                        <p>{step.content}</p>
                        {step.tip && (
                          <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                            <p className="text-sm">
                              <strong className="text-primary">Tip:</strong> {step.tip}
                            </p>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Need More Help */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-3">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">Need More Help?</h3>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>FAQ:</strong> Check the frequently asked questions for common issues
            </li>
            <li>
              <strong>Glossary:</strong> Look up VA-specific terms and acronyms
            </li>
            <li>
              <strong>VA Forms:</strong> Quick access to official VA forms
            </li>
            <li>
              <strong>Settings:</strong> Customize the app and manage your data
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
