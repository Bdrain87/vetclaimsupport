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
import { useSentinel } from '@/hooks/useSentinel';
import { Mic, MicOff, Copy, Trash2, Sparkles } from 'lucide-react';

const SYSTEM_PROMPT = 'As a VA disability claim expert, provide helpful, accurate advice for veterans:';

function getGeminiModel() {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
}

const QUICK_PROMPTS: readonly { label: string; prompt: string | ((conditions: string) => string) }[] = [
  { label: 'Impact Statement', prompt: 'Generate a sample VA impact statement for [condition].' },
  { label: 'C&P Exam Tips', prompt: 'Provide tips for preparing for a C&P exam for [condition].' },
  { label: 'Rating Help', prompt: 'Explain VA rating percentages for [condition] and how to calculate combined ratings.' },
  { label: 'Optimize Rating', prompt: (c) => `Suggest rating optimizations and combined calculations for ${c}.` },
  { label: 'Buddy Statement', prompt: (c) => `Generate a sample buddy statement for ${c}.` },
  { label: 'Evidence Strength', prompt: (c) => `Evaluate evidence strength and suggest improvements for ${c}.` },
  { label: 'Stressor Statement', prompt: (c) => `Generate a sample stressor statement for ${c}.` },
  { label: 'Nexus Letter', prompt: (c) => `Generate a sample nexus letter outline for ${c}.` },
];

function ReadinessRing({ score, label }: { score: number; label: string }) {
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#C5A55A' : '#ef4444';

  return (
    <div className="flex items-center gap-3">
      <svg width="48" height="48" viewBox="0 0 48 48" className="flex-shrink-0">
        <circle cx="24" cy="24" r="18" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="3" />
        <circle
          cx="24" cy="24" r="18" fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 24 24)"
          className="transition-all duration-700"
        />
        <text x="24" y="26" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
          {score}
        </text>
      </svg>
      <div>
        <p className="text-xs text-white/60 uppercase tracking-widest">Readiness</p>
        <p className="text-sm font-semibold text-white">{label}</p>
      </div>
    </div>
  );
}

export function SentinelCore() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const conditions = useAppStore((state) => state.userConditions?.map(c => c.name).join(', ') || 'my conditions');
  const { score, label } = useSentinel();

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

  const quickPrompt = (prompt: string | ((c: string) => string)) => {
    const resolved = typeof prompt === 'function' ? prompt(conditions) : prompt;
    setQuery(resolved);
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-gold/90 to-amber-700/90 border border-gold/30 backdrop-blur-md shadow-[0_4px_24px_rgba(197,165,90,0.3)] flex items-center justify-center"
          aria-label="Open Sentinel AI"
        >
          <Sparkles className="h-6 w-6 text-white" />
        </motion.button>
      </DialogTrigger>
      <DialogContent asChild className="glass-card bg-slate-950/95 border-gold/10 backdrop-blur-xl rounded-2xl max-h-[85dvh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 50 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-semibold tracking-wide">Sentinel AI</DialogTitle>
          </DialogHeader>

          {/* Readiness Score */}
          <div className="mt-2 mb-4 p-3 rounded-xl border border-gold/10 bg-gold/5">
            <ReadinessRing score={score} label={label} />
          </div>

          <div className="space-y-3">
            {/* Input + voice */}
            <div className="relative">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !loading) { impactMedium(); handleAsk(); } }}
                placeholder="Ask about VA claims, symptoms, etc."
                className="bg-slate-800/50 text-white border-white/10 pr-12"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-white/60 hover:text-white"
                onClick={toggleVoice}
                aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
              >
                {isRecording ? <MicOff className="h-4 w-4 text-red-400" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>

            {/* Quick prompts */}
            <div className="grid grid-cols-2 gap-2">
              {QUICK_PROMPTS.map(({ label, prompt }) => (
                <Button
                  key={label}
                  onClick={() => quickPrompt(prompt)}
                  variant="secondary"
                  className="bg-slate-800/50 text-white/80 text-xs h-auto py-2 px-3 hover:bg-slate-700/50"
                >
                  {label}
                </Button>
              ))}
            </div>

            {/* Submit */}
            <Button
              onClick={() => { impactMedium(); handleAsk(); }}
              disabled={loading || !query}
              className="w-full bg-gold hover:bg-gold/80 text-black font-semibold"
            >
              {loading ? 'Asking...' : 'Ask Sentinel'}
            </Button>

            {/* Response */}
            {response && (
              <div className="space-y-2">
                <div className="text-white/90 text-sm p-4 bg-slate-800/40 rounded-xl border border-white/5 whitespace-pre-wrap">
                  {response}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={async () => {
                      impactMedium();
                      await Clipboard.write({ string: response });
                      toast({ title: 'Copied to clipboard' });
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-white/10 text-white/70"
                  >
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                    Copy
                  </Button>
                  <Button
                    onClick={() => { impactMedium(); setQuery(''); setResponse(''); }}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-white/10 text-white/70"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </div>

          <p className="mt-4 text-[10px] text-white/40 text-center italic leading-relaxed">
            AI outputs are samples based on general knowledge. Verify with VA resources, personalize with your facts, and consult a VSO or attorney. Not legal advice.
          </p>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
