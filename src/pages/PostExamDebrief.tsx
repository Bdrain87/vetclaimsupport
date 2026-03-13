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
import { isNativeApp } from '@/lib/platform';
import { createPostDebriefPromptV2, AI_ANTI_HALLUCINATION } from '@/lib/ai-prompts';
import { scanAIOutput, AI_OUTPUT_WARNING } from '@/utils/aiOutputGuard';
import { buildVeteranContext } from '@/utils/veteranContext';
import { formatContextForAI } from '@/utils/formatContextForAI';
import { useUserConditions } from '@/hooks/useUserConditions';
import { getModelConfig } from '@/lib/ai-models';
import { StreamingText } from '@/components/ui/StreamingText';
import { Mic, MicOff, Copy, RotateCcw, AlertTriangle, FileText, Shield, Square } from 'lucide-react';
import { AIDisclaimer } from '@/components/ui/AIDisclaimer';
import { DataConnectedBadge } from '@/components/shared/DataConnectedBadge';
import { AIConfidenceScore } from '@/components/shared/AIConfidenceScore';
import { WhatNextCard } from '@/components/shared/WhatNextCard';
import { getNextAction } from '@/utils/whatNext';

export default function PostExamDebrief() {
  const { conditions } = useUserConditions();
  const [selectedCondition, setSelectedCondition] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [error, setError] = useState('');
  const [showWhatNext, setShowWhatNext] = useState(false);
  const [aiWarning, setAiWarning] = useState(false);
  const { streamedText, isStreaming, startStream, cancel: cancelStream } = useAIStream();

  const startRecording = async () => {
    if (!isNativeApp) {
      setError('Voice recording is only available on mobile');
      return;
    }
    if (!isGeminiConfigured) {
      setError('AI features are not configured');
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

  const stopAndAnalyze = async () => {
    if (!isRecording) return;
    setIsRecording(false);
    setIsProcessing(true);
    impactMedium();

    try {
      const recording = await VoiceRecorder.stopRecording();
      if (!recording.value) { setIsProcessing(false); return; }

      const transcribed = await aiTranscribe({
        audioBase64: recording.value.recordDataBase64,
        mimeType: recording.value.mimeType || 'audio/wav',
        feature: 'post-exam-debrief',
      });
      setTranscript(transcribed);

      setError('');
      const ctx = buildVeteranContext({ maskPII: true });
      const contextBlock = formatContextForAI(ctx, 'standard');
      const { model, temperature, timeout } = getModelConfig('post-exam-debrief');
      const result = await startStream({
        prompt: createPostDebriefPromptV2(transcribed, contextBlock, selectedCondition || undefined),
        systemInstruction: `You are a VA claims advisor helping veterans review their C&P exam experience. Provide actionable guidance. Not legal advice.${AI_ANTI_HALLUCINATION}`,
        feature: 'post-exam-debrief',
        model,
        temperature,
        timeout,
      });
      const scan = scanAIOutput(result);
      if (!scan.clean) setAiWarning(true);
      setAnalysis(result);
      setShowWhatNext(true);
    } catch {
      setError('Failed to process. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    cancelStream();
    impactMedium();
    setTranscript('');
    setAnalysis('');
    setError('');
    setAiWarning(false);
    setShowWhatNext(false);
  };

  return (
    <PageContainer className="space-y-4">
      <h1 className="text-xl font-bold mb-4">Post-Exam Debrief</h1>
      <AIDisclaimer variant="banner" />
      <DataConnectedBadge />
      <div className="flex items-start gap-2 p-3 rounded-xl bg-gold/5 border border-gold/10">
        <AlertTriangle className="h-4 w-4 text-gold mt-0.5 shrink-0" />
        <p className="text-[11px] text-muted-foreground">
          Record your C&P exam experience immediately while it's fresh. This helps identify if anything was missed and whether follow-up action is needed. Not legal advice.
        </p>
      </div>

      {!analysis && !isProcessing && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="text-center py-6 space-y-3">
            <div className="h-16 w-16 mx-auto rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
              <FileText className="h-8 w-8 text-gold" />
            </div>
            <h2 className="text-lg font-semibold">Debrief Your C&P Exam</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Tell us what happened — what did the examiner ask? What did you say? Was anything missed? Speak naturally and include as much detail as you remember.
            </p>
          </div>

          {/* Condition selector for criteria-specific analysis */}
          {conditions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Which condition was this exam for? (optional)</p>
              <div className="flex flex-wrap gap-2">
                {conditions.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCondition(
                      selectedCondition === (c.displayName || c.conditionId) ? '' : (c.displayName || c.conditionId)
                    )}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      selectedCondition === (c.displayName || c.conditionId)
                        ? 'bg-gold/10 border-gold/30 text-gold'
                        : 'border-border text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {c.displayName || c.conditionId}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isRecording ? (
            <Button onClick={startRecording} className="w-full bg-gold hover:bg-gold/80 text-black font-semibold h-14">
              <Mic className="h-5 w-5 mr-2" /> Start Recording Debrief
            </Button>
          ) : (
            <div className="text-center space-y-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="h-20 w-20 mx-auto rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center"
              >
                <Mic className="h-10 w-10 text-red-400" />
              </motion.div>
              <p className="text-sm font-medium text-red-400">Recording your debrief...</p>
              <p className="text-xs text-muted-foreground">Take your time. Include everything you remember.</p>
              <Button onClick={stopAndAnalyze} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                <MicOff className="h-4 w-4 mr-2" /> Stop & Analyze
              </Button>
            </div>
          )}

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        </motion.div>
      )}

      {isProcessing && (
        <div className="text-center py-12 space-y-3">
          <div className="h-16 w-16 mx-auto rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center animate-pulse">
            <Shield className="h-8 w-8 text-gold" />
          </div>
          <p className="text-sm text-muted-foreground">Analyzing your exam experience...</p>
        </div>
      )}

      {(analysis || isStreaming) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {transcript && (
            <details className="rounded-xl border border-border bg-card overflow-hidden">
              <summary className="p-3 text-sm font-medium cursor-pointer hover:bg-accent transition-colors">Your Recording (transcript)</summary>
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
            text={isStreaming ? streamedText : analysis}
            isStreaming={isStreaming}
            className="p-4 rounded-xl border border-border bg-card text-sm text-muted-foreground leading-relaxed"
          />

          {!isStreaming && analysis && <AIConfidenceScore />}

          <div className="flex gap-2">
            {isStreaming ? (
              <Button
                onClick={() => { cancelStream(); setAnalysis(streamedText); }}
                variant="outline" className="flex-1 border-red-500/30 text-red-400"
              >
                <Square className="h-3.5 w-3.5 mr-2" /> Stop
              </Button>
            ) : (
              <>
                <Button
                  onClick={async () => {
                    try {
                      await Clipboard.write({ string: analysis });
                      toast({ title: 'Debrief analysis copied' });
                    } catch {
                      toast({ title: 'Copy failed', description: 'Could not access clipboard.', variant: 'destructive' });
                    }
                  }}
                  variant="outline" className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
                <Button onClick={reset} className="flex-1 bg-gold hover:bg-gold/80 text-black font-semibold">
                  <RotateCcw className="h-4 w-4 mr-2" /> New Debrief
                </Button>
              </>
            )}
          </div>

          {showWhatNext && !isStreaming && (
            <WhatNextCard actions={getNextAction('complete-exam-debrief')} className="mt-2" />
          )}
        </motion.div>
      )}
    </PageContainer>
  );
}
