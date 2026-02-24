import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Calendar,
  Printer,
  Download,
  Lightbulb,
  Shield,
  Search,
  AlertTriangle,
  Sparkles,
  Loader2,
  FileCheck,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { examCategories, examPrepData } from '@/data/cpExamPrep';
import { useClaims } from '@/hooks/useClaims';
import { useAIGenerate } from '@/hooks/useAIGenerate';
import { createCPExamPrepPrompt } from '@/lib/ai-prompts';
import { AIDisclaimer } from '@/components/ui/AIDisclaimer';
import { AIContentBadge } from '@/components/ui/AIContentBadge';
import { PageContainer } from '@/components/PageContainer';
import { getConditionSymptoms, getConditionMedications } from '@/utils/prefillHelpers';

interface ChecklistItem {
  id: string;
  text: string;
  category: 'before' | 'during' | 'dayof';
}

const dayOfChecklist: ChecklistItem[] = [
  { id: '1', text: 'Get a good night\'s sleep (or document if you couldn\'t)', category: 'dayof' },
  { id: '2', text: 'Eat a light meal - don\'t skip eating', category: 'dayof' },
  { id: '3', text: 'Bring photo ID', category: 'dayof' },
  { id: '4', text: 'Bring your claim folder with all documents', category: 'dayof' },
  { id: '5', text: 'Bring list of all medications', category: 'dayof' },
  { id: '6', text: 'Wear comfortable, loose clothing', category: 'dayof' },
  { id: '7', text: 'Bring any assistive devices you use (brace, cane, CPAP)', category: 'dayof' },
  { id: '8', text: 'Arrive 15 minutes early', category: 'dayof' },
  { id: '9', text: 'Have someone drive you if needed', category: 'dayof' },
  { id: '10', text: 'Bring buddy statement copies', category: 'dayof' },
];

const beforeExamChecklist: ChecklistItem[] = [
  { id: 'b1', text: 'Review your medical records for dates and details', category: 'before' },
  { id: 'b2', text: 'Write down all symptoms and their frequency', category: 'before' },
  { id: 'b3', text: 'Note how symptoms affect work and daily life', category: 'before' },
  { id: 'b4', text: 'Gather all relevant documents', category: 'before' },
  { id: 'b5', text: 'Get buddy statements signed and notarized', category: 'before' },
  { id: 'b6', text: 'Review condition-specific exam tips', category: 'before' },
  { id: 'b7', text: 'Know your worst days - prepare to describe them', category: 'before' },
  { id: 'b8', text: 'Consider taking someone who can observe the exam', category: 'before' },
];

const dosList = [
  'Describe your WORST days, not average or best days',
  'Be specific with numbers: "5 times per week" vs "frequently"',
  'Explain impact on work, relationships, daily activities',
  'Mention all symptoms, even embarrassing ones',
  'Bring documentation for everything',
  'Be honest - exaggeration hurts your credibility',
  'Take your time answering questions',
  'Ask for clarification if you don\'t understand',
  'Demonstrate actual limitations during physical exams',
  'Mention if you\'re having a good or bad day',
];

const dontsList = [
  'Don\'t say "I\'m fine" or minimize symptoms',
  'Don\'t push through pain during ROM testing',
  'Don\'t be confrontational with the examiner',
  'Don\'t skip the exam - it results in denial',
  'Don\'t forget to mention medications and side effects',
  'Don\'t leave out symptoms you think are minor',
  'Don\'t assume the examiner has read your file',
  'Don\'t discuss symptoms you don\'t actually have',
  'Don\'t be late - it may cancel your exam',
  'Don\'t forget to bring your assistive devices',
];

export default function CPExamPrepEnhanced() {
  const { data: claimsData } = useClaims();


  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const conditionDetailRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { generate: aiGenerate, isLoading: aiLoading, error: aiError } = useAIGenerate('EXAMINER_PERSONA');
  const [aiQuestions, setAiQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('cp-exam-checklist');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cp-exam-checklist', JSON.stringify([...checkedItems]));
    } catch { /* storage full */ }
  }, [checkedItems]);

  const selectedPrepData = selectedCondition ? examPrepData[selectedCondition] : null;

  const toggleCheckItem = (id: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const checklistProgress = useMemo(() => {
    const total = dayOfChecklist.length + beforeExamChecklist.length;
    const checked = checkedItems.size;
    return Math.round((checked / total) * 100);
  }, [checkedItems]);

  const handleGenerateAIQuestions = async () => {
    if (!selectedCondition) return;
    setAiQuestions([]);
    setCurrentQuestionIndex(0);
    setShowSuggestion(false);
    setUserAnswer('');

    // Filter symptoms and medications by the selected condition
    const conditionSymptoms = getConditionSymptoms(selectedCondition, claimsData.symptoms || []);
    const conditionMeds = getConditionMedications(selectedCondition, claimsData.medications || []);

    // Fall back to all symptoms/meds if no condition-specific matches
    const userSymptoms = conditionSymptoms.length > 0
      ? conditionSymptoms.map(s => s.symptom)
      : (claimsData.symptoms || []).map(s => s.symptom);
    const userTreatments = conditionMeds.length > 0
      ? conditionMeds.map(m => m.name)
      : (claimsData.medications || []).map(m => m.name);

    const prompt = createCPExamPrepPrompt({
      condition: selectedCondition,
      currentSymptoms: userSymptoms.length > 0 ? userSymptoms : ['Symptoms related to condition'],
      currentTreatments: userTreatments.length > 0 ? userTreatments : ['Current treatment regimen'],
    });

    const result = await aiGenerate(prompt);
    if (result) {
      // Parse questions from AI response
      const lines = result.split('\n').filter(line => {
        const trimmed = line.trim();
        return trimmed.match(/^\d+[.)]\s/) || trimmed.startsWith('- ') || trimmed.startsWith('Q:');
      });
      const parsed = lines.map(l => l.replace(/^\d+[.)]\s*/, '').replace(/^-\s*/, '').replace(/^Q:\s*/, '').trim()).filter(Boolean);
      setAiQuestions(parsed.length > 0 ? parsed.slice(0, 10) : [result.slice(0, 500)]);
    }
  };

  return (
    <PageContainer className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <Stethoscope className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">C&P Exam Preparation</h1>
          <p className="text-muted-foreground">
            Everything you need to prepare for your Compensation & Pension exam
          </p>
        </div>
      </div>

      {/* Exam Packet CTA */}
      <Link
        to="/cp-exam-packet"
        className="flex items-center gap-3 p-4 rounded-xl bg-gold/10 border border-gold/30 hover:bg-gold/20 transition-colors"
      >
        <FileCheck className="h-5 w-5 text-gold shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Ready for your exam? Build your packet</p>
          <p className="text-xs text-muted-foreground">Create a comprehensive C&P exam preparation document</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </Link>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="conditions">By Condition</TabsTrigger>
          <TabsTrigger value="tips">Do's & Don'ts</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  What to Expect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="shrink-0">Duration</Badge>
                  <span className="text-sm min-w-0">20-60 minutes depending on conditions</span>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="shrink-0">Examiner</Badge>
                  <span className="text-sm min-w-0">Doctor, PA, NP, or psychologist (for MH)</span>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="shrink-0">Location</Badge>
                  <span className="text-sm min-w-0">VA facility or contracted clinic (QTC, VES, LHI)</span>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="shrink-0">Purpose</Badge>
                  <span className="text-sm min-w-0">Document current severity of your conditions</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Your Rights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    <span>You can request a copy of the exam report</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    <span>You can bring someone with you (they may wait outside)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    <span>You can request a same-gender examiner</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    <span>You can reschedule if needed (call in advance)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    <span>You can record the exam in some states</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* The Key Principle */}
          <Card className="bg-primary/5 border-primary/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-2">
                    The #1 Rule: Describe Your Worst Days
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    The VA rates disabilities based on how bad they can get, not how they are on a good day.
                    When the examiner asks about symptoms, think about your worst flare-ups and describe those.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                      <p className="text-destructive font-medium">❌ Wrong approach:</p>
                      <p className="text-muted-foreground">"My back hurts sometimes, but I manage."</p>
                    </div>
                    <div className="p-3 rounded-lg bg-success/10 border border-success/30">
                      <p className="text-success font-medium">✓ Right approach:</p>
                      <p className="text-muted-foreground">"During flare-ups, which happen 3-4 times per month, I can't bend forward and have to miss work."</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exam Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Types of C&P Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2">Physical Exams</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    For musculoskeletal, respiratory, skin, and other physical conditions.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Includes: Range of motion testing, palpation, strength testing
                  </p>
                </div>
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2">Mental Health Exams</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    For PTSD, depression, anxiety, and other mental health conditions.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Includes: Interview, questionnaires, symptom assessment
                  </p>
                </div>
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2">Hearing Exams</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    For hearing loss and tinnitus claims.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Includes: Audiogram, speech recognition testing
                  </p>
                </div>
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2">DBQ-Based Exams</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Examiners fill out Disability Benefits Questionnaires.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Standardized forms matching VA rating criteria
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conditions Tab */}
        <TabsContent value="conditions" className="space-y-6 mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conditions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Condition List */}
            <div className="space-y-4">
              <h3 className="font-semibold">Select Your Condition</h3>
              <Accordion type="single" collapsible>
                {examCategories.map((category) => (
                  <AccordionItem key={category.id} value={category.id}>
                    <AccordionTrigger className="text-sm">
                      {category.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1">
                        {category.conditions
                          .filter(c =>
                            !searchQuery.trim() ||
                            c.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map((condition) => (
                            <button
                              key={condition}
                              onClick={() => {
                                setSelectedCondition(condition);
                                setTimeout(() => {
                                  conditionDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }, 100);
                              }}
                              className={`w-full text-left p-2 rounded-lg text-sm transition-colors truncate ${
                                selectedCondition === condition
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'hover:bg-muted'
                              }`}
                            >
                              {condition}
                            </button>
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Condition Details */}
            <div className="lg:col-span-2" ref={conditionDetailRef}>
              {selectedPrepData ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-foreground break-words">{selectedCondition}</h2>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        What to Expect
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedPrepData.whatToExpect.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <ChevronRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Symptom Communication Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedPrepData.symptomTips.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-warning" />
                        Common Mistakes to Avoid
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedPrepData.mistakesToAvoid.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Documents to Bring
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedPrepData.documentsToBring.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <Checkbox id={`doc-${i}`} />
                            <label htmlFor={`doc-${i}`}>{item}</label>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Practice Questions</CardTitle>
                      <CardDescription>
                        Questions the examiner may ask you
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {selectedPrepData.examinerQuestions.slice(0, 8).map((q, i) => (
                          <li key={i} className="p-3 rounded-lg bg-muted/50 text-sm">
                            <span className="text-muted-foreground">Q: </span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* AI Practice Questions */}
                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        AI Practice Questions
                      </CardTitle>
                      <CardDescription>
                        Condition-specific practice questions generated by AI
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {aiQuestions.length === 0 ? (
                        <>
                          <Button
                            onClick={handleGenerateAIQuestions}
                            disabled={aiLoading}
                            className="w-full"
                            variant="outline"
                          >
                            {aiLoading ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Sparkles className="h-4 w-4 mr-2" />
                            )}
                            {aiLoading ? 'Generating Questions...' : 'Generate AI Practice Questions'}
                          </Button>
                          {aiError && !aiLoading && (
                            <Alert className="border-warning/30 bg-warning/5">
                              <AlertTriangle className="h-4 w-4 text-warning" />
                              <AlertDescription className="text-sm">{aiError}</AlertDescription>
                            </Alert>
                          )}
                        </>
                      ) : (
                        <>
                          <AIDisclaimer variant="banner" />
                          <AIContentBadge timestamp={new Date().toISOString()} />
                          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                              <Badge variant="outline">
                                Question {currentQuestionIndex + 1} of {aiQuestions.length}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                <Sparkles className="h-3 w-3 mr-1" />
                                AI Generated
                              </Badge>
                            </div>
                            <p className="text-sm font-medium mb-4">
                              {aiQuestions[currentQuestionIndex]}
                            </p>
                            <Textarea
                              value={userAnswer}
                              onChange={(e) => setUserAnswer(e.target.value)}
                              placeholder="Think about how you would answer this question, focusing on your worst days..."
                              rows={3}
                              className="mb-3"
                            />
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowSuggestion(!showSuggestion)}
                              >
                                {showSuggestion ? 'Hide Tip' : 'Show Tip'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={currentQuestionIndex === 0}
                                onClick={() => {
                                  setCurrentQuestionIndex(i => i - 1);
                                  setUserAnswer('');
                                  setShowSuggestion(false);
                                }}
                              >
                                Previous
                              </Button>
                              <Button
                                size="sm"
                                disabled={currentQuestionIndex >= aiQuestions.length - 1}
                                onClick={() => {
                                  setCurrentQuestionIndex(i => i + 1);
                                  setUserAnswer('');
                                  setShowSuggestion(false);
                                }}
                              >
                                Next
                              </Button>
                            </div>
                            {showSuggestion && (
                              <div className="mt-3 p-3 rounded-lg bg-success/10 border border-success/20">
                                <p className="text-xs font-medium text-success mb-1">Suggested Talking Point:</p>
                                <p className="text-xs text-muted-foreground">
                                  Remember: Describe your WORST days, not your average days. Be specific with frequency, duration, and severity numbers. Explain how this affects your work, daily activities, and relationships.
                                </p>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setAiQuestions([]);
                              setCurrentQuestionIndex(0);
                              setUserAnswer('');
                              setShowSuggestion(false);
                            }}
                          >
                            Generate New Questions
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="h-full flex items-center justify-center min-h-[400px]">
                  <CardContent className="text-center">
                    <Stethoscope className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Select a condition from the left to see exam preparation tips
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tips Tab */}
        <TabsContent value="tips" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-success/30">
              <CardHeader className="bg-success/5">
                <CardTitle className="text-lg flex items-center gap-2 text-success">
                  <ThumbsUp className="h-5 w-5" />
                  DO's - What to Do
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {dosList.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-destructive/30">
              <CardHeader className="bg-destructive/5">
                <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                  <ThumbsDown className="h-5 w-5" />
                  DON'Ts - What to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {dontsList.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Checklist Tab */}
        <TabsContent value="checklist" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Preparation Progress</CardTitle>
                <Badge variant={checklistProgress === 100 ? 'default' : 'secondary'}>
                  {checklistProgress}% Complete
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${checklistProgress}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Before the Exam
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {beforeExamChecklist.map((item) => (
                    <li key={item.id} className="flex items-center gap-3">
                      <Checkbox
                        id={item.id}
                        checked={checkedItems.has(item.id)}
                        onCheckedChange={() => toggleCheckItem(item.id)}
                      />
                      <label
                        htmlFor={item.id}
                        className={`text-sm cursor-pointer ${
                          checkedItems.has(item.id) ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {item.text}
                      </label>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Day of Exam
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {dayOfChecklist.map((item) => (
                    <li key={item.id} className="flex items-center gap-3">
                      <Checkbox
                        id={item.id}
                        checked={checkedItems.has(item.id)}
                        onCheckedChange={() => toggleCheckItem(item.id)}
                      />
                      <label
                        htmlFor={item.id}
                        className={`text-sm cursor-pointer ${
                          checkedItems.has(item.id) ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {item.text}
                      </label>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" className="gap-2" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              Print Checklist
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <Link to="/cp-exam-packet">
                <Download className="h-4 w-4" />
                <span className="truncate">Download Full Exam Packet PDF</span>
              </Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
