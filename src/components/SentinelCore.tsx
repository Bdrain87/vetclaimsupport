import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Clipboard } from '@capacitor/clipboard';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { toast } from '@/hooks/use-toast';
import { impactMedium } from '@/lib/haptics';
import { getGeminiModel, isGeminiConfigured } from '@/lib/gemini';
import { isNativeApp } from '@/lib/platform';
import useAppStore from '@/store/useAppStore';
import { useSentinel } from '@/hooks/useSentinel';
import { Mic, MicOff, Copy, Trash2, Sparkles, FileText, Shield, Heart, Scan } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SYSTEM_PROMPT = `You are Intel, an AI assistant for VA disability claim preparation. You help veterans understand the claims process and generate SAMPLE statement templates. Important rules:
- All outputs are sample templates that must be personalized
- Never provide legal advice — always recommend consulting a VSO or attorney
- Use military-respectful language and VA-recognized terminology
- Focus on helping veterans accurately describe their genuine experiences`;

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
        <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="3" />
        <circle
          cx="24" cy="24" r="18" fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 24 24)"
          className="transition-all duration-700"
        />
        <text x="24" y="26" textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="bold">
          {score}
        </text>
      </svg>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Readiness</p>
        <p className="text-sm font-semibold text-foreground">{label}</p>
      </div>
    </div>
  );
}

type IntelMode = 'ask' | 'voice-build';

export function SentinelCore() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mode, setMode] = useState<IntelMode>('ask');
  const conditions = useAppStore((state) => state.userConditions?.map(c => c.displayName || c.conditionId).join(', ') || 'my conditions');
  const { score, label } = useSentinel();
  const navigate = useNavigate();

  const askGemini = async (text: string) => {
    if (!isGeminiConfigured) {
      setResponse('AI features are not configured. Please contact support.');
      return;
    }
    setLoading(true);
    setResponse('');
    try {
      const model = getGeminiModel();
      const result = await model.generateContent(`${SYSTEM_PROMPT}\n\n${text}`);
      setResponse(result.response.text());
    } catch {
      setResponse('Something went wrong. Please check your connection and try again.');
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
    if (!isNativeApp) {
      toast({ title: 'Voice recording is only available on mobile' });
      return;
    }
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
          className="fixed right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-gold/90 to-amber-700/90 border border-gold/30 backdrop-blur-md shadow-[0_4px_24px_rgba(197,165,90,0.3)] flex items-center justify-center"
          style={{ bottom: 'calc(9rem + env(safe-area-inset-bottom, 0px))' }}
          aria-label="Open Intel AI"
        >
          <Sparkles className="h-6 w-6 text-white" />
        </motion.button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border rounded-2xl max-h-[85dvh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-foreground text-lg font-semibold tracking-wide">Intel</DialogTitle>
          </DialogHeader>

          {/* Readiness Score */}
          <div className="mt-2 mb-4 p-3 rounded-xl border border-gold/10 bg-gold/5">
            <ReadinessRing score={score} label={label} />
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-1 p-1 rounded-lg bg-secondary mb-3" role="tablist" aria-label="Intel mode">
            <button
              role="tab"
              aria-selected={mode === 'ask'}
              onClick={() => { setMode('ask'); impactMedium(); }}
              className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${mode === 'ask' ? 'bg-gold/20 text-gold font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Ask Anything
            </button>
            <button
              role="tab"
              aria-selected={mode === 'voice-build'}
              onClick={() => { setMode('voice-build'); impactMedium(); }}
              className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${mode === 'voice-build' ? 'bg-gold/20 text-gold font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Voice Claim Builder
            </button>
          </div>

          <div className="space-y-3">
            {mode === 'voice-build' ? (
              /* Voice Claim Builder Mode */
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground text-center">
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
                  <div className="text-xs text-muted-foreground p-2 rounded-lg bg-secondary/50 italic">
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
                    className="bg-secondary text-foreground border-border pr-12"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
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
                      className="bg-secondary text-foreground/80 text-xs h-auto py-2 px-3 hover:bg-accent justify-start gap-1.5"
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
                  {loading ? 'Asking...' : 'Ask Intel'}
                </Button>
              </>
            )}

            {/* Response */}
            {response && (
              <div className="space-y-2">
                <div className="text-foreground text-sm p-4 bg-secondary rounded-xl border border-border whitespace-pre-wrap">
                  {response}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={async () => {
                      impactMedium();
                      try {
                        await Clipboard.write({ string: response });
                        toast({ title: 'Copied to clipboard' });
                      } catch {
                        toast({ title: 'Copy failed', description: 'Could not access clipboard.', variant: 'destructive' });
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-border text-muted-foreground"
                  >
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                    Copy
                  </Button>
                  <Button
                    onClick={() => { impactMedium(); setQuery(''); setResponse(''); }}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-border text-muted-foreground"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Clear
                  </Button>
                </div>
              </div>
            )}

            {/* Tool Links */}
            <div className="pt-2 border-t border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">AI Tools</p>
              <div className="grid grid-cols-2 gap-1.5">
                {TOOL_LINKS.map(({ label, route }) => (
                  <button
                    key={route}
                    onClick={() => { impactMedium(); navigate(route); }}
                    className="text-[11px] text-muted-foreground hover:text-gold py-1.5 px-2 rounded-lg hover:bg-accent transition-colors text-left"
                  >
                    {label} →
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-3 text-[10px] text-muted-foreground text-center italic leading-relaxed">
            AI outputs are samples based on general knowledge. Verify with VA resources, personalize with your facts, and consult a VSO or attorney. Not legal advice.
          </p>
      </DialogContent>
    </Dialog>
  );
}
