import { FileText, Scale, ClipboardList, Stethoscope, Calculator, Users } from 'lucide-react';
import { PersonalStatementGenerator } from '@/components/tools/PersonalStatementGenerator';
import { DBQRatingReference } from '@/components/tools/DBQRatingReference';
import { ConditionSpecificChecklist } from '@/components/tools/ConditionSpecificChecklist';
import { CPExamPrepGuide } from '@/components/tools/CPExamPrepGuide';
import { RatingCalculator } from '@/components/dashboard/RatingCalculator';
import { BuddyStatementGenerator } from '@/components/tools/BuddyStatementGenerator';
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
    if (tabParam === 'buddy') return 'buddy';
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

      {/* Tools Tabs */}
      <Tabs defaultValue={getDefaultTab()} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="statement" className="text-xs sm:text-sm">
            <FileText className="h-4 w-4 mr-1 hidden sm:inline" />
            Statement
          </TabsTrigger>
          <TabsTrigger value="buddy" className="text-xs sm:text-sm">
            <Users className="h-4 w-4 mr-1 hidden sm:inline" />
            Buddy
          </TabsTrigger>
          <TabsTrigger value="criteria" className="text-xs sm:text-sm">
            <Scale className="h-4 w-4 mr-1 hidden sm:inline" />
            Criteria
          </TabsTrigger>
          <TabsTrigger value="checklist" className="text-xs sm:text-sm">
            <ClipboardList className="h-4 w-4 mr-1 hidden sm:inline" />
            Checklists
          </TabsTrigger>
          <TabsTrigger value="exam-prep" className="text-xs sm:text-sm">
            <Stethoscope className="h-4 w-4 mr-1 hidden sm:inline" />
            C&P Prep
          </TabsTrigger>
          <TabsTrigger value="calculator" className="text-xs sm:text-sm">
            <Calculator className="h-4 w-4 mr-1 hidden sm:inline" />
            Calculator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="statement" className="mt-6">
          <PersonalStatementGenerator />
        </TabsContent>

        <TabsContent value="buddy" className="mt-6">
          <BuddyStatementGenerator />
        </TabsContent>

        <TabsContent value="criteria" className="mt-6">
          <DBQRatingReference />
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
      </Tabs>
    </div>
  );
}