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
  FileText,
  Users,
  Stethoscope,
  Pill,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

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
    { question: 'How does this affect walking or standing?', tip: 'Describe duration limitations' },
  ],
  'ptsd': [
    { question: 'What traumatic event(s) occurred during service?', tip: 'Be prepared to discuss stressors briefly' },
    { question: 'How often do you have nightmares?', tip: 'Reference your sleep logs if available' },
    { question: 'Do you avoid crowds or certain situations?', tip: 'Give specific examples of avoidance' },
    { question: 'How does this affect your work and relationships?', tip: 'Describe occupational and social impairment' },
    { question: 'Do you have thoughts of harming yourself?', tip: 'Be honest - this is critical for proper rating' },
  ],
  'tinnitus': [
    { question: 'When did the ringing start?', tip: 'Connect it to noise exposure in service' },
    { question: 'Is the ringing constant or intermittent?', tip: 'Constant ringing supports the claim' },
    { question: 'Does it affect your sleep or concentration?', tip: 'Describe functional impact' },
    { question: 'What noise exposure did you have in service?', tip: 'List weapons, aircraft, machinery' },
  ],
  'migraine': [
    { question: 'How often do you get migraines?', tip: 'Reference your migraine log - monthly count matters' },
    { question: 'Are any of your migraines prostrating?', tip: 'Prostrating = you MUST lie down and can\'t function' },
    { question: 'Do you have to miss work due to migraines?', tip: 'Economic inadaptability is key for 50% rating' },
    { question: 'What symptoms accompany your migraines?', tip: 'Mention aura, nausea, light/sound sensitivity' },
  ],
  'sleep': [
    { question: 'Do you use a CPAP machine?', tip: 'CPAP use = minimum 50% rating for sleep apnea' },
    { question: 'How many hours of sleep do you get?', tip: 'Reference your sleep logs' },
    { question: 'Do you experience daytime sleepiness?', tip: 'Describe impact on daily activities and safety' },
    { question: 'Does your partner notice you stop breathing?', tip: 'Witnessed apneas support diagnosis' },
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

const dayOfChecklist = [
  { item: 'Bring valid photo ID', category: 'essential' },
  { item: 'Arrive 15 minutes early', category: 'essential' },
  { item: 'Bring list of all current medications', category: 'essential' },
  { item: 'Bring any assistive devices you use (brace, cane, etc.)', category: 'evidence' },
  { item: 'Don\'t wear tight clothing for range of motion tests', category: 'prep' },
  { item: 'Bring a copy of your claim conditions list', category: 'evidence' },
  { item: 'Know dates of service and key incidents', category: 'prep' },
  { item: 'Have emergency contact info ready', category: 'essential' },
  { item: 'Bring spouse/buddy if they\'ve witnessed symptoms', category: 'evidence' },
  { item: 'Review your logged symptoms before the exam', category: 'prep' },
];

export default function ExamPrep() {
  const { data } = useClaims();
  const [expandedConditions, setExpandedConditions] = useState<Set<string>>(new Set());
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const claimConditions = data.claimConditions || [];

  // Calculate overall evidence summary
  const evidenceSummary = useMemo(() => {
    return {
      conditionCount: claimConditions.length,
      medicalVisits: data.medicalVisits.length,
      symptoms: data.symptoms.length,
      buddyContacts: data.buddyContacts.length,
      buddyStatementsReceived: data.buddyContacts.filter(b => 
        b.statementStatus === 'Received' || b.statementStatus === 'Submitted'
      ).length,
      medications: data.medications.length,
      documentsObtained: data.documents.filter(d => 
        d.status === 'Obtained' || d.status === 'Submitted'
      ).length,
      serviceEntries: data.serviceHistory.length,
      migraines: data.migraines?.length || 0,
      sleepEntries: data.sleepEntries?.length || 0,
    };
  }, [data, claimConditions]);

  // Get relevant questions for each condition
  const conditionPrep = useMemo(() => {
    return claimConditions.map(condition => {
      const name = condition.name.toLowerCase();
      
      // Match condition to question set
      let questionSet = examQuestions.default;
      let conditionType = 'general';
      if (name.includes('back') || name.includes('spine') || name.includes('lumbar')) {
        questionSet = examQuestions.back;
        conditionType = 'musculoskeletal';
      } else if (name.includes('knee') || name.includes('shoulder') || name.includes('hip')) {
        questionSet = examQuestions.knee;
        conditionType = 'musculoskeletal';
      } else if (name.includes('ptsd') || name.includes('anxiety') || name.includes('depression')) {
        questionSet = examQuestions.ptsd;
        conditionType = 'mental health';
      } else if (name.includes('tinnitus') || name.includes('hearing')) {
        questionSet = examQuestions.tinnitus;
        conditionType = 'auditory';
      } else if (name.includes('migraine') || name.includes('headache')) {
        questionSet = examQuestions.migraine;
        conditionType = 'neurological';
      } else if (name.includes('sleep') || name.includes('apnea')) {
        questionSet = examQuestions.sleep;
        conditionType = 'sleep';
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
      const allDates = [
        ...linkedSymptoms.map(s => s.date),
        ...linkedVisits.map(v => v.date),
      ].filter(Boolean).sort();
      
      const firstDocumented = allDates[0];

      // Get linked medications
      const linkedMeds = data.medications.filter(m => 
        m.prescribedFor?.toLowerCase().includes(name.split(' ')[0])
      );

      return {
        condition,
        conditionType,
        questions: questionSet,
        worstEpisodes,
        recentVisits: linkedVisits.slice(0, 3),
        firstDocumented,
        symptomCount: linkedSymptoms.length,
        avgSeverity: linkedSymptoms.length > 0 
          ? Math.round(linkedSymptoms.reduce((sum, s) => sum + s.severity, 0) / linkedSymptoms.length)
          : 0,
        medications: linkedMeds,
        buddyCount: condition.linkedBuddyContacts.length,
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

  const toggleChecked = (item: string) => {
    const newSet = new Set(checkedItems);
    if (newSet.has(item)) {
      newSet.delete(item);
    } else {
      newSet.add(item);
    }
    setCheckedItems(newSet);
  };

  const checklistProgress = Math.round((checkedItems.size / dayOfChecklist.length) * 100);

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

      {/* Evidence Summary Card */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Your Evidence Summary
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Reference these numbers during your exam
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-background rounded-lg">
              <Shield className="h-5 w-5 mx-auto text-primary mb-1" />
              <p className="text-2xl font-bold">{evidenceSummary.conditionCount}</p>
              <p className="text-xs text-muted-foreground">Conditions Claimed</p>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <Stethoscope className="h-5 w-5 mx-auto text-medical mb-1" />
              <p className="text-2xl font-bold">{evidenceSummary.medicalVisits}</p>
              <p className="text-xs text-muted-foreground">Medical Visits</p>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <Activity className="h-5 w-5 mx-auto text-symptoms mb-1" />
              <p className="text-2xl font-bold">{evidenceSummary.symptoms}</p>
              <p className="text-xs text-muted-foreground">Symptoms Logged</p>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <Users className="h-5 w-5 mx-auto text-buddy mb-1" />
              <p className="text-2xl font-bold">{evidenceSummary.buddyStatementsReceived}</p>
              <p className="text-xs text-muted-foreground">Buddy Statements</p>
            </div>
          </div>
          
          {claimConditions.length > 0 && (
            <div className="mt-4 p-3 bg-background rounded-lg">
              <p className="text-sm font-medium mb-2">Conditions You're Claiming:</p>
              <div className="flex flex-wrap gap-2">
                {claimConditions.map(c => (
                  <Badge key={c.id} variant="secondary">{c.name}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
            <p className="text-muted-foreground max-w-sm mx-auto mb-4">
              Add conditions to your Claim Builder on the Dashboard to see personalized exam prep for each.
            </p>
            <Button asChild>
              <Link to="/">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Condition-Specific Prep ({claimConditions.length} condition{claimConditions.length !== 1 ? 's' : ''})
          </h2>

          {conditionPrep.map(({ condition, conditionType, questions, worstEpisodes, recentVisits, firstDocumented, symptomCount, avgSeverity, medications, buddyCount }) => (
            <Card key={condition.id}>
              <CardHeader 
                className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => toggleCondition(condition.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {condition.name}
                      <Badge variant="outline" className="text-xs">
                        {conditionType}
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {symptomCount} symptom{symptomCount !== 1 ? 's' : ''}
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
                      {buddyCount > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {buddyCount} buddy statement{buddyCount !== 1 ? 's' : ''}
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
                    <div className="p-3 bg-primary/5 rounded-lg flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <p className="text-sm">
                        <strong>First Documented:</strong>{' '}
                        {format(parseISO(firstDocumented), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  )}

                  {/* Medications for this condition */}
                  {medications.length > 0 && (
                    <div className="p-3 bg-medications/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Pill className="h-4 w-4 text-medications" />
                        <p className="text-sm font-medium">Related Medications</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {medications.map((med, idx) => (
                          <Badge key={idx} variant="outline">{med.name}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Worst Episodes to Mention */}
                  {worstEpisodes.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        Worst Episodes to Mention (Your "Bad Days")
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
                                <strong>Impact:</strong> {episode.dailyImpact}
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
                          <AccordionTrigger className="text-sm text-left py-3">
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
                        <Stethoscope className="h-4 w-4 text-medical" />
                        Recent Relevant Visits to Reference
                      </h4>
                      <div className="space-y-2">
                        {recentVisits.map((visit, idx) => (
                          <div key={idx} className="p-3 bg-medical/5 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">
                                {format(parseISO(visit.date), 'MMM d, yyyy')}
                              </span>
                              <Badge variant="outline">{visit.visitType}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {visit.reason || visit.diagnosis}
                            </p>
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
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              Exam Day Checklist
            </CardTitle>
            <Badge variant="outline">
              {checkedItems.size}/{dayOfChecklist.length} complete
            </Badge>
          </div>
          <Progress value={checklistProgress} className="h-2 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {dayOfChecklist.map((item, idx) => (
              <div 
                key={idx} 
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  checkedItems.has(item.item) ? 'bg-success/10' : 'bg-muted/30 hover:bg-muted/50'
                }`}
                onClick={() => toggleChecked(item.item)}
              >
                <Checkbox 
                  checked={checkedItems.has(item.item)}
                  onCheckedChange={() => toggleChecked(item.item)}
                />
                <span className={`text-sm ${checkedItems.has(item.item) ? 'line-through text-muted-foreground' : ''}`}>
                  {item.item}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Final Reminder */}
      <Card className="border-success/30 bg-success/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Star className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Remember: You Know Your Body Best</p>
              <p className="text-sm text-muted-foreground mt-1">
                The examiner has 20-30 minutes with you. You live with these conditions every day. 
                Be prepared to clearly explain your symptoms, their frequency, and how they impact your life.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
