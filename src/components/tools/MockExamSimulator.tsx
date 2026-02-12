import { useState, useMemo, useRef, useEffect } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { DisclaimerNotice } from '@/components/shared/DisclaimerNotice';
import {
  Stethoscope,
  Send,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  User,
  ClipboardList,
  Lightbulb,
  Copy,
  Download,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { examPrepData, examCategories } from '@/data/cpExamPrep';

interface ExamMessage {
  role: 'examiner' | 'veteran' | 'feedback';
  content: string;
  ratingCriteria?: string;
}

// Vagueness detection patterns
const VAGUE_PATTERNS = [
  { pattern: /\b(sometimes|occasionally|a lot|often|frequently)\b/i, feedback: 'The rater needs exact numbers. Instead of "{match}", try "X times per week/month." For example, "3-4 times per week" gives the rater what they need to assign the correct rating.' },
  { pattern: /\b(pretty bad|really bad|not great|hurts|painful)\b/i, feedback: 'The rater uses a severity scale. Instead of "{match}", describe the intensity on a 0-10 scale AND what you cannot do during episodes. For example, "pain at 7/10 that prevents me from standing for more than 10 minutes."' },
  { pattern: /\b(i guess|maybe|sort of|kind of|i think)\b/i, feedback: 'Hedging language weakens your description. Instead of "{match}", state facts directly. "I experience nightmares" is stronger than "I think I have nightmares sometimes."' },
  { pattern: /\b(fine|okay|not too bad|manageable|deal with it)\b/i, feedback: 'Minimizing language can lower your rating. The rater needs to know your WORST days. Instead of "{match}", describe what happens on your worst day and how it limits your function.' },
  { pattern: /\b(it happens|stuff like that|things like that|you know|and stuff)\b/i, feedback: 'The rater needs specific details, not generalizations. Replace "{match}" with concrete examples including dates, durations, and specific limitations.' },
];

// Rating criteria keywords for 38 CFR mapping
const RATING_CRITERIA_MAP: Record<string, { criteria: string; cfrReference: string }[]> = {
  'ptsd': [
    { criteria: 'Occupational and social impairment with occasional decrease in work efficiency', cfrReference: '38 CFR 4.130, DC 9411 - 30%' },
    { criteria: 'Occupational and social impairment with reduced reliability and productivity', cfrReference: '38 CFR 4.130, DC 9411 - 50%' },
    { criteria: 'Occupational and social impairment with deficiencies in most areas', cfrReference: '38 CFR 4.130, DC 9411 - 70%' },
    { criteria: 'Total occupational and social impairment', cfrReference: '38 CFR 4.130, DC 9411 - 100%' },
  ],
  'migraine': [
    { criteria: 'Characteristic prostrating attacks averaging one in 2 months', cfrReference: '38 CFR 4.124a, DC 8100 - 10%' },
    { criteria: 'Characteristic prostrating attacks occurring on average once a month', cfrReference: '38 CFR 4.124a, DC 8100 - 30%' },
    { criteria: 'Very frequent completely prostrating and prolonged attacks productive of severe economic inadaptability', cfrReference: '38 CFR 4.124a, DC 8100 - 50%' },
  ],
  'back': [
    { criteria: 'Forward flexion greater than 60 degrees but not greater than 85 degrees', cfrReference: '38 CFR 4.71a, DC 5237 - 10%' },
    { criteria: 'Forward flexion greater than 30 degrees but not greater than 60 degrees', cfrReference: '38 CFR 4.71a, DC 5237 - 20%' },
    { criteria: 'Forward flexion of 30 degrees or less, or favorable ankylosis', cfrReference: '38 CFR 4.71a, DC 5237 - 40%' },
  ],
  'knee': [
    { criteria: 'Flexion limited to 45 degrees', cfrReference: '38 CFR 4.71a, DC 5260 - 10%' },
    { criteria: 'Flexion limited to 30 degrees', cfrReference: '38 CFR 4.71a, DC 5260 - 20%' },
    { criteria: 'Slight recurrent subluxation or lateral instability', cfrReference: '38 CFR 4.71a, DC 5257 - 10%' },
  ],
  'sleep apnea': [
    { criteria: 'Persistent daytime hypersomnolence', cfrReference: '38 CFR 4.97, DC 6847 - 30%' },
    { criteria: 'Requires use of breathing assistance device such as CPAP', cfrReference: '38 CFR 4.97, DC 6847 - 50%' },
    { criteria: 'Chronic respiratory failure with carbon dioxide retention or cor pulmonale', cfrReference: '38 CFR 4.97, DC 6847 - 100%' },
  ],
  'tinnitus': [
    { criteria: 'Recurrent tinnitus', cfrReference: '38 CFR 4.87, DC 6260 - 10% (maximum schedular)' },
  ],
};

// Build exam question sequences by condition type
function getExamSequence(conditionName: string): { question: string; focus: string; followUp: string }[] {
  // Try to get from examPrepData
  const prepKey = Object.keys(examPrepData).find(k => k.toLowerCase() === conditionName.toLowerCase());
  const prepData = prepKey ? examPrepData[prepKey] : null;

  const baseQuestions: { question: string; focus: string; followUp: string }[] = [];

  if (prepData) {
    // Use first 6 examiner questions from prep data with focus areas
    prepData.examinerQuestions.slice(0, 6).forEach((q, i) => {
      baseQuestions.push({
        question: q,
        focus: i < 2 ? 'onset and history' : i < 4 ? 'frequency, severity, and duration' : 'functional impact',
        followUp: prepData.symptomTips[i] || 'Be as specific as possible with dates and measurements.',
      });
    });
  }

  // Add universal functional impact questions
  baseQuestions.push(
    {
      question: 'How does this condition affect your ability to work? Have you missed any days or had to change how you do your job?',
      focus: 'occupational impairment',
      followUp: 'Occupational impairment is a key factor in VA ratings. Mention missed days, reduced performance, and job accommodations.',
    },
    {
      question: 'Describe your worst flare-up or episode in the last 12 months. What happened, how long did it last, and what could you not do?',
      focus: 'severity during flare-ups',
      followUp: 'Flare-ups that cause incapacitation are rated differently. Be specific about duration and limitations during these episodes.',
    },
    {
      question: 'How does this condition affect your daily activities? Things like household chores, driving, personal hygiene, or social activities?',
      focus: 'activities of daily living',
      followUp: 'Describe specific activities you cannot do or need help with. This demonstrates functional limitation.',
    },
  );

  // If no prep data, add generic opening questions
  if (!prepData) {
    baseQuestions.unshift(
      {
        question: `When did you first notice symptoms related to your ${conditionName}? Can you describe what happened?`,
        focus: 'onset and service connection',
        followUp: 'Connect the onset to your military service period. Include dates and locations if possible.',
      },
      {
        question: 'How often do you experience these symptoms? Please be as specific as possible.',
        focus: 'frequency',
        followUp: 'Use exact numbers: "4 times per week" not "often." The rating criteria depend on frequency.',
      },
      {
        question: 'On a scale of 0-10, how would you rate the severity on a typical day versus your worst day?',
        focus: 'severity',
        followUp: 'Describe what each severity level means for your functioning. A 7/10 that keeps you in bed is different from a 7/10 you push through.',
      },
    );
  }

  return baseQuestions;
}

function getConditionCategory(conditionName: string): string {
  const name = conditionName.toLowerCase();
  if (name.includes('ptsd') || name.includes('anxiety') || name.includes('depression') || name.includes('bipolar') || name.includes('insomnia')) return 'ptsd';
  if (name.includes('migraine') || name.includes('headache')) return 'migraine';
  if (name.includes('back') || name.includes('spine') || name.includes('lumbar') || name.includes('disc')) return 'back';
  if (name.includes('knee')) return 'knee';
  if (name.includes('sleep') || name.includes('apnea')) return 'sleep apnea';
  if (name.includes('tinnitus')) return 'tinnitus';
  return '';
}

export function MockExamSimulator() {
  const { data } = useClaims();
  const { toast } = useToast();
  const [selectedCondition, setSelectedCondition] = useState('');
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messages, setMessages] = useState<ExamMessage[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [examComplete, setExamComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const claimedConditions = data.claimConditions?.map(c => c.name) || [];

  const examSequence = useMemo(() => {
    if (!selectedCondition) return [];
    return getExamSequence(selectedCondition);
  }, [selectedCondition]);

  const conditionCategory = useMemo(() => getConditionCategory(selectedCondition), [selectedCondition]);
  const ratingCriteria = conditionCategory ? RATING_CRITERIA_MAP[conditionCategory] : undefined;

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startExam = () => {
    if (!selectedCondition) return;

    const introMessage: ExamMessage = {
      role: 'examiner',
      content: `Good morning. I'm Dr. Johnson, and I'll be conducting your Compensation & Pension examination today for ${selectedCondition}. This exam will help the VA understand the severity and impact of your condition.\n\nPlease answer each question as specifically as possible. I need to document frequency, severity, and duration for the rating board.\n\nLet's begin.`,
    };

    const firstQuestion: ExamMessage = {
      role: 'examiner',
      content: examSequence[0]?.question || `Tell me about your ${selectedCondition}. When did it start?`,
      ratingCriteria: `Focus area: ${examSequence[0]?.focus || 'onset and history'}`,
    };

    setMessages([introMessage, firstQuestion]);
    setExamStarted(true);
    setCurrentQuestionIndex(0);
    setExamComplete(false);
  };

  const analyzeAnswer = (answer: string): ExamMessage | null => {
    const trimmed = answer.trim();
    if (trimmed.length < 15) {
      return {
        role: 'feedback',
        content: 'Your answer is very brief. The rater needs detailed information to assign the correct rating. Try to include specific numbers, dates, and examples of how this affects your daily life.',
      };
    }

    for (const { pattern, feedback: template } of VAGUE_PATTERNS) {
      const match = trimmed.match(pattern);
      if (match) {
        return {
          role: 'feedback',
          content: template.replace('{match}', match[0]),
        };
      }
    }

    return null;
  };

  const submitAnswer = () => {
    if (!currentAnswer.trim()) return;

    // Add veteran's answer
    const veteranMessage: ExamMessage = {
      role: 'veteran',
      content: currentAnswer.trim(),
    };

    const newMessages = [...messages, veteranMessage];

    // Analyze for vagueness
    const feedback = analyzeAnswer(currentAnswer);
    if (feedback) {
      newMessages.push(feedback);
    }

    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < examSequence.length) {
      // Add next question
      const nextQ = examSequence[nextIndex];
      newMessages.push({
        role: 'examiner',
        content: nextQ.question,
        ratingCriteria: `Focus area: ${nextQ.focus}`,
      });
      setCurrentQuestionIndex(nextIndex);
    } else {
      // Exam complete
      newMessages.push({
        role: 'examiner',
        content: `Thank you for your time today. That concludes the examination for ${selectedCondition}. The results will be sent to the VA rating board for review.\n\nRemember: If you think of additional details after this exam, you can submit a supplemental statement.`,
      });
      setExamComplete(true);
    }

    setMessages(newMessages);
    setCurrentAnswer('');
  };

  const resetExam = () => {
    setMessages([]);
    setExamStarted(false);
    setCurrentQuestionIndex(0);
    setCurrentAnswer('');
    setExamComplete(false);
  };

  const handleCopyTranscript = async () => {
    const transcript = messages
      .map(m => {
        if (m.role === 'examiner') return `EXAMINER: ${m.content}`;
        if (m.role === 'veteran') return `YOU: ${m.content}`;
        return `[COACHING TIP]: ${m.content}`;
      })
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(transcript);
      toast({
        title: 'Transcript Copied',
        description: 'Your mock exam transcript has been copied to clipboard.',
      });
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Please select and copy the text manually.',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadTranscript = () => {
    const transcript = messages
      .map(m => {
        if (m.role === 'examiner') return `EXAMINER: ${m.content}`;
        if (m.role === 'veteran') return `YOUR ANSWER: ${m.content}`;
        return `[COACHING TIP]: ${m.content}`;
      })
      .join('\n\n');

    const header = `MOCK C&P EXAM TRANSCRIPT\nCondition: ${selectedCondition}\nDate: ${new Date().toLocaleDateString()}\n\nDISCLAIMER: Educational Mapping based on 38 CFR Part 4. Not medical or legal advice.\n\n---\n\n`;

    const blob = new Blob([header + transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mock-cp-exam-${selectedCondition.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Transcript Downloaded',
      description: 'Your mock exam transcript has been saved.',
    });
  };

  const progress = examSequence.length > 0
    ? Math.round(((currentQuestionIndex + (examComplete ? 1 : 0)) / examSequence.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Mock C&P Exam Simulator</CardTitle>
              <CardDescription>
                Practice answering examiner questions with real-time feedback on specificity
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Alert className="border-warning/30 bg-warning/5">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-sm">
              This simulates a C&P exam to help you practice articulating your symptoms using
              38 CFR Part 4 (VASRD) criteria. It is <strong>not</strong> a real exam and should not
              replace preparation with a VSO.
            </AlertDescription>
          </Alert>
          <DisclaimerNotice variant="inline" />
        </CardContent>
      </Card>

      {/* Condition Selection */}
      {!examStarted && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              Select Condition for Mock Exam
            </CardTitle>
            <CardDescription>
              Choose the condition you want to practice for
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* User's claimed conditions */}
            {claimedConditions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Your Claimed Conditions:</p>
                <div className="flex flex-wrap gap-2">
                  {claimedConditions.map(c => (
                    <Badge
                      key={c}
                      variant={selectedCondition === c ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-primary/20"
                      onClick={() => setSelectedCondition(c)}
                    >
                      {c}
                      {selectedCondition === c && <CheckCircle2 className="h-3 w-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* All conditions dropdown */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Or select from database:</p>
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a condition..." />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {examCategories.map(cat => (
                    <div key={cat.id}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50">
                        {cat.name}
                      </div>
                      {cat.conditions.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={startExam}
              disabled={!selectedCondition}
              className="w-full"
              size="lg"
            >
              <Stethoscope className="h-4 w-4 mr-2" />
              Begin Mock Exam
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active Exam */}
      {examStarted && (
        <>
          {/* Progress */}
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">
                  Exam Progress: Question {Math.min(currentQuestionIndex + 1, examSequence.length)} of {examSequence.length}
                </p>
                <Badge variant="outline">{selectedCondition}</Badge>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="border-primary/20">
            <CardContent className="p-4">
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === 'veteran' ? 'justify-end' : ''}`}>
                    {msg.role !== 'veteran' && (
                      <div className={`p-1.5 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'examiner' ? 'bg-primary/10' : 'bg-warning/10'
                      }`}>
                        {msg.role === 'examiner'
                          ? <Stethoscope className="h-4 w-4 text-primary" />
                          : <Lightbulb className="h-4 w-4 text-warning" />
                        }
                      </div>
                    )}

                    <div className={`max-w-[80%] ${
                      msg.role === 'veteran'
                        ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3'
                        : msg.role === 'feedback'
                          ? 'bg-warning/10 border border-warning/30 rounded-2xl rounded-tl-sm px-4 py-3'
                          : 'bg-muted/50 border rounded-2xl rounded-tl-sm px-4 py-3'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      {msg.ratingCriteria && (
                        <p className="text-xs mt-2 opacity-70 italic">{msg.ratingCriteria}</p>
                      )}
                    </div>

                    {msg.role === 'veteran' && (
                      <div className="p-1.5 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Answer Input */}
              {!examComplete && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  <Textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your answer as you would tell the examiner... Be specific with dates, frequencies, and examples."
                    className="min-h-[100px] text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        submitAnswer();
                      }
                    }}
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Press Ctrl+Enter to submit
                    </p>
                    <Button onClick={submitAnswer} disabled={!currentAnswer.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Answer
                    </Button>
                  </div>
                </div>
              )}

              {/* Exam Complete Actions */}
              {examComplete && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  <div className="p-3 bg-success/10 border border-success/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <p className="text-sm font-medium">Mock Exam Complete</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Review your answers above. Look at any coaching tips to improve how you describe your symptoms before your real exam.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={handleCopyTranscript} variant="outline" className="flex-1 gap-2">
                      <Copy className="h-4 w-4" />
                      Copy Transcript
                    </Button>
                    <Button onClick={handleDownloadTranscript} variant="outline" className="flex-1 gap-2">
                      <Download className="h-4 w-4" />
                      Download Transcript
                    </Button>
                    <Button onClick={resetExam} className="flex-1 gap-2">
                      <RotateCcw className="h-4 w-4" />
                      New Exam
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rating Criteria Reference */}
          {ratingCriteria && ratingCriteria.length > 0 && (
            <Card className="border-[#D6B25E]/20 bg-[#D6B25E]/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[#D6B25E]" />
                  38 CFR Rating Criteria Reference
                </CardTitle>
                <CardDescription>
                  These are the criteria the rater uses to assign your rating
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {ratingCriteria.map((c, i) => (
                    <div key={i} className="p-3 bg-background rounded-lg border">
                      <Badge variant="outline" className="mb-1 text-xs">{c.cfrReference}</Badge>
                      <p className="text-sm text-muted-foreground">{c.criteria}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reset Button */}
          {!examComplete && (
            <div className="flex justify-center">
              <Button variant="ghost" onClick={resetExam} className="gap-2 text-muted-foreground">
                <RotateCcw className="h-4 w-4" />
                Start Over
              </Button>
            </div>
          )}
        </>
      )}

      {/* Educational Footer */}
      <DisclaimerNotice variant="subtle" />
      <p className="text-xs text-center text-muted-foreground/60">
        Educational Mapping based on 38 CFR Part 4. Not medical or legal advice.
      </p>
    </div>
  );
}
