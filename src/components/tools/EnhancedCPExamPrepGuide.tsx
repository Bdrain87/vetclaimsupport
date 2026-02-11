import { useState, useMemo } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Stethoscope,
  AlertTriangle,
  Search,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Ban,
  MessageCircleQuestion,
  Lightbulb,
  Clock,
  Target,
  PenLine,
  BarChart3,
} from 'lucide-react';
import { examPrepData, examCategories, generalExamTips } from '@/data/cpExamPrep';

interface PreparedAnswer {
  question: string;
  answer: string;
}

export function EnhancedCPExamPrepGuide() {
  const { data } = useClaims();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [preparedAnswers, setPreparedAnswers] = useState<PreparedAnswer[]>([]);
  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set());

  // Get user's claimed conditions
  const claimedConditions = data.claimConditions?.map(c => c.name) || [];

  // Get relevant symptom data for the selected condition
  const relevantSymptoms = useMemo(() => {
    if (!selectedCondition) return [];
    const condition = data.claimConditions?.find(c => c.name === selectedCondition);
    if (!condition) return [];
    
    return data.symptoms?.filter(s => condition.linkedSymptoms.includes(s.id)) || [];
  }, [selectedCondition, data]);

  // Find available conditions
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

  // Check if condition has specific prep data
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

  // Generate personalized answer starters based on user data
  const generateAnswerStarter = (question: string): string => {
    const q = question.toLowerCase();
    
    if (q.includes('when') && q.includes('start')) {
      if (relevantSymptoms.length > 0) {
        const earliest = relevantSymptoms.sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        )[0];
        return `I first noticed symptoms around ${new Date(earliest.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}...`;
      }
      return `I first noticed symptoms in [MONTH/YEAR] while I was stationed at...`;
    }

    if (q.includes('how often') || q.includes('frequency')) {
      if (relevantSymptoms.length >= 5) {
        return `Based on my symptom log, this occurs approximately ${Math.round(relevantSymptoms.length / 4)} times per week...`;
      }
      return `This occurs approximately [X] times per [DAY/WEEK/MONTH]. For example, last week...`;
    }

    if (q.includes('worst') || q.includes('severe')) {
      const severeSymptom = relevantSymptoms.find(s => s.severity >= 7);
      if (severeSymptom) {
        return `On ${new Date(severeSymptom.date).toLocaleDateString()}, I experienced severity ${severeSymptom.severity}/10. I could not...`;
      }
      return `On my worst days, I cannot [SPECIFIC ACTIVITY]. The last time this happened was on [DATE] when I...`;
    }

    if (q.includes('work') || q.includes('job')) {
      return `My condition affects my work by [SPECIFIC IMPACT]. I have [MISSED X DAYS / HAD TO LEAVE EARLY / COULDN'T COMPLETE TASKS]...`;
    }

    if (q.includes('sleep')) {
      const sleepSymptom = relevantSymptoms.find(s => 
        s.symptom.toLowerCase().includes('sleep') || s.dailyImpact?.toLowerCase().includes('sleep')
      );
      if (sleepSymptom) {
        return `I typically only get about [X] hours of sleep. On ${new Date(sleepSymptom.date).toLocaleDateString()}, I noted...`;
      }
      return `I typically only get [X] hours of sleep per night. I wake up approximately [X] times because...`;
    }

    if (q.includes('medication')) {
      if (data.medications?.length > 0) {
        const meds = data.medications.slice(0, 3).map(m => m.name).join(', ');
        return `I currently take ${meds}. The side effects include...`;
      }
      return `I currently take [MEDICATION NAME] which was prescribed on [DATE]. The side effects include...`;
    }

    return `In my experience, [DESCRIBE SPECIFICALLY WITH DATES AND EXAMPLES]...`;
  };

  const handleAnswerChange = (question: string, answer: string) => {
    setPreparedAnswers(prev => {
      const existing = prev.find(a => a.question === question);
      if (existing) {
        return prev.map(a => a.question === question ? { ...a, answer } : a);
      }
      return [...prev, { question, answer }];
    });
  };

  const getAnswer = (question: string): string => {
    return preparedAnswers.find(a => a.question === question)?.answer || '';
  };

  const toggleDoc = (doc: string) => {
    setCheckedDocs(prev => {
      const next = new Set(prev);
      if (next.has(doc)) next.delete(doc);
      else next.add(doc);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Critical Alert */}
      <Alert className="border-destructive/50 bg-destructive/5">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertDescription className="text-foreground">
          <strong>The C&P exam is the most important part of your claim.</strong> The examiner's report 
          directly determines your rating. Proper preparation can mean the difference between 0% and 70%.
        </AlertDescription>
      </Alert>

      {/* User's Claimed Conditions Quick Access */}
      {claimedConditions.length > 0 && (
        <Card className="data-card border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              Your Claimed Conditions
            </CardTitle>
            <CardDescription>Select a condition to see specific exam prep guidance</CardDescription>
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
                      hasPrep ? 'hover:bg-primary/20' : 'opacity-60'
                    } ${selectedCondition === condition ? 'ring-2 ring-primary/50' : ''}`}
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

      {/* Search Condition */}
      <Card className="data-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            Find Condition-Specific Prep
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conditions (e.g., PTSD, Back Pain)..."
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
        </CardContent>
      </Card>

      {/* Condition-Specific Prep */}
      {selectedPrep && selectedCondition && (
        <Card className="data-card border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-lg">{selectedCondition} C&P Exam Prep</CardTitle>
                <CardDescription>
                  {selectedPrep.category} exam - prepare your answers below
                </CardDescription>
              </div>
              <Badge variant="secondary">{selectedPrep.category}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={['what-to-expect', 'practice-answers']} className="space-y-2">
              
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

              {/* Practice Your Answers - NEW INTERACTIVE SECTION */}
              <AccordionItem value="practice-answers" className="border rounded-lg px-4 border-primary/30 bg-primary/5">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <PenLine className="h-4 w-4 text-primary" />
                    <span>Practice Your Answers (Write in First Person)</span>
                    <Badge variant="secondary" className="ml-2 text-xs">Interactive</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <Alert className="border-primary/30 bg-background">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    <AlertDescription>
                      <strong>Pro Tip:</strong> Write your answers in first person with specific dates and examples. 
                      "I have nightmares 4-5 times per week" is better than "I have nightmares often."
                    </AlertDescription>
                  </Alert>
                  
                  {selectedPrep.examinerQuestions.slice(0, 5).map((question, i) => (
                    <div key={i} className="space-y-2 p-4 bg-background rounded-lg border">
                      <Label className="text-sm font-medium flex items-start gap-2">
                        <span className="text-primary font-bold">Q{i + 1}:</span>
                        {question}
                      </Label>
                      <p className="text-xs text-muted-foreground italic">
                        <Lightbulb className="h-3 w-3 inline text-primary" /> Start with: "{generateAnswerStarter(question)}"
                      </p>
                      <Textarea
                        placeholder="Write your answer here... Be specific with dates, frequencies, and examples."
                        value={getAnswer(question)}
                        onChange={(e) => handleAnswerChange(question, e.target.value)}
                        className="min-h-[80px] text-sm"
                      />
                    </div>
                  ))}
                  
                  {preparedAnswers.length > 0 && (
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                        ✓ You've prepared {preparedAnswers.filter(a => a.answer.length > 10).length} answer{preparedAnswers.filter(a => a.answer.length > 10).length !== 1 ? 's' : ''}. 
                        Review them before your exam!
                      </p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* Symptom Description Tips */}
              <AccordionItem value="symptom-tips" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span>How to Describe Your Symptoms</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {selectedPrep.symptomTips.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-blue-500 mt-1">★</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* User's logged symptom data */}
                  {relevantSymptoms.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">
                        <BarChart3 className="h-3 w-3 inline" /> Your Logged Symptom Data:
                      </p>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        {relevantSymptoms.slice(0, 3).map((s, i) => (
                          <li key={i}>
                            • {new Date(s.date).toLocaleDateString()}: {s.symptom} - Severity {s.severity}/10
                          </li>
                        ))}
                        {relevantSymptoms.length > 3 && (
                          <li className="text-primary">+ {relevantSymptoms.length - 3} more entries</li>
                        )}
                      </ul>
                      <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
                        <Lightbulb className="h-3 w-3 inline text-primary" /> Reference these specific dates during your exam!
                      </p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* Documents Checklist */}
              <AccordionItem value="documents" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span>Documents to Bring</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {checkedDocs.size}/{selectedPrep.documentsTouring.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {selectedPrep.documentsTouring.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Checkbox 
                          id={`doc-${i}`} 
                          checked={checkedDocs.has(item)}
                          onCheckedChange={() => toggleDoc(item)}
                        />
                        <label 
                          htmlFor={`doc-${i}`} 
                          className={`cursor-pointer ${checkedDocs.has(item) ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {item}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Mistakes to Avoid */}
              <AccordionItem value="mistakes" className="border rounded-lg px-4 border-destructive/30">
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

              {/* All Examiner Questions */}
              <AccordionItem value="all-questions" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <MessageCircleQuestion className="h-4 w-4 text-purple-500" />
                    <span>All Possible Questions ({selectedPrep.examinerQuestions.length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {selectedPrep.examinerQuestions.map((question, i) => (
                      <div key={i} className="p-2 rounded-lg bg-muted/50 border text-sm">
                        <span className="text-purple-500 font-medium mr-2">Q{i + 1}:</span>
                        {question}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* General Exam Tips - Always Show */}
      <Card className="data-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-primary" />
            General C&P Exam Preparation
          </CardTitle>
          <CardDescription>Essential guidance for ALL C&P exams</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={selectedPrep ? [] : ['general-tips']} className="space-y-2">
            <AccordionItem value="general-tips" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-500" />
                  <span>Pro Tips from Veterans</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {generalExamTips.proTips.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-500 mt-1">★</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="general-mistakes" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Ban className="h-4 w-4 text-destructive" />
                  <span>Mistakes to Avoid at Any Exam</span>
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
          </Accordion>
        </CardContent>
      </Card>

      {/* Final Reminder */}
      <Card className="data-card bg-primary/5 border-primary/30">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <Clock className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">Day of Exam Reminders</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• Arrive 15 minutes early</li>
                <li>• Describe your WORST days, not average days</li>
                <li>• Be specific: use dates, frequencies, and examples</li>
                <li>• Don't minimize - if it hurts, show it</li>
                <li>• Bring copies of all documents (examiner may not have your file)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
