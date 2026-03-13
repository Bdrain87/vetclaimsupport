import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
  ClipboardList, ChevronLeft, ChevronRight, Loader2, BarChart3, AlertTriangle,
  Camera, Upload, Search, Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { PageContainer } from '@/components/PageContainer';
import { AIDisclaimer } from '@/components/ui/AIDisclaimer';
import { DraftRestoredBanner } from '@/components/ui/DraftRestoredBanner';
import { IntelInsightsCard, type InsightItem } from '@/components/shared/IntelInsightsCard';
import { ClaimIntelligence } from '@/services/claimIntelligence';
import { useClaims } from '@/hooks/useClaims';
import { useToolDraft } from '@/hooks/useToolDraft';
import { useUserConditions } from '@/hooks/useUserConditions';
import { useToast } from '@/hooks/use-toast';
import { resolveDBQ, resolveLegacyRatingCriteria, resolveAllMatchingCriteria, findDBQsForUserCondition } from '@/utils/dbqLookup';
import { dbqQuickReference, type DBQReference } from '@/data/vaResources/dbqReference';
import { conditionRatingCriteria, type ConditionRatingCriteria } from '@/data/ratingCriteria';
import { aiGenerateJSON, isGeminiConfigured } from '@/lib/gemini';
import { scanAIOutput, AI_OUTPUT_WARNING } from '@/utils/aiOutputGuard';
import { analyzeDocument, type AnalysisStep } from '@/lib/analyzeDocument';
import { classifyError } from '@/lib/fileProcessing';
import { AI_ANTI_HALLUCINATION, formatCriteriaForPrompt, getConditionCriteriaForPrompt } from '@/lib/ai-prompts';
import {
  buildQuestionAnalysisPrompt,
  buildOverallAnalysisPrompt,
  questionAnalysisSchema,
  overallAnalysisSchema,
  INTERACTIVE_DBQ_SYSTEM_INSTRUCTION,
  type QuestionAnalysisResult,
  type OverallAnalysisResult,
} from '@/lib/interactive-dbq-prompts';
import { DBQQuestionCard } from '@/components/interactive-dbq/DBQQuestionCard';
import { DBQOverallSummary } from '@/components/interactive-dbq/DBQOverallSummary';
import { getRatingColor } from '@/utils/ratingColors';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

/**
 * Build a condensed lookup table of ALL rating criteria keyed by form number.
 * Included in the upload prompt so the AI can always match the DBQ to criteria,
 * even when the user hasn't pre-selected a condition.
 * Cached at module level — built once, ~3-4K tokens.
 */
const CONDENSED_CRITERIA_LOOKUP = (() => {
  const lines: string[] = ['RATING CRITERIA LOOKUP TABLE — match the DBQ form number to find criteria:'];
  for (const dbq of dbqQuickReference) {
    // Find all matching criteria for this DBQ's diagnostic codes
    const criteria = resolveAllMatchingCriteria(dbq);
    if (criteria.length === 0) continue;
    for (const c of criteria) {
      const levels = c.ratingLevels.map((l) => `${l.percent}%: ${l.criteria}`).join(' | ');
      lines.push(`[${dbq.formNumber}] ${c.conditionName} (DC ${c.diagnosticCode}): ${levels}`);
    }
  }
  return lines.join('\n');
})();

const DISCLAIMER_TEXT = 'Educational preparation tool only. Shows how your documented symptoms align with published VA rating criteria (38 CFR Part 4). This is NOT a rating prediction. Actual ratings are determined solely by the VA based on C&P exam findings. Be truthful and accurate — never exaggerate symptoms.';

type Phase = 'select' | 'condition-select' | 'form' | 'summary';

interface FormData {
  selectedDBQId: string;
  selectedConditionId: string;
  answers: string;
  analysisResults: string;
  uploadedImageAnalysis: string;
}

const initialFormData: FormData = {
  selectedDBQId: '',
  selectedConditionId: '',
  answers: '{}',
  analysisResults: '{}',
  uploadedImageAnalysis: '',
};

/** Schema for DBQ image analysis via AI vision. */
const dbqImageAnalysisSchema = {
  type: 'OBJECT' as const,
  properties: {
    conditionName: { type: 'STRING' as const, description: 'The condition this DBQ is for' },
    formNumber: { type: 'STRING' as const, description: 'VA form number if visible' },
    extractedAnswers: {
      type: 'ARRAY' as const,
      items: {
        type: 'OBJECT' as const,
        properties: {
          question: { type: 'STRING' as const },
          answer: { type: 'STRING' as const },
          ratingRelevance: { type: 'STRING' as const, description: 'How this answer relates to rating criteria' },
        },
        required: ['question', 'answer', 'ratingRelevance'],
      },
    },
    overallAssessment: { type: 'STRING' as const, description: 'Overall assessment of how the documented findings align with rating criteria' },
    suggestedRatingAlignment: { type: 'STRING' as const, description: 'What rating level the documented findings might support' },
    suggestedPercent: { type: 'NUMBER' as const, description: 'Numeric rating percentage the findings best align with (0, 10, 20, 30, 40, 50, 60, 70, 80, or 100)' },
    gaps: { type: 'ARRAY' as const, items: { type: 'STRING' as const }, description: 'Documentation gaps or missing information' },
  },
  required: ['conditionName', 'extractedAnswers', 'overallAssessment', 'suggestedRatingAlignment', 'suggestedPercent', 'gaps'],
};

interface DBQImageAnalysis {
  conditionName: string;
  formNumber?: string;
  extractedAnswers: Array<{ question: string; answer: string; ratingRelevance: string }>;
  overallAssessment: string;
  suggestedRatingAlignment: string;
  suggestedPercent: number;
  gaps: string[];
}

export default function InteractiveDBQ() {
  const { conditions } = useUserConditions();
  const { data } = useClaims();
  const { toast } = useToast();

  const {
    formData, updateField, currentStep, setCurrentStep,
    draftRestored, clearDraft, lastSaved,
  } = useToolDraft<FormData>({
    toolId: 'tool:interactive-dbq',
    initialData: initialFormData,
  });

  // Parse stored JSON state
  const answers: Record<number, string> = useMemo(() => {
    try { return JSON.parse(formData.answers); } catch { return {}; }
  }, [formData.answers]);

  const analysisResults: Record<number, QuestionAnalysisResult> = useMemo(() => {
    try { return JSON.parse(formData.analysisResults); } catch { return {}; }
  }, [formData.analysisResults]);

  // Local state
  const [phase, setPhase] = useState<Phase>(() => {
    if (!formData.selectedDBQId) return 'select';
    if (formData.selectedConditionId) return 'form';
    // Check if this DBQ covers multiple conditions
    const dbq = dbqQuickReference.find((d) => d.id === formData.selectedDBQId);
    if (dbq) {
      const allCriteria = resolveAllMatchingCriteria(dbq);
      if (allCriteria.length > 1) return 'condition-select';
    }
    return 'form';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [analyzingIndex, setAnalyzingIndex] = useState<number | null>(null);
  const [overallResult, setOverallResult] = useState<OverallAnalysisResult | null>(null);
  const [isOverallLoading, setIsOverallLoading] = useState(false);
  const [aiWarning, setAiWarning] = useState(false);

  // Upload state
  const [isUploadProcessing, setIsUploadProcessing] = useState(false);
  const [uploadResult, setUploadResult] = useState<DBQImageAnalysis | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadStep, setUploadStep] = useState<AnalysisStep>('reading');
  // Single set of file inputs (rendered once, outside phase-specific content)
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  // Resolve DBQ and criteria
  const selectedDBQ: DBQReference | undefined = useMemo(
    () => formData.selectedDBQId ? dbqQuickReference.find((d) => d.id === formData.selectedDBQId) : undefined,
    [formData.selectedDBQId],
  );

  // All matching criteria for multi-condition DBQs
  const allMatchingCriteria = useMemo(() => {
    if (!selectedDBQ) return [];
    return resolveAllMatchingCriteria(selectedDBQ);
  }, [selectedDBQ]);

  const ratingCriteria: ConditionRatingCriteria | undefined = useMemo(() => {
    if (!selectedDBQ) return undefined;
    // If a specific condition was selected from multi-condition picker, use it
    if (formData.selectedConditionId) {
      const selected = allMatchingCriteria.find((c) => c.conditionId === formData.selectedConditionId);
      if (selected) return selected;
    }
    // Fallback to first match or legacy resolution
    if (allMatchingCriteria.length > 0) return allMatchingCriteria[0];
    return resolveLegacyRatingCriteria({
      id: selectedDBQ.id,
      diagnosticCode: selectedDBQ.diagnosticCodes[0],
      diagnosticCodes: selectedDBQ.diagnosticCodes,
    });
  }, [selectedDBQ, formData.selectedConditionId, allMatchingCriteria]);

  const availablePercents = useMemo(
    () => ratingCriteria?.ratingLevels.map((l) => l.percent) ?? [],
    [ratingCriteria],
  );

  // Intel Insights for the selected condition
  const intelInsights = useMemo(() => {
    const conditionName = ratingCriteria?.conditionName || selectedDBQ?.name || '';
    if (!conditionName) return { score: 0, insights: [] as InsightItem[], tips: [] as string[] };
    const readiness = ClaimIntelligence.getConditionReadiness(conditionName, data);
    if (!readiness) return { score: 0, insights: [] as InsightItem[], tips: [] as string[] };
    const insights: InsightItem[] = [
      { label: 'Medical evidence', value: `${readiness.components.medicalEvidence}%` },
      { label: 'Service connection', value: `${readiness.components.serviceConnection}%` },
      { label: 'Current severity', value: `${readiness.components.currentSeverity}%` },
      { label: 'Statements', value: `${readiness.components.statements}%` },
      { label: 'Exam prep', value: `${readiness.components.examPrep}%` },
    ];
    return { score: readiness.overallScore, insights, tips: readiness.tips };
  }, [ratingCriteria, selectedDBQ, data]);

  // Group user conditions with matching DBQs at top
  const userDBQMatches = useMemo(() => {
    return conditions
      .map((uc) => {
        const matches = findDBQsForUserCondition({ conditionId: uc.conditionId, displayName: uc.displayName });
        return { uc, matches };
      })
      .filter((m) => m.matches.length > 0);
  }, [conditions]);

  // Filtered DBQ list for browsing
  const filteredDBQs = useMemo(() => {
    if (!searchQuery.trim()) return dbqQuickReference;
    const q = searchQuery.toLowerCase();
    return dbqQuickReference.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.conditionsCovered.some((c) => c.toLowerCase().includes(q)) ||
        d.formNumber.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  // Count only analysis results for current DBQ's question indices
  const totalQuestions = selectedDBQ?.keyQuestions.length ?? 0;
  const analyzedCount = useMemo(() => {
    if (!selectedDBQ) return 0;
    let count = 0;
    for (let i = 0; i < selectedDBQ.keyQuestions.length; i++) {
      if (analysisResults[i]) count++;
    }
    return count;
  }, [selectedDBQ, analysisResults]);

  // Clamp currentStep to valid range for current DBQ
  const safeCurrentStep = selectedDBQ
    ? Math.min(currentStep, selectedDBQ.keyQuestions.length - 1)
    : 0;
  // Sync if clamped (e.g. draft restored with step beyond current question count)
  useEffect(() => {
    if (safeCurrentStep !== currentStep && selectedDBQ) {
      setCurrentStep(safeCurrentStep);
    }
  }, [safeCurrentStep, currentStep, selectedDBQ, setCurrentStep]);

  // --- Handlers ---

  const handleSelectDBQ = useCallback((dbq: DBQReference) => {
    updateField('selectedDBQId', dbq.id);
    updateField('selectedConditionId', '');
    // Clear answers/results from prior DBQ selection
    updateField('answers', '{}');
    updateField('analysisResults', '{}');
    setCurrentStep(0);
    setOverallResult(null);
    // Clear upload state from prior selection
    setUploadResult(null);
    setUploadPreview(null);
    // Check if this DBQ covers multiple conditions
    const allCriteria = resolveAllMatchingCriteria(dbq);
    if (allCriteria.length > 1) {
      setPhase('condition-select');
    } else {
      setPhase('form');
    }
  }, [updateField, setCurrentStep]);

  const handleSelectCondition = useCallback((conditionId: string) => {
    updateField('selectedConditionId', conditionId);
    setPhase('form');
  }, [updateField]);

  const handleAnswerChange = useCallback((index: number, value: string) => {
    const updated = { ...answers, [index]: value };
    updateField('answers', JSON.stringify(updated));
  }, [answers, updateField]);

  const handleAnalyzeQuestion = useCallback(async (index: number) => {
    if (!selectedDBQ || !ratingCriteria || !isGeminiConfigured) return;
    const answer = answers[index];
    if (!answer || answer.trim().length < 10) return;

    setAnalyzingIndex(index);
    try {
      const prompt = buildQuestionAnalysisPrompt(
        selectedDBQ.name,
        ratingCriteria,
        selectedDBQ.keyQuestions[index].question,
        answer,
      );

      const result = await aiGenerateJSON<QuestionAnalysisResult>({
        prompt,
        systemInstruction: INTERACTIVE_DBQ_SYSTEM_INSTRUCTION,
        responseSchema: questionAnalysisSchema,
        feature: 'interactive-dbq-question',
        temperature: 0.3,
      });

      // Scan AI output for banned phrases
      const scanText = [result.explanation, result.improvementSuggestion].filter(Boolean).join(' ');
      const scan = scanAIOutput(scanText);
      if (!scan.clean) setAiWarning(true);

      // Snap alignedPercent to nearest valid value
      if (availablePercents.length === 0) return;
      if (!availablePercents.includes(result.alignedPercent)) {
        const closest = availablePercents.reduce((prev, curr) =>
          Math.abs(curr - result.alignedPercent) < Math.abs(prev - result.alignedPercent) ? curr : prev,
          availablePercents[0],
        );
        result.alignedPercent = closest;
      }

      const updated = { ...analysisResults, [index]: result };
      updateField('analysisResults', JSON.stringify(updated));
    } catch {
      toast({ title: 'Analysis failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setAnalyzingIndex(null);
    }
  }, [selectedDBQ, ratingCriteria, answers, analysisResults, availablePercents, updateField, toast]);

  const handleOverallSummary = useCallback(async () => {
    if (!selectedDBQ || !ratingCriteria) return;

    setIsOverallLoading(true);
    try {
      const questionsAndAnswers = selectedDBQ.keyQuestions.map((q, i) => ({
        question: q.question,
        answer: answers[i] || '',
        analysisResult: analysisResults[i],
      }));

      const prompt = buildOverallAnalysisPrompt(selectedDBQ.name, ratingCriteria, questionsAndAnswers);

      const result = await aiGenerateJSON<OverallAnalysisResult>({
        prompt,
        systemInstruction: INTERACTIVE_DBQ_SYSTEM_INSTRUCTION,
        responseSchema: overallAnalysisSchema,
        feature: 'interactive-dbq-summary',
        temperature: 0.3,
      });

      // Scan AI output for banned phrases
      const scanText = [...result.strengths, ...result.gaps, ...result.nextSteps, ...result.questionBreakdown.map((q) => q.summary)].filter(Boolean).join(' ');
      const scan = scanAIOutput(scanText);
      if (!scan.clean) setAiWarning(true);

      if (availablePercents.length === 0) return;
      if (!availablePercents.includes(result.overallAlignedPercent)) {
        const closest = availablePercents.reduce((prev, curr) =>
          Math.abs(curr - result.overallAlignedPercent) < Math.abs(prev - result.overallAlignedPercent) ? curr : prev,
          availablePercents[0],
        );
        result.overallAlignedPercent = closest;
      }

      setOverallResult(result);
      setPhase('summary');
    } catch {
      toast({ title: 'Summary failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setIsOverallLoading(false);
    }
  }, [selectedDBQ, ratingCriteria, answers, analysisResults, availablePercents, toast]);

  // --- Image upload/capture ---

  const processUploadedFile = useCallback(async (file: File) => {
    if (!isGeminiConfigured) {
      toast({ title: 'AI not configured', variant: 'destructive' });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: 'File too large', description: 'Please use a file under 20 MB.', variant: 'destructive' });
      return;
    }

    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    setIsUploadProcessing(true);
    setUploadResult(null);
    setUploadStep('reading');

    // Preview — show thumbnail for images, placeholder for PDFs
    if (isPDF) {
      setUploadPreview(null);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => setUploadPreview(e.target?.result as string);
      reader.onerror = () => toast({ title: 'Could not read file', description: 'The file may be corrupted.', variant: 'destructive' });
      reader.readAsDataURL(file);
    }

    try {
      let criteriaBlock = '';
      if (ratingCriteria) {
        criteriaBlock = `\n\n<rating_criteria>\n${formatCriteriaForPrompt(ratingCriteria)}\n</rating_criteria>\n\nIMPORTANT: Use ONLY the rating criteria above when discussing rating levels. Do NOT invent or guess criteria — reference only the exact percentages and requirements listed above.`;
      } else if (selectedDBQ) {
        // Tiered fallback: try brief criteria from vaDisabilities or conditions data
        const briefResult = getConditionCriteriaForPrompt(selectedDBQ.name, selectedDBQ.diagnosticCodes[0]);
        if (briefResult) {
          criteriaBlock = `\n\n<rating_criteria>\n${briefResult.text}\n</rating_criteria>\n\nIMPORTANT: This is a summary of rating criteria. Use it as reference but note it may not contain all rating levels.`;
        }
      }

      // Fallback: no DBQ selected yet (upload from select phase) — inject the full condensed lookup table
      // so the AI can match the form number it sees in the document to the correct criteria
      if (!criteriaBlock) {
        criteriaBlock = `\n\n<rating_criteria>\n${CONDENSED_CRITERIA_LOOKUP}\n</rating_criteria>\n\nIMPORTANT: Identify the DBQ form number from the uploaded document, then look it up in the rating criteria table above. Use ONLY those criteria when discussing rating levels. You MUST provide a suggestedPercent based on the matching criteria.`;
      }

      const { text } = await analyzeDocument({
        file,
        prompt: `Analyze this VA Disability Benefits Questionnaire (DBQ) form. Extract:
1. The condition name this DBQ is for
2. The VA form number if visible (look for "VA FORM" followed by a number like 21-0960X-X)
3. Each question and the examiner's documented answer/findings
4. How each finding relates to the VA rating criteria for this condition
5. An overall assessment of what rating level the documented findings support — you MUST provide a suggestedPercent value
6. Any gaps or missing information
${criteriaBlock}

Important: Focus on the medical findings and how they align with 38 CFR Part 4 rating criteria. This is for educational purposes to help veterans understand their documentation. You MUST always provide a suggestedPercent numeric value based on the criteria match.`,
        systemInstruction: `You are a VA disability claims documentation analyst. Extract and analyze DBQ form contents against published rating criteria. Be factual and objective. Only cite rating percentages and criteria that were explicitly provided to you — never fabricate criteria from memory. This is an educational tool — not a rating prediction.${AI_ANTI_HALLUCINATION}`,
        feature: 'interactive-dbq-upload',
        responseSchema: dbqImageAnalysisSchema,
        temperature: 0.2,
        onProgress: setUploadStep,
      });

      const parsed: DBQImageAnalysis = JSON.parse(text);

      // Scan AI output for banned phrases
      const uploadScanText = [parsed.overallAssessment, parsed.suggestedRatingAlignment, ...parsed.gaps, ...parsed.extractedAnswers.map((a) => `${a.answer} ${a.ratingRelevance}`)].filter(Boolean).join(' ');
      const uploadScan = scanAIOutput(uploadScanText);
      if (!uploadScan.clean) setAiWarning(true);

      // Auto-resolve DBQ from parsed result so ratingCriteria populates for the display
      if (!selectedDBQ && (parsed.conditionName || parsed.formNumber)) {
        const resolved = resolveDBQ({
          id: '',
          name: parsed.conditionName || '',
          diagnosticCode: '',
          formNumber: parsed.formNumber,
        });
        if (resolved) {
          updateField('selectedDBQId', resolved.id);
          // If multi-condition DBQ, try to auto-select the right condition
          const allCriteria = resolveAllMatchingCriteria(resolved);
          if (allCriteria.length === 1) {
            updateField('selectedConditionId', allCriteria[0].conditionId);
          } else if (allCriteria.length > 1 && parsed.conditionName) {
            const match = allCriteria.find((c) => c.conditionName.toLowerCase().includes(parsed.conditionName.toLowerCase()) || parsed.conditionName.toLowerCase().includes(c.conditionName.toLowerCase()));
            if (match) updateField('selectedConditionId', match.conditionId);
          }
        }
      }

      setUploadResult(parsed);
      updateField('uploadedImageAnalysis', JSON.stringify(parsed));
    } catch (err) {
      const { message } = classifyError(err, file);
      toast({ title: 'Could not analyze file', description: message, variant: 'destructive' });
    } finally {
      setIsUploadProcessing(false);
    }
  }, [toast, updateField, ratingCriteria, selectedDBQ]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processUploadedFile(file);
    e.target.value = '';
  }, [processUploadedFile]);

  // --- Render ---

  return (
    <PageContainer className="py-6 space-y-4">
      {/* Hidden file inputs — rendered once, shared across phases */}
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileSelect} />
      <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileSelect} />

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gold/10 border border-gold/20">
          <ClipboardList className="h-6 w-6 text-gold" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">AI DBQ Analyzer</h1>
          <p className="text-xs text-muted-foreground">Color-coded rating criteria alignment</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs text-muted-foreground flex gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <span>{DISCLAIMER_TEXT}</span>
      </div>

      {/* AI output warning */}
      {aiWarning && (
        <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-xs text-red-400 flex gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{AI_OUTPUT_WARNING}</span>
        </div>
      )}

      {/* Draft restored */}
      {draftRestored && lastSaved && (
        <DraftRestoredBanner lastSaved={lastSaved} onStartFresh={clearDraft} />
      )}

      {/* ── SELECT PHASE ── */}
      {phase === 'select' && (
        <div className="space-y-4">
          {/* Upload / Camera section */}
          <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Camera className="h-4 w-4 text-gold" />
              Upload a Completed DBQ
            </h2>
            <p className="text-xs text-muted-foreground">
              Take a photo, upload an image, or select a PDF of a completed DBQ form to get instant color-coded analysis of the documented findings.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 min-h-[44px]"
                onClick={() => cameraRef.current?.click()}
                disabled={isUploadProcessing}
              >
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
              <Button
                variant="outline"
                className="flex-1 min-h-[44px]"
                onClick={() => fileRef.current?.click()}
                disabled={isUploadProcessing}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>

            {/* Upload processing */}
            {isUploadProcessing && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  {uploadStep === 'reading' && 'Reading file...'}
                  {uploadStep === 'uploading' && 'Uploading to AI...'}
                  {uploadStep === 'analyzing' && 'Analyzing with AI...'}
                  {uploadStep === 'ocr-fallback' && 'Trying text extraction...'}
                </span>
              </div>
            )}

            {/* Upload preview + result */}
            {!isUploadProcessing && uploadResult && (
              <div className="space-y-3">
                {uploadPreview && (
                  <img src={uploadPreview} alt="Uploaded DBQ" className="w-full rounded-lg max-h-48 object-contain bg-black/5" />
                )}
                <UploadAnalysisResult result={uploadResult} hasCriteria />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex-1 border-t border-border" />
            <span>OR prepare your answers interactively</span>
            <div className="flex-1 border-t border-border" />
          </div>

          {/* User's conditions */}
          {userDBQMatches.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gold px-1">Your Conditions</h2>
              <div className="space-y-1.5">
                {userDBQMatches.map(({ uc, matches }) => (
                  <button
                    key={uc.id}
                    onClick={() => handleSelectDBQ(matches[0])}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl border border-gold/20 bg-gold/5 hover:bg-gold/10 active:scale-[0.98] transition-all text-left"
                  >
                    <div className="p-2 rounded-xl bg-gold/10 shrink-0">
                      <ClipboardList className="h-4 w-4 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground block truncate">
                        {uc.displayName || uc.conditionId}
                      </span>
                      <span className="text-xs text-muted-foreground block truncate">
                        {matches[0].name} · {matches[0].keyQuestions.length} questions
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Browse all DBQs */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
              Browse All DBQ Forms ({dbqQuickReference.length})
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conditions or form numbers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 rounded-xl"
              />
            </div>
            <div className="space-y-1 max-h-[50vh] overflow-y-auto">
              {filteredDBQs.map((dbq) => (
                <button
                  key={dbq.id}
                  onClick={() => handleSelectDBQ(dbq)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:bg-accent/50 active:scale-[0.98] transition-all text-left"
                >
                  <div className="p-2 rounded-xl bg-gold/10 shrink-0">
                    <ClipboardList className="h-4 w-4 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground block truncate">{dbq.name}</span>
                    <span className="text-xs text-muted-foreground block truncate">
                      {dbq.formNumber} · {dbq.keyQuestions.length} questions
                    </span>
                  </div>
                </button>
              ))}
              {filteredDBQs.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No DBQ forms match your search.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── CONDITION-SELECT PHASE (multi-condition DBQs) ── */}
      {phase === 'condition-select' && selectedDBQ && allMatchingCriteria.length > 1 && (
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            className="min-h-[44px]"
            onClick={() => { updateField('selectedDBQId', ''); setPhase('select'); }}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to DBQ Selection
          </Button>

          <div className="text-center space-y-2">
            <ClipboardList className="h-8 w-8 text-gold mx-auto" />
            <h2 className="text-lg font-semibold text-foreground">{selectedDBQ.name}</h2>
            <p className="text-sm text-muted-foreground">
              This DBQ covers multiple conditions. Which are you preparing for?
            </p>
          </div>

          <div className="space-y-2">
            {allMatchingCriteria.map((criteria) => (
              <button
                key={criteria.conditionId}
                onClick={() => handleSelectCondition(criteria.conditionId)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-gold/40 hover:bg-gold/5 transition-colors text-left"
              >
                <div className="p-2 rounded-xl bg-gold/10 shrink-0">
                  <BarChart3 className="h-4 w-4 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground block">{criteria.conditionName}</span>
                  <span className="text-xs text-muted-foreground block">
                    DC {criteria.diagnosticCode} · {criteria.ratingLevels.length} rating levels
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── FORM PHASE ── */}
      {phase === 'form' && selectedDBQ && (
        <div className="space-y-4">
          {/* Nav */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="min-h-[44px]"
              onClick={() => {
                if (allMatchingCriteria.length > 1) {
                  setPhase('condition-select');
                } else {
                  setPhase('select');
                }
              }}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <span className="text-xs text-muted-foreground">
              {analyzedCount}/{totalQuestions} analyzed
            </span>
          </div>

          {/* Condition header */}
          <div className="p-3 rounded-xl bg-card border border-border">
            <h2 className="text-sm font-semibold text-foreground">{selectedDBQ.name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-muted-foreground">{selectedDBQ.formNumber}</p>
              {ratingCriteria && (
                <span className="text-[10px] text-muted-foreground">
                  · Ratings: {availablePercents.map((p) => `${p}%`).join(', ')}
                </span>
              )}
            </div>
            {!ratingCriteria && (
              <div className="mt-2 flex items-center gap-2 text-xs text-amber-400">
                <Info className="h-3.5 w-3.5 shrink-0" />
                Rating criteria analysis not available for this condition.
              </div>
            )}
          </div>

          {/* Intel Insights */}
          {intelInsights.insights.length > 0 && (
            <IntelInsightsCard
              title="Symptom Analysis"
              readinessScore={intelInsights.score}
              insights={intelInsights.insights}
              tips={intelInsights.tips}
              defaultExpanded={false}
            />
          )}

          {/* Upload in form phase */}
          <div className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Have a completed DBQ?</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="min-h-[44px] text-xs" onClick={() => cameraRef.current?.click()} disabled={isUploadProcessing}>
                  <Camera className="h-3.5 w-3.5 mr-1" /> Photo
                </Button>
                <Button variant="ghost" size="sm" className="min-h-[44px] text-xs" onClick={() => fileRef.current?.click()} disabled={isUploadProcessing}>
                  <Upload className="h-3.5 w-3.5 mr-1" /> Upload
                </Button>
              </div>
            </div>
            {isUploadProcessing && (
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {uploadStep === 'reading' ? 'Reading file...' : uploadStep === 'uploading' ? 'Uploading to AI...' : uploadStep === 'ocr-fallback' ? 'Trying text extraction...' : 'Analyzing...'}
              </div>
            )}
            {uploadResult && !isUploadProcessing && (
              <div className="mt-2">
                <UploadAnalysisResult result={uploadResult} hasCriteria />
              </div>
            )}
          </div>

          {/* Step indicator */}
          <div className="flex gap-1">
            {selectedDBQ.keyQuestions.map((_, i) => {
              const qResult = analysisResults[i];
              const isActive = i === safeCurrentStep;
              const dotStyle: React.CSSProperties = isActive
                ? {}
                : qResult
                  ? { backgroundColor: getRatingColor(qResult.alignedPercent).hex, opacity: 0.7 }
                  : {};
              return (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={cn('flex-1 h-1.5 rounded-full transition-all min-h-[44px] relative', 'bg-transparent')}
                  aria-label={`Go to question ${i + 1}`}
                >
                  <span
                    className={cn('absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full', isActive ? 'bg-gold' : !qResult ? 'bg-muted' : '')}
                    style={dotStyle}
                  />
                </button>
              );
            })}
          </div>

          {/* Current question card */}
          <DBQQuestionCard
            index={safeCurrentStep}
            total={totalQuestions}
            question={selectedDBQ.keyQuestions[safeCurrentStep].question}
            whyItMatters={selectedDBQ.keyQuestions[safeCurrentStep].whyItMatters}
            tips={selectedDBQ.keyQuestions[safeCurrentStep].tips}
            answer={answers[safeCurrentStep] || ''}
            onAnswerChange={(v) => handleAnswerChange(safeCurrentStep, v)}
            analysisResult={analysisResults[safeCurrentStep] ?? null}
            isAnalyzing={analyzingIndex === safeCurrentStep}
            onAnalyze={() => handleAnalyzeQuestion(safeCurrentStep)}
            availablePercents={availablePercents}
            hasCriteria={!!ratingCriteria}
          />

          {/* Navigation */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 min-h-[44px]"
              disabled={safeCurrentStep === 0}
              onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            {safeCurrentStep < totalQuestions - 1 ? (
              <Button
                className="flex-1 min-h-[44px]"
                onClick={() => setCurrentStep((p) => Math.min(totalQuestions - 1, p + 1))}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : ratingCriteria ? (
              <Button
                className="flex-1 min-h-[44px]"
                onClick={handleOverallSummary}
                disabled={isOverallLoading || analyzedCount === 0}
              >
                {isOverallLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Summary
                  </>
                )}
              </Button>
            ) : null}
          </div>
        </div>
      )}

      {/* ── SUMMARY PHASE ── */}
      {phase === 'summary' && overallResult && selectedDBQ && ratingCriteria && (
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            className="min-h-[44px]"
            onClick={() => setPhase('form')}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Questions
          </Button>

          <DBQOverallSummary
            result={overallResult}
            conditionName={selectedDBQ.name}
            availablePercents={availablePercents}
          />

          {/* Bottom disclaimer */}
          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs text-muted-foreground flex gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{DISCLAIMER_TEXT}</span>
          </div>

          <AIDisclaimer variant="banner" />
        </div>
      )}

      {/* Global AI disclaimer */}
      {phase !== 'summary' && <AIDisclaimer variant="banner" />}
    </PageContainer>
  );
}

// --- Upload Analysis Result Component ---

function UploadAnalysisResult({ result, hasCriteria = true }: { result: DBQImageAnalysis; hasCriteria?: boolean }) {
  const uploadColor = result.suggestedPercent != null ? getRatingColor(result.suggestedPercent) : null;

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">{result.conditionName}</h3>
        {result.formNumber && <p className="text-xs text-muted-foreground">{result.formNumber}</p>}
      </div>

      {/* Color-coded rating alignment */}
      {hasCriteria && uploadColor && result.suggestedPercent != null && (
        <div
          className="rounded-xl border p-3 space-y-2 bg-card"
          style={{ borderColor: `${uploadColor.hex}50` }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Rating Alignment</span>
            <span className={cn('text-lg font-bold', uploadColor.textClass)}>
              {result.suggestedPercent}%
            </span>
          </div>
          <div className="flex gap-1">
            {[0, 10, 20, 30, 40, 50, 60, 70, 80, 100].map((pct) => {
              const c = getRatingColor(pct);
              const isActive = pct === result.suggestedPercent;
              return (
                <div
                  key={pct}
                  className={cn('flex-1 h-1.5 rounded-full transition-all', isActive ? 'scale-y-150' : 'opacity-20')}
                  style={{ backgroundColor: c.hex }}
                />
              );
            })}
          </div>
          <p className={cn('text-xs', uploadColor.textClass)}>{uploadColor.label} impairment</p>
        </div>
      )}

      {/* No criteria note */}
      {!hasCriteria && (
        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs text-muted-foreground flex gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span>Rating criteria not available for this condition. Rating alignment cannot be determined. Use the Rating Guidance tool for criteria details.</span>
        </div>
      )}

      {/* Extracted answers */}
      {result.extractedAnswers.length > 0 && (
        <div className="space-y-2">
          {result.extractedAnswers.map((ea, i) => (
            <div key={i} className="p-2 rounded-lg bg-muted/50 space-y-1">
              <p className="text-xs font-medium text-foreground">{ea.question}</p>
              <p className="text-xs text-muted-foreground">{ea.answer}</p>
              <p className="text-[10px] text-primary italic">{ea.ratingRelevance}</p>
            </div>
          ))}
        </div>
      )}

      {/* Overall */}
      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-xs font-medium text-primary mb-1">Overall Assessment</p>
        <p className="text-xs text-muted-foreground">{result.overallAssessment}</p>
        {hasCriteria && result.suggestedRatingAlignment && (
          <p className="text-xs text-foreground mt-1 font-medium">{result.suggestedRatingAlignment}</p>
        )}
      </div>

      {/* Gaps */}
      {result.gaps.length > 0 && (
        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
          <p className="text-xs font-medium text-amber-400 mb-1">Documentation Gaps</p>
          <ul className="space-y-0.5">
            {result.gaps.map((g, i) => (
              <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                <span className="text-amber-400 shrink-0">-</span>
                {g}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/20 text-[10px] text-muted-foreground flex gap-1.5">
        <AlertTriangle className="h-3 w-3 text-amber-400 shrink-0 mt-0.5" />
        <span>Educational analysis only — not a rating prediction. Actual ratings are determined solely by the VA.</span>
      </div>
    </div>
  );
}
