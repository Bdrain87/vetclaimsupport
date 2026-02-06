import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FileText, Scale, Stethoscope, Calculator, Users,
  BookOpen, Gavel, FileSignature, TrendingUp, ShieldAlert,
  DollarSign, Link2, Target, Languages, MessageSquare, Wrench,
} from 'lucide-react';
import { PersonalStatementGenerator } from '@/components/tools/PersonalStatementGenerator';
import { DBQRatingReference } from '@/components/tools/DBQRatingReference';
import { DBQGuidance } from '@/components/tools/DBQGuidance';
import { DBQAppointmentSummary } from '@/components/tools/DBQAppointmentSummary';
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
import { MockExamSimulator } from '@/components/tools/MockExamSimulator';
import { VASpeakTranslator } from '@/components/tools/VASpeakTranslator';
import { DisclaimerNotice } from '@/components/shared/DisclaimerNotice';
import { useState } from 'react';

interface Tool {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  category: string;
}

const tools: Tool[] = [
  { id: 'calculator', name: 'VA Rating Calculator', icon: Calculator, description: 'Calculate your combined VA disability rating using VA Math', category: 'Calculators' },
  { id: 'secondary-suggester', name: 'Secondary Finder', icon: Link2, description: 'Find linked conditions to strengthen your claim', category: 'Claim Strategy' },
  { id: 'statement', name: 'Personal Statement', icon: FileText, description: 'Generate a compelling personal statement for your claim', category: 'Documents' },
  { id: 'stressor', name: 'Stressor Statement', icon: ShieldAlert, description: 'Create a PTSD stressor statement (VA Form 21-0781)', category: 'Documents' },
  { id: 'nexus', name: 'Nexus Letter Request', icon: FileSignature, description: 'Request a nexus letter template for your doctor', category: 'Documents' },
  { id: 'dbq-summary', name: 'DBQ Summary', icon: Stethoscope, description: 'Generate a printable DBQ appointment summary', category: 'Documents' },
  { id: 'buddy', name: 'Buddy Statement', icon: Users, description: 'Generate a buddy statement template for witnesses', category: 'Documents' },
  { id: 'va-speak', name: 'VA-Speak Translator', icon: Languages, description: 'Translate plain English into VA clinical terminology', category: 'Documents' },
  { id: 'exam-prep', name: 'C&P Exam Prep', icon: Stethoscope, description: 'Prepare for your C&P exam with practice questions', category: 'Exam Prep' },
  { id: 'mock-exam', name: 'Mock C&P Exam', icon: MessageSquare, description: 'Simulate a real C&P exam with a virtual examiner', category: 'Exam Prep' },
  { id: 'criteria', name: 'VA Rating Criteria', icon: Scale, description: 'Look up 38 CFR Part 4 rating criteria for your condition', category: 'Reference' },
  { id: 'dbq-guidance', name: 'DBQ Form Guidance', icon: BookOpen, description: 'Find the correct DBQ form and required findings', category: 'Reference' },
  { id: 'checklist', name: 'Evidence Checklist', icon: Target, description: 'Track what evidence you have vs. what you need', category: 'Reference' },
  { id: 'increase', name: 'Rating Increase', icon: TrendingUp, description: 'Analyze what evidence supports a higher rating', category: 'Reference' },
  { id: 'appeal', name: 'Appeal Strategy', icon: Gavel, description: 'Get guidance on HLR, Supplemental, and Board appeals', category: 'Appeals' },
  { id: 'backpay', name: 'Back Pay Estimator', icon: DollarSign, description: 'Estimate retroactive compensation based on your dates', category: 'Calculators' },
];

const renderTool = (id: string) => {
  switch (id) {
    case 'statement': return <PersonalStatementGenerator />;
    case 'buddy': return <BuddyStatementGenerator />;
    case 'stressor': return <StressorStatementGenerator />;
    case 'nexus': return <NexusLetterGenerator />;
    case 'dbq-summary': return <DBQAppointmentSummary />;
    case 'exam-prep': return <EnhancedCPExamPrepGuide />;
    case 'secondary-suggester': return <SmartSecondaryConditionsSuggester />;
    case 'criteria': return <DBQRatingReference />;
    case 'dbq-guidance': return <DBQGuidance />;
    case 'checklist': return <EnhancedEvidenceChecklist />;
    case 'increase': return <RatingIncreaseAnalyzer />;
    case 'appeal': return <AppealStrategyAdvisor />;
    case 'calculator': return <RatingCalculator />;
    case 'backpay': return <BackPayEstimator />;
    case 'mock-exam': return <MockExamSimulator />;
    case 'va-speak': return <VASpeakTranslator />;
    default: return null;
  }
};

export default function ClaimTools() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [selectedToolId, setSelectedToolId] = useState<string>(tabParam || '');

  const selectedTool = tools.find(t => t.id === selectedToolId);

  if (selectedTool) {
    return (
      <div className="container max-w-4xl mx-auto py-6 px-4 space-y-6">
        <button
          onClick={() => setSelectedToolId('')}
          className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-2"
        >
          <span>&larr;</span> Back to all tools
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#C8A628]/10 border border-[#C8A628]/20 flex items-center justify-center">
            <selectedTool.icon className="h-6 w-6 text-[#C8A628]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{selectedTool.name}</h1>
            <p className="text-white/50 text-sm">{selectedTool.description}</p>
          </div>
        </div>

        {renderTool(selectedToolId)}
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#C8A628]/10 border border-[#C8A628]/20 flex items-center justify-center">
          <Wrench className="h-6 w-6 text-[#C8A628]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Claim Tools</h1>
          <p className="text-white/50 text-sm">Choose a tool to strengthen your VA claim</p>
        </div>
      </div>

      <DisclaimerNotice variant="card" />

      {/* Tool Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setSelectedToolId(tool.id)}
            className="group text-left p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-[#C8A628]/30 hover:bg-white/[0.07] transition-all duration-200 hover:shadow-lg hover:shadow-[#C8A628]/5"
          >
            <div className="w-11 h-11 rounded-xl bg-[#C8A628]/10 border border-[#C8A628]/20 flex items-center justify-center mb-4 group-hover:bg-[#C8A628]/20 transition-colors">
              <tool.icon className="h-5 w-5 text-[#C8A628]" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-[#C8A628] transition-colors">
              {tool.name}
            </h3>
            <p className="text-xs text-white/50 leading-relaxed line-clamp-2">
              {tool.description}
            </p>
            <span className="inline-block mt-3 text-[10px] font-semibold uppercase tracking-wider text-white/30">
              {tool.category}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
