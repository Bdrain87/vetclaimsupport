import { useState, useCallback } from 'react';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { GoogleGenerativeAI } from '@google/generative-ai';

function getGeminiModel() {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
}

export type VoiceMode = 'claim-builder' | 'cp-simulator' | 'post-debrief' | 'family-statement' | 'transcribe-only';

const MODE_PROMPTS: Record<VoiceMode, string> = {
  'claim-builder': `You are a VA disability claim writing assistant. The veteran just spoke about their symptoms, experiences, or evidence. Based on their words, generate THREE structured sections in a military-respectful tone:

1. **Sample Impact Statement Paragraph** — How this condition affects daily life, work, and relationships. Use specific language the VA looks for.
2. **Sample Stressor/Nexus Paragraph** — Connect the condition to military service with specific language.
3. **Key Evidence Points** — Bullet list of evidence types they should gather based on what they described.

IMPORTANT: These are SAMPLE templates only. The veteran must personalize with their own facts and verify with a VSO or attorney. Not legal advice.`,

  'cp-simulator': `You are simulating a VA Compensation & Pension exam. You are the examiner. Based on the veteran's spoken answer, provide:

1. **Evaluation of Answer Strength** (Strong/Moderate/Weak) — Would this answer support their claim?
2. **What the Examiner Is Looking For** — Explain what the DBQ criteria actually measure for this response.
3. **Suggested Stronger Response** — A sample way to describe the same symptoms using VA-recognized terminology.

Remember: You are helping them PREPARE. Do not coach them to exaggerate. Help them accurately articulate their genuine symptoms in terms the VA recognizes.`,

  'post-debrief': `You are a VA claims advisor. The veteran just finished their C&P exam and is recording what happened. Based on their debrief:

1. **Key Points Noted** — Summarize what the examiner asked and what the veteran said.
2. **Potential Concerns** — Flag anything that might have been missed or could weaken the claim.
3. **Recommended Follow-Up** — Sample language for a follow-up statement if the exam didn't capture everything.
4. **Appeal Trigger Assessment** — Based on what happened, note if an appeal may be warranted and why.

This is general guidance only. Consult a VSO or attorney for specific legal advice.`,

  'family-statement': `You are helping a veteran's family member (spouse, child, or parent) write a statement supporting the veteran's VA disability claim. Based on what the family member just described, generate:

1. **Sample Lay Statement** — A structured witness statement describing how they've observed the veteran's condition affect daily life, using specific examples and timeframes.
2. **Key Observations to Include** — Bullet list of specific observable behaviors and impacts the VA values.
3. **Formatting Guidance** — How to structure this for VA submission.

IMPORTANT: This is a SAMPLE template. The family member must personalize with their own observations. Not legal advice.`,

  'transcribe-only': 'Transcribe this audio accurately, preserving the speaker\'s exact words.',
};

export interface VoicePipelineResult {
  transcript: string;
  analysis: string;
}

export function useVoicePipeline() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const perm = await VoiceRecorder.requestAudioRecordingPermission();
      if (!perm.value) {
        setError('Microphone permission denied');
        return;
      }
      await VoiceRecorder.startRecording();
      setIsRecording(true);
    } catch {
      setError('Failed to start recording');
    }
  }, []);

  const stopAndProcess = useCallback(async (mode: VoiceMode, context?: string): Promise<VoicePipelineResult | null> => {
    if (!isRecording) return null;
    setIsRecording(false);
    setIsProcessing(true);
    setError(null);

    try {
      const recording = await VoiceRecorder.stopRecording();
      if (!recording.value) {
        setError('No audio recorded');
        setIsProcessing(false);
        return null;
      }

      const model = getGeminiModel();
      const audioPart = {
        inlineData: {
          mimeType: recording.value.mimeType || 'audio/wav',
          data: recording.value.recordDataBase64,
        },
      };

      // Step 1: Transcribe
      const transResult = await model.generateContent([
        { text: 'Transcribe this audio accurately:' },
        audioPart,
      ]);
      const transcribed = transResult.response.text();
      setTranscript(transcribed);

      if (mode === 'transcribe-only') {
        setResult(transcribed);
        setIsProcessing(false);
        return { transcript: transcribed, analysis: transcribed };
      }

      // Step 2: Analyze with mode-specific prompt
      const contextLine = context ? `\n\nContext: ${context}` : '';
      const analysisResult = await model.generateContent(
        `${MODE_PROMPTS[mode]}${contextLine}\n\nVeteran's words: "${transcribed}"`
      );
      const analysis = analysisResult.response.text();
      setResult(analysis);
      setIsProcessing(false);
      return { transcript: transcribed, analysis };
    } catch {
      setError('Failed to process recording. Please try again.');
      setIsProcessing(false);
      return null;
    }
  }, [isRecording]);

  const cancelRecording = useCallback(async () => {
    if (isRecording) {
      try {
        await VoiceRecorder.stopRecording();
      } catch { /* ignore */ }
      setIsRecording(false);
    }
  }, [isRecording]);

  const reset = useCallback(() => {
    setTranscript('');
    setResult('');
    setError(null);
  }, []);

  return {
    isRecording,
    isProcessing,
    transcript,
    result,
    error,
    startRecording,
    stopAndProcess,
    cancelRecording,
    reset,
  };
}
