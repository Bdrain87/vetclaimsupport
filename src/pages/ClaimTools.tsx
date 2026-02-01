import { FileText, Scale, ClipboardList, Stethoscope, Calculator, Users, BookOpen, Gavel, Printer, FileSignature, TrendingUp, ShieldAlert, DollarSign } from 'lucide-react';
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
import { useSearchParams } from 'react-router-dom';

export default function ClaimTools() {
  const [searchParams] = useSearchParams();
  const conditionParam = searchParams.get('condition');
  const tabParam = searchParams.get('tab');

  // Determine default tab based on URL params
  const getDefaultTab = () => {
    if (tabParam === 'exam-prep') return 'exam-prep';
    if (tabParam === 'calculator') return 'calculator';
    if (tabParam === 'backpay') return 'backpay';
    if (tabParam === 'buddy') return 'buddy';
    if (tabParam === 'stressor') return 'stressor';
    if (tabParam === 'dbq-guidance') return 'dbq-guidance';
    if (tabParam === 'dbq-summary') return 'dbq-summary';
    if (tabParam === 'nexus') return 'nexus';
    if (tabParam === 'increase') return 'increase';
    if (tabParam === 'appeal') return 'appeal';
    return 'statement';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Claim Tools</h1>
          <p className="text-muted-foreground">Powerful tools to strengthen your VA claim</p>
        </div>
      </div>

      {/* Educational Disclaimer */}
      <DisclaimerNotice variant="card" />

      {/* Tools Tabs */}
      <Tabs defaultValue={getDefaultTab()} className="w-full">
        <div className="space-y-2">
          {/* Row 1: Statement Generators */}
          <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1.5 rounded-lg">
            <TabsTrigger value="statement" className="text-xs sm:text-sm flex-1 min-w-[70px]">
              <FileText className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Statement</span>
            </TabsTrigger>
            <TabsTrigger value="buddy" className="text-xs sm:text-sm flex-1 min-w-[70px]">
              <Users className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Buddy</span>
            </TabsTrigger>
            <TabsTrigger value="stressor" className="text-xs sm:text-sm flex-1 min-w-[70px]">
              <ShieldAlert className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Stressor</span>
            </TabsTrigger>
            <TabsTrigger value="nexus" className="text-xs sm:text-sm flex-1 min-w-[70px]">
              <FileSignature className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Nexus</span>
            </TabsTrigger>
            <TabsTrigger value="increase" className="text-xs sm:text-sm flex-1 min-w-[70px]">
              <TrendingUp className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Increase</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Row 2: Reference & Prep Tools */}
          <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1.5 rounded-lg">
            <TabsTrigger value="criteria" className="text-xs sm:text-sm flex-1 min-w-[70px]">
              <Scale className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Criteria</span>
            </TabsTrigger>
            <TabsTrigger value="dbq-guidance" className="text-xs sm:text-sm flex-1 min-w-[70px]">
              <BookOpen className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">DBQ</span>
            </TabsTrigger>
            <TabsTrigger value="dbq-summary" className="text-xs sm:text-sm flex-1 min-w-[70px]">
              <Printer className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Dr. Summary</span>
            </TabsTrigger>
            <TabsTrigger value="checklist" className="text-xs sm:text-sm flex-1 min-w-[70px]">
              <ClipboardList className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Checklists</span>
            </TabsTrigger>
            <TabsTrigger value="exam-prep" className="text-xs sm:text-sm flex-1 min-w-[70px]">
              <Stethoscope className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">C&P Prep</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Row 3: Calculators & Appeals */}
          <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1.5 rounded-lg">
            <TabsTrigger value="calculator" className="text-xs sm:text-sm flex-1 min-w-[70px]">
              <Calculator className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Calculator</span>
            </TabsTrigger>
            <TabsTrigger value="backpay" className="text-xs sm:text-sm flex-1 min-w-[70px]">
              <DollarSign className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Back Pay</span>
            </TabsTrigger>
            <TabsTrigger value="appeal" className="text-xs sm:text-sm flex-1 min-w-[70px]">
              <Gavel className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Appeals</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="statement" className="mt-6">
          <PersonalStatementGenerator />
        </TabsContent>

        <TabsContent value="buddy" className="mt-6">
          <BuddyStatementGenerator />
        </TabsContent>

        <TabsContent value="stressor" className="mt-6">
          <StressorStatementGenerator />
        </TabsContent>

        <TabsContent value="nexus" className="mt-6">
          <NexusLetterGenerator />
        </TabsContent>

        <TabsContent value="increase" className="mt-6">
          <RatingIncreaseAnalyzer />
        </TabsContent>

        <TabsContent value="criteria" className="mt-6">
          <DBQRatingReference />
        </TabsContent>

        <TabsContent value="dbq-guidance" className="mt-6">
          <DBQGuidance />
        </TabsContent>

        <TabsContent value="dbq-summary" className="mt-6">
          <DBQAppointmentSummary />
        </TabsContent>

        <TabsContent value="checklist" className="mt-6">
          <ConditionSpecificChecklist />
        </TabsContent>

        <TabsContent value="exam-prep" className="mt-6">
          <CPExamPrepGuide initialCondition={conditionParam || undefined} />
        </TabsContent>

        <TabsContent value="calculator" className="mt-6">
          <RatingCalculator />
        </TabsContent>

        <TabsContent value="backpay" className="mt-6">
          <BackPayEstimator />
        </TabsContent>

        <TabsContent value="appeal" className="mt-6">
          <AppealStrategyAdvisor />
        </TabsContent>
      </Tabs>
    </div>
  );
}