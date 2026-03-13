import { useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSearch, Upload, Loader2, CheckCircle2, AlertTriangle,
  ChevronRight, ShieldCheck, Plus, TrendingUp, Link2, FileText,
  X, Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PageContainer } from '@/components/PageContainer';
import { AIDisclaimer } from '@/components/ui/AIDisclaimer';
import { toast } from '@/hooks/use-toast';
import { analyzeDocument, type AnalysisStep } from '@/lib/analyzeDocument';
import { buildVeteranContext } from '@/utils/veteranContext';
import { formatContextForAI } from '@/utils/formatContextForAI';
import { buildCFileIntelPrompt, CFILE_RESPONSE_SCHEMA, type CFileAnalysisResult } from '@/lib/cfile-prompts';
import { buildSecondaryConnectionsBlock, buildCriteriaBlockForConditions } from '@/lib/ai-prompts';
import { useUserConditions } from '@/hooks/useUserConditions';
import { getConditionDisplayName } from '@/utils/conditionResolver';
import { requireOnline } from '@/utils/networkCheck';
import { checkAIRateLimit } from '@/services/aiUsageTracker';
import { trackAICall } from '@/services/aiUsageTracker';
import { scanAIOutput, AI_OUTPUT_WARNING } from '@/utils/aiOutputGuard';
import { C_FILE_CONSENT } from '@/data/legalCopy';
import { buildToolLink } from '@/lib/toolRouting';

type Phase = 'consent' | 'upload' | 'analyzing' | 'results';

const CONSENT_KEY = 'vcs-cfile-consent-accepted';

function hasConsent(): boolean {
  try { return localStorage.getItem(CONSENT_KEY) === 'true'; } catch { return false; }
}

function saveConsent(): void {
  try { localStorage.setItem(CONSENT_KEY, 'true'); } catch { /* */ }
}

export default function CFileIntel() {
  const navigate = useNavigate();
  const { conditions } = useUserConditions();
  const uploadRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [phase, setPhase] = useState<Phase>(hasConsent() ? 'upload' : 'consent');
  const [consentChecked, setConsentChecked] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<AnalysisStep>('reading');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<CFileAnalysisResult | null>(null);
  const [aiWarning, setAiWarning] = useState(false);
  const [error, setError] = useState('');

  const currentConditionNames = useMemo(
    () => conditions.map(c => getConditionDisplayName(c)),
    [conditions],
  );

  const handleConsent = () => {
    saveConsent();
    setPhase('upload');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.size > 50 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'C-Files must be under 50MB.', variant: 'destructive' });
      return;
    }
    if (!selected.type.includes('pdf')) {
      toast({ title: 'PDF required', description: 'Please upload your C-File as a PDF.', variant: 'destructive' });
      return;
    }
    setFile(selected);
  };

  const handleAnalyze = useCallback(async () => {
    if (!file) return;
    if (!requireOnline('C-File Intel')) return;

    const { allowed, status } = checkAIRateLimit();
    if (!allowed) {
      toast({
        title: 'AI limit reached',
        description: `Monthly limit (${status.used}/${status.limit}). Resets ${status.resetDate}.`,
        variant: 'destructive',
      });
      return;
    }

    setError('');
    setPhase('analyzing');
    setProgress(10);

    const abort = new AbortController();
    abortRef.current = abort;

    const ctx = buildVeteranContext({ maskPII: true });
    const contextBlock = formatContextForAI(ctx, 'detailed');
    const secondaries = buildSecondaryConnectionsBlock(currentConditionNames);
    const criteria = buildCriteriaBlockForConditions(currentConditionNames.map(name => ({ name })));

    const systemPrompt = buildCFileIntelPrompt({
      veteranContext: contextBlock,
      currentConditions: currentConditionNames,
      secondaryConnections: secondaries || undefined,
      ratingCriteria: criteria || undefined,
    });

    const start = Date.now();

    try {
      setStep('uploading');
      setProgress(25);

      const { text } = await analyzeDocument({
        file,
        prompt: 'Analyze this VA C-File (Claims File) and return structured findings as JSON.',
        systemInstruction: systemPrompt,
        feature: 'cfile-intel',
        responseSchema: CFILE_RESPONSE_SCHEMA,
        temperature: 0.2,
        signal: abort.signal,
        onProgress: (s) => {
          setStep(s);
          if (s === 'uploading') setProgress(30);
          if (s === 'analyzing') setProgress(60);
        },
      });

      setProgress(90);

      let parsed: CFileAnalysisResult;
      try {
        parsed = JSON.parse(text);
      } catch {
        setError('Could not parse AI response. Please try again.');
        setPhase('upload');
        return;
      }

      // Scan for banned phrases
      const fullText = JSON.stringify(parsed);
      const scan = scanAIOutput(fullText);
      if (!scan.clean) {
        setAiWarning(true);
      }

      trackAICall({
        feature: 'cfile-intel',
        model: 'gemini-2.5-flash',
        success: true,
        durationMs: Date.now() - start,
        inputLength: file.size,
      });

      setResult(parsed);
      setProgress(100);
      setPhase('results');
    } catch (err) {
      if (abort.signal.aborted) return;
      trackAICall({ feature: 'cfile-intel', success: false, durationMs: Date.now() - start });
      const msg = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      setError(msg);
      setPhase('upload');
      toast({ title: 'Analysis failed', description: msg, variant: 'destructive' });
    }
  }, [file, currentConditionNames]);

  const handleCancel = () => {
    abortRef.current?.abort();
    setPhase('upload');
    setProgress(0);
  };

  const totalFindings = result
    ? result.missedConditions.length + result.ratingDiscrepancies.length + result.secondaryOpportunities.length + result.evidenceGaps.length
    : 0;

  return (
    <PageContainer className="space-y-6 animate-fade-in">
      <AIDisclaimer variant="banner" />

      {/* Header */}
      <div className="section-header">
        <div className="section-icon bg-gold/10">
          <FileSearch className="h-5 w-5 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">C-File Intel</h1>
          <p className="text-muted-foreground text-sm">AI-powered analysis of your VA Claims File</p>
        </div>
      </div>

      {/* Consent Phase */}
      {phase === 'consent' && (
        <Card className="border-gold/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-gold" />
              Upload Consent Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>{C_FILE_CONSENT.intro}</p>
              <ul className="space-y-1.5">
                {C_FILE_CONSENT.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-gold shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-1 accent-gold"
              />
              <span className="text-xs text-foreground">{C_FILE_CONSENT.acknowledgment}</span>
            </label>
            <Button onClick={handleConsent} disabled={!consentChecked} className="w-full">
              Continue
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upload Phase */}
      {phase === 'upload' && (
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-2xl bg-gold/10 border border-gold/20">
                <Upload className="h-8 w-8 text-gold" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Upload Your C-File</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  Upload your VA Claims File (PDF, up to 50MB). Personal identifiers are
                  automatically redacted before analysis.
                </p>
              </div>
              {file && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-sm">
                  <FileText className="h-4 w-4 text-gold" />
                  <span className="truncate max-w-[200px]">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024 / 1024).toFixed(1)} MB)
                  </span>
                  <button onClick={() => setFile(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive max-w-sm">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  ref={uploadRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {!file ? (
                  <Button onClick={() => uploadRef.current?.click()} className="gap-2">
                    <Upload className="h-4 w-4" />
                    Select PDF
                  </Button>
                ) : (
                  <Button onClick={handleAnalyze} className="gap-2">
                    <FileSearch className="h-4 w-4" />
                    Analyze C-File
                  </Button>
                )}
              </div>
              {currentConditionNames.length > 0 && (
                <p className="text-[11px] text-muted-foreground">
                  Analysis will cross-reference against your {currentConditionNames.length} tracked condition{currentConditionNames.length !== 1 ? 's' : ''}.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analyzing Phase */}
      {phase === 'analyzing' && (
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <Loader2 className="h-8 w-8 text-gold animate-spin" />
              <div>
                <h3 className="text-base font-semibold text-foreground">Analyzing Your C-File</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {step === 'reading' && 'Reading document...'}
                  {step === 'uploading' && 'Uploading to analysis service...'}
                  {step === 'analyzing' && 'AI is reviewing your file...'}
                  {step === 'ocr-fallback' && 'Using text extraction fallback...'}
                </p>
              </div>
              <Progress value={progress} className="w-64" />
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Phase */}
      {phase === 'results' && result && (
        <>
          {/* AI Warning */}
          {aiWarning && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-gold/10 border border-gold/20">
              <AlertTriangle className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <p className="text-xs text-gold">{AI_OUTPUT_WARNING}</p>
            </div>
          )}

          {/* Summary */}
          <Card className="border-gold/20 bg-gold/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Analysis Complete — {totalFindings} finding{totalFindings !== 1 ? 's' : ''}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{result.summary}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Missed Conditions */}
          {result.missedConditions.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Plus className="h-4 w-4 text-gold" />
                  Potential Missed Conditions ({result.missedConditions.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.missedConditions.map((mc, i) => (
                  <div key={i} className="p-3 rounded-lg border border-border space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{mc.conditionName}</span>
                      {mc.diagnosticCode && <Badge variant="outline" className="text-[10px]">DC {mc.diagnosticCode}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{mc.reason}</p>
                    <p className="text-[11px] text-muted-foreground italic">Evidence: {mc.evidenceInFile}</p>
                    <button
                      onClick={() => navigate(buildToolLink('conditions'))}
                      className="flex items-center gap-1 text-xs text-gold hover:text-gold/80 mt-1"
                    >
                      Add to your conditions <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Rating Discrepancies */}
          {result.ratingDiscrepancies.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gold" />
                  Rating Discrepancies ({result.ratingDiscrepancies.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.ratingDiscrepancies.map((rd, i) => (
                  <div key={i} className="p-3 rounded-lg border border-border space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{rd.conditionName}</span>
                      {rd.currentRating !== undefined && <Badge variant="secondary">{rd.currentRating}%</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{rd.reason}</p>
                    <p className="text-[11px] text-muted-foreground italic">Evidence: {rd.evidenceInFile}</p>
                    <button
                      onClick={() => navigate(buildToolLink('evidence-strength'))}
                      className="flex items-center gap-1 text-xs text-gold hover:text-gold/80 mt-1"
                    >
                      Review evidence strength <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Secondary Opportunities */}
          {result.secondaryOpportunities.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-gold" />
                  Secondary Opportunities ({result.secondaryOpportunities.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.secondaryOpportunities.map((so, i) => (
                  <div key={i} className="p-3 rounded-lg border border-border space-y-1.5">
                    <p className="text-sm font-medium text-foreground">
                      {so.secondaryCondition} <span className="text-xs text-muted-foreground font-normal">secondary to {so.primaryCondition}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{so.medicalBasis}</p>
                    <p className="text-[11px] text-muted-foreground italic">Evidence: {so.evidenceInFile}</p>
                    <button
                      onClick={() => navigate(buildToolLink('secondary-finder'))}
                      className="flex items-center gap-1 text-xs text-gold hover:text-gold/80 mt-1"
                    >
                      Explore secondaries <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Evidence Gaps */}
          {result.evidenceGaps.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-gold" />
                  Evidence Gaps ({result.evidenceGaps.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.evidenceGaps.map((eg, i) => (
                  <div key={i} className="p-3 rounded-lg border border-border space-y-1.5">
                    <span className="text-sm font-medium text-foreground">{eg.condition}</span>
                    <p className="text-xs text-muted-foreground">{eg.missingEvidence}</p>
                    <p className="text-xs text-gold">{eg.recommendation}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Action Plan */}
          {result.actionPlan.length > 0 && (
            <Card className="border-gold/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="h-4 w-4 text-gold" />
                  Recommended Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.actionPlan.map((step, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="text-gold font-bold shrink-0">{i + 1}.</span>
                    <span className="text-muted-foreground">{step}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Analyze Another */}
          <Button variant="outline" onClick={() => { setPhase('upload'); setFile(null); setResult(null); setAiWarning(false); }} className="w-full">
            Analyze Another C-File
          </Button>

          {/* Disclaimer */}
          <div className="px-4 py-3 rounded-lg bg-gold/10 border border-gold/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <p className="text-xs text-gold/80">
                This analysis is for educational purposes only. It does not constitute legal or medical advice.
                Consult a VA-accredited VSO, attorney, or claims agent before taking action on these findings.
              </p>
            </div>
          </div>
        </>
      )}
    </PageContainer>
  );
}
