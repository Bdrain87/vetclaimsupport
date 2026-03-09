import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { PageContainer } from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { Clipboard } from '@capacitor/clipboard';
import { toast } from '@/hooks/use-toast';
import { impactMedium } from '@/lib/haptics';
import { aiAnalyzeImage, isGeminiConfigured } from '@/lib/gemini';
import { EVIDENCE_SCAN_SYSTEM_PROMPT } from '@/lib/ai-prompts';
import { getModelConfig } from '@/lib/ai-models';
import { buildVeteranContext } from '@/utils/veteranContext';
import { formatContextForAI } from '@/utils/formatContextForAI';
import { Camera, Upload, Copy, RotateCcw, AlertTriangle, FileSearch, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import { AIDisclaimer } from '@/components/ui/AIDisclaimer';

interface Finding {
  label: string;
  status: 'present' | 'missing' | 'weak';
  detail: string;
}

export default function EvidenceScanner() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [rawAnalysis, setRawAnalysis] = useState('');
  const [buddyRequest, setBuddyRequest] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const processImage = async (file: File) => {
    if (!isGeminiConfigured) {
      setError('AI features are not configured.');
      return;
    }
    setError('');
    setIsProcessing(true);
    setFindings([]);
    setRawAnalysis('');
    setBuddyRequest('');

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      // Convert to base64
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      const evidenceSchema = {
        type: 'object' as const,
        properties: {
          documentType: { type: 'string' as const },
          findings: {
            type: 'array' as const,
            items: {
              type: 'object' as const,
              properties: {
                label: { type: 'string' as const },
                status: { type: 'string' as const, enum: ['present', 'missing', 'weak'] },
                detail: { type: 'string' as const },
              },
              required: ['label', 'status', 'detail'],
            },
          },
          overallStrength: { type: 'string' as const, enum: ['Strong', 'Moderate', 'Weak'] },
          analysis: { type: 'string' as const },
          missingElements: { type: 'array' as const, items: { type: 'string' as const } },
          sampleBuddyRequest: { type: 'string' as const },
        },
        required: ['documentType', 'findings', 'overallStrength', 'analysis'],
      };

      const ctx = buildVeteranContext({ maskPII: true });
      const contextBlock = formatContextForAI(ctx, 'minimal');
      const enrichedSystem = `${EVIDENCE_SCAN_SYSTEM_PROMPT}\n\nThe veteran is claiming:\n${contextBlock}`;

      const { temperature, timeout } = getModelConfig('evidence-scanner');
      const text = await aiAnalyzeImage({
        imageBase64: base64,
        mimeType: file.type || 'image/jpeg',
        prompt: 'Analyze this document image and provide a structured assessment of its value for a VA disability claim.',
        systemInstruction: enrichedSystem,
        feature: 'evidence-scanner',
        responseSchema: evidenceSchema,
        temperature,
        timeout,
      });

      try {
        const parsed = JSON.parse(text);

        setFindings(parsed.findings || []);
        setRawAnalysis(
          `**Document Type:** ${parsed.documentType}\n**Overall Strength:** ${parsed.overallStrength}\n\n${parsed.analysis}` +
          (parsed.missingElements?.length ? `\n\n**Missing Elements:**\n${parsed.missingElements.map((m: string) => `• ${m}`).join('\n')}` : '')
        );
        if (parsed.sampleBuddyRequest) {
          setBuddyRequest(parsed.sampleBuddyRequest);
        }
      } catch {
        // Fallback: use raw text if JSON parse fails
        setRawAnalysis(text);
      }
    } catch {
      setError('Failed to analyze document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      setError('File too large. Maximum 20MB.');
      return;
    }
    impactMedium();
    processImage(file);
  };

  const reset = () => {
    impactMedium();
    setImagePreview(null);
    setFindings([]);
    setRawAnalysis('');
    setBuddyRequest('');
    setError('');
    if (fileRef.current) fileRef.current.value = '';
    if (cameraRef.current) cameraRef.current.value = '';
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'present') return <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />;
    if (status === 'missing') return <XCircle className="h-4 w-4 text-red-400 shrink-0" />;
    return <MinusCircle className="h-4 w-4 text-gold shrink-0" />;
  };

  return (
    <PageContainer className="space-y-4">
      <h1 className="text-xl font-bold mb-4">Evidence Scanner</h1>
      <AIDisclaimer variant="banner" />
      <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />

      <div className="flex items-start gap-2 p-3 rounded-xl bg-gold/5 border border-gold/10">
        <AlertTriangle className="h-4 w-4 text-gold mt-0.5 shrink-0" />
        <p className="text-[11px] text-muted-foreground">
          Your document is processed by AI for analysis only. Images are not stored or uploaded to any server beyond the AI analysis. Review all suggestions with a VSO or attorney.
        </p>
      </div>

      {!rawAnalysis && !isProcessing && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="text-center py-6 space-y-3">
            <div className="h-16 w-16 mx-auto rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
              <FileSearch className="h-8 w-8 text-gold" />
            </div>
            <h2 className="text-lg font-semibold">Scan Your Evidence</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Upload or photograph medical records, nexus letters, buddy statements, or any claim evidence. AI will analyze strength and flag gaps.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => cameraRef.current?.click()}
              variant="outline"
              className="h-24 flex-col gap-2 border-gold/20 hover:bg-gold/5"
            >
              <Camera className="h-6 w-6 text-gold" />
              <span className="text-xs">Take Photo</span>
            </Button>
            <Button
              onClick={() => fileRef.current?.click()}
              variant="outline"
              className="h-24 flex-col gap-2 border-gold/20 hover:bg-gold/5"
            >
              <Upload className="h-6 w-6 text-gold" />
              <span className="text-xs">Upload File</span>
            </Button>
          </div>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        </motion.div>
      )}

      {isProcessing && (
        <div className="text-center py-12 space-y-3">
          {imagePreview && (
            <img src={imagePreview} alt="Document preview" className="h-32 mx-auto rounded-xl object-cover opacity-50" />
          )}
          <div className="h-12 w-12 mx-auto rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center animate-pulse">
            <FileSearch className="h-6 w-6 text-gold" />
          </div>
          <p className="text-sm text-muted-foreground">Analyzing document for evidence strength...</p>
        </div>
      )}

      {rawAnalysis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {imagePreview && (
            <img src={imagePreview} alt="Scanned document" className="w-full max-h-48 rounded-xl object-cover border border-border" />
          )}

          {/* Findings checklist */}
          {findings.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Evidence Checklist</h3>
              {findings.map((f, i) => (
                <div key={`${f.label}-${i}`} className="flex items-start gap-2 p-2 rounded-lg border border-border bg-card">
                  <StatusIcon status={f.status} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{f.label}</p>
                    <p className="text-xs text-muted-foreground">{f.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Analysis */}
          <div className="p-4 rounded-xl border border-border bg-card text-sm whitespace-pre-wrap text-muted-foreground leading-relaxed">
            {rawAnalysis}
          </div>

          {/* Buddy request template */}
          {buddyRequest && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Sample Buddy Statement Request</h3>
              <div className="p-3 rounded-xl border border-gold/10 bg-gold/5 text-sm text-muted-foreground">
                {buddyRequest}
              </div>
              <Button
                onClick={async () => {
                  try {
                    await Clipboard.write({ string: buddyRequest });
                    toast({ title: 'Buddy request copied' });
                  } catch {
                    toast({ title: 'Copy failed', description: 'Could not access clipboard.', variant: 'destructive' });
                  }
                }}
                variant="outline" size="sm"
              >
                <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy Request
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={async () => {
                try {
                  const text = rawAnalysis + (buddyRequest ? `\n\nBuddy Statement Request:\n${buddyRequest}` : '');
                  await Clipboard.write({ string: text });
                  toast({ title: 'Analysis copied' });
                } catch {
                  toast({ title: 'Copy failed', description: 'Could not access clipboard.', variant: 'destructive' });
                }
              }}
              variant="outline" className="flex-1"
            >
              <Copy className="h-4 w-4 mr-2" /> Copy All
            </Button>
            <Button onClick={reset} className="flex-1 bg-gold hover:bg-gold/80 text-black font-semibold">
              <RotateCcw className="h-4 w-4 mr-2" /> Scan Another
            </Button>
          </div>
        </motion.div>
      )}
    </PageContainer>
  );
}
