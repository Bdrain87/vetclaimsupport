import { useState } from 'react';
import { motion } from 'motion/react';
import { PageContainer } from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { Clipboard } from '@capacitor/clipboard';
import { toast } from '@/hooks/use-toast';
import { impactMedium } from '@/lib/haptics';
import { getGeminiModel, isGeminiConfigured } from '@/lib/gemini';
import { isNativeApp } from '@/lib/platform';
import { Mic, MicOff, Copy, RotateCcw, AlertTriangle, FileText, Shield } from 'lucide-react';

export default function PostExamDebrief() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [error, setError] = useState('');

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

      const model = getGeminiModel();
      const audioPart = {
        inlineData: {
          mimeType: recording.value.mimeType || 'audio/wav',
          data: recording.value.recordDataBase64,
        },
      };

      const transResult = await model.generateContent([
        { text: 'Transcribe this audio accurately:' },
        audioPart,
      ]);
      const transcribed = transResult.response.text();
      setTranscript(transcribed);

      const result = await model.generateContent(
        `You are a VA claims advisor. A veteran just finished their C&P exam and recorded this debrief about what happened:

"${transcribed}"

Provide a structured analysis:

## Key Points from Your Exam
[Summarize what the examiner asked and what the veteran described happening]

## Potential Concerns
[Flag anything that might have been missed, misunderstood, or could weaken the claim]

## Recommended Follow-Up Actions
[List specific actions — e.g., request copy of DBQ within 30 days, file supplemental statement if something was missed]

## Sample Follow-Up Statement
[If the veteran described something the examiner missed or didn't fully capture, draft a sample follow-up statement they could submit. Mark clearly as SAMPLE — must be personalized.]

## Appeal Assessment
[Based on what happened, note whether an appeal may be warranted and what type (HLR, Supplemental, Board)]

DISCLAIMER: This is general guidance only. Not legal advice. Consult a VSO or attorney for claim-specific advice.`
      );
      setAnalysis(result.response.text());
    } catch {
      setError('Failed to process. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    impactMedium();
    setTranscript('');
    setAnalysis('');
    setError('');
  };

  return (
    <PageContainer className="space-y-4 pb-8">
      <h1 className="text-xl font-bold mb-4">Post-Exam Debrief</h1>
      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
        <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
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

      {analysis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {transcript && (
            <details className="rounded-xl border border-border bg-card overflow-hidden">
              <summary className="p-3 text-sm font-medium cursor-pointer hover:bg-accent transition-colors">Your Recording (transcript)</summary>
              <p className="px-3 pb-3 text-sm text-muted-foreground italic border-t border-border pt-2">"{transcript}"</p>
            </details>
          )}

          <div className="p-4 rounded-xl border border-border bg-card text-sm whitespace-pre-wrap text-muted-foreground leading-relaxed">
            {analysis}
          </div>

          <div className="flex gap-2">
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
          </div>
        </motion.div>
      )}
    </PageContainer>
  );
}
