import { useState } from 'react';
import { 
  FileText, Scale, ClipboardList, Stethoscope, Calculator, Users, 
  BookOpen, Gavel, Printer, FileSignature, TrendingUp, ShieldAlert, 
  DollarSign, Wrench, Link2, Target
} from 'lucide-react';
import { PersonalStatementGenerator } from '@/components/tools/PersonalStatementGenerator';
import { DBQRatingReference } from '@/components/tools/DBQRatingReference';
import { DBQGuidance } from '@/components/tools/DBQGuidance';
import { DBQAppointmentSummary } from '@/components/tools/DBQAppointmentSummary';
import { ConditionSpecificChecklist } from '@/components/tools/ConditionSpecificChecklist';
import { CPExamPrepGuide } from '@/components/tools/CPExamPrepGuide';
import { EnhancedCPExamPrepGuide } from '@/components/tools/EnhancedCPExamPrepGuide';
import { EnhancedEvidenceChecklist } from '@/components/tools/EnhancedEvidenceChecklist';
import { SmartSecondaryConditionsSuggester } from '@/components/tools/SmartSecondaryConditionsSuggester';
import { RatingCalculator } from '@/components/dashboard/RatingCalculator';
import { BuddyStatementGenerator } from '@/components/tools/BuddyStatementGenerator';
import { AppealStrategyAdvisor } from '@/components/tools/AppealStrategyAdvisor';
import { NexusLetterGenerator } from '@/components/tools/NexusLetterGenerator';
import { RatingIncreaseAnalyzer } from '@/components/tools/RatingIncreaseAnalyzer';
import { StressorStatementGenerator } from '@/components/tools/StressorStatementGenerator';
import { BackPayEstimator } from '@/components/tools/BackPayEstimator';
import { DisclaimerNotice } from '@/components/shared/DisclaimerNotice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSearchParams } from 'react-router-dom';

// Tool definitions
interface Tool {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  category: string;
}

const tools: Tool[] = [
  // Document Generators
  {
    id: 'statement',
    name: 'Personal Statement',
    icon: FileText,
    description: 'Create a compelling personal statement that explains your condition, its impact on your daily life, and its connection to your military service. Required for most VA claims.',
    category: 'Documents',
  },
  {
    id: 'buddy',
    name: 'Buddy Statement',
    icon: Users,
    description: 'Generate a template for fellow service members, family, or friends to document what they witnessed about your condition or incidents. Strong supporting evidence.',
    category: 'Documents',
  },
  {
    id: 'stressor',
    name: 'Stressor Statement (PTSD)',
    icon: ShieldAlert,
    description: 'Create a detailed stressor statement for PTSD claims describing traumatic events, including when, where, and who was involved. Required for PTSD claims (VA Form 21-0781).',
    category: 'Documents',
  },
  {
    id: 'nexus',
    name: 'Nexus Letter Request',
    icon: FileSignature,
    description: 'Generate a template to request a nexus letter from your doctor, explaining what information they need to establish service connection. Critical medical evidence.',
    category: 'Documents',
  },
  {
    id: 'dbq-summary',
    name: 'DBQ Appointment Summary',
    icon: Printer,
    description: 'Create a printable summary of your symptoms and history to bring to DBQ appointments, helping your doctor document everything accurately.',
    category: 'Documents',
  },
  
  // Prep & Reference
  {
    id: 'exam-prep',
    name: 'C&P Exam Prep Guide',
    icon: Stethoscope,
    description: 'Interactive exam prep with practice answer writing. Includes first-person templates, specific date guidance, and your logged symptom data.',
    category: 'Exam Prep',
  },
  {
    id: 'secondary-suggester',
    name: 'Secondary Conditions Suggester',
    icon: Link2,
    description: 'Smart suggestions for secondary conditions based on your claimed conditions. Includes first-person statement templates and action steps.',
    category: 'Claim Strategy',
  },
  {
    id: 'criteria',
    name: 'VA Rating Criteria',
    icon: Scale,
    description: 'Look up the specific criteria the VA uses to assign disability ratings for your condition, based on 38 CFR Part 4.',
    category: 'Reference',
  },
  {
    id: 'dbq-guidance',
    name: 'DBQ Form Guidance',
    icon: BookOpen,
    description: 'Find the correct DBQ form for your condition and understand what measurements and findings your doctor needs to document.',
    category: 'Reference',
  },
  {
    id: 'checklist',
    name: 'Evidence Checklist',
    icon: Target,
    description: 'Interactive checklist showing what evidence you have vs. what\'s missing. Includes first-person writing tips and statement templates.',
    category: 'Reference',
  },
  {
    id: 'increase',
    name: 'Rating Increase Analyzer',
    icon: TrendingUp,
    description: 'Analyze your current rating and identify what additional evidence could support a higher rating for worsening conditions.',
    category: 'Reference',
  },
  {
    id: 'appeal',
    name: 'Appeal Strategy Advisor',
    icon: Gavel,
    description: 'Get guidance on appeal options if your claim was denied, including Higher Level Review, Supplemental Claims, and Board Appeals.',
    category: 'Appeals',
  },
  
  // Calculators
  {
    id: 'calculator',
    name: 'VA Rating Calculator',
    icon: Calculator,
    description: 'Calculate your combined VA disability rating using "VA Math" and estimate monthly compensation based on current rates.',
    category: 'Calculators',
  },
  {
    id: 'backpay',
    name: 'Back Pay Estimator',
    icon: DollarSign,
    description: 'Estimate potential back pay based on your effective date and rating, including retroactive compensation calculations.',
    category: 'Calculators',
  },
];

export default function ClaimTools() {
  const [searchParams] = useSearchParams();
  const conditionParam = searchParams.get('condition');
  const tabParam = searchParams.get('tab');
  
  const [selectedToolId, setSelectedToolId] = useState<string>(tabParam || '');

  const selectedTool = tools.find(t => t.id === selectedToolId);

  // Handle tool selection - just update state, no navigation
  const handleToolSelect = (toolId: string) => {
    setSelectedToolId(toolId);
  };

  // Render the selected tool component
  const renderTool = () => {
    switch (selectedToolId) {
      case 'statement':
        return <PersonalStatementGenerator />;
      case 'buddy':
        return <BuddyStatementGenerator />;
      case 'stressor':
        return <StressorStatementGenerator />;
      case 'nexus':
        return <NexusLetterGenerator />;
      case 'dbq-summary':
        return <DBQAppointmentSummary />;
      case 'exam-prep':
        return <EnhancedCPExamPrepGuide />;
      case 'secondary-suggester':
        return <SmartSecondaryConditionsSuggester />;
      case 'criteria':
        return <DBQRatingReference />;
      case 'dbq-guidance':
        return <DBQGuidance />;
      case 'checklist':
        return <EnhancedEvidenceChecklist />;
      case 'increase':
        return <RatingIncreaseAnalyzer />;
      case 'appeal':
        return <AppealStrategyAdvisor />;
      case 'calculator':
        return <RatingCalculator />;
      case 'backpay':
        return <BackPayEstimator />;
      default:
        return null;
    }
  };

  // Group tools by category for the dropdown
  const groupedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <Wrench className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Claim Tools</h1>
          <p className="text-muted-foreground">Select a tool to strengthen your VA claim</p>
        </div>
      </div>

      {/* Educational Disclaimer */}
      <DisclaimerNotice variant="card" />

      {/* Tool Selector Dropdown */}
      <Card className="data-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Select a Tool</CardTitle>
          <CardDescription>Choose from document generators, prep guides, calculators, and more</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedToolId} onValueChange={handleToolSelect}>
            <SelectTrigger className="w-full h-12 text-base">
              <SelectValue placeholder="Choose a tool..." />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border z-50 max-h-[400px]">
              {Object.entries(groupedTools).map(([category, categoryTools]) => (
                <div key={category}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50">
                    {category}
                  </div>
                  {categoryTools.map((tool) => (
                    <SelectItem 
                      key={tool.id} 
                      value={tool.id}
                      className="py-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <tool.icon className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{tool.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Selected Tool Description & Interface */}
      {selectedTool && (
        <div className="space-y-4">
          {/* Tool Description */}
          <Card className="data-card border-primary/30">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <selectedTool.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{selectedTool.name}</CardTitle>
                  <CardDescription className="text-xs uppercase tracking-wide">{selectedTool.category}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">{selectedTool.description}</p>
            </CardContent>
          </Card>

          {/* Tool Interface */}
          <div className="mt-6">
            {renderTool()}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedToolId && (
        <Card className="data-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wrench className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">Select a tool from the dropdown above to get started.</p>
            <p className="text-sm text-muted-foreground text-center mt-1">Each tool helps with a different part of your claim.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
