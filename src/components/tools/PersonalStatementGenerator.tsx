import { useState, useMemo } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { useProfileStore, BRANCH_LABELS } from '@/store/useProfileStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Copy,
  Download,
  CheckCircle2,
  Edit3,
  Sparkles,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { exportPersonalStatement } from '@/utils/pdfExport';
import { useAIGenerate } from '@/hooks/useAIGenerate';
import { createPersonalStatementPrompt } from '@/lib/ai-prompts';
import { AIDisclaimer } from '@/components/ui/AIDisclaimer';

export function PersonalStatementGenerator() {
  const { data } = useClaims();
  const profile = useProfileStore();
  const { toast } = useToast();
  const veteranFullName = `${profile.firstName} ${profile.lastName}`.trim();
  const branchLabel = profile.branch ? BRANCH_LABELS[profile.branch] : '';
  const [activeTab, setActiveTab] = useState('preview');
  const [customEdits, setCustomEdits] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const { generate: aiGenerate, isLoading: aiLoading, error: aiError } = useAIGenerate('VA_SPEAK_TRANSLATOR');
  const [aiDraft, setAiDraft] = useState<string | null>(null);
  const [draftMode, setDraftMode] = useState<'template' | 'ai'>('template');

  const claimConditions = useMemo(() => data.claimConditions ?? [], [data.claimConditions]);

  // Generate statement content
  const generateStatement = useMemo(() => {
    const condition = selectedCondition 
      ? claimConditions.find(c => c.id === selectedCondition)
      : claimConditions[0];

    if (!condition) {
      return {
        header: '',
        serviceConnection: '',
        symptoms: '',
        impact: '',
        conclusion: '',
        full: '',
      };
    }

    // Get linked data
    const linkedVisits = data.medicalVisits.filter(v => 
      condition.linkedMedicalVisits.includes(v.id)
    );
    const linkedSymptoms = data.symptoms.filter(s => 
      condition.linkedSymptoms.includes(s.id)
    );
    const linkedExposures = data.exposures.filter(e => 
      condition.linkedExposures.includes(e.id)
    );

    // Service dates
    const serviceEntries = data.serviceHistory;
    const earliestService = serviceEntries.length > 0
      ? [...serviceEntries].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0]
      : null;

    const today = format(new Date(), 'MMMM d, yyyy');

    // Build statement sections
    const header = `PERSONAL STATEMENT IN SUPPORT OF CLAIM
VA Form 21-4138

Date: ${today}
${veteranFullName ? `Veteran: ${veteranFullName}` : ''}
${branchLabel ? `Branch: ${branchLabel}` : ''}
Subject: Statement in Support of Claim for ${condition.name}

To Whom It May Concern:

I${veteranFullName ? `, ${veteranFullName},` : ''} am writing to provide a personal statement in support of my claim for service connection for ${condition.name}. This statement describes my in-service experiences, the onset of my condition, and its ongoing impact on my daily life.`;

    const serviceConnection = `
SERVICE CONNECTION

${earliestService ? `I served in the ${branchLabel || 'United States military'} from ${format(parseISO(earliestService.startDate), 'MMMM yyyy')}${earliestService.endDate ? ` to ${format(parseISO(earliestService.endDate), 'MMMM yyyy')}` : ' to present'}.` : profile.serviceDates?.start ? `I served in the ${branchLabel || 'United States military'} from ${format(parseISO(profile.serviceDates.start), 'MMMM yyyy')}${profile.serviceDates.end ? ` to ${format(parseISO(profile.serviceDates.end), 'MMMM yyyy')}` : ' to present'}.` : 'During my military service,'}

${linkedExposures.length > 0 ? `During my service, I was exposed to the following hazards that I believe contributed to my current condition:
${linkedExposures.map(e => `- ${e.type} exposure at ${e.location || 'duty station'} (${format(parseISO(e.date), 'MMMM yyyy')})${e.duration ? `, duration: ${e.duration}` : ''}${e.details ? `. ${e.details}` : ''}`).join('\n')}
` : ''}

${linkedVisits.length > 0 ? `I sought medical treatment during service for symptoms related to this condition:
${linkedVisits.slice(0, 5).map(v => `- ${format(parseISO(v.date), 'MMMM d, yyyy')}: ${v.visitType} visit at ${v.location || 'military treatment facility'}. Reason: ${v.reason || v.diagnosis || 'symptoms related to condition'}.`).join('\n')}
` : 'I began experiencing symptoms during my military service that have continued to the present day.'}`;

    const symptomsSection = `
CURRENT SYMPTOMS AND SEVERITY

${linkedSymptoms.length > 0 ? `My symptoms have been ongoing and include:
${[...new Set(linkedSymptoms.map(s => s.symptom))].map(symptom => {
  const entries = linkedSymptoms.filter(s => s.symptom === symptom);
  const avgSeverity = Math.round(entries.reduce((sum, e) => sum + e.severity, 0) / entries.length);
  const bodyArea = entries[0]?.bodyArea;
  return `- ${symptom}${bodyArea ? ` (${bodyArea})` : ''}: Average severity ${avgSeverity}/10, frequency: ${entries[0]?.frequency || 'ongoing'}`;
}).join('\n')}

Recent symptom episodes include:
${linkedSymptoms.slice(0, 3).map(s => `- ${format(parseISO(s.date), 'MMMM d, yyyy')}: ${s.symptom} with severity ${s.severity}/10. ${s.dailyImpact || ''} ${s.notes || ''}`).join('\n')}
` : 'I continue to experience symptoms related to this condition on a regular basis.'}`;

    const impact = `
IMPACT ON DAILY LIFE

This condition significantly impacts my ability to perform daily activities. ${
  linkedSymptoms.length > 0 
    ? linkedSymptoms.filter(s => s.dailyImpact).slice(0, 3).map(s => s.dailyImpact).join(' ')
    : 'I experience limitations in my daily activities due to this condition.'
}

${data.medications.filter(m => m.prescribedFor?.toLowerCase().includes(condition.name.toLowerCase())).length > 0 
  ? `I am currently taking medications for this condition, including: ${data.medications.filter(m => m.prescribedFor?.toLowerCase().includes(condition.name.toLowerCase())).map(m => m.name).join(', ')}.` 
  : ''}`;

    const conclusion = `
CONCLUSION

I respectfully request that the VA consider this statement along with my medical records and other supporting evidence in evaluating my claim for service connection for ${condition.name}. I believe the evidence clearly establishes that this condition began during or was caused by my military service and continues to affect my daily life.

I certify that the statements made herein are true and correct to the best of my knowledge and belief.

Respectfully submitted,

_______________________________
[Your Signature]

_______________________________
${veteranFullName || '[Your Printed Name]'}

_______________________________
[Date]`;

    return {
      header,
      serviceConnection,
      symptoms: symptomsSection,
      impact,
      conclusion,
      full: header + serviceConnection + symptomsSection + impact + conclusion,
    };
  }, [selectedCondition, claimConditions, data, veteranFullName, branchLabel, profile.serviceDates]);

  const handleGenerateAI = async () => {
    const condition = selectedCondition
      ? claimConditions.find(c => c.id === selectedCondition)
      : claimConditions[0];
    if (!condition) return;

    const linkedSymptoms = data.symptoms.filter(s =>
      condition.linkedSymptoms.includes(s.id)
    );
    const symptomNames = [...new Set(linkedSymptoms.map(s => s.symptom))];
    const impacts = linkedSymptoms
      .filter(s => s.dailyImpact)
      .map(s => s.dailyImpact)
      .join(' ');

    const serviceEntry = data.serviceHistory.length > 0
      ? data.serviceHistory.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0]
      : null;

    const prompt = createPersonalStatementPrompt({
      veteranName: veteranFullName || 'Veteran',
      condition: condition.name,
      incidentDescription: condition.description || 'Symptoms began during military service.',
      currentSymptoms: symptomNames.length > 0 ? symptomNames : ['Ongoing symptoms related to condition'],
      dailyImpact: impacts || 'This condition affects daily activities.',
      serviceInfo: {
        branch: branchLabel || 'United States military',
        mos: profile.mosTitle || profile.mosCode || undefined,
        deployments: serviceEntry
          ? `${format(parseISO(serviceEntry.startDate), 'MMM yyyy')}${serviceEntry.endDate ? ` to ${format(parseISO(serviceEntry.endDate), 'MMM yyyy')}` : ' to present'}`
          : undefined,
      },
    });

    const result = await aiGenerate(prompt);
    if (result) {
      setAiDraft(result);
      setDraftMode('ai');
    }
  };

  const handleCopy = async () => {
    const content = customEdits || generateStatement.full;
    await navigator.clipboard.writeText(content);
    toast({
      title: 'Copied to Clipboard',
      description: 'Personal statement copied successfully',
    });
  };

  const handleDownload = () => {
    const content = customEdits || generateStatement.full;
    const condition = selectedCondition
      ? claimConditions.find(c => c.id === selectedCondition)
      : claimConditions[0];
    exportPersonalStatement(content, condition?.name);

    toast({
      title: 'Statement Downloaded',
      description: 'Your personal statement has been saved as PDF',
    });
  };

  if (claimConditions.length === 0) {
    return (
      <Card className="data-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Personal Statement Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">
              Add conditions to your Claim Builder first
            </p>
            <p className="text-sm text-muted-foreground">
              The generator will create a personalized VA Form 21-4138 statement 
              using your logged evidence
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="data-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Personal Statement Generator
          <Badge variant="secondary" className="ml-2">
            <Sparkles className="h-3 w-3 mr-1" />
            VA Form 21-4138
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Auto-generated from your logged evidence. Review and personalize before submitting.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Disclaimer */}
        <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg">
          <div className="flex gap-2">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Review Required:</strong> This is a draft based on your 
              logged data. You must review, personalize, and verify all information before submission. 
              Consider having a VSO review your statement.
            </p>
          </div>
        </div>

        {/* Condition Selector */}
        {claimConditions.length > 1 && (
          <div className="space-y-2">
            <Label>Select Condition</Label>
            <div className="flex flex-wrap gap-2">
              {claimConditions.map(c => (
                <Button
                  key={c.id}
                  variant={selectedCondition === c.id || (!selectedCondition && c === claimConditions[0]) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCondition(c.id)}
                >
                  {c.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Draft Mode Switcher */}
        <div className="flex gap-2">
          <Button
            variant={draftMode === 'template' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDraftMode('template')}
            className="flex-1"
          >
            <FileText className="h-4 w-4 mr-2" />
            Template Draft
          </Button>
          <Button
            variant={draftMode === 'ai' ? 'default' : 'outline'}
            size="sm"
            onClick={aiDraft ? () => setDraftMode('ai') : handleGenerateAI}
            disabled={aiLoading}
            className="flex-1"
          >
            {aiLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            {aiLoading ? 'Generating...' : aiDraft ? 'AI Draft' : 'Generate AI Draft'}
          </Button>
        </div>

        {aiError && !aiLoading && (
          <Alert className="border-warning/30 bg-warning/5">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-sm">{aiError}</AlertDescription>
          </Alert>
        )}

        {draftMode === 'ai' && aiDraft && (
          <AIDisclaimer variant="banner" />
        )}

        {/* Tabs for Preview/Edit */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">
              <FileText className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="edit">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            <div className="bg-muted/30 rounded-lg p-4 max-h-[500px] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm font-mono text-foreground">
                {draftMode === 'ai' && aiDraft ? (customEdits || aiDraft) : (customEdits || generateStatement.full)}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="edit" className="mt-4">
            <Textarea
              value={draftMode === 'ai' && aiDraft ? (customEdits || aiDraft) : (customEdits || generateStatement.full)}
              onChange={(e) => setCustomEdits(e.target.value)}
              className="min-h-[500px] font-mono text-sm"
              placeholder="Edit your personal statement..."
            />
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleCopy} variant="outline" className="flex-1 gap-2">
            <Copy className="h-4 w-4" />
            Copy to Clipboard
          </Button>
          <Button onClick={handleDownload} className="flex-1 gap-2">
            <Download className="h-4 w-4" />
            Download Statement
          </Button>
        </div>

        {/* Data Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">
              {data.medicalVisits.length}
            </p>
            <p className="text-xs text-muted-foreground">Medical Visits</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">
              {data.symptoms.length}
            </p>
            <p className="text-xs text-muted-foreground">Symptoms Logged</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">
              {data.exposures.length}
            </p>
            <p className="text-xs text-muted-foreground">Exposures</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
