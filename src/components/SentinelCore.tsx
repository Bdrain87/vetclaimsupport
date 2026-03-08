import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Clipboard } from '@capacitor/clipboard';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { toast } from '@/hooks/use-toast';
import { impactMedium } from '@/lib/haptics';
import { aiTranscribe, createChat, isGeminiConfigured, type Chat } from '@/lib/gemini';
import { redactPII } from '@/lib/redaction';
import { logAISend } from '@/services/aiAuditLog';
import { isNativeApp } from '@/lib/platform';
import useAppStore from '@/store/useAppStore';
import { useSentinel } from '@/hooks/useSentinel';
import { StreamingText } from './ui/StreamingText';
import { SENTINEL_SYSTEM_PROMPT, SENTINEL_VOICE_BUILD_PROMPT } from '@/lib/ai-prompts';
import { buildVeteranContext } from '@/utils/veteranContext';
import { formatContextForAI } from '@/utils/formatContextForAI';
import { Mic, MicOff, Copy, Trash2, Sparkles, FileText, Shield, Heart, Scan, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QUICK_PROMPTS: readonly { label: string; icon: React.ElementType; prompt: string | ((conditions: string) => string) }[] = [
  { label: 'Impact Statement', icon: FileText, prompt: (c) => `Generate a sample VA impact statement for ${c}. Include how the condition affects daily life, work, and relationships using VA-recognized language.` },
  { label: 'C&P Exam Tips', icon: Shield, prompt: (c) => `Provide detailed tips for preparing for a C&P exam for ${c}. Include what the examiner looks for, what to bring, and how to describe symptoms accurately.` },
  { label: 'Buddy Statement', icon: Heart, prompt: (c) => `Generate a sample buddy/lay statement template for ${c}. Include specific observable behaviors and impacts a witness would notice.` },
  { label: 'Nexus Letter', icon: FileText, prompt: (c) => `Generate a sample nexus letter outline for ${c}. Include the medical opinion structure, "at least as likely as not" language, and what a doctor should address.` },
  { label: 'Evidence Gaps', icon: Scan, prompt: (c) => `Analyze what evidence types are most important for ${c} and suggest what might be missing. Include medical records, lay statements, and service records needed.` },
  { label: 'Stressor Statement', icon: FileText, prompt: (c) => `Generate a sample stressor statement for ${c}. Include specific details about the in-service event, timeframe, and ongoing impact.` },
];

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

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

type IntelMode = 'ask' | 'voice-build';

export function SentinelCore() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamedText, setStreamedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mode, setMode] = useState<IntelMode>('ask');
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conditions = useAppStore((state) => state.userConditions?.map(c => c.displayName || c.conditionId).join(', ') || 'my conditions');
  const conditionCount = useAppStore((state) => (state.userConditions || []).length);
  const prevConditionCountRef = useRef(conditionCount);
  const { score, label } = useSentinel();
  const navigate = useNavigate();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamedText]);

  // Recreate chat when conditions change so it picks up new context
  useEffect(() => {
    if (prevConditionCountRef.current !== conditionCount) {
      prevConditionCountRef.current = conditionCount;
      chatRef.current = null;
    }
  }, [conditionCount]);

  const getOrCreateChat = useCallback((systemPrompt: string): Chat => {
    if (!chatRef.current) {
      const ctx = buildVeteranContext({ maskPII: true });
      const contextBlock = formatContextForAI(ctx, 'detailed');
      chatRef.current = createChat({
        systemInstruction: `${systemPrompt}\n\n${contextBlock}`,
        feature: 'sentinel-core',
      });
    }
    return chatRef.current;
  }, []);

  const sendMessage = async (text: string, systemPrompt: string) => {
    if (!isGeminiConfigured) {
      setMessages(prev => [...prev, { role: 'model', text: 'AI features are not configured. Please contact support.' }]);
      return;
    }

    // PII redact + audit log
    const { redactedText, redactionCount } = redactPII(text, 'high');
    logAISend({ feature: 'sentinel-core', redactionMode: 'high', redactionCount, textLengthSent: redactedText.length });

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text }]);
    setQuery('');
    setLoading(true);
    setStreamedText('');
    setIsStreaming(true);

    try {
      const chat = getOrCreateChat(systemPrompt);
      const stream = await chat.sendMessageStream({ message: redactedText });

      let fullText = '';
      for await (const chunk of stream) {
        const t = chunk.text;
        if (t) {
          fullText += t;
          setStreamedText(fullText);
        }
      }

      setMessages(prev => [...prev, { role: 'model', text: fullText }]);
    } catch {
      setMessages(prev => [...prev, { role: 'model', text: 'Something went wrong. Please check your connection and try again.' }]);
    } finally {
      setLoading(false);
      setIsStreaming(false);
      setStreamedText('');
    }
  };

  const handleAsk = () => {
    if (!query) return;
    impactMedium();
    sendMessage(query, SENTINEL_SYSTEM_PROMPT);
  };

  const quickPrompt = (prompt: string | ((c: string) => string)) => {
    const resolved = typeof prompt === 'function' ? prompt(conditions) : prompt;
    impactMedium();
    sendMessage(resolved, SENTINEL_SYSTEM_PROMPT);
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

      try {
        const transcribed = await aiTranscribe({
          audioBase64: recording.value.recordDataBase64,
          mimeType: recording.value.mimeType || 'audio/wav',
          feature: 'sentinel-core-voice',
        });

        const systemPrompt = mode === 'voice-build'
          ? SENTINEL_VOICE_BUILD_PROMPT
          : SENTINEL_SYSTEM_PROMPT;
        const prompt = mode === 'voice-build'
          ? `Veteran's words: "${transcribed}"`
          : transcribed;

        // For voice-build, create a fresh chat with the build prompt
        if (mode === 'voice-build') {
          chatRef.current = null;
        }

        await sendMessage(prompt, systemPrompt);
      } catch {
        toast({ title: 'Transcription error. Try again.', variant: 'destructive' });
      }
    } else {
      await VoiceRecorder.requestAudioRecordingPermission();
      await VoiceRecorder.startRecording();
      setIsRecording(true);
    }
  };

  const clearChat = () => {
    impactMedium();
    setMessages([]);
    setQuery('');
    setStreamedText('');
    chatRef.current = null;
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
          className="fixed right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-gold/90 to-gold/70 border border-gold/30 backdrop-blur-md shadow-[0_4px_24px_rgba(197,165,90,0.3)] flex items-center justify-center"
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
              </div>
            ) : (
              /* Ask Anything Mode */
              <>
                {/* Quick prompts — only show when no conversation yet */}
                {messages.length === 0 && (
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
                )}

                <div className="relative">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !loading) handleAsk(); }}
                    placeholder={messages.length > 0 ? 'Follow up...' : 'Ask about VA claims, symptoms, etc.'}
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

                <Button
                  onClick={handleAsk}
                  disabled={loading || !query}
                  className="w-full bg-gold hover:bg-gold/80 text-black font-semibold"
                >
                  {loading ? 'Thinking...' : 'Ask Intel'}
                </Button>
              </>
            )}

            {/* Conversation Messages */}
            {messages.length > 0 && (
              <div className="space-y-2 max-h-[40vh] overflow-y-auto rounded-xl border border-border p-3 bg-secondary/30">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-gold/20 text-foreground'
                          : 'bg-card border border-border text-muted-foreground'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {/* Streaming response */}
                {isStreaming && (
                  <div className="flex justify-start">
                    <StreamingText
                      text={streamedText}
                      isStreaming={true}
                      className="max-w-[85%] rounded-xl px-3 py-2 text-sm bg-card border border-border text-muted-foreground"
                    />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Action buttons */}
            {messages.length > 0 && !isStreaming && (
              <div className="flex gap-2">
                <Button
                  onClick={async () => {
                    impactMedium();
                    const fullConvo = messages.map(m => `${m.role === 'user' ? 'You' : 'Intel'}: ${m.text}`).join('\n\n');
                    try {
                      await Clipboard.write({ string: fullConvo });
                      toast({ title: 'Conversation copied' });
                    } catch {
                      toast({ title: 'Copy failed', variant: 'destructive' });
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
                  onClick={clearChat}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-border text-muted-foreground"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Clear
                </Button>
              </div>
            )}

            {isStreaming && (
              <Button
                onClick={() => { /* Chat streams can't be cancelled easily, so just let it finish */ }}
                variant="outline"
                size="sm"
                className="w-full border-border text-muted-foreground"
                disabled
              >
                <Square className="h-3 w-3 mr-1.5" />
                Generating...
              </Button>
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
