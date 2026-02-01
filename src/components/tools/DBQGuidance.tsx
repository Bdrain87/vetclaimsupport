import { useMemo } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Info,
  ClipboardList,
} from 'lucide-react';

interface DBQFormInfo {
  formNumber: string;
  formName: string;
  diagnosticCodes: string[];
  keySections: string[];
  strongDBQTips: string[];
  weakDBQWarnings: string[];
  doctorInstructions: string[];
}

const dbqFormDatabase: Record<string, DBQFormInfo> = {
  'ptsd': {
    formNumber: '21-0960P-3',
    formName: 'Review Post Traumatic Stress Disorder (PTSD) Disability Benefits Questionnaire',
    diagnosticCodes: ['9411'],
    keySections: [
      'Diagnosis confirmation with DSM-5 criteria',
      'Stressor identification and verification',
      'Occupational and social impairment level',
      'Symptom frequency and severity ratings',
      'GAF or similar functional assessment score',
    ],
    strongDBQTips: [
      'Doctor provides specific examples of how PTSD affects daily functioning',
      'Clear connection between symptoms and rating criteria levels',
      'Documentation of frequency (daily, weekly) not just "occasional"',
      'Notes on treatment history and response to treatment',
      'Specific impairment percentages aligned with VA criteria',
    ],
    weakDBQWarnings: [
      'Vague statements like "veteran has PTSD symptoms"',
      'Missing stressor connection or verification',
      'No functional impairment assessment',
      'Incomplete symptom checklists',
      'Contradictory information between sections',
    ],
    doctorInstructions: [
      'Review the veteran\'s treatment records before completing',
      'Use specific DSM-5 diagnostic criteria',
      'Rate ALL symptom categories, don\'t leave blanks',
      'Provide nexus statement linking PTSD to service stressor',
      'Include impact on employment and relationships',
    ],
  },
  'back': {
    formNumber: '21-0960M-14',
    formName: 'Back (Thoracolumbar Spine) Conditions Disability Benefits Questionnaire',
    diagnosticCodes: ['5237', '5242', '5243'],
    keySections: [
      'Range of motion measurements (flexion, extension, lateral)',
      'Pain on movement and where it begins',
      'Muscle spasm presence and effect on gait',
      'Radiculopathy assessment for each extremity',
      'Incapacitating episodes frequency and duration',
      'Flare-up frequency and functional loss',
    ],
    strongDBQTips: [
      'Precise ROM measurements in degrees (not "limited")',
      'Pain documented at specific degree of movement',
      'Flare-ups quantified: frequency, duration, additional ROM loss',
      'Radiculopathy documented with specific nerve roots affected',
      'Repetitive use testing completed with results',
    ],
    weakDBQWarnings: [
      'ROM listed as "within normal limits" without numbers',
      'No documentation of pain behavior during exam',
      'Missing flare-up assessment',
      'Incomplete radiculopathy evaluation',
      'No repetitive use testing performed',
    ],
    doctorInstructions: [
      'Use a goniometer for precise ROM measurements',
      'Document where pain begins during each movement',
      'Ask about and document flare-ups specifically',
      'Test and document radiculopathy in BOTH legs',
      'Perform 3 repetitions and note any change in ROM',
    ],
  },
  'knee': {
    formNumber: '21-0960M-9',
    formName: 'Knee and Lower Leg Conditions Disability Benefits Questionnaire',
    diagnosticCodes: ['5256', '5257', '5258', '5259', '5260', '5261'],
    keySections: [
      'Range of motion (flexion and extension) for BOTH knees',
      'Joint stability testing results',
      'Meniscal conditions assessment',
      'Pain on movement documentation',
      'Functional impact on standing and walking',
    ],
    strongDBQTips: [
      'Separate ROM for flexion AND extension documented',
      'Stability testing (anterior, posterior, medial, lateral) completed',
      'Comparison with unaffected knee if applicable',
      'Weight-bearing function documented',
      'Assistive device use noted (brace, cane)',
    ],
    weakDBQWarnings: [
      'Only one knee examined when both are claimed',
      'No stability testing performed',
      'Missing pain on motion documentation',
      'No functional impact assessment',
      'ROM given as range (45-90°) instead of specific measurement',
    ],
    doctorInstructions: [
      'Examine BOTH knees even if only one is claimed',
      'Perform all stability tests and document results',
      'Note if the veteran uses a brace or assistive device',
      'Document ability to squat, kneel, climb stairs',
      'Record painful motion starting point',
    ],
  },
  'hearing': {
    formNumber: '21-0960N-1',
    formName: 'Hearing Loss and Tinnitus Disability Benefits Questionnaire',
    diagnosticCodes: ['6100', '6260'],
    keySections: [
      'Pure tone audiometry results (500-4000 Hz)',
      'Speech recognition scores (Maryland CNC)',
      'Tinnitus presence and recurrence',
      'Impact on daily communication',
    ],
    strongDBQTips: [
      'Audiogram performed within last 12 months',
      'Maryland CNC word list used (not other tests)',
      'Tinnitus documented as recurrent',
      'Functional impact on understanding speech noted',
    ],
    weakDBQWarnings: [
      'Audiogram older than 12 months',
      'Wrong speech discrimination test used',
      'Missing frequencies in audiogram',
      'No documentation of tinnitus characteristics',
    ],
    doctorInstructions: [
      'Use calibrated audiometric equipment',
      'Must use Maryland CNC word list for speech discrimination',
      'Test all frequencies: 500, 1000, 2000, 3000, 4000 Hz',
      'Document tinnitus pitch, loudness, and pattern',
    ],
  },
  'sleep_apnea': {
    formNumber: '21-0960G-3',
    formName: 'Sleep Apnea Disability Benefits Questionnaire',
    diagnosticCodes: ['6847'],
    keySections: [
      'Sleep study results (AHI score)',
      'CPAP or other device requirement',
      'Daytime hypersomnolence documentation',
      'Respiratory failure indicators if applicable',
    ],
    strongDBQTips: [
      'Recent sleep study (polysomnography) attached',
      'CPAP prescription and compliance records included',
      'Specific AHI (Apnea-Hypopnea Index) score documented',
      'Daytime symptoms specifically described',
    ],
    weakDBQWarnings: [
      'No sleep study to support diagnosis',
      'CPAP prescribed but no compliance evidence',
      'Missing AHI score from sleep study',
      'Vague "fatigue" without daytime hypersomnolence details',
    ],
    doctorInstructions: [
      'Attach the full sleep study report',
      'Document CPAP settings and compliance percentage',
      'Note AHI score and oxygen desaturation levels',
      'Describe functional impact of daytime sleepiness',
    ],
  },
  'tinnitus': {
    formNumber: '21-0960N-1',
    formName: 'Hearing Loss and Tinnitus Disability Benefits Questionnaire',
    diagnosticCodes: ['6260'],
    keySections: [
      'Tinnitus diagnosis confirmation',
      'Recurrence pattern (constant vs intermittent)',
      'Which ear(s) affected',
      'Impact on concentration and sleep',
    ],
    strongDBQTips: [
      'Clear statement that tinnitus is recurrent',
      'Description matches veteran\'s reported symptoms',
      'Noise exposure history documented',
      'Functional impact on daily life noted',
    ],
    weakDBQWarnings: [
      'No statement on recurrence pattern',
      'Missing which ear(s) affected',
      'No noise exposure history connection',
      'Diagnosis unsupported by examination findings',
    ],
    doctorInstructions: [
      'Document whether tinnitus is constant or recurrent',
      'Note the character (ringing, buzzing, etc.)',
      'Connect to noise exposure if applicable',
      'Describe impact on sleep and concentration',
    ],
  },
  'migraine': {
    formNumber: '21-0960C-8',
    formName: 'Headaches (Including Migraine Headaches) Disability Benefits Questionnaire',
    diagnosticCodes: ['8100'],
    keySections: [
      'Headache type and diagnosis',
      'Prostrating attack frequency',
      'Duration of attacks',
      'Economic impact (missed work)',
      'Characteristic symptoms (aura, nausea, photophobia)',
    ],
    strongDBQTips: [
      '"Prostrating" attacks specifically documented',
      'Frequency stated as specific number per month',
      'Duration of each attack documented',
      'Work impact with specific examples',
      'Treatment history and response documented',
    ],
    weakDBQWarnings: [
      'Using "severe" instead of "prostrating"',
      'Vague frequency like "frequent" or "often"',
      'No documentation of economic impact',
      'Missing characteristic migraine symptoms',
      'No treatment history documented',
    ],
    doctorInstructions: [
      'Use the word "prostrating" if applicable (requires lying down)',
      'Count specific number of attacks per month',
      'Document average duration of each attack',
      'Ask about and document missed work days',
      'Note all associated symptoms (aura, nausea, light/sound sensitivity)',
    ],
  },
  'shoulder': {
    formNumber: '21-0960M-12',
    formName: 'Shoulder and Arm Conditions Disability Benefits Questionnaire',
    diagnosticCodes: ['5200', '5201', '5202', '5203'],
    keySections: [
      'Range of motion for BOTH shoulders',
      'Pain on movement documentation',
      'Strength testing results',
      'Functional impact assessment',
      'Dominant arm identification',
    ],
    strongDBQTips: [
      'Dominant vs non-dominant arm clearly identified',
      'All planes of motion measured (flexion, abduction, rotation)',
      'Painful motion starting point documented',
      'Comparison with unaffected shoulder',
      'Repetitive use testing completed',
    ],
    weakDBQWarnings: [
      'Dominant arm not identified',
      'Missing external/internal rotation measurements',
      'No pain on motion documentation',
      'Only one shoulder examined',
      'No functional impact assessment',
    ],
    doctorInstructions: [
      'Identify which arm is dominant',
      'Measure ALL planes of motion in degrees',
      'Document where pain begins during movement',
      'Examine BOTH shoulders for comparison',
      'Note impact on reaching, lifting, carrying',
    ],
  },
};

// Map condition names to DBQ types
function getDBQTypeForCondition(conditionName: string): string | null {
  const name = conditionName.toLowerCase();
  
  if (name.includes('ptsd') || name.includes('anxiety') || name.includes('depression') || name.includes('mental')) {
    return 'ptsd';
  }
  if (name.includes('back') || name.includes('lumbar') || name.includes('spine') || name.includes('disc')) {
    return 'back';
  }
  if (name.includes('knee')) {
    return 'knee';
  }
  if (name.includes('hearing') && !name.includes('tinnitus')) {
    return 'hearing';
  }
  if (name.includes('tinnitus') || name.includes('ringing')) {
    return 'tinnitus';
  }
  if (name.includes('sleep') || name.includes('apnea')) {
    return 'sleep_apnea';
  }
  if (name.includes('migraine') || name.includes('headache')) {
    return 'migraine';
  }
  if (name.includes('shoulder')) {
    return 'shoulder';
  }
  
  return null;
}

export function DBQGuidance() {
  const { data } = useClaims();
  const claimConditions = data.claimConditions || [];

  const conditionsWithDBQ = useMemo(() => {
    return claimConditions.map(condition => ({
      condition,
      dbqType: getDBQTypeForCondition(condition.name),
      dbqInfo: getDBQTypeForCondition(condition.name) 
        ? dbqFormDatabase[getDBQTypeForCondition(condition.name)!] 
        : null,
    })).filter(c => c.dbqInfo !== null);
  }, [claimConditions]);

  const conditionsWithoutDBQ = useMemo(() => {
    return claimConditions.filter(condition => !getDBQTypeForCondition(condition.name));
  }, [claimConditions]);

  if (claimConditions.length === 0) {
    return (
      <Card className="data-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            DBQ Guidance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <FileText className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Add conditions to your Claim Builder to see DBQ guidance
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* General DBQ Tips Card */}
      <Card className="data-card border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            What is a DBQ?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            A <strong>Disability Benefits Questionnaire (DBQ)</strong> is a standardized form 
            that documents your medical condition in the exact format the VA uses for rating decisions.
          </p>
          
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
              <h4 className="text-sm font-medium text-success mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Why Get a Private DBQ?
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Your doctor knows your condition better than a C&P examiner</li>
                <li>• More thorough examination in familiar environment</li>
                <li>• Can strengthen a weak C&P exam result</li>
                <li>• Provides additional evidence for your claim</li>
              </ul>
            </div>
            
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <h4 className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Important Notes
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• DBQs must be completed by a licensed physician</li>
                <li>• VA accepts private DBQs as evidence</li>
                <li>• Doctor should review your records first</li>
                <li>• Print the DBQ and bring to your appointment</li>
              </ul>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open('https://www.va.gov/find-forms/?q=dbq', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View All VA DBQ Forms
          </Button>
        </CardContent>
      </Card>

      {/* Condition-Specific DBQ Guidance */}
      {conditionsWithDBQ.length > 0 && (
        <Card className="data-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Your Conditions - DBQ Forms
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Specific DBQ guidance for each of your claimed conditions
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {conditionsWithDBQ.map(({ condition, dbqInfo }) => (
              <div key={condition.id} className="border rounded-lg overflow-hidden">
                <div className="p-4 bg-muted/30">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h4 className="font-medium text-foreground">{condition.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Form: {dbqInfo!.formNumber}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      DC {dbqInfo!.diagnosticCodes.join(', ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground mt-2">{dbqInfo!.formName}</p>
                </div>

                <div className="p-4">
                  <Accordion type="single" collapsible className="space-y-2">
                    {/* Key Sections */}
                    <AccordionItem value="sections" className="border rounded-lg px-3">
                      <AccordionTrigger className="text-sm py-3">
                        <span className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          Key Sections Doctor Must Complete
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pb-3">
                          {dbqInfo!.keySections.map((section, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                              {section}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Strong DBQ Tips */}
                    <AccordionItem value="strong" className="border rounded-lg px-3 border-success/30">
                      <AccordionTrigger className="text-sm py-3">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          What Makes a STRONG DBQ
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pb-3">
                          {dbqInfo!.strongDBQTips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-success">
                              <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                              <span className="text-foreground">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Weak DBQ Warnings */}
                    <AccordionItem value="weak" className="border rounded-lg px-3 border-destructive/30">
                      <AccordionTrigger className="text-sm py-3">
                        <span className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                          What Makes a WEAK DBQ (Avoid!)
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pb-3">
                          {dbqInfo!.weakDBQWarnings.map((warning, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-destructive">
                              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                              <span className="text-foreground">{warning}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Doctor Instructions */}
                    <AccordionItem value="instructions" className="border rounded-lg px-3">
                      <AccordionTrigger className="text-sm py-3">
                        <span className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-primary" />
                          Instructions for Your Doctor
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pb-3 space-y-3">
                          <p className="text-xs text-muted-foreground">
                            Share these instructions with your doctor before the DBQ appointment:
                          </p>
                          <ul className="space-y-2">
                            {dbqInfo!.doctorInstructions.map((instruction, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <span className="text-primary font-medium">{idx + 1}.</span>
                                {instruction}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => window.open(`https://www.va.gov/find-forms/?q=${dbqInfo!.formNumber}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Download DBQ Form {dbqInfo!.formNumber}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Conditions without DBQ mapping */}
      {conditionsWithoutDBQ.length > 0 && (
        <Card className="data-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-5 w-5 text-muted-foreground" />
              Other Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              The following conditions may have specific DBQs. Search the VA forms database:
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {conditionsWithoutDBQ.map(condition => (
                <Badge key={condition.id} variant="outline">
                  {condition.name}
                </Badge>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://www.va.gov/find-forms/?q=dbq', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Search VA DBQ Forms
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pro Tips */}
      <Card className="data-card bg-primary/5 border-primary/20">
        <CardContent className="pt-4">
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            💡 Pro Tips for Private DBQs
          </h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary">1.</span>
              <span><strong>Schedule a dedicated appointment</strong> - DBQs take 30-60 minutes to complete properly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">2.</span>
              <span><strong>Bring your medical records</strong> - Doctor should review history before completing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">3.</span>
              <span><strong>Print the DBQ beforehand</strong> - Give it to your doctor to review before the appointment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">4.</span>
              <span><strong>Don't coach the doctor</strong> - Let them provide honest medical opinion</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">5.</span>
              <span><strong>Submit with your claim</strong> - Upload as supporting evidence when filing</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}