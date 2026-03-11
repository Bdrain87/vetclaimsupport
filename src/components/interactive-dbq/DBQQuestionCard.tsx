import { useState, useCallback } from 'react';
import { Loader2, Sparkles, ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { getRatingColor } from '@/utils/ratingColors';
import { DBQRatingColorBar } from './DBQRatingColorBar';
import type { QuestionAnalysisResult } from '@/lib/interactive-dbq-prompts';

interface DBQQuestionCardProps {
  index: number;
  total: number;
  question: string;
  whyItMatters: string;
  tips?: string[];
  answer: string;
  onAnswerChange: (value: string) => void;
  analysisResult: QuestionAnalysisResult | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  availablePercents: number[];
  hasCriteria: boolean;
}

export function DBQQuestionCard({
  index,
  total,
  question,
  whyItMatters,
  tips,
  answer,
  onAnswerChange,
  analysisResult,
  isAnalyzing,
  onAnalyze,
  availablePercents,
  hasCriteria,
}: DBQQuestionCardProps) {
  const [showTips, setShowTips] = useState(false);

  const handleAnalyze = useCallback(() => {
    if (answer.trim().length < 10) return;
    onAnalyze();
  }, [answer, onAnalyze]);

  const ratingColor = analysisResult ? getRatingColor(analysisResult.alignedPercent) : null;

  return (
    <div
      className={cn(
        'rounded-2xl border bg-card p-4 space-y-4 transition-colors duration-300',
        !analysisResult && 'border-border',
      )}
      style={analysisResult && ratingColor ? { borderColor: `${ratingColor.hex}50` } : undefined}
    >
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">
            Question {index + 1} of {total}
          </span>
          {analysisResult && (
            <span className={cn('flex items-center gap-1 text-xs font-medium', ratingColor?.textClass)}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Analyzed
            </span>
          )}
        </div>
        <h3 className="text-sm font-semibold text-foreground leading-snug">{question}</h3>
        <p className="text-xs text-muted-foreground">{whyItMatters}</p>
      </div>

      {/* Tips toggle */}
      {tips && tips.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowTips(!showTips)}
            aria-expanded={showTips}
            className="flex items-center gap-1 text-xs text-gold hover:text-gold/80 transition-colors min-h-[44px]"
          >
            {showTips ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {showTips ? 'Hide tips' : 'Show tips'}
          </button>
          {showTips && (
            <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground pl-4">
              {tips.map((tip, i) => (
                <li key={i} className="list-disc">{tip}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Textarea */}
      <Textarea
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Describe your symptoms, their frequency, severity, and how they affect your daily life and work..."
        className="min-h-[120px] text-sm resize-y"
        rows={5}
      />

      {/* Analyze button */}
      {hasCriteria && (
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || answer.trim().length < 10}
          className="w-full min-h-[44px]"
          variant={analysisResult ? 'outline' : 'default'}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              {analysisResult ? 'Re-Analyze' : 'Analyze'}
            </>
          )}
        </Button>
      )}

      {/* Analysis result */}
      {analysisResult && (
        <div className="space-y-3 pt-2 border-t border-border">
          <DBQRatingColorBar
            availablePercents={availablePercents}
            activePercent={analysisResult.alignedPercent}
            confidence={analysisResult.confidence}
          />

          <p className="text-sm text-foreground">{analysisResult.explanation}</p>

          {analysisResult.keyTermsPresent.length > 0 && (
            <div>
              <span className="text-xs font-medium text-emerald-400">Strong points:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {analysisResult.keyTermsPresent.map((term, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {term}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysisResult.keyTermsMissing.length > 0 && (
            <div>
              <span className="text-xs font-medium text-amber-400">Missing evidence:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {analysisResult.keyTermsMissing.map((term, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {term}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysisResult.improvementSuggestion && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <span className="text-xs font-medium text-primary">Suggestion:</span>
              <p className="text-xs text-muted-foreground mt-0.5">{analysisResult.improvementSuggestion}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
