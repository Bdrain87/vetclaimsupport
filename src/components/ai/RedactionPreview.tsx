import { useState, useMemo } from 'react';
import { Shield, Send, ArrowLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { redactPII, REDACTION_TOKENS } from '@/lib/redaction';
import { AI_COPY } from '@/data/legalCopy';

interface RedactionPreviewProps {
  originalText: string;
  onConfirm: (redactedText: string) => void;
  onCancel: () => void;
}

const TOKEN_COLORS: Record<string, string> = {
  [REDACTION_TOKENS.SSN]: 'bg-red-500/20 text-red-300 border-red-500/30',
  [REDACTION_TOKENS.DOB]: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  [REDACTION_TOKENS.ADDRESS]: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  [REDACTION_TOKENS.PHONE]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  [REDACTION_TOKENS.EMAIL]: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  [REDACTION_TOKENS.CLAIM_NUMBER]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  [REDACTION_TOKENS.SERVICE_NUMBER]: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  [REDACTION_TOKENS.MRN]: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
};

function highlightRedactions(text: string): React.ReactNode[] {
  const tokenPattern = /\[(SSN|DOB|ADDRESS|PHONE|EMAIL|CLAIM_NUMBER|SERVICE_NUMBER|MRN)_REDACTED\]/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    const colorClass = TOKEN_COLORS[token] || 'bg-muted text-foreground';
    parts.push(
      <span key={match.index} className={`inline-block px-1.5 py-0.5 rounded text-xs font-mono border ${colorClass}`}>
        {token}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

export function RedactionPreview({ originalText, onConfirm, onCancel }: RedactionPreviewProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  const result = useMemo(() => redactPII(originalText), [originalText]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-gold/10 shrink-0">
          <Shield className="h-5 w-5 text-gold" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{AI_COPY.preSendHeader}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {AI_COPY.preSendBody}
          </p>
        </div>
      </div>

      {/* Redaction Summary */}
      {result.redactionCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(result.redactionsByType).map(([token, count]) => (
            <Badge key={token} variant="secondary" className="text-xs">
              {token}: {count} found
            </Badge>
          ))}
        </div>
      )}

      {result.redactionCount === 0 && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-sm text-emerald-300">
            No identifiers detected. The text appears clean.
          </p>
        </div>
      )}

      {/* Preview */}
      <Card>
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">
              {showOriginal ? 'Original Text' : 'This is what will be sent to AI'}
            </CardTitle>
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Eye className="h-3 w-3" />
              {showOriginal ? 'Show redacted' : 'Show original'}
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-64 overflow-y-auto rounded-lg bg-muted/30 p-3 text-sm leading-relaxed whitespace-pre-wrap">
            {showOriginal
              ? originalText
              : highlightRedactions(result.redactedText)}
          </div>
        </CardContent>
      </Card>

      {/* Info sections */}
      <div className="space-y-2 text-xs text-muted-foreground">
        <p><strong className="text-foreground">What gets sent:</strong> {AI_COPY.whatGetsSent}</p>
        <p><strong className="text-foreground">Your control:</strong> {AI_COPY.yourControl}</p>
        <p>{AI_COPY.noTelemetry}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go back
        </Button>
        <Button onClick={() => onConfirm(result.redactedText)} className="flex-1">
          <Send className="h-4 w-4 mr-2" />
          Send to AI
        </Button>
      </div>
    </div>
  );
}
