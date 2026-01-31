import { useMemo, useState } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { 
  Clipboard, 
  AlertCircle, 
  CheckCircle2, 
  Calendar,
  Lightbulb,
  MessageSquare,
  Activity,
  ChevronDown,
  ChevronUp,
  Star,
  Clock,
  ThumbsUp,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { format, parseISO } from 'date-fns';

// C&P Exam question database by condition type
const examQuestions: Record<string, { question: string; tip: string }[]> = {
  'back': [
    { question: 'When did your back pain first start?', tip: 'Reference your earliest symptom log date' },
    { question: 'Can you bend forward and touch your toes?', tip: 'Demonstrate your actual limitation, don\'t push through pain' },
    { question: 'Does the pain radiate down your legs?', tip: 'Describe radiculopathy symptoms if present' },
    { question: 'How many flare-ups do you have per year?', tip: 'Reference your logged flare-ups' },
    { question: 'Have you had any incapacitating episodes requiring bed rest?', tip: 'This is key for IVDS rating - mention doctor-prescribed bed rest' },
  ],
  'knee': [
    { question: 'Can you fully bend your knee?', tip: 'Show actual range of motion, don\'t force it' },
    { question: 'Does your knee give out or feel unstable?', tip: 'Mention any falls or near-falls' },
    { question: 'Do you use any assistive devices?', tip: 'Bring your brace/cane if you use one' },
  ],
  'ptsd': [
    { question: 'What traumatic event(s) occurred during service?', tip: 'Be prepared to discuss stressors' },
    { question: 'How often do you have nightmares?', tip: 'Reference your sleep logs if available' },
    { question: 'Do you avoid crowds or certain situations?', tip: 'Give specific examples' },
    { question: 'How does this affect your work and relationships?', tip: 'Describe occupational and social impairment' },
  ],
  'tinnitus': [
    { question: 'When did the ringing start?', tip: 'Connect it to noise exposure in service' },
    { question: 'Is the ringing constant or intermittent?', tip: 'Constant ringing supports higher rating' },
    { question: 'Does it affect your sleep or concentration?', tip: 'Describe functional impact' },
  ],
  'migraine': [
    { question: 'How often do you get migraines?', tip: 'Reference your migraine log - monthly count matters' },
    { question: 'Are any of your migraines prostrating?', tip: 'Prostrating = you must lie down and can\'t function' },
    { question: 'Do you have to miss work due to migraines?', tip: 'Economic adaptability is key for 50% rating' },
  ],
  'sleep': [
    { question: 'Do you use a CPAP machine?', tip: 'CPAP use = minimum 50% rating for sleep apnea' },
    { question: 'How many hours of sleep do you get?', tip: 'Reference your sleep logs' },
    { question: 'Do you experience daytime sleepiness?', tip: 'Describe impact on daily activities' },
  ],
  'default': [
    { question: 'When did this condition first start?', tip: 'Connect onset to your service dates' },
    { question: 'How often do you experience symptoms?', tip: 'Daily/constant is more severe than occasional' },
    { question: 'How does this affect your daily life?', tip: 'Give specific examples of limitations' },
    { question: 'What treatments have you tried?', tip: 'List all medications and therapies' },
    { question: 'Has this condition gotten worse over time?', tip: 'Describe progression if applicable' },
  ],
};

const generalTips = [
  { icon: AlertTriangle, tip: 'Describe your WORST days, not your best days', color: 'text-destructive' },
  { icon: Clock, tip: 'Arrive 15 minutes early with ID and any medical records', color: 'text-warning' },
  { icon: ThumbsUp, tip: 'Be honest but don\'t minimize your symptoms', color: 'text-success' },
  { icon: MessageSquare, tip: 'If asked "Can you do X?" - describe pain/difficulty, not just yes/no', color: 'text-primary' },
  { icon: Activity, tip: 'Don\'t take pain medication before the exam if possible', color: 'text-orange-500' },
  { icon: Star, tip: 'Mention all conditions being claimed, examiners sometimes miss some', color: 'text-purple-500' },
];

export default function ExamPrep() {
  const { data } = useClaims();
  const [expandedConditions, setExpandedConditions] = useState<Set<string>>(new Set());

  const claimConditions = data.claimConditions || [];

  // Get relevant questions for each condition
  const conditionPrep = useMemo(() => {
    return claimConditions.map(condition => {
      const name = condition.name.toLowerCase();
      
      // Match condition to question set
      let questionSet = examQuestions.default;
      if (name.includes('back') || name.includes('spine') || name.includes('lumbar')) {
        questionSet = examQuestions.back;
      } else if (name.includes('knee')) {
        questionSet = examQuestions.knee;
      } else if (name.includes('ptsd') || name.includes('anxiety') || name.includes('depression')) {
        questionSet = examQuestions.ptsd;
      } else if (name.includes('tinnitus') || name.includes('hearing')) {
        questionSet = examQuestions.tinnitus;
      } else if (name.includes('migraine') || name.includes('headache')) {
        questionSet = examQuestions.migraine;
      } else if (name.includes('sleep') || name.includes('apnea')) {
        questionSet = examQuestions.sleep;
      }

      // Get worst symptom episodes
      const linkedSymptoms = data.symptoms.filter(s => 
        condition.linkedSymptoms.includes(s.id)
      ).sort((a, b) => b.severity - a.severity);

      const worstEpisodes = linkedSymptoms.slice(0, 3);

      // Get relevant medical visits
      const linkedVisits = data.medicalVisits.filter(v => 
        condition.linkedMedicalVisits.includes(v.id)
      ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // First documented date
      const firstSymptom = linkedSymptoms.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )[0];

      return {
        condition,
        questions: questionSet,
        worstEpisodes,
        recentVisits: linkedVisits.slice(0, 3),
        firstDocumented: firstSymptom?.date,
        symptomCount: linkedSymptoms.length,
        avgSeverity: linkedSymptoms.length > 0 
          ? Math.round(linkedSymptoms.reduce((sum, s) => sum + s.severity, 0) / linkedSymptoms.length)
          : 0,
      };
    });
  }, [claimConditions, data]);

  const toggleCondition = (id: string) => {
    const newSet = new Set(expandedConditions);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedConditions(newSet);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <Clipboard className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">C&P Exam Prep</h1>
          <p className="text-muted-foreground">Prepare for your Compensation & Pension examination</p>
        </div>
      </div>

      {/* Critical Tips */}
      <Card className="border-warning/30 bg-warning/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            Critical Exam Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {generalTips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-background rounded-lg">
                <tip.icon className={`h-5 w-5 flex-shrink-0 ${tip.color}`} />
                <p className="text-sm text-foreground">{tip.tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conditions Overview */}
      {claimConditions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Clipboard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Conditions Added</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Add conditions to your Claim Builder on the Dashboard to see personalized exam prep for each.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Condition-Specific Prep
          </h2>

          {conditionPrep.map(({ condition, questions, worstEpisodes, recentVisits, firstDocumented, symptomCount, avgSeverity }) => (
            <Card key={condition.id}>
              <CardHeader 
                className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => toggleCondition(condition.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{condition.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">
                        {symptomCount} symptoms logged
                      </Badge>
                      {avgSeverity > 0 && (
                        <Badge variant="outline" className={
                          avgSeverity >= 7 ? 'border-destructive/50 text-destructive' :
                          avgSeverity >= 4 ? 'border-warning/50 text-warning' :
                          'border-success/50 text-success'
                        }>
                          Avg: {avgSeverity}/10
                        </Badge>
                      )}
                    </div>
                  </div>
                  {expandedConditions.has(condition.id) 
                    ? <ChevronUp className="h-5 w-5" /> 
                    : <ChevronDown className="h-5 w-5" />}
                </div>
              </CardHeader>

              {expandedConditions.has(condition.id) && (
                <CardContent className="space-y-4 border-t pt-4">
                  {/* Key Dates */}
                  {firstDocumented && (
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm">
                        <strong>First Documented:</strong>{' '}
                        {format(parseISO(firstDocumented), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  )}

                  {/* Worst Episodes to Mention */}
                  {worstEpisodes.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        Worst Episodes to Mention
                      </h4>
                      <div className="space-y-2">
                        {worstEpisodes.map((episode, idx) => (
                          <div key={idx} className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">
                                {format(parseISO(episode.date), 'MMM d, yyyy')}
                              </span>
                              <Badge variant="destructive">{episode.severity}/10</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {episode.symptom}{episode.bodyArea ? ` (${episode.bodyArea})` : ''}
                            </p>
                            {episode.dailyImpact && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Impact: {episode.dailyImpact}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expected Questions */}
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      Likely Examiner Questions
                    </h4>
                    <Accordion type="single" collapsible className="w-full">
                      {questions.map((q, idx) => (
                        <AccordionItem key={idx} value={`q-${idx}`}>
                          <AccordionTrigger className="text-sm text-left">
                            {q.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
                              <p className="text-sm flex items-start gap-2">
                                <Lightbulb className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                                <span>{q.tip}</span>
                              </p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>

                  {/* Recent Medical Visits */}
                  {recentVisits.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-medical" />
                        Recent Relevant Visits
                      </h4>
                      <div className="space-y-2">
                        {recentVisits.map((visit, idx) => (
                          <div key={idx} className="p-2 bg-medical/5 rounded-lg text-sm">
                            <span className="font-medium">
                              {format(parseISO(visit.date), 'MMM d, yyyy')}
                            </span>
                            {' - '}
                            {visit.reason || visit.diagnosis || visit.visitType}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Day-Of Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            Day-Of Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              'Bring valid photo ID',
              'Arrive 15 minutes early',
              'Bring list of all medications',
              'Bring any assistive devices you use (brace, cane, etc.)',
              'Don\'t wear tight clothing for range of motion tests',
              'Bring a copy of your claim conditions list',
              'Have emergency contact info ready',
              'Know dates of service and key incidents',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2">
                <div className="h-5 w-5 rounded border border-muted-foreground/30 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
