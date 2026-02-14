import { useMemo, useCallback } from 'react';
import { useClaims } from '@/hooks/useClaims';
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
  Download,
  Printer,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
interface DBQFormInfo {
  formNumber: string;
  formName: string;
  diagnosticCodes: string[];
  keySections: string[];
  strongDBQTips: string[];
  weakDBQWarnings: string[];
  doctorInstructions: string[];
  doctorQuestions: string[];
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
    doctorQuestions: [
      'How often do you have nightmares or flashbacks?',
      'Do you avoid places, people, or situations that remind you of your trauma?',
      'How has this affected your relationships with family and friends?',
      'Are you able to maintain employment? If not, why?',
      'Do you have trouble concentrating or feel constantly on edge?',
      'Have you had any thoughts of harming yourself or others?',
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
    doctorQuestions: [
      'Where exactly is your pain located and does it radiate?',
      'What activities make your pain worse?',
      'How often do you have flare-ups and what triggers them?',
      'Do you have numbness, tingling, or weakness in your legs?',
      'How does your back pain affect your ability to work?',
      'Have you ever been prescribed bed rest for your back?',
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
    doctorQuestions: [
      'Does your knee give way, lock up, or feel unstable?',
      'Can you squat, kneel, or climb stairs?',
      'Do you use a knee brace or cane?',
      'How far can you walk before the pain becomes severe?',
      'Have you had any knee surgeries or meniscus tears?',
      'How does your knee condition affect your daily activities?',
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
    doctorQuestions: [
      'Do you have difficulty understanding speech in noisy environments?',
      'Do you need the TV or radio louder than others?',
      'Were you exposed to loud noises during military service?',
      'Did you wear hearing protection during noise exposure?',
      'Have you noticed your hearing getting progressively worse?',
      'Does your hearing loss affect your ability to communicate at work?',
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
    doctorQuestions: [
      'Do you use a CPAP machine every night?',
      'How many hours per night do you use the CPAP?',
      'Do you still feel tired during the day despite using CPAP?',
      'Have you ever fallen asleep while driving or at work?',
      'Do you wake up choking or gasping for air?',
      'Has anyone witnessed you stop breathing during sleep?',
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
    doctorQuestions: [
      'Is the ringing constant or does it come and go?',
      'Which ear(s) are affected?',
      'Does the ringing affect your ability to concentrate?',
      'Does the tinnitus interfere with your sleep?',
      'What noise exposure did you have during military service?',
      'Have you noticed the tinnitus getting louder over time?',
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
    doctorQuestions: [
      'How many migraines do you have per month?',
      'How long does each migraine typically last?',
      'Do you have to lie down in a dark room during migraines?',
      'Do you experience nausea, vomiting, or sensitivity to light/sound?',
      'How many days of work have you missed due to migraines?',
      'Do you see an aura or have warning signs before migraines?',
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
    doctorQuestions: [
      'Which is your dominant arm (left or right)?',
      'Can you raise your arm above your head?',
      'Do you have pain when reaching behind your back?',
      'Does your shoulder dislocate or feel unstable?',
      'Can you lift objects or carry groceries?',
      'How does your shoulder condition affect your work?',
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
  const claimConditions = useMemo(() => data.claimConditions ?? [], [data.claimConditions]);

  const conditionsWithDBQ = useMemo(() => {
    return claimConditions.map(condition => ({
      condition,
      dbqType: getDBQTypeForCondition(condition.name),
      dbqInfo: (() => {
        const type = getDBQTypeForCondition(condition.name);
        return type ? dbqFormDatabase[type] : null;
      })(),
    })).filter(c => c.dbqInfo !== null);
  }, [claimConditions]);

  const conditionsWithoutDBQ = useMemo(() => {
    return claimConditions.filter(condition => !getDBQTypeForCondition(condition.name));
  }, [claimConditions]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleExportPDF = useCallback(async () => {
    if (conditionsWithDBQ.length === 0) {
      console.warn('No conditions with DBQ guidance to export');
      return;
    }

    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Colors
    const colors = {
      primary: [26, 54, 93] as [number, number, number],
      secondary: [45, 55, 72] as [number, number, number],
      muted: [113, 128, 150] as [number, number, number],
      success: [34, 84, 61] as [number, number, number],
      danger: [155, 44, 44] as [number, number, number],
      border: [226, 232, 240] as [number, number, number],
      background: [247, 250, 252] as [number, number, number],
    };

    let yPos = 20;

    // Title
    doc.setFontSize(20);
    doc.setTextColor(...colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('DBQ Guidance Summary', 20, yPos);
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(0.5);
    doc.line(20, yPos + 3, pageWidth - 20, yPos + 3);
    yPos += 15;

    // Subtitle
    doc.setFontSize(11);
    doc.setTextColor(...colors.muted);
    doc.setFont('helvetica', 'normal');
    doc.text('Disability Benefits Questionnaire Guidance for VA Claims', 20, yPos);
    yPos += 6;
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, yPos);
    yPos += 15;

    // Helper to check page break
    const checkPageBreak = (needed: number): void => {
      if (yPos + needed > pageHeight - 45) {
        doc.addPage();
        yPos = 20;
      }
    };

    // Process each condition
    conditionsWithDBQ.forEach(({ condition, dbqInfo }) => {
      if (!dbqInfo) return;

      checkPageBreak(80);

      // Condition header
      doc.setFillColor(...colors.background);
      doc.roundedRect(20, yPos, pageWidth - 40, 12, 2, 2, 'F');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.secondary);
      doc.text(`${condition.name} - Form ${dbqInfo.formNumber}`, 25, yPos + 8);
      yPos += 18;

      // Form name
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.muted);
      doc.text(dbqInfo.formName, 25, yPos);
      yPos += 8;

      // Key Sections
      checkPageBreak(40);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text('Key Sections Doctor Must Complete:', 25, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...colors.secondary);
      dbqInfo.keySections.forEach(section => {
        checkPageBreak(6);
        doc.text(`• ${section}`, 30, yPos);
        yPos += 5;
      });
      yPos += 5;

      // Strong DBQ Tips
      checkPageBreak(40);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.success);
      doc.text('What Makes a STRONG DBQ:', 25, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...colors.secondary);
      dbqInfo.strongDBQTips.forEach(tip => {
        checkPageBreak(6);
        doc.text(`✓ ${tip}`, 30, yPos);
        yPos += 5;
      });
      yPos += 5;

      // Weak DBQ Warnings
      checkPageBreak(40);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.danger);
      doc.text('What Makes a WEAK DBQ (Avoid):', 25, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...colors.secondary);
      dbqInfo.weakDBQWarnings.forEach(warning => {
        checkPageBreak(6);
        doc.text(`✗ ${warning}`, 30, yPos);
        yPos += 5;
      });
      yPos += 5;

      // Doctor Instructions
      checkPageBreak(40);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text('Instructions for Your Doctor:', 25, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...colors.secondary);
      dbqInfo.doctorInstructions.forEach((instruction, idx) => {
        checkPageBreak(6);
        doc.text(`${idx + 1}. ${instruction}`, 30, yPos);
        yPos += 5;
      });
      yPos += 5;

      // Questions Your Doctor May Ask
      checkPageBreak(40);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.muted);
      doc.text('Questions Your Doctor May Ask:', 25, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...colors.secondary);
      dbqInfo.doctorQuestions.forEach(question => {
        checkPageBreak(6);
        doc.text(`? ${question}`, 30, yPos);
        yPos += 5;
      });
      yPos += 10;
    });

    // Footer disclaimer
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.3);
    doc.line(20, pageHeight - 35, pageWidth - 20, pageHeight - 35);
    doc.setFontSize(8);
    doc.setTextColor(...colors.muted);
    doc.setFont('helvetica', 'bold');
    doc.text('DISCLAIMER', pageWidth / 2, pageHeight - 28, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    const disclaimer = 'This document is for educational purposes only. It is not medical, legal, or VA advice. Consult with a healthcare provider, attorney, or accredited VSO before making decisions about your claim.';
    const lines = doc.splitTextToSize(disclaimer, pageWidth - 40);
    doc.text(lines, pageWidth / 2, pageHeight - 22, { align: 'center' });

    doc.save('dbq-guidance.pdf');
  }, [conditionsWithDBQ]);

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

          {conditionsWithDBQ.length > 0 && (
            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleExportPDF}
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          )}
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
            {conditionsWithDBQ.map(({ condition, dbqInfo }) => {
              if (!dbqInfo) return null;

              return (
              <div key={condition.id} className="border rounded-lg overflow-hidden">
                <div className="p-4 bg-muted/30">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h4 className="font-medium text-foreground">{condition.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Form: {dbqInfo?.formNumber}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      DC {dbqInfo?.diagnosticCodes.join(', ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground mt-2">{dbqInfo?.formName}</p>
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
                          {dbqInfo?.keySections.map((section, idx) => (
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
                          {dbqInfo?.strongDBQTips.map((tip, idx) => (
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
                          {dbqInfo?.weakDBQWarnings.map((warning, idx) => (
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
                            {dbqInfo?.doctorInstructions.map((instruction, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <span className="text-primary font-medium">{idx + 1}.</span>
                                {instruction}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Questions Your Doctor May Ask */}
                    <AccordionItem value="questions" className="border rounded-lg px-3 border-muted/50">
                      <AccordionTrigger className="text-sm py-3">
                        <span className="flex items-center gap-2">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          Questions Your Doctor May Ask
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pb-3 space-y-3">
                          <p className="text-xs text-muted-foreground">
                            Be prepared to answer these types of questions during your DBQ exam.
                            Think about your answers beforehand to provide accurate information:
                          </p>
                          <ul className="space-y-2">
                            {dbqInfo?.doctorQuestions.map((question, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <span className="text-muted-foreground font-medium">?</span>
                                <span className="text-foreground">{question}</span>
                              </li>
                            ))}
                          </ul>
                          <p className="text-xs text-muted-foreground italic pt-2 border-t border-border">
                            Note: These questions are informational to help you prepare. Your doctor
                            may ask additional or different questions based on your specific condition.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => window.open(`https://www.va.gov/find-forms/?q=${dbqInfo?.formNumber}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Download DBQ Form {dbqInfo?.formNumber}
                  </Button>
                </div>
              </div>
              );
            })}
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
            <Lightbulb className="h-4 w-4 text-[#D4AF37]" /> Pro Tips for Private DBQs
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