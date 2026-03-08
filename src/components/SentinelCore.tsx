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
import { Mic, MicOff, Copy, Trash2, Sparkles, FileText, Shield, Heart, Scan } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SYSTEM_PROMPT = `You are Sentinel, a VA disability claim preparation assistant. You help veterans understand the claims process and generate SAMPLE statement templates. Important rules:
- All outputs are sample templates that must be personalized
- Never provide legal advice — always recommend consulting a VSO or attorney
- Use military-respectful language and VA-recognized terminology
- Focus on helping veterans accurately describe their genuine experiences`;

function getGeminiModel() {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
}

const QUICK_PROMPTS: readonly { label: string; icon: React.ElementType; prompt: string | ((conditions: string) => string) }[] = [
  { label: 'Impact Statement', icon: FileText, prompt: (c) => `Generate a sample VA impact statement for ${c}. Include how the condition affects daily life, work, and relationships using VA-recognized language.` },
  { label: 'C&P Exam Tips', icon: Shield, prompt: (c) => `Provide detailed tips for preparing for a C&P exam for ${c}. Include what the examiner looks for, what to bring, and how to describe symptoms accurately.` },
  { label: 'Buddy Statement', icon: Heart, prompt: (c) => `Generate a sample buddy/lay statement template for ${c}. Include specific observable behaviors and impacts a witness would notice.` },
  { label: 'Nexus Letter', icon: FileText, prompt: (c) => `Generate a sample nexus letter outline for ${c}. Include the medical opinion structure, "at least as likely as not" language, and what a doctor should address.` },
  { label: 'Evidence Gaps', icon: Scan, prompt: (c) => `Analyze what evidence types are most important for ${c} and suggest what might be missing. Include medical records, lay statements, and service records needed.` },
  { label: 'Stressor Statement', icon: FileText, prompt: (c) => `Generate a sample stressor statement for ${c}. Include specific details about the in-service event, timeframe, and ongoing impact.` },
];

const VOICE_BUILD_PROMPT = `You are a VA disability claim writing assistant. The veteran just spoke about their symptoms, experiences, or evidence. Based on their words, generate THREE structured sections in a military-respectful tone:

**Sample Impact Statement Paragraph** — How this condition affects daily life, work, and relationships. Use specific VA-recognized language.

**Sample Nexus/Service Connection Paragraph** — Connect the described condition to military service with specific language patterns the VA looks for.

**Key Evidence Checklist** — Bullet list of evidence types they should gather based on what they described.

IMPORTANT: These are SAMPLE templates only. The veteran must personalize with their own facts and verify with a VSO or attorney. Not legal advice.`;

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

type SentinelMode = 'ask' | 'voice-build';

export function SentinelCore() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mode, setMode] = useState<SentinelMode>('ask');
  const conditions = useAppStore((state) => state.userConditions?.map(c => c.displayName || c.conditionId).join(', ') || 'my conditions');
  const { score, label } = useSentinel();
  const navigate = useNavigate();

  const askGemini = async (text: string) => {
    setLoading(true);
    setResponse('');
    try {
      const model = getGeminiModel();
      const result = await model.generateContent(`${SYSTEM_PROMPT}\n\n${text}`);
      setResponse(result.response.text());
    } catch {
      setResponse('Error: Could not get response. Check your connection or API key.');
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
            mimeType: recording.value.mimeType || 'audio/wav',
            data: recording.value.recordDataBase64,
          },
        };
        const transResult = await model.generateContent([
          { text: 'Transcribe this audio accurately:' },
          audioPart,
        ]);
        const transcribed = transResult.response.text();
        setQuery(transcribed);

        // If in voice-build mode, auto-generate structured content
        const prompt = mode === 'voice-build'
          ? `${VOICE_BUILD_PROMPT}\n\nVeteran's words: "${transcribed}"`
          : `${SYSTEM_PROMPT}\n\n${transcribed}`;
        const result = await model.generateContent(prompt);
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

  const TOOL_LINKS = [
    { label: 'C&P Simulator', route: '/prep/exam-simulator' },
    { label: 'Post-Exam Debrief', route: '/prep/post-debrief' },
    { label: 'Family Statement', route: '/prep/family-statement' },
    { label: 'Evidence Scanner', route: '/prep/evidence-scanner' },
  ];

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

          {/* Mode Toggle */}
          <div className="flex gap-1 p-1 rounded-lg bg-slate-800/50 mb-3">
            <button
              onClick={() => { setMode('ask'); impactMedium(); }}
              className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${mode === 'ask' ? 'bg-gold/20 text-gold font-semibold' : 'text-white/50 hover:text-white/70'}`}
            >
              Ask Anything
            </button>
            <button
              onClick={() => { setMode('voice-build'); impactMedium(); }}
              className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${mode === 'voice-build' ? 'bg-gold/20 text-gold font-semibold' : 'text-white/50 hover:text-white/70'}`}
            >
              Voice Claim Builder
            </button>
          </div>

          <div className="space-y-3">
            {mode === 'voice-build' ? (
              /* Voice Claim Builder Mode */
              <div className="space-y-3">
                <p className="text-xs text-white/50 text-center">
                  Speak about your symptoms or experience → get instant impact statement, nexus paragraph, and evidence checklist
                </p>
                <Button
                  onClick={toggleVoice}
                  className={`w-full h-16 font-semibold ${isRecording ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30' : 'bg-gold hover:bg-gold/80 text-black'}`}
                >
                  {isRecording ? (
                    <><MicOff className="h-5 w-5 mr-2" /> Stop & Generate</>
                  ) : loading ? (
                    'Processing...'
                  ) : (
                    <><Mic className="h-5 w-5 mr-2" /> Speak Your Symptoms</>
                  )}
                </Button>
                {query && !loading && (
                  <div className="text-xs text-white/40 p-2 rounded-lg bg-slate-800/30 italic">
                    "{query}"
                  </div>
                )}
              </div>
            ) : (
              /* Ask Anything Mode */
              <>
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
                  {QUICK_PROMPTS.map(({ label, icon: Icon, prompt }) => (
                    <Button
                      key={label}
                      onClick={() => quickPrompt(prompt)}
                      variant="secondary"
                      className="bg-slate-800/50 text-white/80 text-xs h-auto py-2 px-3 hover:bg-slate-700/50 justify-start gap-1.5"
                    >
                      <Icon className="h-3 w-3 flex-shrink-0 text-gold/60" />
                      {label}
                    </Button>
                  ))}
                </div>

                <Button
                  onClick={() => { impactMedium(); handleAsk(); }}
                  disabled={loading || !query}
                  className="w-full bg-gold hover:bg-gold/80 text-black font-semibold"
                >
                  {loading ? 'Asking...' : 'Ask Sentinel'}
                </Button>
              </>
            )}

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

            {/* Tool Links */}
            <div className="pt-2 border-t border-white/5">
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Voice Tools</p>
              <div className="grid grid-cols-2 gap-1.5">
                {TOOL_LINKS.map(({ label, route }) => (
                  <button
                    key={route}
                    onClick={() => { impactMedium(); navigate(route); }}
                    className="text-[11px] text-white/50 hover:text-gold py-1.5 px-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                  >
                    {label} →
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-3 text-[10px] text-white/40 text-center italic leading-relaxed">
            AI outputs are samples based on general knowledge. Verify with VA resources, personalize with your facts, and consult a VSO or attorney. Not legal advice.
          </p>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
