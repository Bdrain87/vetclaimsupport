import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Clipboard } from '@capacitor/clipboard';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { toast } from '@/hooks/use-toast';
import { impactMedium } from '@/lib/haptics';
import { aiTranscribe, createChat, isGeminiConfigured, type Chat } from '@/lib/gemini';
import { getModelConfig } from '@/lib/ai-models';
import { redactPII } from '@/lib/redaction';
import { logAISend } from '@/services/aiAuditLog';
import { checkAIRateLimit, trackAICall, AIRateLimitError } from '@/services/aiUsageTracker';
import { AIUsageBanner } from '@/components/AIUsageBanner';
import { scanAIOutput, AI_OUTPUT_WARNING } from '@/utils/aiOutputGuard';
import { isNativeApp } from '@/lib/platform';
import useAppStore from '@/store/useAppStore';
import { useSentinel } from '@/hooks/useSentinel';
import { StreamingText } from './ui/StreamingText';
import { SENTINEL_SYSTEM_PROMPT, SENTINEL_VOICE_BUILD_PROMPT, buildCriteriaBlockForConditions, buildSecondaryConnectionsBlock } from '@/lib/ai-prompts';
import { buildVeteranContext } from '@/utils/veteranContext';
import { formatContextForAI } from '@/utils/formatContextForAI';
import { Mic, MicOff, Sparkles, FileText, Shield, Heart, Scan, ArrowUp, ClipboardCheck, AlertTriangle, Users, FileSearch, Calculator, BarChart3 } from 'lucide-react';
import { AIDisclaimer } from '@/components/ui/AIDisclaimer';
import { useNavigate } from 'react-router-dom';

interface AITool {
  label: string;
  desc: string;
  icon: React.ElementType;
  route: string;
}

const AI_TOOLS: { title: string; tools: AITool[] }[] = [
  {
    title: 'Documents',
    tools: [
      { label: 'Impact Statement', desc: 'Build your statement', icon: FileText, route: '/prep/personal-statement' },
      { label: 'Buddy Statement', desc: 'Lay statement builder', icon: Users, route: '/prep/buddy-statement' },
      { label: 'Doctor Summary Builder', desc: 'Doctor summary outline', icon: FileText, route: '/prep/doctor-summary' },
      { label: 'Stressor Statement', desc: 'Document stressors', icon: AlertTriangle, route: '/prep/stressor' },
      { label: 'Family Statement', desc: 'Family lay statements', icon: Heart, route: '/prep/family-statement' },
    ],
  },
  {
    title: 'Exam & Evidence',
    tools: [
      { label: 'C&P Exam Prep', desc: 'Prepare for your exam', icon: ClipboardCheck, route: '/prep/exam' },
      { label: 'C&P Simulator', desc: 'Practice questions', icon: Shield, route: '/prep/exam-simulator' },
      { label: 'Post-Exam Debrief', desc: 'Analyze your exam', icon: ClipboardCheck, route: '/prep/post-debrief' },
      { label: 'Evidence Analyzer', desc: 'Find evidence gaps', icon: Scan, route: '/prep/evidence-scanner' },
      { label: 'DBQ Self-Assessment', desc: 'Estimate your rating per DBQ', icon: ClipboardCheck, route: '/prep/dbq-analyzer' },
      { label: 'Decision Decoder', desc: 'Decode VA decisions', icon: FileSearch, route: '/claims/decision-decoder' },
      { label: 'Rating Calculator', desc: 'Calculate your rating', icon: Calculator, route: '/calculator' },
    ],
  },
];

function ReadinessRing({ score, label }: { score: number; label: string }) {
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#C5A55A' : '#ef4444';

  return (
    <svg width="48" height="48" viewBox="0 0 48 48" className="shrink-0">
      <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="3" />
      <circle
        cx="24" cy="24" r="18" fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 24 24)"
        className="transition-all duration-700"
      />
      <text x="24" y="22" textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="bold">
        {score}
      </text>
      <text x="24" y="33" textAnchor="middle" fill="currentColor" fontSize="7" opacity="0.5">
        {label}
      </text>
    </svg>
  );
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  hasWarning?: boolean;
}

type IntelMode = 'ask' | 'voice-build';

export function SentinelCore() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamedText, setStreamedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mode, setMode] = useState<IntelMode>('ask');
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
      // Inject rating criteria for veteran's logged conditions
      const conditionsForCriteria = (ctx.conditions || []).map(c => ({
        name: c.name,
        diagnosticCode: c.diagnosticCode,
      }));
      const criteriaBlock = buildCriteriaBlockForConditions(conditionsForCriteria);
      const conditionNames = (ctx.conditions || []).map(c => c.name);
      const secondaryBlock = buildSecondaryConnectionsBlock(conditionNames);
      const { temperature } = getModelConfig('sentinel-core');
      chatRef.current = createChat({
        systemInstruction: `${systemPrompt}\n\n${contextBlock}${criteriaBlock ? `\n\n${criteriaBlock}\nUse ONLY the criteria above when discussing rating levels. For conditions not listed, direct the veteran to the Rating Guidance tool.` : ''}${secondaryBlock ? `\n\n${secondaryBlock}\nWhen the veteran asks about secondary conditions, reference ONLY the connections listed above.` : ''}`,
        feature: 'sentinel-core',
        temperature,
      });
    }
    return chatRef.current;
  }, []);

  const sendMessage = async (text: string, systemPrompt: string) => {
    if (!isGeminiConfigured) {
      setMessages(prev => [...prev, { role: 'model', text: 'AI features are not configured. Please contact support.' }]);
      return;
    }

    // Rate limit check
    const { allowed, status: rateLimitStatus } = checkAIRateLimit();
    if (!allowed) {
      setMessages(prev => [...prev, { role: 'model', text: new AIRateLimitError(rateLimitStatus).message }]);
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

    const sendStart = Date.now();
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

      trackAICall({ feature: 'sentinel-core', success: true, durationMs: Date.now() - sendStart, inputLength: redactedText.length });
      const scan = scanAIOutput(fullText);
      setMessages(prev => [...prev, { role: 'model', text: fullText, hasWarning: !scan.clean }]);
    } catch {
      trackAICall({ feature: 'sentinel-core', success: false, durationMs: Date.now() - sendStart, inputLength: redactedText.length });
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

  const copyChat = async () => {
    impactMedium();
    const fullConvo = messages.map(m => `${m.role === 'user' ? 'You' : 'Intel'}: ${m.text}`).join('\n\n');
    try {
      await Clipboard.write({ string: fullConvo });
      toast({ title: 'Conversation copied' });
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="fixed right-4 z-50 w-14 h-14 rounded-full bg-gold/15 border border-gold/30 backdrop-blur-xl shadow-[0_4px_24px_rgba(197,165,90,0.2)] flex items-center justify-center"
          style={{ bottom: 'calc(9rem + env(safe-area-inset-bottom, 0px))' }}
          aria-label="Open Intel AI"
        >
          <Sparkles className="h-6 w-6 text-gold" />
        </motion.button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border rounded-2xl p-6">
          <AIDisclaimer variant="banner" />
          <AIUsageBanner />
          {/* Condensed Header — title left, readiness ring right */}
          <DialogHeader className="flex-row items-center justify-between space-y-0">
            <DialogTitle className="text-foreground text-lg font-semibold tracking-wide">Intel</DialogTitle>
            <ReadinessRing score={score} label={label} />
          </DialogHeader>

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
              /* Ask Anything Mode — chat input at top */
              <div className="flex items-end gap-2 rounded-xl bg-secondary border border-border px-3 py-2">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !loading) { e.preventDefault(); handleAsk(); } }}
                  placeholder={messages.length > 0 ? 'Follow up...' : 'Ask anything about your claim...'}
                  rows={3}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-hidden min-w-0 resize-none"
                />
                <button
                  onClick={toggleVoice}
                  className="shrink-0 h-11 w-11 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
                >
                  {isRecording ? <MicOff className="h-4 w-4 text-red-400" /> : <Mic className="h-4 w-4" />}
                </button>
                <button
                  onClick={handleAsk}
                  disabled={loading || !query}
                  className="shrink-0 h-11 w-11 rounded-full bg-gold text-black flex items-center justify-center disabled:opacity-30 transition-opacity"
                  aria-label="Send message"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
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
                      {msg.role === 'model' && msg.hasWarning && (
                        <div className="flex items-center gap-1 text-[10px] text-gold mb-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>{AI_OUTPUT_WARNING}</span>
                        </div>
                      )}
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

            {/* Copy / Clear */}
            {messages.length > 0 && !isStreaming && (
              <div className="flex items-center gap-3 justify-end">
                <button onClick={copyChat} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">Copy</button>
                <button onClick={clearChat} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">Clear</button>
              </div>
            )}

            {/* AI Tools — Unified Card Grid */}
            {AI_TOOLS.map(({ title, tools }) => (
              <div key={title}>
                <p className="text-[11px] font-semibold text-gold/70 uppercase tracking-widest mb-2 flex items-center gap-1.5 px-1">
                  <Sparkles className="h-3 w-3" />
                  {title}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {tools.map(({ label: cardLabel, desc, icon: Icon, route }) => (
                    <button
                      key={route}
                      onClick={() => { impactMedium(); setOpen(false); setTimeout(() => navigate(route), 150); }}
                      className="rounded-xl bg-secondary/50 border border-border/50 p-3 hover:border-gold/20 hover:bg-gold/5 transition-all text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center mb-2">
                        <Icon className="h-4 w-4 text-gold" />
                      </div>
                      <p className="text-xs font-medium text-foreground">{cardLabel}</p>
                      <p className="text-[10px] text-muted-foreground">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Compact Disclaimer */}
          <p className="text-[10px] text-muted-foreground/60 text-center pt-2 pb-1">
            AI-assisted · Verify with VA resources · Not legal advice
          </p>
      </DialogContent>
    </Dialog>
  );
}
