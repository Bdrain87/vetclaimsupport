import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { PageContainer } from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { useUserConditions } from '@/hooks/useUserConditions';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { Clipboard } from '@capacitor/clipboard';
import { toast } from '@/hooks/use-toast';
import { impactMedium, notifySuccess } from '@/lib/haptics';
import { aiTranscribe, isGeminiConfigured } from '@/lib/gemini';
import { useAIStream } from '@/hooks/useAIStream';
import { isNativeApp } from '@/lib/platform';
import { createCPExamEvalPromptV2 } from '@/lib/ai-prompts';
import { getModelConfig } from '@/lib/ai-models';
import { buildConditionContext } from '@/utils/veteranContext';
import { formatContextForAI } from '@/utils/formatContextForAI';
import { StreamingText } from '@/components/ui/StreamingText';
import { Mic, MicOff, Play, RotateCcw, Copy, ChevronRight, Shield, AlertTriangle, Square, Volume2, VolumeX, MessageSquare } from 'lucide-react';
import { AIDisclaimer } from '@/components/ui/AIDisclaimer';

// DBQ-based question sets by condition category
const EXAM_QUESTIONS: Record<string, string[]> = {
  'PTSD': [
    "Describe the traumatic event(s) that you experienced during military service.",
    "How often do you experience intrusive memories, nightmares, or flashbacks?",
    "Do you avoid situations, people, or places that remind you of your trauma? Give examples.",
    "How has your sleep been affected? Describe a typical night.",
    "Have you experienced hypervigilance or an exaggerated startle response? Give specific examples.",
    "How do your symptoms affect your ability to work and maintain relationships?",
    "Do you experience emotional numbness or difficulty feeling positive emotions?",
    "Have you had any panic attacks? How frequent and how severe?",
  ],
  'Tinnitus': [
    "When did you first notice ringing in your ears?",
    "What noise exposure did you have during military service?",
    "Is the ringing constant or intermittent? Describe the sound.",
    "How does tinnitus affect your ability to concentrate or sleep?",
    "Does the tinnitus affect your ability to hear conversations?",
  ],
  'Back': [
    "Describe the injury or onset of your back condition during service.",
    "What is your current range of motion? Can you bend forward, backward, side to side?",
    "Do you experience flare-ups? How often and how long do they last?",
    "What daily activities are limited by your back condition?",
    "Do you experience any radiating pain, numbness, or tingling in your legs?",
    "What treatments have you tried? Medications, physical therapy, surgery?",
    "How many days of work have you missed due to your back condition in the past year?",
  ],
  'Knee': [
    "Describe the injury or onset of your knee condition during service.",
    "What is your current range of motion? Can you fully bend and straighten your knee?",
    "Do you experience instability or giving way? How often?",
    "Do you experience flare-ups? How often and what triggers them?",
    "Can you walk, climb stairs, squat, or kneel without difficulty?",
    "Do you use any assistive devices like a brace or cane?",
  ],
  'Migraine': [
    "How often do you experience migraines? Weekly, monthly?",
    "How long do your migraines typically last?",
    "Are your migraines prostrating — do they force you to lie down in a dark room?",
    "What triggers your migraines?",
    "How many days of work do you miss per month due to migraines?",
    "What medications do you take for migraines and how effective are they?",
  ],
  'Sleep Apnea': [
    "When were you diagnosed with sleep apnea?",
    "Do you use a CPAP machine? How many hours per night?",
    "How does sleep apnea affect your daytime functioning?",
    "Do you experience excessive daytime sleepiness despite treatment?",
    "Has your sleep apnea affected your work performance?",
  ],
  'General': [
    "Describe when your condition first started and its connection to military service.",
    "What are your current symptoms? Describe their frequency and severity.",
    "How does this condition affect your daily activities and ability to work?",
    "What treatments have you received? How effective have they been?",
    "Do you experience flare-ups? How often and how severe?",
    "How has this condition changed since it first started?",
  ],
};

function getQuestionsForCondition(conditionName: string): string[] {
  const name = conditionName.toLowerCase();
  if (name.includes('ptsd') || name.includes('anxiety') || name.includes('depression') || name.includes('mental')) {
    return EXAM_QUESTIONS['PTSD'];
  }
  if (name.includes('tinnitus') || name.includes('hearing')) {
    return EXAM_QUESTIONS['Tinnitus'];
  }
  if (name.includes('back') || name.includes('lumbar') || name.includes('spine') || name.includes('cervical')) {
    return EXAM_QUESTIONS['Back'];
  }
  if (name.includes('knee') || name.includes('patell')) {
    return EXAM_QUESTIONS['Knee'];
  }
  if (name.includes('migraine') || name.includes('headache')) {
    return EXAM_QUESTIONS['Migraine'];
  }
  if (name.includes('sleep apnea')) {
    return EXAM_QUESTIONS['Sleep Apnea'];
  }
  return EXAM_QUESTIONS['General'];
}

type SimPhase = 'select' | 'intro' | 'question' | 'recording' | 'feedback' | 'summary';

interface ExamAnswer {
  question: string;
  transcript: string;
  feedback: string;
  strength: 'Strong' | 'Moderate' | 'Weak';
}

/** Extracted so we can use useEffect for auto-speak on mount */
function QuestionPhase({ question, questionNum, totalQuestions, selectedCondition, conversationMode, isSpeaking, onSpeak, onStopSpeaking, onStartAnswer }: {
  question: string;
  questionNum: number;
  totalQuestions: number;
  selectedCondition: string;
  conversationMode: boolean;
  isSpeaking: boolean;
  onSpeak: (autoRecord: boolean) => void;
  onStopSpeaking: () => void;
  onStartAnswer: () => void;
}) {
  const hasAutoSpoken = useRef(false);

  // Auto-speak when entering question phase in conversation mode
  useEffect(() => {
    if (conversationMode && !hasAutoSpoken.current) {
      hasAutoSpoken.current = true;
      // Small delay so the UI renders first
      const t = setTimeout(() => onSpeak(true), 300);
      return () => clearTimeout(t);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground shrink-0">Q{questionNum}/{totalQuestions}</span>
        {conversationMode && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold/10 border border-gold/20 text-gold shrink-0">
            Conversation
          </span>
        )}
        <span className="text-xs text-muted-foreground truncate text-right">{selectedCondition}</span>
      </div>
      <div className="w-full h-1 rounded-full bg-border overflow-hidden">
        <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${((questionNum - 1) / totalQuestions) * 100}%` }} />
      </div>
      <div className="p-4 rounded-xl border border-gold/20 bg-gold/5">
        <div className="flex items-start gap-3">
          <p className="text-sm font-medium flex-1">{question}</p>
          <button
            onClick={() => isSpeaking ? onStopSpeaking() : onSpeak(false)}
            className="shrink-0 h-11 w-11 rounded-full flex items-center justify-center border border-gold/20 bg-gold/10 hover:bg-gold/20 transition-colors"
            aria-label={isSpeaking ? 'Stop reading' : 'Read question aloud'}
          >
            {isSpeaking ? (
              <VolumeX className="h-4 w-4 text-gold" />
            ) : (
              <Volume2 className="h-4 w-4 text-gold" />
            )}
          </button>
        </div>
      </div>
      {isSpeaking && conversationMode ? (
        <p className="text-xs text-muted-foreground text-center">Listening... recording will start automatically</p>
      ) : (
        <p className="text-xs text-muted-foreground text-center">Tap the microphone and answer as if speaking to the examiner</p>
      )}
      <Button onClick={onStartAnswer} disabled={isSpeaking && conversationMode} className="w-full bg-gold hover:bg-gold/80 text-black font-semibold h-14 disabled:opacity-50">
        <Mic className="h-5 w-5 mr-2" /> {isSpeaking && conversationMode ? 'Waiting for question...' : 'Start Recording Answer'}
      </Button>
    </motion.div>
  );
}

// iOS WebKit pauses speechSynthesis after ~15s. This keep-alive nudges it.
let keepAliveTimer: ReturnType<typeof setInterval> | null = null;
let cachedVoice: SpeechSynthesisVoice | null = null;

/** Pick the best English voice — prefer enhanced/premium iOS voices over the default robotic one. */
function getBestVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis?.getVoices() ?? [];
  const en = voices.filter(v => v.lang.startsWith('en'));
  // iOS enhanced voices contain "Enhanced" or "Premium" in their name
  // and have higher quality than the default compact voices
  const enhanced = en.find(v => /enhanced|premium/i.test(v.name));
  // Fallback: prefer any non-default local voice for slightly better quality
  const local = en.find(v => v.localService && !v.default);
  cachedVoice = enhanced ?? local ?? en[0] ?? null;
  return cachedVoice;
}

// Pre-load voices — iOS loads them async, so we trigger early
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', () => { cachedVoice = null; getBestVoice(); });
}

function stopSpeaking() {
  if (keepAliveTimer) { clearInterval(keepAliveTimer); keepAliveTimer = null; }
  window.speechSynthesis?.cancel();
}

function speakText(text: string, onEnd?: () => void): void {
  stopSpeaking();
  const synth = window.speechSynthesis;
  if (!synth) {
    toast({ title: 'Text-to-speech not supported on this device', variant: 'destructive' });
    onEnd?.();
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getBestVoice();
  if (voice) utterance.voice = voice;
  utterance.rate = 0.95;
  utterance.pitch = 1;
  let finished = false;
  // Don't touch keepAliveTimer in done — it may belong to a newer speakText call.
  // The timer self-cleans via its !synth.speaking check, and stopSpeaking() clears it on next call.
  const done = () => { if (finished) return; finished = true; onEnd?.(); };
  utterance.onend = done;
  utterance.onerror = done;
  synth.speak(utterance);
  // iOS keep-alive: pause/resume every 10s to prevent silent pause
  keepAliveTimer = setInterval(() => {
    if (!synth.speaking) { clearInterval(keepAliveTimer!); keepAliveTimer = null; return; }
    synth.pause();
    synth.resume();
  }, 10_000);
}

export default function CPExamSimulator() {
  const { conditions } = useUserConditions();
  const [phase, setPhase] = useState<SimPhase>('select');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<ExamAnswer[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<ExamAnswer | null>(null);
  const { streamedText, isStreaming, startStream, cancel: cancelStream } = useAIStream();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationMode, setConversationMode] = useState(false);
  const conversationModeRef = useRef(false);
  // Incremented when speech is cancelled manually — prevents stale onEnd from triggering auto-record
  const speechGenRef = useRef(0);

  // Keep ref in sync so callbacks always see latest value
  useEffect(() => { conversationModeRef.current = conversationMode; }, [conversationMode]);

  // Cancel speech on unmount
  useEffect(() => () => stopSpeaking(), []);

  const speakQuestion = useCallback((text: string, autoRecord?: boolean) => {
    const gen = ++speechGenRef.current;
    setIsSpeaking(true);
    speakText(text, () => {
      // If speech was cancelled (gen changed), don't auto-record
      if (gen !== speechGenRef.current) return;
      setIsSpeaking(false);
      // Only auto-record on native — on web, TTS works but recording doesn't
      if (autoRecord && conversationModeRef.current && isNativeApp) {
        // Small delay so the user hears the question end before mic activates
        setTimeout(() => {
          if (gen !== speechGenRef.current) return;
          startAnswerRef.current?.();
        }, 600);
      }
    });
  }, []);

  // We need a ref to startAnswer so speakQuestion's onEnd can call it without stale closure
  const startAnswerRef = useRef<(() => void) | null>(null);

  const startExam = useCallback((condition: string) => {
    impactMedium();
    setSelectedCondition(condition);
    setQuestions(getQuestionsForCondition(condition));
    setCurrentQ(0);
    setAnswers([]);
    setPhase('intro');
  }, []);

  const beginQuestions = useCallback(() => {
    impactMedium();
    setPhase('question');
  }, []);

  const startAnswer = useCallback(async () => {
    if (!isNativeApp) {
      toast({ title: 'Voice recording is only available on mobile', variant: 'destructive' });
      return;
    }
    if (!isGeminiConfigured) {
      toast({ title: 'AI features are not configured', variant: 'destructive' });
      return;
    }
    speechGenRef.current++; // Invalidate any pending auto-record
    stopSpeaking();
    setIsSpeaking(false);
    impactMedium();
    try {
      await VoiceRecorder.requestAudioRecordingPermission();
      await VoiceRecorder.startRecording();
      setIsRecording(true);
      setPhase('recording');
    } catch {
      toast({ title: 'Microphone access required', variant: 'destructive' });
    }
  }, []);

  // Keep the ref current
  useEffect(() => { startAnswerRef.current = startAnswer; }, [startAnswer]);

  const submitAnswer = useCallback(async () => {
    if (!isRecording) return;
    setIsRecording(false);
    setIsProcessing(true);
    impactMedium();

    try {
      const recording = await VoiceRecorder.stopRecording();
      if (!recording.value) {
        toast({ title: 'No audio captured. Try again.', variant: 'destructive' });
        setIsProcessing(false);
        return;
      }

      // Transcribe
      const transcript = await aiTranscribe({
        audioBase64: recording.value.recordDataBase64,
        mimeType: recording.value.mimeType || 'audio/wav',
        feature: 'cp-exam-simulator',
      });

      // Evaluate (streaming) — Pro model + VASRD criteria injection
      const ctx = buildConditionContext(selectedCondition);
      const contextBlock = formatContextForAI(ctx, 'standard');
      const { model, temperature, timeout } = getModelConfig('cp-exam-simulator');
      const feedbackText = await startStream({
        prompt: createCPExamEvalPromptV2(selectedCondition, questions[currentQ], transcript, contextBlock),
        feature: 'cp-exam-simulator',
        model,
        temperature,
        timeout,
      });

      const strengthMatch = feedbackText.match(/STRENGTH:\s*(Strong|Moderate|Weak)/i);
      const strength = (strengthMatch?.[1] as 'Strong' | 'Moderate' | 'Weak') || 'Moderate';

      const answer: ExamAnswer = {
        question: questions[currentQ],
        transcript,
        feedback: feedbackText,
        strength,
      };

      setCurrentFeedback(answer);
      setAnswers(prev => [...prev, answer]);
      setPhase('feedback');
    } catch {
      toast({ title: 'Error processing answer. Try again.', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  }, [isRecording, selectedCondition, questions, currentQ, startStream]);

  const nextQuestion = useCallback(() => {
    impactMedium();
    if (currentQ + 1 >= questions.length) {
      notifySuccess();
      setPhase('summary');
    } else {
      setCurrentQ(prev => prev + 1);
      setCurrentFeedback(null);
      setPhase('question');
    }
  }, [currentQ, questions.length]);

  const resetExam = useCallback(() => {
    cancelStream();
    speechGenRef.current++;
    stopSpeaking();
    setIsSpeaking(false);
    impactMedium();
    setPhase('select');
    setSelectedCondition('');
    setQuestions([]);
    setCurrentQ(0);
    setAnswers([]);
    setCurrentFeedback(null);
    setConversationMode(false);
  }, [cancelStream]);

  const strengthColor = (s: string) =>
    s === 'Strong' ? 'text-gold' : s === 'Moderate' ? 'text-gold' : 'text-red-400';
  const strengthBg = (s: string) =>
    s === 'Strong' ? 'bg-gold/10 border-gold/20' : s === 'Moderate' ? 'bg-gold/10 border-gold/20' : 'bg-red-500/10 border-red-500/20';

  return (
    <PageContainer className="space-y-4">
      <AIDisclaimer variant="banner" />

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-gold/5 border border-gold/10">
        <AlertTriangle className="h-4 w-4 text-gold mt-0.5 shrink-0" />
        <p className="text-[11px] text-muted-foreground">
          This simulator helps you practice articulating your symptoms. Always describe your genuine experiences truthfully. This is not legal advice — consult a VSO or attorney.
        </p>
      </div>

      {/* PHASE: Select Condition */}
      {phase === 'select' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h2 className="text-lg font-semibold">Select a condition to practice</h2>
          <p className="text-sm text-muted-foreground">Choose a condition and answer exam-style questions by voice. Get instant AI feedback on answer strength.</p>

          {conditions.length > 0 ? (
            <div className="space-y-2">
              {conditions.map((c) => (
                <button
                  key={c.id}
                  onClick={() => startExam(c.displayName || c.conditionId)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent transition-colors text-left"
                >
                  <Shield className="h-5 w-5 text-gold shrink-0" />
                  <span className="flex-1 min-w-0 truncate text-sm font-medium">{c.displayName || c.conditionId}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Add conditions to your claim first to practice exam questions.</p>
            </div>
          )}

          {/* Practice with generic condition */}
          <button
            onClick={() => startExam('General Condition')}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-border hover:bg-accent transition-colors text-left"
          >
            <Play className="h-5 w-5 text-muted-foreground shrink-0" />
            <span className="flex-1 min-w-0 text-sm text-muted-foreground">Practice with general questions</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </motion.div>
      )}

      {/* PHASE: Intro */}
      {phase === 'intro' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-center py-6">
          <div className="h-16 w-16 mx-auto rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Shield className="h-8 w-8 text-gold" />
          </div>
          <h2 className="text-lg font-semibold">C&P Exam: {selectedCondition}</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            You'll be asked {questions.length} questions based on real DBQ criteria. Answer each one by voice — speak naturally as if you're talking to the examiner. You'll get instant feedback on each answer.
          </p>

          {/* Conversation mode toggle */}
          <button
            onClick={() => setConversationMode(m => !m)}
            className={`mx-auto flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors ${
              conversationMode
                ? 'border-gold/30 bg-gold/10 text-gold'
                : 'border-border bg-card text-muted-foreground hover:bg-accent'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm font-medium">Conversation Mode</span>
            <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${conversationMode ? 'bg-gold/20 text-gold' : 'bg-muted text-muted-foreground'}`}>
              {conversationMode ? 'ON' : 'OFF'}
            </span>
          </button>
          {conversationMode && (
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Questions will be read aloud automatically and recording starts after each question finishes — like a real exam.
            </p>
          )}

          <Button onClick={beginQuestions} className="bg-gold hover:bg-gold/80 text-black font-semibold">
            <Play className="h-4 w-4 mr-2" /> Begin Exam
          </Button>
        </motion.div>
      )}

      {/* PHASE: Question — auto-speak in conversation mode */}
      {phase === 'question' && (
        <QuestionPhase
          key={currentQ}
          question={questions[currentQ]}
          questionNum={currentQ + 1}
          totalQuestions={questions.length}
          selectedCondition={selectedCondition}
          conversationMode={conversationMode}
          isSpeaking={isSpeaking}
          onSpeak={(autoRecord) => speakQuestion(questions[currentQ], autoRecord)}
          onStopSpeaking={() => { speechGenRef.current++; stopSpeaking(); setIsSpeaking(false); }}
          onStartAnswer={startAnswer}
        />
      )}

      {/* PHASE: Recording */}
      {(phase === 'recording' || (isProcessing && !isStreaming)) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-center py-6">
          {isProcessing && !isStreaming ? (
            <>
              <div className="h-20 w-20 mx-auto rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center animate-pulse">
                <Shield className="h-10 w-10 text-gold" />
              </div>
              <p className="text-sm text-muted-foreground">Analyzing your answer...</p>
            </>
          ) : (
            <>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="h-20 w-20 mx-auto rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center"
              >
                <Mic className="h-10 w-10 text-red-400" />
              </motion.div>
              <p className="text-sm font-medium text-red-400">Recording...</p>
              <p className="text-xs text-muted-foreground">Speak naturally. Tap stop when done.</p>
              <Button onClick={submitAnswer} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                <MicOff className="h-4 w-4 mr-2" /> Stop & Submit
              </Button>
            </>
          )}
        </motion.div>
      )}

      {/* Streaming evaluation in progress */}
      {isStreaming && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Question {currentQ + 1} of {questions.length}</span>
            <span className="text-xs text-muted-foreground">Evaluating...</span>
          </div>
          <StreamingText
            text={streamedText}
            isStreaming={true}
            className="p-4 rounded-xl border border-border bg-card text-sm text-muted-foreground leading-relaxed"
          />
          <Button
            onClick={() => cancelStream()}
            variant="outline" size="sm" className="w-full border-red-500/30 text-red-400"
          >
            <Square className="h-3 w-3 mr-1.5" /> Stop
          </Button>
        </motion.div>
      )}

      {/* PHASE: Feedback */}
      {phase === 'feedback' && currentFeedback && !isStreaming && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Question {currentQ + 1} of {questions.length}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${strengthBg(currentFeedback.strength)} ${strengthColor(currentFeedback.strength)}`}>
              {currentFeedback.strength}
            </span>
          </div>

          <div className="p-3 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground mb-1">Your answer:</p>
            <p className="text-sm italic">"{currentFeedback.transcript}"</p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card text-sm whitespace-pre-wrap text-muted-foreground leading-relaxed">
            {currentFeedback.feedback}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={async () => {
                try {
                  await Clipboard.write({ string: currentFeedback.feedback });
                  toast({ title: 'Copied feedback' });
                } catch {
                  toast({ title: 'Copy failed', description: 'Could not access clipboard.', variant: 'destructive' });
                }
              }}
              variant="outline" size="sm" className="flex-1"
            >
              <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy
            </Button>
            <Button onClick={nextQuestion} className="flex-1 bg-gold hover:bg-gold/80 text-black font-semibold">
              {currentQ + 1 >= questions.length ? 'View Summary' : 'Next Question'}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* PHASE: Summary */}
      {phase === 'summary' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="text-center py-4">
            <h2 className="text-lg font-semibold">Exam Complete</h2>
            <p className="text-sm text-muted-foreground mt-1">{selectedCondition} — {answers.length} questions answered</p>
          </div>

          {/* Score Summary */}
          <div className="grid grid-cols-3 gap-2">
            {(['Strong', 'Moderate', 'Weak'] as const).map((s) => {
              const count = answers.filter(a => a.strength === s).length;
              return (
                <div key={s} className={`p-3 rounded-xl border text-center ${strengthBg(s)}`}>
                  <p className={`text-lg font-bold ${strengthColor(s)}`}>{count}</p>
                  <p className="text-xs text-muted-foreground">{s}</p>
                </div>
              );
            })}
          </div>

          {/* Answer Review */}
          <div className="space-y-3">
            {answers.map((a, i) => (
              <details key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <summary className="flex items-center gap-2 p-3 cursor-pointer hover:bg-accent transition-colors">
                  <span className="text-xs text-muted-foreground w-6">Q{i + 1}</span>
                  <span className="flex-1 text-sm truncate">{a.question}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${strengthBg(a.strength)} ${strengthColor(a.strength)}`}>
                    {a.strength}
                  </span>
                </summary>
                <div className="px-3 pb-3 space-y-2 border-t border-border pt-2">
                  <p className="text-xs text-muted-foreground">Your answer: <span className="italic">"{a.transcript}"</span></p>
                  <div className="text-xs text-muted-foreground whitespace-pre-wrap">{a.feedback}</div>
                </div>
              </details>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={async () => {
                const text = answers.map((a, i) => `Q${i+1}: ${a.question}\nAnswer: ${a.transcript}\nStrength: ${a.strength}\n${a.feedback}\n`).join('\n---\n\n');
                await Clipboard.write({ string: text });
                toast({ title: 'Full exam results copied' });
              }}
              variant="outline" className="flex-1"
            >
              <Copy className="h-4 w-4 mr-2" /> Copy All
            </Button>
            <Button onClick={resetExam} className="flex-1 bg-gold hover:bg-gold/80 text-black font-semibold">
              <RotateCcw className="h-4 w-4 mr-2" /> New Exam
            </Button>
          </div>

          <p className="text-[10px] text-muted-foreground text-center italic">
            This practice exam is for preparation only. Always describe your genuine experiences truthfully. Consult a VSO or attorney for claim advice.
          </p>
        </motion.div>
      )}
    </PageContainer>
  );
}
