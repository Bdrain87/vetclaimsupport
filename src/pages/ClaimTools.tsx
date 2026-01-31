import { FileText, Clipboard, Scale, ClipboardList } from 'lucide-react';
import { PersonalStatementGenerator } from '@/components/tools/PersonalStatementGenerator';
import { DBQRatingReference } from '@/components/tools/DBQRatingReference';
import { ConditionSpecificChecklist } from '@/components/tools/ConditionSpecificChecklist';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ClaimTools() {
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
      <Tabs defaultValue="statement" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="statement" className="text-xs sm:text-sm">
            <FileText className="h-4 w-4 mr-1 hidden sm:inline" />
            Statement
          </TabsTrigger>
          <TabsTrigger value="criteria" className="text-xs sm:text-sm">
            <Scale className="h-4 w-4 mr-1 hidden sm:inline" />
            Rating Criteria
          </TabsTrigger>
          <TabsTrigger value="checklist" className="text-xs sm:text-sm">
            <ClipboardList className="h-4 w-4 mr-1 hidden sm:inline" />
            Checklists
          </TabsTrigger>
        </TabsList>

        <TabsContent value="statement" className="mt-6">
          <PersonalStatementGenerator />
        </TabsContent>

        <TabsContent value="criteria" className="mt-6">
          <DBQRatingReference />
        </TabsContent>

        <TabsContent value="checklist" className="mt-6">
          <ConditionSpecificChecklist />
        </TabsContent>
      </Tabs>
    </div>
  );
}
