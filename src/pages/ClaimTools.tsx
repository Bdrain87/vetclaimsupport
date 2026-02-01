import { useState } from 'react';
import { 
  FileText, Scale, ClipboardList, Stethoscope, Calculator, Users, 
  BookOpen, Gavel, Printer, FileSignature, TrendingUp, ShieldAlert, 
  DollarSign, ArrowRight, FileEdit, FolderOpen, BarChart, Briefcase
} from 'lucide-react';
import { PersonalStatementGenerator } from '@/components/tools/PersonalStatementGenerator';
import { DBQRatingReference } from '@/components/tools/DBQRatingReference';
import { DBQGuidance } from '@/components/tools/DBQGuidance';
import { DBQAppointmentSummary } from '@/components/tools/DBQAppointmentSummary';
import { ConditionSpecificChecklist } from '@/components/tools/ConditionSpecificChecklist';
import { CPExamPrepGuide } from '@/components/tools/CPExamPrepGuide';
import { RatingCalculator } from '@/components/dashboard/RatingCalculator';
import { BuddyStatementGenerator } from '@/components/tools/BuddyStatementGenerator';
import { AppealStrategyAdvisor } from '@/components/tools/AppealStrategyAdvisor';
import { NexusLetterGenerator } from '@/components/tools/NexusLetterGenerator';
import { RatingIncreaseAnalyzer } from '@/components/tools/RatingIncreaseAnalyzer';
import { StressorStatementGenerator } from '@/components/tools/StressorStatementGenerator';
import { BackPayEstimator } from '@/components/tools/BackPayEstimator';
import { DisclaimerNotice } from '@/components/shared/DisclaimerNotice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSearchParams, useNavigate } from 'react-router-dom';

// Tool definitions with categories
interface Tool {
  id: string;
  name: string;
  shortName: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  purpose: string;
  category: 'documents' | 'calculators' | 'prep';
  color: string;
}

const tools: Tool[] = [
  // Documents Category
  {
    id: 'statement',
    name: 'Personal Statement Generator',
    shortName: 'Personal Statement',
    icon: FileText,
    description: 'Create a compelling personal statement that clearly explains your condition, its impact on your daily life, and its connection to your military service.',
    purpose: 'Required for most VA claims to explain your condition in your own words',
    category: 'documents',
    color: 'text-blue-500',
  },
  {
    id: 'buddy',
    name: 'Buddy Statement Generator',
    shortName: 'Buddy Statement',
    icon: Users,
    description: 'Generate a template for fellow service members, family, or friends to document what they witnessed about your condition or incidents.',
    purpose: 'Strong supporting evidence from people who know you',
    category: 'documents',
    color: 'text-green-500',
  },
  {
    id: 'stressor',
    name: 'Stressor Statement Generator',
    shortName: 'Stressor Statement',
    icon: ShieldAlert,
    description: 'Create a detailed stressor statement for PTSD claims describing traumatic events, including when, where, and who was involved.',
    purpose: 'Required for PTSD claims (VA Form 21-0781)',
    category: 'documents',
    color: 'text-orange-500',
  },
  {
    id: 'nexus',
    name: 'Nexus Letter Request Template',
    shortName: 'Nexus Letter',
    icon: FileSignature,
    description: 'Generate a template to request a nexus letter from your doctor, explaining what information they need to establish service connection.',
    purpose: 'Critical medical evidence linking condition to service',
    category: 'documents',
    color: 'text-purple-500',
  },
  {
    id: 'dbq-summary',
    name: 'DBQ Appointment Summary',
    shortName: 'Dr. Summary',
    icon: Printer,
    description: 'Create a printable summary of your symptoms and history to bring to DBQ appointments, helping your doctor document everything accurately.',
    purpose: 'Ensure your doctor has all the information for your DBQ',
    category: 'documents',
    color: 'text-teal-500',
  },
  
  // Prep Tools Category
  {
    id: 'exam-prep',
    name: 'C&P Exam Prep Guide',
    shortName: 'C&P Prep',
    icon: Stethoscope,
    description: 'Condition-specific preparation guide for your Compensation & Pension exam, including what to expect, what to bring, and how to describe symptoms.',
    purpose: 'Be fully prepared for your C&P examination',
    category: 'prep',
    color: 'text-red-500',
  },
  {
    id: 'criteria',
    name: 'VA Rating Criteria Reference',
    shortName: 'Rating Criteria',
    icon: Scale,
    description: 'Look up the specific criteria the VA uses to assign disability ratings for your condition, based on 38 CFR Part 4.',
    purpose: 'Understand exactly what the VA is looking for',
    category: 'prep',
    color: 'text-indigo-500',
  },
  {
    id: 'dbq-guidance',
    name: 'DBQ Form Guidance',
    shortName: 'DBQ Guidance',
    icon: BookOpen,
    description: 'Find the correct DBQ form for your condition and understand what measurements and findings your doctor needs to document.',
    purpose: 'Ensure your medical evidence is complete',
    category: 'prep',
    color: 'text-cyan-500',
  },
  {
    id: 'checklist',
    name: 'Condition-Specific Checklist',
    shortName: 'Checklists',
    icon: ClipboardList,
    description: 'Get a customized checklist of evidence and documentation needed for your specific claimed condition.',
    purpose: 'Make sure you have all required evidence',
    category: 'prep',
    color: 'text-amber-500',
  },
  {
    id: 'increase',
    name: 'Rating Increase Analyzer',
    shortName: 'Increase Analyzer',
    icon: TrendingUp,
    description: 'Analyze your current rating and identify what additional evidence could support a higher rating for worsening conditions.',
    purpose: 'Strengthen claims for rating increases',
    category: 'prep',
    color: 'text-emerald-500',
  },
  {
    id: 'appeal',
    name: 'Appeal Strategy Advisor',
    shortName: 'Appeal Strategy',
    icon: Gavel,
    description: 'Get guidance on appeal options if your claim was denied, including Higher Level Review, Supplemental Claims, and Board Appeals.',
    purpose: 'Navigate the appeals process effectively',
    category: 'prep',
    color: 'text-rose-500',
  },
  
  // Calculators Category
  {
    id: 'calculator',
    name: 'VA Rating Calculator',
    shortName: 'Rating Calculator',
    icon: Calculator,
    description: 'Calculate your combined VA disability rating using "VA Math" and estimate monthly compensation based on current rates.',
    purpose: 'Understand your potential compensation',
    category: 'calculators',
    color: 'text-yellow-500',
  },
  {
    id: 'backpay',
    name: 'Back Pay Estimator',
    shortName: 'Back Pay',
    icon: DollarSign,
    description: 'Estimate potential back pay based on your effective date and rating, including retroactive compensation calculations.',
    purpose: 'Understand potential retroactive benefits',
    category: 'calculators',
    color: 'text-lime-500',
  },
];

const categoryLabels = {
  documents: { label: 'Document Generators', icon: FileEdit, description: 'Create statements and letters for your claim' },
  prep: { label: 'Prep & Reference', icon: Briefcase, description: 'Prepare for exams and understand VA criteria' },
  calculators: { label: 'Calculators', icon: BarChart, description: 'Estimate ratings and compensation' },
};

export default function ClaimTools() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const conditionParam = searchParams.get('condition');
  const tabParam = searchParams.get('tab');
  
  const [selectedTool, setSelectedTool] = useState<string | null>(tabParam || null);
  const [activeCategory, setActiveCategory] = useState<'documents' | 'calculators' | 'prep'>('documents');

  // Get tools for current category
  const categoryTools = tools.filter(t => t.category === activeCategory);

  // Render the selected tool component
  const renderTool = () => {
    switch (selectedTool) {
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
        return <CPExamPrepGuide initialCondition={conditionParam || undefined} />;
      case 'criteria':
        return <DBQRatingReference />;
      case 'dbq-guidance':
        return <DBQGuidance />;
      case 'checklist':
        return <ConditionSpecificChecklist />;
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

  const handleUseTool = (toolId: string) => {
    setSelectedTool(toolId);
    // Update URL for deep linking
    const tool = tools.find(t => t.id === toolId);
    if (tool) {
      navigate(`/tools?tab=${toolId}`, { replace: true });
    }
  };

  const handleBackToTools = () => {
    setSelectedTool(null);
    navigate('/tools', { replace: true });
  };

  // If a tool is selected, show the tool component
  if (selectedTool) {
    const tool = tools.find(t => t.id === selectedTool);
    
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={handleBackToTools}
          className="gap-2 -ml-2"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          Back to Tools
        </Button>

        {/* Tool Header */}
        {tool && (
          <div className="section-header">
            <div className={`section-icon ${tool.color.replace('text-', 'bg-').replace('500', '500/10')}`}>
              <tool.icon className={`h-5 w-5 ${tool.color}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{tool.name}</h1>
              <p className="text-muted-foreground text-sm">{tool.purpose}</p>
            </div>
          </div>
        )}

        {/* Tool Content */}
        {renderTool()}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <FolderOpen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Claim Tools</h1>
          <p className="text-muted-foreground">Powerful tools to strengthen your VA claim</p>
        </div>
      </div>

      {/* Educational Disclaimer */}
      <DisclaimerNotice variant="card" />

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as typeof activeCategory)} className="w-full">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex w-auto min-w-full sm:grid sm:w-full sm:grid-cols-3 h-auto bg-muted p-1.5 rounded-lg">
            {(Object.entries(categoryLabels) as [keyof typeof categoryLabels, typeof categoryLabels[keyof typeof categoryLabels]][]).map(([key, { label, icon: Icon }]) => (
              <TabsTrigger 
                key={key} 
                value={key} 
                className="text-xs sm:text-sm flex-shrink-0 px-3 py-2.5 gap-2"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{key === 'documents' ? 'Docs' : key === 'calculators' ? 'Calc' : 'Prep'}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {(Object.keys(categoryLabels) as (keyof typeof categoryLabels)[]).map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            {/* Category Description */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                {categoryLabels[category].description}
              </p>
            </div>

            {/* Tool Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.filter(t => t.category === category).map((tool) => (
                <Card 
                  key={tool.id} 
                  className="data-card group hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => handleUseTool(tool.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl ${tool.color.replace('text-', 'bg-').replace('500', '500/10')} group-hover:scale-110 transition-transform`}>
                        <tool.icon className={`h-5 w-5 ${tool.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base leading-tight">{tool.shortName}</CardTitle>
                        <Badge variant="secondary" className="mt-1.5 text-[10px] font-normal">
                          {tool.purpose.split(' ').slice(0, 4).join(' ')}...
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm line-clamp-3 mb-4">
                      {tool.description}
                    </CardDescription>
                    <Button 
                      className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUseTool(tool.id);
                      }}
                    >
                      Use Tool
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
