import { useState, useMemo } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Download, FileText, AlertTriangle, Check, Info, Stethoscope, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { getDiagnosticCodeForCondition } from '@/components/shared/ConditionSearchInput.utils';
import { DisclaimerNotice } from '@/components/shared/DisclaimerNotice';
import { exportNexusLetterTemplate } from '@/utils/pdfExport';
import { useAIGenerate } from '@/hooks/useAIGenerate';
import { createNexusLetterPrompt } from '@/lib/ai-prompts';
import { AIDisclaimer } from '@/components/ui/AIDisclaimer';

export function NexusLetterGenerator() {
  const { data } = useClaims();
  
  // Form state
  const [selectedCondition, setSelectedCondition] = useState('');
  const [customCondition, setCustomCondition] = useState('');
  const [veteranName, setVeteranName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [doctorCredentials, setDoctorCredentials] = useState('');
  const [additionalRationale, setAdditionalRationale] = useState('');
  const [copied, setCopied] = useState(false);
  const { generate: aiGenerate, isLoading: aiLoading, error: aiError } = useAIGenerate('NEXUS_LOGIC');
  const [aiOutline, setAiOutline] = useState<string | null>(null);

  // Get service dates from service history
  const serviceDates = useMemo(() => {
    if (data.serviceHistory.length === 0) return null;
    
    const sorted = [...data.serviceHistory].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    
    const earliest = sorted[0]?.startDate;
    const latest = sorted[sorted.length - 1]?.endDate;
    
    return { start: earliest, end: latest };
  }, [data.serviceHistory]);

  // Get conditions from claim builder
  const claimedConditions = data.claimConditions?.map(c => c.name) || [];

  const conditionName = selectedCondition === 'custom' ? customCondition : selectedCondition;

  const generateLetter = () => {
    const today = format(new Date(), 'MMMM d, yyyy');
    const serviceStart = serviceDates?.start ? format(new Date(serviceDates.start), 'MMMM yyyy') : '[SERVICE START DATE]';
    const serviceEnd = serviceDates?.end ? format(new Date(serviceDates.end), 'MMMM yyyy') : '[SERVICE END DATE]';
    
    // Get diagnostic code if available
    const dcInfo = conditionName ? getDiagnosticCodeForCondition(conditionName) : null;
    const dcLine = dcInfo ? `\n    VA Diagnostic Code: DC ${dcInfo.code}` : '';
    
    return `NEXUS LETTER

Date: ${today}

To Whom It May Concern:

Re: Medical Opinion for ${veteranName || '[VETERAN NAME]'}
    Condition: ${conditionName || '[CONDITION]'}${dcLine}

I, ${doctorName || '[DOCTOR NAME]'}${doctorCredentials ? `, ${doctorCredentials}` : ''}, am writing to provide my professional medical opinion regarding ${veteranName || '[VETERAN NAME]'}'s ${conditionName || '[CONDITION]'}.

PATIENT HISTORY:
${veteranName || 'The veteran'} served in the United States military from ${serviceStart} to ${serviceEnd}. I have reviewed the patient's medical history, service treatment records, and current condition.
${dcInfo ? `\nRelevant VA Rating: This condition is evaluated under 38 CFR Part 4, Diagnostic Code ${dcInfo.code}.` : ''}

MEDICAL OPINION:
Based on my review of the available medical evidence, clinical examination, and my professional expertise, it is my opinion that it is AT LEAST AS LIKELY AS NOT (50% probability or greater) that ${veteranName || 'the veteran'}'s current ${conditionName || '[CONDITION]'} is related to, was caused by, or was aggravated by their military service.

RATIONALE:
${additionalRationale || '[The doctor should include specific medical reasoning here, referencing symptoms, timeline, and medical literature as appropriate.]'}

This opinion is provided to assist in the evaluation of a claim for service-connected disability benefits.

Sincerely,


_________________________________
${doctorName || '[Doctor Name]'}
${doctorCredentials || '[Credentials/Specialty]'}
[License Number]
[Contact Information]
[Date]

---
DISCLAIMER: This document is a template only and is not official VA documentation.`;
  };

  const handleGenerateAIOutline = async () => {
    if (!conditionName) return;

    const serviceStart = serviceDates?.start ? format(new Date(serviceDates.start), 'MMMM yyyy') : 'Unknown';
    const serviceEnd = serviceDates?.end ? format(new Date(serviceDates.end), 'MMMM yyyy') : 'Unknown';

    const linkedSymptoms = data.claimConditions
      ?.find(c => c.name === conditionName)
      ?.linkedSymptoms || [];
    const symptomNames = data.symptoms
      ?.filter(s => linkedSymptoms.includes(s.id))
      .map(s => s.symptom) || [];

    const prompt = createNexusLetterPrompt({
      veteranName: veteranName || 'Veteran',
      conditionName,
      serviceStart,
      serviceEnd,
      symptoms: symptomNames.length > 0 ? symptomNames : ['Symptoms related to condition'],
      medicalHistory: additionalRationale || 'Medical history to be provided by examining physician.',
    });

    const result = await aiGenerate(prompt);
    if (result) setAiOutline(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateLetter());
    setCopied(true);
    toast.success('Letter template copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const letter = generateLetter();
    exportNexusLetterTemplate(letter, conditionName);
    toast.success('Letter template downloaded as PDF');
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Nexus Letter Template Generator</CardTitle>
              <CardDescription>
                Generate a template with proper VA language for your doctor to complete
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
            <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Important</p>
              <p>This is a <strong>template only</strong>. Your doctor must review, modify as needed, and sign the final letter. The VA requires nexus letters from qualified medical professionals who have examined you.</p>
            </div>
          </div>
          <DisclaimerNotice variant="inline" />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Letter Details</CardTitle>
            <CardDescription>Fill in the information for your nexus letter template</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Veteran Name */}
            <div className="space-y-2">
              <Label htmlFor="veteranName">Your Full Name</Label>
              <Input
                id="veteranName"
                placeholder="Enter your full legal name"
                value={veteranName}
                onChange={(e) => setVeteranName(e.target.value)}
              />
            </div>

            {/* Condition Selection */}
            <div className="space-y-2">
              <Label>Condition</Label>
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a condition" />
                </SelectTrigger>
                <SelectContent>
                  {claimedConditions.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {condition}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Other (type your own)</SelectItem>
                </SelectContent>
              </Select>
              {selectedCondition === 'custom' && (
                <Input
                  placeholder="Enter condition name"
                  value={customCondition}
                  onChange={(e) => setCustomCondition(e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            {/* Service Dates Display */}
            {serviceDates && (
              <div className="p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-2 mb-1">
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Service Dates (from your profile)</span>
                </div>
                <p className="text-sm font-medium">
                  {format(new Date(serviceDates.start), 'MMM yyyy')} – {format(new Date(serviceDates.end), 'MMM yyyy')}
                </p>
              </div>
            )}
            {!serviceDates && (
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-xs text-warning">
                  No service dates found. Add your service history to auto-populate dates.
                </p>
              </div>
            )}

            {/* Doctor Info */}
            <div className="space-y-2">
              <Label htmlFor="doctorName">Doctor's Name</Label>
              <Input
                id="doctorName"
                placeholder="Dr. John Smith"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctorCredentials">Doctor's Credentials</Label>
              <Input
                id="doctorCredentials"
                placeholder="M.D., Board Certified Orthopedic Surgeon"
                value={doctorCredentials}
                onChange={(e) => setDoctorCredentials(e.target.value)}
              />
            </div>

            {/* Additional Rationale */}
            <div className="space-y-2">
              <Label htmlFor="rationale">
                Medical Rationale
                <span className="text-muted-foreground font-normal ml-1">(for doctor to complete)</span>
              </Label>
              <Textarea
                id="rationale"
                placeholder="Leave blank for doctor to complete, or provide notes about symptoms, timeline, or evidence for them to reference..."
                value={additionalRationale}
                onChange={(e) => setAdditionalRationale(e.target.value)}
                rows={4}
              />
            </div>

            {/* AI Outline Button */}
            <Button
              variant="outline"
              onClick={handleGenerateAIOutline}
              disabled={!conditionName || aiLoading}
              className="w-full border-primary/30 text-primary hover:bg-primary/5"
            >
              {aiLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {aiLoading ? 'Generating Outline...' : 'Generate AI Outline'}
            </Button>

            {aiError && !aiLoading && (
              <Alert className="border-warning/30 bg-warning/5">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-sm">{aiError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Letter Preview</CardTitle>
                <CardDescription>Review and copy the generated template</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                <FileText className="h-3 w-3 mr-1" />
                Template
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30 border font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto">
              {generateLetter()}
            </div>

            {/* Key Language Highlight */}
            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
              <p className="text-xs font-medium text-success mb-1">✓ VA-Required Language Included</p>
              <p className="text-xs text-muted-foreground">
                "At least as likely as not (50% probability or greater)" – This is the exact standard the VA uses for service connection.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={handleCopy} className="flex-1" variant="outline">
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy Template'}
              </Button>
              <Button onClick={handleDownload} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Generated Outline */}
      {aiOutline && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI-Generated Nexus Outline
              <Badge variant="destructive" className="text-xs ml-2">DRAFT</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AIDisclaimer variant="banner" />
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  <strong className="text-destructive">Medical Professional Review Required:</strong> This AI-generated outline MUST be reviewed, edited, and signed by a qualified medical professional before submission. It is not a medical opinion and cannot be submitted as-is.
                </p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-background border font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto">
              {aiOutline}
            </div>
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(aiOutline);
                toast.success('AI outline copied to clipboard');
              }}
              className="w-full"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy AI Outline
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tips for Getting an Effective Nexus Letter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-3 rounded-lg border bg-muted/30">
              <p className="text-sm font-medium mb-1">Choose the Right Doctor</p>
              <p className="text-xs text-muted-foreground">
                Specialists in your condition carry more weight. A orthopedist for back issues, psychiatrist for PTSD, etc.
              </p>
            </div>
            <div className="p-3 rounded-lg border bg-muted/30">
              <p className="text-sm font-medium mb-1">Provide Your Evidence</p>
              <p className="text-xs text-muted-foreground">
                Bring copies of your service treatment records, diagnosis records, and symptom logs to the appointment.
              </p>
            </div>
            <div className="p-3 rounded-lg border bg-muted/30">
              <p className="text-sm font-medium mb-1">Detailed Rationale Matters</p>
              <p className="text-xs text-muted-foreground">
                The doctor should explain WHY the condition is service-connected, citing medical literature if possible.
              </p>
            </div>
            <div className="p-3 rounded-lg border bg-muted/30">
              <p className="text-sm font-medium mb-1">Review Records First</p>
              <p className="text-xs text-muted-foreground">
                Ask the doctor to document that they reviewed your service records – this strengthens the opinion.
              </p>
            </div>
            <div className="p-3 rounded-lg border bg-muted/30">
              <p className="text-sm font-medium mb-1">Get It On Letterhead</p>
              <p className="text-xs text-muted-foreground">
                The final letter should be on official practice letterhead with license number and contact info.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
