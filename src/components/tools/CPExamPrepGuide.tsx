import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  AlertTriangle, ClipboardCheck, Search, FileText, 
  MessageCircleQuestion, Ban, Lightbulb, Stethoscope,
  CheckCircle2
} from 'lucide-react';
import { examPrepData, examCategories, generalExamTips } from '@/data/cpExamPrep';
import { useClaims } from '@/hooks/useClaims';

interface CPExamPrepGuideProps {
  initialCondition?: string;
}

export function CPExamPrepGuide({ initialCondition }: CPExamPrepGuideProps) {
  const { data } = useClaims();
  const [searchQuery, setSearchQuery] = useState(initialCondition || '');
  const [selectedCondition, setSelectedCondition] = useState<string | null>(initialCondition || null);

  // Get user's claimed conditions
  const claimedConditions = data.claimConditions?.map(c => c.name) || [];

  // Find matching conditions from our data
  const availableConditions = useMemo(() => {
    const all: string[] = [];
    examCategories.forEach(cat => {
      cat.conditions.forEach(cond => {
        if (!all.includes(cond)) all.push(cond);
      });
    });
    return all.sort();
  }, []);

  // Filter conditions based on search
  const filteredConditions = useMemo(() => {
    if (!searchQuery.trim()) return availableConditions;
    const query = searchQuery.toLowerCase();
    return availableConditions.filter(c => c.toLowerCase().includes(query));
  }, [availableConditions, searchQuery]);

  // Check if a condition has specific prep data
  const hasSpecificPrep = (condition: string): boolean => {
    return Object.keys(examPrepData).some(key => 
      key.toLowerCase() === condition.toLowerCase()
    );
  };

  // Get prep data for selected condition
  const getConditionPrep = (condition: string) => {
    const key = Object.keys(examPrepData).find(k => 
      k.toLowerCase() === condition.toLowerCase()
    );
    return key ? examPrepData[key] : null;
  };

  const selectedPrep = selectedCondition ? getConditionPrep(selectedCondition) : null;

  return (
    <div className="space-y-6">
      <Alert className="border-primary/30 bg-primary/5">
        <AlertTriangle className="h-4 w-4 text-primary" />
        <AlertDescription className="text-foreground">
          <strong>The C&P exam is crucial</strong> — it's how the VA determines your rating. 
          Proper preparation can significantly impact your claim outcome.
        </AlertDescription>
      </Alert>

      {/* Claimed Conditions Quick Access */}
      {claimedConditions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              Your Claimed Conditions
            </CardTitle>
            <CardDescription>Quick access to exam prep for conditions you're claiming</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {claimedConditions.map((condition) => {
                const hasPrep = hasSpecificPrep(condition);
                return (
                  <Badge
                    key={condition}
                    variant={selectedCondition === condition ? 'default' : 'outline'}
                    className={`cursor-pointer transition-all ${
                      hasPrep 
                        ? 'hover:bg-primary/20' 
                        : 'opacity-60'
                    }`}
                    onClick={() => {
                      if (hasPrep) {
                        setSelectedCondition(condition);
                        setSearchQuery(condition);
                      }
                    }}
                  >
                    {condition}
                    {hasPrep && <CheckCircle2 className="h-3 w-3 ml-1" />}
                  </Badge>
                );
              })}
            </div>
            {claimedConditions.some(c => !hasSpecificPrep(c)) && (
              <p className="text-xs text-muted-foreground mt-3">
                Conditions without ✓ will use general exam prep guidance
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search & Select Condition */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            Find Condition-Specific Guidance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conditions (e.g., PTSD, Back Pain, Tinnitus)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!e.target.value) setSelectedCondition(null);
              }}
              className="pl-10"
            />
          </div>
          
          {searchQuery && filteredConditions.length > 0 && !selectedCondition && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {filteredConditions.slice(0, 12).map((condition) => (
                <Badge
                  key={condition}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/20 justify-center py-2"
                  onClick={() => {
                    setSelectedCondition(condition);
                    setSearchQuery(condition);
                  }}
                >
                  {condition}
                </Badge>
              ))}
            </div>
          )}
          
          {searchQuery && filteredConditions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No specific guidance found. General exam tips are shown below.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Condition-Specific Prep */}
      {selectedPrep && selectedCondition && (
        <Card className="border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{selectedCondition} C&P Exam Prep</CardTitle>
                <CardDescription>
                  Condition-specific guidance for your {selectedPrep.category} exam
                </CardDescription>
              </div>
              <Badge variant="secondary">{selectedPrep.category}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={['what-to-expect', 'symptom-tips']} className="space-y-2">
              {/* What to Expect */}
              <AccordionItem value="what-to-expect" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4 text-primary" />
                    <span>What to Expect</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {selectedPrep.whatToExpect.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Symptom Tips */}
              <AccordionItem value="symptom-tips" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    <span>Tips for Describing Symptoms</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {selectedPrep.symptomTips.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-yellow-500 mt-1">★</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Documents to Bring */}
              <AccordionItem value="documents" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span>Documents to Bring</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {selectedPrep.documentsTouring.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Checkbox id={`doc-${i}`} className="mt-0.5" />
                        <label htmlFor={`doc-${i}`} className="cursor-pointer">{item}</label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Mistakes to Avoid */}
              <AccordionItem value="mistakes" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Ban className="h-4 w-4 text-destructive" />
                    <span>Common Mistakes to Avoid</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {selectedPrep.mistakesToAvoid.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-destructive mt-1">✗</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Examiner Questions */}
              <AccordionItem value="questions" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <MessageCircleQuestion className="h-4 w-4 text-purple-500" />
                    <span>Questions the Examiner May Ask</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {selectedPrep.examinerQuestions.map((question, i) => (
                      <div 
                        key={i} 
                        className="p-3 rounded-lg bg-muted/50 border border-border"
                      >
                        <p className="text-sm font-medium">
                          <span className="text-purple-500 mr-2">Q{i + 1}:</span>
                          {question}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    💡 Practice answering these questions before your exam. Be specific with dates, frequencies, and impacts.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* General Exam Tips - Always Show */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-primary" />
            General C&P Exam Preparation
          </CardTitle>
          <CardDescription>Essential guidance that applies to all C&P exams</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={selectedPrep ? [] : ['general-expect']} className="space-y-2">
            {/* What to Expect */}
            <AccordionItem value="general-expect" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-primary" />
                  <span>What to Expect at Any C&P Exam</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {generalExamTips.whatToExpect.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Essential Documents */}
            <AccordionItem value="general-docs" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span>Essential Documents Checklist</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {generalExamTips.documentsTouring.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Checkbox id={`gen-doc-${i}`} className="mt-0.5" />
                      <label htmlFor={`gen-doc-${i}`} className="cursor-pointer">{item}</label>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Mistakes to Avoid */}
            <AccordionItem value="general-mistakes" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Ban className="h-4 w-4 text-destructive" />
                  <span>Mistakes Veterans Commonly Make</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {generalExamTips.mistakesToAvoid.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-destructive mt-1">✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Pro Tips */}
            <AccordionItem value="pro-tips" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span>Pro Tips from Veterans</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {generalExamTips.proTips.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-yellow-500 mt-1">★</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
