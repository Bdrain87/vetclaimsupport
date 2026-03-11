import { useState, useMemo } from 'react';
import {
  Search, ClipboardList, AlertTriangle, ChevronRight, ChevronDown,
  FileText, CheckCircle2, Info, ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PageContainer } from '@/components/PageContainer';
import { dbqQuickReference, type DBQReference } from '@/data/vaResources/dbqReference';
import { conditionRatingCriteria, type ConditionRatingCriteria, type RatingLevel } from '@/data/ratingCriteria';
import { findDBQsForUserCondition } from '@/utils/dbqLookup';
import { useClaims } from '@/hooks/useClaims';
import useAppStore from '@/store/useAppStore';

// Map DBQ IDs to rating criteria condition IDs
function findRatingCriteria(dbq: DBQReference): ConditionRatingCriteria | undefined {
  return conditionRatingCriteria.find(c =>
    c.conditionId === dbq.id ||
    dbq.diagnosticCodes.some(dc => c.diagnosticCode === dc || c.diagnosticCode.includes(dc))
  );
}

// Rating level color based on percentage — smooth cool→warm→gold ramp
function ratingColor(percent: number): string {
  if (percent === 100) return 'bg-gold/15 text-gold border-gold/30';
  if (percent >= 70) return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
  if (percent >= 50) return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  if (percent >= 30) return 'bg-teal-500/15 text-teal-400 border-teal-500/30';
  if (percent >= 10) return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
  return 'bg-muted text-muted-foreground border-border';
}

interface UserAnswers {
  [questionIndex: number]: number; // 0-4 severity scale
}

export default function DBQAnalyzer() {
  const [search, setSearch] = useState('');
  const [selectedDBQ, setSelectedDBQ] = useState<DBQReference | null>(null);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const claims = useClaims();
  const userConditions = useAppStore((s) => s.userConditions || []);

  const filteredDBQs = useMemo(() => {
    if (!search.trim()) return dbqQuickReference;
    const q = search.toLowerCase();
    return dbqQuickReference.filter(dbq =>
      dbq.name.toLowerCase().includes(q) ||
      dbq.conditionsCovered.some(c => c.toLowerCase().includes(q)) ||
      dbq.formNumber.toLowerCase().includes(q)
    );
  }, [search]);

  // Find user's conditions that match DBQ forms
  const userMatchedDBQs = useMemo(() => {
    if (userConditions.length === 0) return [];
    const matched = new Map<string, DBQReference>();
    for (const uc of userConditions) {
      for (const dbq of findDBQsForUserCondition(uc)) {
        matched.set(dbq.id, dbq);
      }
    }
    return Array.from(matched.values());
  }, [userConditions]);

  const ratingCriteria = selectedDBQ ? findRatingCriteria(selectedDBQ) : null;

  // Estimate rating based on answered questions
  const estimatedRating = useMemo(() => {
    if (!selectedDBQ || !ratingCriteria || Object.keys(answers).length === 0) return null;
    const totalQuestions = selectedDBQ.keyQuestions.length;
    const answeredCount = Object.keys(answers).length;
    if (answeredCount === 0) return null;

    // Average severity (0-4) mapped to rating levels
    const avgSeverity = Object.values(answers).reduce((a, b) => a + b, 0) / answeredCount;
    const levels = ratingCriteria.ratingLevels;

    // Map severity 0-4 to rating level index
    const levelIndex = Math.min(Math.round(avgSeverity * (levels.length - 1) / 4), levels.length - 1);
    return levels[levelIndex];
  }, [selectedDBQ, ratingCriteria, answers]);

  const handleSelectDBQ = (dbq: DBQReference) => {
    setSelectedDBQ(dbq);
    setAnswers({});
    setExpandedLevel(null);
  };

  const handleBack = () => {
    setSelectedDBQ(null);
    setAnswers({});
    setExpandedLevel(null);
  };

  const severityLabels = ['Not present', 'Mild', 'Moderate', 'Severe', 'Extreme'];

  // ── DBQ Detail View ──
  if (selectedDBQ) {
    return (
      <PageContainer className="py-6 space-y-4">
        <button onClick={handleBack} className="text-sm text-gold flex items-center gap-1 mb-2">
          <ChevronRight className="h-4 w-4 rotate-180" /> Back to all DBQs
        </button>

        <div className="space-y-1">
          <h1 className="text-xl font-bold text-foreground">{selectedDBQ.name}</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">Form {selectedDBQ.formNumber}</Badge>
            {selectedDBQ.diagnosticCodes.map(dc => (
              <Badge key={dc} variant="outline" className="text-xs">DC {dc}</Badge>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <Card className="border-gold/30 bg-gold/5">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-gold">For preparation only.</strong> This tool helps you understand what DBQ questions measure and how rating criteria map to your situation. It does not replace a medical exam. All ratings are determined by VA raters based on C&P exam findings and the totality of evidence. Self-assessment here is <strong>not</strong> a diagnosis or rating determination.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Questions */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-gold" />
            Key DBQ Questions — Self-Assessment
          </h2>
          {selectedDBQ.keyQuestions.map((q, i) => (
            <Card key={i} className="border-border">
              <CardContent className="p-3 space-y-2">
                <p className="text-sm font-medium text-foreground">{q.question}</p>
                <p className="text-xs text-muted-foreground">{q.whyItMatters}</p>

                {/* Severity selector */}
                <div className="flex gap-1 flex-wrap">
                  {severityLabels.map((label, severity) => (
                    <button
                      key={severity}
                      onClick={() => setAnswers(prev => ({ ...prev, [i]: severity }))}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-xs transition-all border',
                        answers[i] === severity
                          ? 'bg-gold/20 text-gold border-gold/40 font-medium'
                          : 'bg-secondary/50 text-muted-foreground border-transparent hover:border-border'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Tips */}
                {q.tips && q.tips.length > 0 && (
                  <div className="flex items-start gap-1.5 pt-1">
                    <Info className="h-3 w-3 text-gold/60 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-muted-foreground/70">{q.tips.join(' · ')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Estimated Rating */}
        {estimatedRating && (
          <Card className="border-gold/30 bg-gold/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gold" />
                Estimated Rating Range
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-3">
                <span className={cn(
                  'text-2xl font-bold px-3 py-1 rounded-xl border',
                  ratingColor(estimatedRating.percent)
                )}>
                  {estimatedRating.percent}%
                </span>
                <p className="text-xs text-muted-foreground flex-1">
                  Based on your self-assessment responses. Actual rating may differ.
                </p>
              </div>
              <p className="text-xs text-muted-foreground/70 italic">
                This is an estimate for preparation purposes only. Your actual VA rating depends on the C&P examiner's findings, medical records, and the VA rater's assessment of all evidence.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Full Rating Criteria Breakdown */}
        {ratingCriteria && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-gold" />
              Rating Criteria — {ratingCriteria.cfrReference}
            </h2>
            {ratingCriteria.ratingLevels.map((level) => (
              <Card
                key={level.percent}
                className={cn(
                  'border cursor-pointer transition-all',
                  expandedLevel === level.percent ? 'border-gold/40' : 'border-border',
                  estimatedRating?.percent === level.percent && 'ring-1 ring-gold/30'
                )}
                onClick={() => setExpandedLevel(expandedLevel === level.percent ? null : level.percent)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'text-sm font-bold px-2 py-0.5 rounded-lg border',
                        ratingColor(level.percent)
                      )}>
                        {level.percent}%
                      </span>
                      {estimatedRating?.percent === level.percent && (
                        <Badge className="bg-gold/20 text-gold border-gold/30 text-[10px]">Your estimate</Badge>
                      )}
                    </div>
                    {expandedLevel === level.percent ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  {expandedLevel === level.percent && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-muted-foreground leading-relaxed">{level.criteria}</p>
                      <div className="flex flex-wrap gap-1">
                        {level.keywords.map((kw) => (
                          <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {ratingCriteria.scheduleUrl && (
              <a
                href={ratingCriteria.scheduleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gold flex items-center gap-1 px-1"
              >
                View full 38 CFR rating schedule <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        )}

        {/* What Determines Rating */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">What Determines Your Rating</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {selectedDBQ.whatDeterminesRating.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="h-3 w-3 text-gold shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Common Mistakes */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Common Mistakes to Avoid
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {selectedDBQ.commonMistakes.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-destructive text-xs mt-0.5">x</span>
                <p className="text-xs text-muted-foreground">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Prep Tips */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Prep Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {selectedDBQ.prepTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="h-3 w-3 text-success shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">{tip}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bottom Disclaimer */}
        <div className="border-t border-border pt-3">
          <p className="text-[10px] text-muted-foreground/60 text-center leading-relaxed">
            This tool is for educational and exam preparation purposes only. It does not provide medical diagnoses, legal advice, or official VA rating determinations. All disability rating decisions are made exclusively by VA raters based on the C&P examiner's findings and the totality of evidence in your claims file. Consult an accredited VSO or attorney for claim-specific guidance.
          </p>
        </div>
      </PageContainer>
    );
  }

  // ── DBQ List View ──
  return (
    <PageContainer className="py-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gold/10 border border-gold/20">
          <ClipboardList className="h-6 w-6 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">DBQ Self-Assessment</h1>
          <p className="text-muted-foreground text-sm">Interactive disability rating estimator</p>
        </div>
      </div>

      {/* Main Disclaimer */}
      {showDisclaimer && (
        <Card className="border-gold/30 bg-gold/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Important Disclaimer</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This tool helps you <strong>understand</strong> Disability Benefits Questionnaires (DBQs) and <strong>prepare</strong> for your C&P exam. It shows you what examiners look for, how rating criteria work, and helps you self-assess your symptoms for preparation.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>This is NOT a medical exam or rating determination.</strong> All VA disability ratings are determined exclusively by VA-certified raters based on C&P examiner findings and the evidence in your claims file. Self-assessment results are approximations only.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Rating percentages shown are based on 38 CFR Part 4 — Schedule for Rating Disabilities. Actual ratings depend on individual medical evidence and examiner findings.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs mt-1"
                  onClick={() => setShowDisclaimer(false)}
                >
                  I understand
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search conditions, forms, or diagnostic codes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10 rounded-xl"
        />
      </div>

      {/* Your Conditions */}
      {userMatchedDBQs.length > 0 && !search.trim() && (
        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-gold uppercase tracking-wider px-1">Your Conditions</h2>
          <div className="space-y-1.5">
            {userMatchedDBQs.map((dbq) => (
              <DBQCard key={dbq.id} dbq={dbq} onSelect={handleSelectDBQ} highlighted />
            ))}
          </div>
        </div>
      )}

      {/* All DBQs */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
          {search.trim() ? `Results (${filteredDBQs.length})` : 'All Available DBQs'}
        </h2>
        {filteredDBQs.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No DBQs match &ldquo;{search}&rdquo;</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {filteredDBQs.map((dbq) => (
              <DBQCard key={dbq.id} dbq={dbq} onSelect={handleSelectDBQ} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Info */}
      <div className="border-t border-border pt-3">
        <p className="text-[10px] text-muted-foreground/60 text-center leading-relaxed">
          DBQ forms and rating criteria sourced from VA.gov and 38 CFR Part 4. This tool is for educational purposes only and does not constitute medical or legal advice.
        </p>
      </div>
    </PageContainer>
  );
}

function DBQCard({ dbq, onSelect, highlighted }: { dbq: DBQReference; onSelect: (d: DBQReference) => void; highlighted?: boolean }) {
  const criteria = findRatingCriteria(dbq);
  const ratingRange = criteria
    ? `${criteria.ratingLevels[0].percent}–${criteria.ratingLevels[criteria.ratingLevels.length - 1].percent}%`
    : null;

  return (
    <button
      onClick={() => onSelect(dbq)}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-2xl border bg-card',
        'hover:bg-accent/50 active:scale-[0.98] transition-all text-left',
        highlighted ? 'border-gold/30 bg-gold/5' : 'border-border'
      )}
    >
      <div className={cn('p-2 rounded-xl shrink-0', highlighted ? 'bg-gold/15' : 'bg-gold/10')}>
        <ClipboardList className="h-4 w-4 text-gold" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-foreground block truncate">{dbq.name}</span>
        <span className="text-xs text-muted-foreground block leading-tight">
          Form {dbq.formNumber} · {dbq.conditionsCovered.slice(0, 2).join(', ')}
          {dbq.conditionsCovered.length > 2 && ` +${dbq.conditionsCovered.length - 2}`}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {ratingRange && (
          <Badge variant="outline" className="text-[10px]">{ratingRange}</Badge>
        )}
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </button>
  );
}
