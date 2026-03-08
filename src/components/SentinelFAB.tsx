import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Clipboard } from '@capacitor/clipboard';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { toast } from '@/hooks/use-toast';
import { impactMedium } from '@/lib/haptics';
import useAppStore from '@/store/useAppStore';

const SYSTEM_PROMPT = 'As a VA disability claim expert, provide helpful, accurate advice for veterans:';

function getGeminiModel() {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
}

const QUICK_PROMPTS = [
  { label: 'Impact Statement', prompt: 'Generate a sample VA impact statement for [condition].' },
  { label: 'C&P Exam Tips', prompt: 'Provide tips for preparing for a C&P exam for [condition].' },
  { label: 'Rating Help', prompt: 'Explain VA rating percentages for [condition] and how to calculate combined ratings.' },
] as const;

function getPersonalizedPrompts(conditions: string) {
  return [
    { label: 'Optimize Rating', prompt: `Suggest rating optimizations and combined calculations for ${conditions}.` },
    { label: 'Buddy Statement Help', prompt: `Generate a sample buddy statement for ${conditions}.` },
    { label: 'Evidence Strength Check', prompt: `Evaluate evidence strength and suggest improvements for ${conditions}.` },
    { label: 'Stressor Statement Help', prompt: `Generate a sample stressor statement for ${conditions}.` },
    { label: 'Nexus Letter Outline', prompt: `Generate a sample nexus letter outline for ${conditions}.` },
    { label: 'Optimize Strategy', prompt: `Suggest claim strategy optimizations for ${conditions}.` },
  ] as const;
}

export function SentinelFAB() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const conditions = useAppStore((state) => state.userConditions?.map(c => c.name).join(', ') || 'my conditions');

  const askGemini = async (text: string) => {
    setLoading(true);
    setResponse('');
    try {
      const model = getGeminiModel();
      const result = await model.generateContent(`${SYSTEM_PROMPT} ${text}`);
      setResponse(result.response.text());
    } catch {
      setResponse('Error: Could not get response from Gemini. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = () => {
    if (!query) return;
    askGemini(query);
  };

  const quickPrompt = (prompt: string) => {
    setQuery(prompt);
    impactMedium();
  };

  const toggleVoice = async () => {
    impactMedium();
    if (isRecording) {
      setIsRecording(false);
      const recording = await VoiceRecorder.stopRecording();
      if (!recording.value) return;

      setLoading(true);
      try {
        const model = getGeminiModel();
        const audioPart = {
          inlineData: {
            mimeType: 'audio/wav' as const,
            data: recording.value,
          },
        };
        const transResult = await model.generateContent([
          { text: 'Transcribe this audio accurately:' },
          audioPart,
        ]);
        const transcribed = transResult.response.text();
        setQuery(transcribed);
        // Auto-submit after transcription
        const result = await model.generateContent(`${SYSTEM_PROMPT} ${transcribed}`);
        setResponse(result.response.text());
      } catch {
        setQuery('Transcription error: Try again.');
      } finally {
        setLoading(false);
      }
    } else {
      await VoiceRecorder.requestAudioRecordingPermission();
      await VoiceRecorder.startRecording();
      setIsRecording(true);
    }
  };

  const personalizedPrompts = getPersonalizedPrompts(conditions);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="fixed bottom-20 right-4 z-50"
        >
          <Button
            variant="outline"
            className="rounded-full p-4 bg-indigo-950/80 border-white/20 backdrop-blur-md shadow-lg"
          >
            <span className="text-white font-bold tracking-wide">Sentinel AI</span>
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent asChild className="glass-card bg-slate-950/90 border-white/10 backdrop-blur-xl rounded-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 50 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-semibold">Ask Sentinel AI (Gemini Flash)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about VA claims, symptoms, etc."
                className="bg-slate-800/50 text-white border-white/20 pr-12"
              />
              <Button
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60"
                onClick={toggleVoice}
              >
                {isRecording ? '🛑' : '🎤'}
              </Button>
            </div>
            {QUICK_PROMPTS.map(({ label, prompt }) => (
              <Button key={label} onClick={() => quickPrompt(prompt)} variant="secondary" className="w-full bg-slate-800/50 text-white/90">
                Quick: {label}
              </Button>
            ))}
            {personalizedPrompts.map(({ label, prompt }) => (
              <Button key={label} onClick={() => quickPrompt(prompt)} variant="secondary" className="w-full bg-slate-800/50 text-white/90">
                Quick: {label}
              </Button>
            ))}
            <Button onClick={() => { impactMedium(); handleAsk(); }} disabled={loading} className="w-full bg-amber-600 hover:bg-amber-500">
              {loading ? 'Asking...' : 'Ask Gemini'}
            </Button>
            {response && (
              <>
                <p className="text-white/90 p-4 bg-slate-800/50 rounded-lg">{response}</p>
                <Button
                  onClick={async () => {
                    impactMedium();
                    await Clipboard.write({ string: response });
                    toast({ title: 'Copied to clipboard' });
                  }}
                  variant="outline"
                  className="w-full border-white/20 text-white/80"
                >
                  Copy Response
                </Button>
                <Button onClick={() => { impactMedium(); setQuery(''); setResponse(''); }} variant="outline" className="w-full border-white/20 text-white/80">
                  Clear
                </Button>
              </>
            )}
          </div>
          <p className="mt-6 text-xs text-white/50 text-center italic">
            AI outputs are samples based on general knowledge. Verify with VA resources, personalize with your facts, and consult a VSO or attorney. Not legal advice.
          </p>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
