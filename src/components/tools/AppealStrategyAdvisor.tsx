import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { createWorker, OEM } from 'tesseract.js';
import { 
  AlertTriangle, 
  Scale, 
  FileSearch, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Lightbulb, 
  Target, 
  FileText,
  Camera,
  Upload,
  Loader2,
  Lock,
  Copy,
  Scan,
  X
} from 'lucide-react';

// Common VA denial reason codes and explanations
const denialReasonCodes: Record<string, { title: string; explanation: string; commonFix: string }> = {
  'no-nexus': {
    title: 'No Nexus / Service Connection',
    explanation: 'The VA determined there is insufficient evidence linking your current condition to your military service. This is the most common denial reason.',
    commonFix: 'Obtain an Independent Medical Opinion (IMO) or Nexus Letter from a qualified doctor explicitly connecting your condition to service.'
  },
  'no-current-diagnosis': {
    title: 'No Current Diagnosis',
    explanation: 'The VA found no evidence of a current, diagnosed medical condition. You may have symptoms but lack formal diagnosis.',
    commonFix: 'Get a formal diagnosis from a qualified healthcare provider. Ensure the diagnosis is documented in medical records.'
  },
  'no-in-service-event': {
    title: 'No In-Service Event',
    explanation: 'The VA could not find evidence of an injury, illness, or event during your military service that could have caused your condition.',
    commonFix: 'Gather buddy statements, service records, or other documentation showing the in-service event occurred.'
  },
  'pre-existing': {
    title: 'Pre-existing Condition',
    explanation: 'The VA determined your condition existed before military service and was not aggravated by service.',
    commonFix: 'Obtain medical evidence showing your condition worsened during service beyond natural progression.'
  },
  'insufficient-evidence': {
    title: 'Insufficient Evidence',
    explanation: 'The VA determined there was not enough evidence to support your claim, though they may acknowledge some elements.',
    commonFix: 'Submit additional medical records, buddy statements, or personal statements detailing your condition.'
  },
  'missed-exam': {
    title: 'Failure to Report for C&P Exam',
    explanation: 'You missed a scheduled Compensation & Pension exam, which resulted in denial.',
    commonFix: 'File a Supplemental Claim and show good cause for missing the exam (hospitalization, didn\'t receive notice, etc.).'
  },
  'rating-too-low': {
    title: 'Rating Lower Than Expected',
    explanation: 'Your claim was granted but at a lower rating percentage than your symptoms warrant.',
    commonFix: 'Review the rating criteria and gather evidence showing you meet the criteria for a higher rating.'
  }
};

// Appeal types with detailed information
const appealTypes = {
  hlr: {
    name: 'Higher-Level Review (HLR)',
    description: 'A senior VA reviewer re-examines your case using existing evidence',
    timeline: '125 days average',
    successRate: '~22%',
    pros: [
      'Fastest option (125 days average)',
      'Can request informal conference with reviewer',
      'Senior reviewer may catch errors in original decision',
      'No new evidence required'
    ],
    cons: [
      'Cannot submit new evidence',
      'Limited to errors in original decision',
      'If denied, options narrow',
      'Only one HLR allowed per decision'
    ],
    bestFor: [
      'Clear errors of fact or law in the decision',
      'Evidence was overlooked or misinterpreted',
      'C&P exam was inadequate',
      'Rating criteria were misapplied'
    ]
  },
  supplemental: {
    name: 'Supplemental Claim',
    description: 'Submit new and relevant evidence for reconsideration',
    timeline: '125 days average',
    successRate: '~30%',
    pros: [
      'Can submit new evidence (Nexus letters, buddy statements, etc.)',
      'Preserves effective date if filed within 1 year',
      'Can file multiple supplemental claims',
      'Higher success rate than HLR'
    ],
    cons: [
      'Requires "new and relevant" evidence',
      'Can take longer if C&P exam needed',
      'Previous evidence must still be considered',
      'May result in same denial if evidence is weak'
    ],
    bestFor: [
      'You have new medical evidence or diagnosis',
      'You can obtain a Nexus letter or IMO',
      'New buddy statements available',
      'Medical condition has worsened'
    ]
  },
  board: {
    name: 'Board of Veterans Appeals (BVA)',
    description: 'A Veterans Law Judge reviews your appeal',
    timeline: '12-18 months (Direct Review) to 5+ years (Hearing)',
    successRate: '~35% (with hearing)',
    pros: [
      'Reviewed by a Veterans Law Judge',
      'Can have a hearing to present your case',
      'Can submit new evidence (Evidence lane)',
      'Highest success rate with representation'
    ],
    cons: [
      'Longest timeline (1-5+ years)',
      'Most complex process',
      'May require legal representation',
      'Multiple lanes with different rules'
    ],
    bestFor: [
      'Complex legal or factual disputes',
      'HLR and Supplemental have been denied',
      'You want to present your case in person',
      'You have attorney or VSO representation'
    ]
  }
};

// Evidence suggestions by denial type
const evidenceGapsByDenial: Record<string, string[]> = {
  'no-nexus': [
    'Independent Medical Opinion (IMO) / Nexus Letter',
    'Medical literature supporting connection',
    'Personal statement detailing symptom continuity since service',
    'Buddy statements from fellow service members',
    'Private medical records showing treatment history'
  ],
  'no-current-diagnosis': [
    'Current diagnosis from licensed healthcare provider',
    'Recent medical examination records',
    'Specialist evaluation for your condition',
    'Updated DBQ completed by your doctor',
    'Mental health evaluation (for psychological conditions)'
  ],
  'no-in-service-event': [
    'Buddy statements describing the in-service incident',
    'Personal statement with detailed account of event',
    'Unit historical records or deployment orders',
    'Morning reports or sick call records',
    'Photographs from service showing injury/conditions'
  ],
  'pre-existing': [
    'Medical opinion showing aggravation beyond natural progression',
    'Pre-service medical records for comparison',
    'Service medical records showing treatment increase',
    'Buddy statements about worsening during service',
    'Physical profiles showing duty limitations'
  ],
  'insufficient-evidence': [
    'Complete medical records from all providers',
    'Updated personal statement with specific details',
    'Multiple buddy statements',
    'Nexus letter or IMO',
    'Photographs, journals, or contemporaneous documentation'
  ],
  'missed-exam': [
    'Documentation of good cause (hospitalization, work conflict)',
    'Proof you didn\'t receive notice (moved, wrong address)',
    'Medical records from that time period',
    'Statement explaining circumstances'
  ],
  'rating-too-low': [
    'New DBQ showing current severity',
    'Functional impact statement from employer or family',
    'Updated medical records showing worsening',
    'Lay statements describing limitations',
    'Daily activity log showing impact on life'
  ]
};

export function AppealStrategyAdvisor() {
  const [selectedDenialReason, setSelectedDenialReason] = useState<string>('');
  const [denialNotes, setDenialNotes] = useState('');
  const [recommendedPath, setRecommendedPath] = useState<'hlr' | 'supplemental' | 'board' | null>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  
  // Photo/OCR state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [extractedText, setExtractedText] = useState('');
  
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Handle file/photo selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Maximum file size is 10MB',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setUploadedImage(dataUrl);
      // Auto-run OCR
      performLocalOCR(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // 100% LOCAL OCR - runs entirely in browser using Tesseract.js
  const performLocalOCR = useCallback(async (imageDataUrl: string) => {
    setIsScanning(true);
    setScanProgress(0);
    setExtractedText('');

    try {
      const worker = await createWorker('eng', OEM.LSTM_ONLY, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setScanProgress(Math.round(m.progress * 100));
          }
        },
      });

      const { data } = await worker.recognize(imageDataUrl);
      
      await worker.terminate();

      setExtractedText(data.text);
      // Also append to the notes textarea
      if (data.text.trim()) {
        setDenialNotes(prev => prev ? `${prev}\n\n--- Extracted from letter ---\n${data.text}` : data.text);
      }

      toast({
        title: 'Text Extracted',
        description: `Extracted with ${Math.round(data.confidence)}% confidence`,
      });
    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: 'OCR Failed',
        description: 'Could not extract text. You can still type it manually.',
        variant: 'destructive',
      });
    } finally {
      setIsScanning(false);
    }
  }, [toast]);

  const clearUploadedImage = () => {
    setUploadedImage(null);
    setExtractedText('');
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const copyExtractedText = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      toast({ title: 'Copied!', description: 'Text copied to clipboard' });
    } catch {
      toast({ title: 'Copy Failed', variant: 'destructive' });
    }
  };

  const analyzeAndRecommend = () => {
    if (!selectedDenialReason) return;

    // Logic to recommend appeal path based on denial reason
    if (selectedDenialReason === 'missed-exam') {
      setRecommendedPath('supplemental');
    } else if (selectedDenialReason === 'rating-too-low') {
      // For ratings, HLR if exam was inadequate, supplemental if condition worsened
      setRecommendedPath('hlr');
    } else if (['no-nexus', 'no-current-diagnosis', 'insufficient-evidence'].includes(selectedDenialReason)) {
      // These usually need new evidence
      setRecommendedPath('supplemental');
    } else if (selectedDenialReason === 'no-in-service-event') {
      // May need buddy statements (supplemental) or BVA if complex
      setRecommendedPath('supplemental');
    } else if (selectedDenialReason === 'pre-existing') {
      // Often needs IMO showing aggravation
      setRecommendedPath('supplemental');
    } else {
      setRecommendedPath('supplemental');
    }

    setShowRecommendation(true);
  };

  const selectedDenial = selectedDenialReason ? denialReasonCodes[selectedDenialReason] : null;
  const recommendedAppeal = recommendedPath ? appealTypes[recommendedPath] : null;
  const relevantEvidence = selectedDenialReason ? evidenceGapsByDenial[selectedDenialReason] || [] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Scale className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Appeal Strategy Advisor</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Received a denial or unfavorable rating? This tool helps you understand your options and choose the best path forward.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Decision Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileSearch className="h-5 w-5 text-primary" />
            Step 1: Analyze Your Decision
          </CardTitle>
          <CardDescription>
            Select the primary reason for your denial to get tailored guidance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedDenialReason} onValueChange={setSelectedDenialReason}>
            <SelectTrigger>
              <SelectValue placeholder="Select your denial reason..." />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(denialReasonCodes).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedDenial && (
            <Card className="border-muted bg-muted/30">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{selectedDenial.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedDenial.explanation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 pt-2 border-t">
                  <Lightbulb className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-700 dark:text-green-400">How to Fix This</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedDenial.commonFix}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Photo Upload Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Upload Denial Letter (Optional)</label>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                <span>100% private</span>
              </div>
            </div>
            
            {/* Hidden file inputs */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileSelect}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleFileSelect}
            />

            {!uploadedImage ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1 h-12 gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Take Photo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 h-12 gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Image
                </Button>
              </div>
            ) : (
              <Card className="border-primary/20 bg-primary/5 p-3">
                <div className="space-y-3">
                  {/* Image Preview */}
                  <div className="relative">
                    <img 
                      src={uploadedImage} 
                      alt="Denial letter" 
                      className="w-full max-h-48 object-contain rounded-lg border bg-muted/50"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={clearUploadedImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* OCR Status */}
                  {isScanning && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Extracting text from letter...
                      </div>
                      <Progress value={scanProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground text-right">
                        {scanProgress}% complete
                      </p>
                    </div>
                  )}

                  {!isScanning && extractedText && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="gap-1 bg-success/20 text-success">
                          <CheckCircle2 className="h-3 w-3" />
                          Text Extracted
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyExtractedText}
                          className="h-7 gap-1 text-xs"
                        >
                          <Copy className="h-3 w-3" />
                          Copy
                        </Button>
                      </div>
                      <div className="max-h-24 overflow-y-auto rounded bg-muted/50 p-2 text-xs font-mono whitespace-pre-wrap">
                        {extractedText.substring(0, 500)}{extractedText.length > 500 ? '...' : ''}
                      </div>
                    </div>
                  )}

                  {!isScanning && !extractedText && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => uploadedImage && performLocalOCR(uploadedImage)}
                      className="w-full gap-2"
                    >
                      <Scan className="h-4 w-4" />
                      Extract Text
                    </Button>
                  )}

                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    All processing happens on your device - nothing is uploaded
                  </p>
                </div>
              </Card>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Additional Notes About Your Decision (Optional)</label>
            <Textarea
              placeholder="Paste or type specific language from your decision letter, or it will be extracted from your photo above..."
              value={denialNotes}
              onChange={(e) => setDenialNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button 
            onClick={analyzeAndRecommend} 
            disabled={!selectedDenialReason}
            className="w-full"
          >
            <Target className="h-4 w-4 mr-2" />
            Get My Recommended Strategy
          </Button>
        </CardContent>
      </Card>

      {/* Step 2: Appeal Type Recommendation */}
      {showRecommendation && recommendedAppeal && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-green-600" />
              Step 2: Recommended Appeal Path
            </CardTitle>
            <CardDescription>
              Based on your denial reason, here's our recommendation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-background rounded-xl border-2 border-green-500/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-lg">{recommendedAppeal.name}</h4>
                <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-400">
                  Recommended
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4">{recommendedAppeal.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Timeline</p>
                  <p className="font-semibold">{recommendedAppeal.timeline}</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <TrendingUp className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="font-semibold">{recommendedAppeal.successRate}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="font-medium text-green-700 dark:text-green-400 flex items-center gap-1 mb-2">
                    <CheckCircle2 className="h-4 w-4" /> Best For Your Situation
                  </p>
                  <ul className="space-y-1">
                    {recommendedAppeal.bestFor.map((item, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <ArrowRight className="h-3 w-3 mt-1.5 text-green-600 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Evidence Gap Identifier */}
      {showRecommendation && relevantEvidence.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Step 3: Evidence to Strengthen Your Appeal
            </CardTitle>
            <CardDescription>
              Based on your denial reason, gather these items before appealing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {relevantEvidence.map((evidence, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                    {idx + 1}
                  </div>
                  <span className="text-sm">{evidence}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-400 flex items-start gap-2">
                <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Pro Tip:</strong> A strong Nexus Letter from a qualified medical professional is often the single most important piece of evidence for overturning a denial.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Appeal Options Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Scale className="h-5 w-5 text-primary" />
            Compare All Appeal Options
          </CardTitle>
          <CardDescription>
            Understand the pros and cons of each path
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(appealTypes).map(([key, appeal]) => (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <span className="font-medium">{appeal.name}</span>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {appeal.timeline}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {appeal.successRate}
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <p className="text-muted-foreground">{appeal.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="font-medium text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> Pros
                      </p>
                      <ul className="space-y-1">
                        {appeal.pros.map((pro, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <CheckCircle2 className="h-3 w-3 mt-1.5 text-green-500 shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-red-600 flex items-center gap-1">
                        <XCircle className="h-4 w-4" /> Cons
                      </p>
                      <ul className="space-y-1">
                        {appeal.cons.map((con, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <XCircle className="h-3 w-3 mt-1.5 text-red-500 shrink-0" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="font-medium mb-2">Best For:</p>
                    <div className="flex flex-wrap gap-2">
                      {appeal.bestFor.map((use, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {use}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Success Rate Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Success Rate Insights
          </CardTitle>
          <CardDescription>
            General success rates based on VA data and veteran experiences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Higher-Level Review (HLR)</span>
                <span className="text-sm text-muted-foreground">~22%</span>
              </div>
              <Progress value={22} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Supplemental Claim</span>
                <span className="text-sm text-muted-foreground">~30%</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">BVA with Hearing</span>
                <span className="text-sm text-muted-foreground">~35%</span>
              </div>
              <Progress value={35} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Supplemental with Nexus Letter</span>
                <span className="text-sm text-muted-foreground">~50-60%</span>
              </div>
              <Progress value={55} className="h-2" />
            </div>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Key Insight:</strong> Veterans who obtain professional Nexus Letters and work with accredited VSOs or attorneys see significantly higher success rates on appeals. The quality of new evidence is the biggest factor in overturning denials.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ArrowRight className="h-5 w-5 text-primary" />
            Your Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">
                1
              </div>
              <div>
                <p className="font-medium">Read Your Decision Letter Carefully</p>
                <p className="text-sm text-muted-foreground">Identify the specific reasons for denial and any errors in fact or law.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">
                2
              </div>
              <div>
                <p className="font-medium">Gather New Evidence</p>
                <p className="text-sm text-muted-foreground">Focus on the specific gaps identified above. A Nexus Letter is often critical.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">
                3
              </div>
              <div>
                <p className="font-medium">Contact Your VSO</p>
                <p className="text-sm text-muted-foreground">Work with an accredited Veterans Service Organization for free help with your appeal.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">
                4
              </div>
              <div>
                <p className="font-medium">File Within Deadlines</p>
                <p className="text-sm text-muted-foreground">You have 1 year from decision for NOD/Supplemental, or file Intent to File to preserve your date.</p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
