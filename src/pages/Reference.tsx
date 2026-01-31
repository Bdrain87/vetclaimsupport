import { BookOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DisabilitiesTab } from '@/components/reference/DisabilitiesTab';
import { SecondaryConditionsTab } from '@/components/reference/SecondaryConditionsTab';
import { PACTActTab } from '@/components/reference/PACTActTab';
import { ClaimsGuideTab } from '@/components/reference/ClaimsGuideTab';
import { CPExamPrepTab } from '@/components/reference/CPExamPrepTab';
import { BuddyStatementTemplate } from '@/components/reference/BuddyStatementTemplate';
import { BuddyStatementTemplates } from '@/components/reference/BuddyStatementTemplates';
import { VAFormsTab } from '@/components/reference/VAFormsTab';
import { PersonalStatementTab } from '@/components/reference/PersonalStatementTab';

export default function Reference() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reference Guide</h1>
          <p className="text-muted-foreground">VA disabilities, claims tips, and resources</p>
        </div>
      </div>

      <Tabs defaultValue="disabilities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8 h-auto gap-2 bg-transparent p-0">
          <TabsTrigger value="disabilities" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            VA Disabilities
          </TabsTrigger>
          <TabsTrigger value="secondary" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Secondary
          </TabsTrigger>
          <TabsTrigger value="pact" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            PACT Act
          </TabsTrigger>
          <TabsTrigger value="guide" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Claims Guide
          </TabsTrigger>
          <TabsTrigger value="cpexam" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            C&P Exam
          </TabsTrigger>
          <TabsTrigger value="vaforms" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            VA Forms
          </TabsTrigger>
          <TabsTrigger value="statement" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Personal Statement
          </TabsTrigger>
          <TabsTrigger value="buddy" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Buddy Statements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="disabilities">
          <DisabilitiesTab />
        </TabsContent>

        <TabsContent value="secondary">
          <SecondaryConditionsTab />
        </TabsContent>

        <TabsContent value="pact">
          <PACTActTab />
        </TabsContent>

        <TabsContent value="guide">
          <ClaimsGuideTab />
        </TabsContent>

        <TabsContent value="cpexam">
          <CPExamPrepTab />
        </TabsContent>

        <TabsContent value="vaforms">
          <VAFormsTab />
        </TabsContent>

        <TabsContent value="statement">
          <PersonalStatementTab />
        </TabsContent>

        <TabsContent value="buddy" className="space-y-6">
          <BuddyStatementTemplates />
          <BuddyStatementTemplate />
        </TabsContent>
      </Tabs>
    </div>
  );
}
