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
import { Mic, MicOff, Copy, RotateCcw, AlertTriangle, Heart, Users, PenTool } from 'lucide-react';

type Relationship = 'spouse' | 'child' | 'parent' | 'sibling' | 'friend';

const RELATIONSHIP_LABELS: Record<Relationship, string> = {
  spouse: 'Spouse / Partner',
  child: 'Adult Child',
  parent: 'Parent',
  sibling: 'Sibling',
  friend: 'Close Friend / Battle Buddy',
};

export default function FamilyStatement() {
  const [relationship, setRelationship] = useState<Relationship | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statement, setStatement] = useState('');
  const [useText, setUseText] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [error, setError] = useState('');

  const generateFromText = async (text: string) => {
    if (!isGeminiConfigured) {
      setError('AI features are not configured.');
      return;
    }
    setIsProcessing(true);
    setError('');
    try {
      const model = getGeminiModel();
      const result = await model.generateContent(
        `You are helping a veteran's ${relationship} write a supporting lay statement for a VA disability claim.

The ${relationship} described their observations:
"${text}"

Generate a structured lay statement:

## Sample Lay/Witness Statement

[Write a formal but personal statement from the perspective of the ${relationship}. Include:
- Their relationship to the veteran and how long they've known them
- Specific observable changes they've witnessed (before vs. after service, or over time)
- Concrete examples of how the condition affects daily life, routines, and relationships
- Specific incidents they've witnessed (flare-ups, bad days, limitations)
- Impact on the family/household
- Use first person, specific dates/timeframes where possible]

## Key Observations to Strengthen This Statement
[Bullet list of specific details the VA values in lay statements — things they mentioned or should add]

## Formatting Tips
- Use specific dates and timeframes
- Describe what you personally observed, not medical conclusions
- Include before/after comparisons when possible
- Sign and date the statement
- Include your full name and contact information
- Notarization is optional but adds credibility

IMPORTANT: This is a SAMPLE template. The writer must personalize with their own genuine observations. Not legal advice.`
      );
      setStatement(result.response.text());
    } catch {
      setError('Failed to generate. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    if (!isNativeApp) {
      setError('Voice recording is only available on mobile');
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

  const stopAndGenerate = async () => {
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
      await generateFromText(transcribed);
    } catch {
      setError('Failed to process recording.');
      setIsProcessing(false);
    }
  };

  const reset = () => {
    impactMedium();
    setRelationship(null);
    setTranscript('');
    setStatement('');
    setTextInput('');
    setUseText(false);
    setError('');
  };

  return (
    <PageContainer className="space-y-4 pb-8">
      <h1 className="text-xl font-bold mb-4">Family Impact Statement</h1>
      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
        <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
        <p className="text-[11px] text-muted-foreground">
          Family lay statements are powerful evidence. The VA values specific observations from people who witness the veteran's daily life. These are sample templates — must be personalized. Not legal advice.
        </p>
      </div>

      {/* Step 1: Select relationship */}
      {!relationship && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="text-center py-4 space-y-2">
            <div className="h-14 w-14 mx-auto rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
              <Heart className="h-7 w-7 text-gold" />
            </div>
            <h2 className="text-lg font-semibold">Who is writing this statement?</h2>
            <p className="text-sm text-muted-foreground">Select the relationship to the veteran</p>
          </div>
          <div className="space-y-2">
            {(Object.entries(RELATIONSHIP_LABELS) as [Relationship, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { impactMedium(); setRelationship(key); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent transition-colors text-left"
              >
                <Users className="h-5 w-5 text-gold flex-shrink-0" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Step 2: Record or type */}
      {relationship && !statement && !isProcessing && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="text-center py-4 space-y-2">
            <h2 className="text-lg font-semibold">Describe what you've observed</h2>
            <p className="text-sm text-muted-foreground">
              As the veteran's {RELATIONSHIP_LABELS[relationship].toLowerCase()}, describe how their condition affects daily life. Include specific examples, changes you've noticed, and how it impacts your household.
            </p>
          </div>

          {!useText && !isRecording && (
            <div className="space-y-3">
              <Button onClick={startRecording} className="w-full bg-gold hover:bg-gold/80 text-black font-semibold h-14">
                <Mic className="h-5 w-5 mr-2" /> Record by Voice
              </Button>
              <button
                onClick={() => setUseText(true)}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                <PenTool className="h-3.5 w-3.5 inline mr-1.5" />
                Or type instead
              </button>
            </div>
          )}

          {isRecording && (
            <div className="text-center space-y-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="h-20 w-20 mx-auto rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center"
              >
                <Mic className="h-10 w-10 text-red-400" />
              </motion.div>
              <p className="text-sm font-medium text-red-400">Recording...</p>
              <p className="text-xs text-muted-foreground">Describe what you've observed. Take your time.</p>
              <Button onClick={stopAndGenerate} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                <MicOff className="h-4 w-4 mr-2" /> Stop & Generate
              </Button>
            </div>
          )}

          {useText && (
            <div className="space-y-3">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={`As the veteran's ${RELATIONSHIP_LABELS[relationship].toLowerCase()}, describe what you've observed about their condition. Include specific examples, changes over time, and daily impacts...`}
                className="w-full h-40 p-3 rounded-xl border border-border bg-card text-sm resize-none focus:outline-none focus:border-gold/30"
              />
              <Button
                onClick={() => { impactMedium(); generateFromText(textInput); }}
                disabled={!textInput.trim()}
                className="w-full bg-gold hover:bg-gold/80 text-black font-semibold"
              >
                Generate Statement
              </Button>
            </div>
          )}

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        </motion.div>
      )}

      {isProcessing && (
        <div className="text-center py-12 space-y-3">
          <div className="h-16 w-16 mx-auto rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center animate-pulse">
            <Heart className="h-8 w-8 text-gold" />
          </div>
          <p className="text-sm text-muted-foreground">Generating family statement template...</p>
        </div>
      )}

      {/* Result */}
      {statement && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{relationship ? RELATIONSHIP_LABELS[relationship] : 'Family'} Statement</span>
          </div>

          {transcript && (
            <details className="rounded-xl border border-border bg-card overflow-hidden">
              <summary className="p-3 text-sm font-medium cursor-pointer hover:bg-accent transition-colors">Voice transcript</summary>
              <p className="px-3 pb-3 text-sm text-muted-foreground italic border-t border-border pt-2">"{transcript}"</p>
            </details>
          )}

          <div className="p-4 rounded-xl border border-border bg-card text-sm whitespace-pre-wrap text-muted-foreground leading-relaxed">
            {statement}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={async () => {
                await Clipboard.write({ string: statement });
                toast({ title: 'Statement copied' });
              }}
              variant="outline" className="flex-1"
            >
              <Copy className="h-4 w-4 mr-2" /> Copy
            </Button>
            <Button onClick={reset} className="flex-1 bg-gold hover:bg-gold/80 text-black font-semibold">
              <RotateCcw className="h-4 w-4 mr-2" /> Start Over
            </Button>
          </div>
        </motion.div>
      )}
    </PageContainer>
  );
}
