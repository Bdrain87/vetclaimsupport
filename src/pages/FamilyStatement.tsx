import { useState } from 'react';
import { motion } from 'motion/react';
import { PageContainer } from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { Clipboard } from '@capacitor/clipboard';
import { toast } from '@/hooks/use-toast';
import { impactMedium } from '@/lib/haptics';
import { aiTranscribe, isGeminiConfigured } from '@/lib/gemini';
import { useAIStream } from '@/hooks/useAIStream';
import { getModelConfig } from '@/lib/ai-models';
import { isNativeApp } from '@/lib/platform';
import { createFamilyStatementPrompt, AI_ANTI_HALLUCINATION, buildCriteriaBlockForConditions } from '@/lib/ai-prompts';
import { buildVeteranContext } from '@/utils/veteranContext';
import { formatContextForAI } from '@/utils/formatContextForAI';
import { StreamingText } from '@/components/ui/StreamingText';
import { Mic, MicOff, Copy, RotateCcw, AlertTriangle, Heart, Users, PenTool, Square } from 'lucide-react';
import { AIDisclaimer } from '@/components/ui/AIDisclaimer';
import { DataConnectedBadge } from '@/components/shared/DataConnectedBadge';
import { AIConfidenceScore } from '@/components/shared/AIConfidenceScore';
import { scanAIOutput, AI_OUTPUT_WARNING } from '@/utils/aiOutputGuard';

type Relationship = 'spouse' | 'child' | 'parent' | 'sibling' | 'friend';

const RELATIONSHIP_LABELS: Record<Relationship, string> = {
  spouse: 'Spouse / Partner',
  child: 'Adult Child',
  parent: 'Parent',
  sibling: 'Sibling',
  friend: 'Close Friend / Battle Buddy',
};

const FAMILY_STATEMENT_SYSTEM = `You are helping a veteran's family member write a supporting lay statement for a VA disability claim. Generate structured, formal statements with specific observable details the VA values. Always mark as SAMPLE template. Not legal advice.${AI_ANTI_HALLUCINATION}`;

export default function FamilyStatement() {
  const [relationship, setRelationship] = useState<Relationship | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statement, setStatement] = useState('');
  const [useText, setUseText] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [error, setError] = useState('');
  const [aiWarning, setAiWarning] = useState(false);
  const { streamedText, isStreaming, startStream, cancel: cancelStream } = useAIStream();

  const generateFromText = async (text: string) => {
    if (!isGeminiConfigured) {
      setError('AI features are not configured.');
      return;
    }
    setIsProcessing(true);
    setError('');
    try {
      const ctx = buildVeteranContext({ maskPII: true });
      const contextBlock = formatContextForAI(ctx, 'standard');

      // Inject real rating criteria so the lay statement describes observable behaviors
      // that map to actual VA rating criteria (e.g., frequency, severity, functional impact)
      const criteriaBlock = buildCriteriaBlockForConditions(
        (ctx.conditions || []).map((c) => ({ name: c.name, diagnosticCode: c.diagnosticCode })),
      );
      const enrichedContext = criteriaBlock
        ? `${contextBlock}\n\n${criteriaBlock}\nUse the rating criteria above to guide which observable behaviors and functional limitations the family member should describe. Do NOT cite specific rating percentages in the lay statement — focus on the observable symptoms and impacts that the criteria evaluate.`
        : contextBlock;

      const { temperature, timeout } = getModelConfig('family-statement');
      const result = await startStream({
        prompt: createFamilyStatementPrompt(relationship!, text, enrichedContext),
        systemInstruction: FAMILY_STATEMENT_SYSTEM,
        feature: 'family-statement',
        temperature,
        timeout,
      });
      // Scan AI output for banned phrases
      const scan = scanAIOutput(result);
      if (!scan.clean) setAiWarning(true);
      setStatement(result);
    } catch {
      setError('Failed to generate. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    if (!isNativeApp) {
      setError('Voice recording is only available on mobile');
      return;
    }
    impactMedium();
    setError('');
    try {
      await VoiceRecorder.requestAudioRecordingPermission();
      await VoiceRecorder.startRecording();
      setIsRecording(true);
    } catch {
      setError('Microphone access required');
    }
  };

  const stopAndGenerate = async () => {
    if (!isRecording) return;
    setIsRecording(false);
    setIsProcessing(true);
    impactMedium();

    try {
      const recording = await VoiceRecorder.stopRecording();
      if (!recording.value) { setIsProcessing(false); return; }
      if (!isGeminiConfigured) { setError('AI features are not configured.'); setIsProcessing(false); return; }

      const transcribed = await aiTranscribe({
        audioBase64: recording.value.recordDataBase64,
        mimeType: recording.value.mimeType || 'audio/wav',
        feature: 'family-statement',
      });
      setTranscript(transcribed);
      await generateFromText(transcribed);
    } catch {
      setError('Failed to process recording.');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    cancelStream();
    impactMedium();
    setRelationship(null);
    setTranscript('');
    setStatement('');
    setTextInput('');
    setUseText(false);
    setError('');
    setAiWarning(false);
  };

  return (
    <PageContainer className="space-y-4">
      <h1 className="text-xl font-bold mb-4">Family Impact Statement</h1>
      <AIDisclaimer variant="banner" />
      <DataConnectedBadge />
      <div className="flex items-start gap-2 p-3 rounded-xl bg-gold/5 border border-gold/10">
        <AlertTriangle className="h-4 w-4 text-gold mt-0.5 shrink-0" />
        <p className="text-[11px] text-muted-foreground">
          Family lay statements are powerful evidence. The VA values specific observations from people who witness the veteran's daily life. These are sample templates — must be personalized. Not legal advice.
        </p>
      </div>

      {/* Step 1: Select relationship */}
      {!relationship && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="text-center py-4 space-y-2">
            <div className="h-14 w-14 mx-auto rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
              <Heart className="h-7 w-7 text-gold" />
            </div>
            <h2 className="text-lg font-semibold">Who is writing this statement?</h2>
            <p className="text-sm text-muted-foreground">Select the relationship to the veteran</p>
          </div>
          <div className="space-y-2">
            {(Object.entries(RELATIONSHIP_LABELS) as [Relationship, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { impactMedium(); setRelationship(key); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent transition-colors text-left"
              >
                <Users className="h-5 w-5 text-gold shrink-0" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Step 2: Record or type */}
      {relationship && !statement && !isProcessing && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="text-center py-4 space-y-2">
            <h2 className="text-lg font-semibold">Describe what you've observed</h2>
            <p className="text-sm text-muted-foreground">
              As the veteran's {RELATIONSHIP_LABELS[relationship].toLowerCase()}, describe how their condition affects daily life. Include specific examples, changes you've noticed, and how it impacts your household.
            </p>
          </div>

          {!useText && !isRecording && (
            <div className="space-y-3">
              <Button onClick={startRecording} className="w-full bg-gold hover:bg-gold/80 text-black font-semibold h-14">
                <Mic className="h-5 w-5 mr-2" /> Record by Voice
              </Button>
              <button
                onClick={() => setUseText(true)}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                <PenTool className="h-3.5 w-3.5 inline mr-1.5" />
                Or type instead
              </button>
            </div>
          )}

          {isRecording && (
            <div className="text-center space-y-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="h-20 w-20 mx-auto rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center"
              >
                <Mic className="h-10 w-10 text-red-400" />
              </motion.div>
              <p className="text-sm font-medium text-red-400">Recording...</p>
              <p className="text-xs text-muted-foreground">Describe what you've observed. Take your time.</p>
              <Button onClick={stopAndGenerate} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                <MicOff className="h-4 w-4 mr-2" /> Stop & Generate
              </Button>
            </div>
          )}

          {useText && (
            <div className="space-y-3">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                maxLength={5000}
                placeholder={`As the veteran's ${RELATIONSHIP_LABELS[relationship].toLowerCase()}, describe what you've observed about their condition. Include specific examples, changes over time, and daily impacts...`}
                className="w-full h-40 p-3 rounded-xl border border-border bg-card text-sm resize-none focus:outline-hidden focus:border-gold/30"
              />
              <Button
                onClick={() => { impactMedium(); generateFromText(textInput); }}
                disabled={!textInput.trim()}
                className="w-full bg-gold hover:bg-gold/80 text-black font-semibold"
              >
                Generate Statement
              </Button>
            </div>
          )}

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        </motion.div>
      )}

      {isProcessing && (
        <div className="text-center py-12 space-y-3">
          <div className="h-16 w-16 mx-auto rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center animate-pulse">
            <Heart className="h-8 w-8 text-gold" />
          </div>
          <p className="text-sm text-muted-foreground">Generating family statement template...</p>
        </div>
      )}

      {/* Result */}
      {(statement || isStreaming) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{relationship ? RELATIONSHIP_LABELS[relationship] : 'Family'} Statement</span>
          </div>

          {transcript && (
            <details className="rounded-xl border border-border bg-card overflow-hidden">
              <summary className="p-3 text-sm font-medium cursor-pointer hover:bg-accent transition-colors">Voice transcript</summary>
              <p className="px-3 pb-3 text-sm text-muted-foreground italic border-t border-border pt-2">"{transcript}"</p>
            </details>
          )}

          {aiWarning && !isStreaming && (
            <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-xs text-red-400 flex gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{AI_OUTPUT_WARNING}</span>
            </div>
          )}

          <StreamingText
            text={isStreaming ? streamedText : statement}
            isStreaming={isStreaming}
            className="p-4 rounded-xl border border-border bg-card text-sm text-muted-foreground leading-relaxed"
          />

          {!isStreaming && statement && <AIConfidenceScore />}

          <div className="flex gap-2">
            {isStreaming ? (
              <Button
                onClick={() => { cancelStream(); setStatement(streamedText); }}
                variant="outline" className="flex-1 border-red-500/30 text-red-400"
              >
                <Square className="h-3.5 w-3.5 mr-2" /> Stop
              </Button>
            ) : (
              <>
                <Button
                  onClick={async () => {
                    try {
                      await Clipboard.write({ string: statement });
                      toast({ title: 'Statement copied' });
                    } catch {
                      toast({ title: 'Copy failed', description: 'Could not access clipboard.', variant: 'destructive' });
                    }
                  }}
                  variant="outline" className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
                <Button onClick={reset} className="flex-1 bg-gold hover:bg-gold/80 text-black font-semibold">
                  <RotateCcw className="h-4 w-4 mr-2" /> Start Over
                </Button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </PageContainer>
  );
}
