import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { safeFormatDate } from '@/utils/dateUtils';
import {
  ChevronLeft,
  Target,
  ChevronDown,
  ChevronUp,
  Activity,
  CheckCircle2,
  Circle,
  Info,
  AlertTriangle,
  TrendingUp,
  ExternalLink,
  FileText,
  Stethoscope,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { PageContainer } from '@/components/PageContainer';
import { useUserConditions } from '@/hooks/useUserConditions';
import { getConditionDisplayName } from '@/utils/conditionResolver';
import useAppStore from '@/store/useAppStore';
import { useClaims } from '@/hooks/useClaims';
import { ClaimIntelligence } from '@/services/claimIntelligence';
import { ProgressRing } from '@/components/ui/progress-ring';
import {
  conditionRatingCriteria,
  type ConditionRatingCriteria,
  type RatingLevel,
} from '@/data/ratingCriteria';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Fuzzy-match a condition name to our rating criteria database */
function findCriteria(conditionId: string, displayName?: string): ConditionRatingCriteria | null {
  // Direct ID match first
  const direct = conditionRatingCriteria.find((c) => c.conditionId === conditionId);
  if (direct) return direct;

  // Fuzzy match on display name
  if (!displayName) return null;
  const lower = displayName.toLowerCase();
  return (
    conditionRatingCriteria.find((c) => c.conditionName.toLowerCase().includes(lower)) ||
    conditionRatingCriteria.find((c) => lower.includes(c.conditionId.toLowerCase())) ||
    conditionRatingCriteria.find((c) => {
      const words = c.conditionName.toLowerCase().split(/[\s()-]+/).filter((w) => w.length > 3);
      return words.some((w) => lower.includes(w));
    }) ||
    null
  );
}

/** Count how many rating-level keywords appear in the veteran's symptom text */
function matchKeywords(level: RatingLevel, symptomTexts: string[]): { matched: string[]; unmatched: string[] } {
  const combined = symptomTexts.join(' ').toLowerCase();
  const matched: string[] = [];
  const unmatched: string[] = [];

  for (const kw of level.keywords) {
    // Split multi-word keywords and check if core words appear
    const words = kw.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    const found = words.length > 0
      ? words.some((w) => combined.includes(w))
      : combined.includes(kw.toLowerCase());
    if (found) {
      matched.push(kw);
    } else {
      unmatched.push(kw);
    }
  }
  return { matched, unmatched };
}

/** Determine which rating level the veteran's evidence best supports */
function estimateEvidenceLevel(
  criteria: ConditionRatingCriteria,
  symptomTexts: string[],
  avgSeverity: number,
  entryCount: number,
): { level: number; confidence: 'low' | 'moderate' | 'strong'; matchPct: number } {
  if (entryCount === 0) return { level: 0, confidence: 'low', matchPct: 0 };

  let bestLevel = 0;
  let bestPct = 0;

  for (const rl of criteria.ratingLevels) {
    const { matched } = matchKeywords(rl, symptomTexts);
    const pct = rl.keywords.length > 0 ? matched.length / rl.keywords.length : 0;
    // Must match at least 30% of keywords to count for that level
    if (pct >= 0.3) {
      bestLevel = rl.percent;
      bestPct = pct;
    }
  }

  // Severity sanity check — high severity logs support higher ratings
  if (avgSeverity >= 7 && bestLevel < 50) bestLevel = Math.max(bestLevel, 30);
  if (avgSeverity >= 8 && bestLevel < 70) bestLevel = Math.max(bestLevel, 50);

  const confidence: 'low' | 'moderate' | 'strong' =
    entryCount < 3 ? 'low' : entryCount < 10 ? 'moderate' : 'strong';

  return { level: bestLevel, confidence, matchPct: bestPct };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EvidenceStrength() {
  const navigate = useNavigate();
  const { conditions: userConditions } = useUserConditions();
  const symptoms = useAppStore((s) => s.symptoms);
  const { data: claimsData } = useClaims();
  const [expandedConditions, setExpandedConditions] = useState<Set<string>>(new Set());

  // Per-condition evidence completeness
  const evidenceScores = useMemo(() => {
    return userConditions.map((uc) => {
      const name = getConditionDisplayName(uc);
      const completeness = ClaimIntelligence.getConditionEvidenceCompleteness(name, uc, claimsData);
      return { uc, name, ...completeness };
    });
  }, [userConditions, claimsData]);

  // Build a text corpus per condition from all symptom entries
  const conditionEvidence = useMemo(() => {
    const map: Record<string, { texts: string[]; avgSeverity: number; count: number; recentDate: string }> = {};

    for (const s of symptoms) {
      const key = s.bodyArea || s.condition || 'general';
      if (!map[key]) map[key] = { texts: [], avgSeverity: 0, count: 0, recentDate: '' };
      map[key].texts.push(
        [s.symptom, s.notes, s.frequency, s.dailyImpact].filter(Boolean).join(' '),
      );
      map[key].avgSeverity += s.severity || 0;
      map[key].count += 1;
      if (!map[key].recentDate || s.date > map[key].recentDate) map[key].recentDate = s.date;
    }

    // Finalize averages
    for (const key of Object.keys(map)) {
      if (map[key].count > 0) map[key].avgSeverity /= map[key].count;
    }

    return map;
  }, [symptoms]);

  // Build analysis per user condition
  const conditionAnalysis = useMemo(() => {
    return userConditions.map((uc) => {
      const name = getConditionDisplayName(uc);
      const criteria = findCriteria(uc.conditionId, name);

      // Gather symptom evidence — fuzzy match condition name to bodyArea
      const lowerName = name.toLowerCase();
      let evidence = conditionEvidence[name] || null;

      // Try partial matches if exact doesn't work
      if (!evidence) {
        for (const [key, val] of Object.entries(conditionEvidence)) {
          if (key.toLowerCase().includes(lowerName) || lowerName.includes(key.toLowerCase())) {
            evidence = val;
            break;
          }
        }
      }

      const texts = evidence?.texts || [];
      const avgSeverity = evidence?.avgSeverity || 0;
      const count = evidence?.count || 0;
      const recentDate = evidence?.recentDate || '';

      const estimate = criteria ? estimateEvidenceLevel(criteria, texts, avgSeverity, count) : null;

      return { uc, name, criteria, texts, avgSeverity, count, recentDate, estimate };
    });
  }, [userConditions, conditionEvidence]);

  const toggleExpand = (id: string) => {
    setExpandedConditions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getConfidenceColor = (c: 'low' | 'moderate' | 'strong') => {
    if (c === 'strong') return 'bg-success/20 text-success border-success/30';
    if (c === 'moderate') return 'bg-gold/20 text-gold border-gold/30';
    return 'bg-muted text-muted-foreground border-border';
  };

  const getLevelColor = (pct: number) => {
    if (pct >= 70) return 'text-success';
    if (pct >= 50) return 'text-gold';
    if (pct >= 30) return 'text-gold';
    return 'text-muted-foreground';
  };

  // Conditions with criteria data vs without
  const withCriteria = conditionAnalysis.filter((c) => c.criteria);
  const withoutCriteria = conditionAnalysis.filter((c) => !c.criteria);

  return (
    <PageContainer className="py-6 space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-2 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/20">
            <Target className="h-6 w-6 text-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Evidence Strength</h1>
            <p className="text-muted-foreground text-sm">
              See how your symptom logs align with VA rating criteria
            </p>
          </div>
        </div>
      </div>

      {/* Educational disclaimer */}
      <div className="flex gap-3 p-3 rounded-2xl border border-primary/20 bg-primary/5">
        <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          This is an educational reference based on publicly available 38 CFR Part 4 rating criteria.
          It does not predict your rating — your actual rating is determined by VA raters based on your
          C&P exam and the totality of medical evidence. Consider discussing your claim with a{' '}
          <a
            href="https://www.va.gov/get-help-from-accredited-representative/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            VA-accredited representative
          </a>.
        </p>
      </div>

      {/* Evidence Completeness per Condition */}
      {evidenceScores.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Evidence Completeness
          </p>
          {evidenceScores.map(({ uc, name, score, items, recommendations }) => (
            <Card key={uc.id} className="rounded-2xl overflow-hidden">
              <CardContent className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <ProgressRing
                    value={score}
                    size="sm"
                    variant={score >= 80 ? 'success' : score >= 50 ? 'warning' : 'danger'}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{name}</p>
                    <div className="mt-1 space-y-0.5">
                      {items.map((item) => (
                        <div key={item.label} className="flex items-center gap-1.5 text-[11px]">
                          {item.complete ? (
                            <CheckCircle2 className="h-3 w-3 text-success flex-shrink-0" />
                          ) : (
                            <Circle className="h-3 w-3 text-muted-foreground/30 flex-shrink-0" />
                          )}
                          <span className={item.complete ? 'text-muted-foreground' : 'text-foreground'}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {recommendations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border space-y-1.5">
                    {recommendations.slice(0, 2).map((rec, i) => (
                      <button
                        key={i}
                        onClick={() => navigate(rec.route)}
                        className="w-full text-left flex items-start gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ArrowRight className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                        <span>{rec.action} <span className="text-primary font-medium">(+{rec.pointsGain}pts)</span></span>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No conditions state */}
      {userConditions.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <AlertTriangle className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-3">
              Add conditions to your claim to see how your evidence aligns with rating criteria.
            </p>
            <Button variant="outline" onClick={() => navigate('/claims')}>
              Go to Conditions
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Conditions with criteria */}
      {withCriteria.map(({ uc, name, criteria, texts, count, avgSeverity, recentDate, estimate }) => {
        if (!criteria || !estimate) return null;
        const isExpanded = expandedConditions.has(uc.id);

        return (
          <Card key={uc.id} className="overflow-hidden rounded-2xl">
            <Collapsible open={isExpanded} onOpenChange={() => toggleExpand(uc.id)}>
              {/* Summary header */}
              <CollapsibleTrigger className="w-full text-left">
                <div className="p-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-semibold text-foreground break-words">{name}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5">
                        DC {criteria.diagnosticCode}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{count} symptom log{count !== 1 ? 's' : ''}</span>
                      {count > 0 && (
                        <>
                          <span>Avg severity: {avgSeverity.toFixed(1)}/10</span>
                          {recentDate && <span>Last: {safeFormatDate(recentDate)}</span>}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {count > 0 ? (
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getLevelColor(estimate.level)}`}>
                          {estimate.level}%
                        </p>
                        <Badge className={`text-[10px] ${getConfidenceColor(estimate.confidence)}`}>
                          {estimate.confidence} evidence
                        </Badge>
                      </div>
                    ) : (
                      <Badge className="bg-muted text-muted-foreground border-border text-[10px]">
                        No logs yet
                      </Badge>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="border-t border-border px-4 pb-4 pt-3 space-y-4">
                  {/* Rating levels breakdown */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Rating Criteria ({criteria.cfrReference})
                    </p>

                    {criteria.ratingLevels.map((rl) => {
                      const { matched, unmatched } = matchKeywords(rl, texts);
                      const isActive = estimate.level >= rl.percent;
                      const totalKw = rl.keywords.length;
                      const matchedCount = matched.length;

                      return (
                        <div
                          key={rl.percent}
                          className={`rounded-lg border p-3 space-y-2 transition-colors ${
                            isActive
                              ? 'border-gold/30 bg-gold/5'
                              : 'border-border bg-card'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {isActive ? (
                                <CheckCircle2 className="h-4 w-4 text-gold flex-shrink-0" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground/30 flex-shrink-0" />
                              )}
                              <span className={`text-sm font-bold ${isActive ? 'text-gold' : 'text-muted-foreground'}`}>
                                {rl.percent}%
                              </span>
                            </div>
                            {totalKw > 0 && (
                              <span className="text-[10px] text-muted-foreground">
                                {matchedCount}/{totalKw} evidence keywords
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {rl.criteria}
                          </p>

                          {/* Keyword match indicators */}
                          {totalKw > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {matched.map((kw) => (
                                <span
                                  key={kw}
                                  className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-success/15 text-success border border-success/20"
                                >
                                  <CheckCircle2 className="h-2.5 w-2.5" />
                                  {kw}
                                </span>
                              ))}
                              {unmatched.map((kw) => (
                                <span
                                  key={kw}
                                  className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border"
                                >
                                  <Circle className="h-2.5 w-2.5" />
                                  {kw}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Exam tips */}
                  {criteria.examTips && criteria.examTips.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        C&P Exam Tips
                      </p>
                      <div className="space-y-1">
                        {criteria.examTips.map((tip, i) => (
                          <div key={i} className="flex gap-2 text-xs text-muted-foreground">
                            <span className="text-gold flex-shrink-0">•</span>
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Common mistakes */}
                  {criteria.commonMistakes && criteria.commonMistakes.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Common Mistakes
                      </p>
                      <div className="space-y-1">
                        {criteria.commonMistakes.map((mistake, i) => (
                          <div key={i} className="flex gap-2 text-xs text-muted-foreground">
                            <AlertTriangle className="h-3 w-3 text-destructive flex-shrink-0 mt-0.5" />
                            <span>{mistake}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/health/symptoms');
                      }}
                    >
                      <Activity className="h-3 w-3" />
                      Log Symptoms
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/prep/personal-statement?condition=${encodeURIComponent(name)}`);
                      }}
                    >
                      <FileText className="h-3 w-3" />
                      Write Statement
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/prep/doctor-summary');
                      }}
                    >
                      <Stethoscope className="h-3 w-3" />
                      Doctor Summary
                    </Button>
                    {criteria.scheduleUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs gap-1.5 text-muted-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(criteria.scheduleUrl, '_blank', 'noopener,noreferrer');
                        }}
                      >
                        <ExternalLink className="h-3 w-3" />
                        View 38 CFR
                      </Button>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}

      {/* Conditions without criteria data */}
      {withoutCriteria.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Conditions Without Criteria Data
          </p>
          {withoutCriteria.map(({ uc, name, count }) => (
            <Card key={uc.id} className="rounded-2xl">
              <CardContent className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{name}</p>
                    <p className="text-xs text-muted-foreground">
                      {count > 0 ? `${count} symptom log${count !== 1 ? 's' : ''}` : 'No logs yet'}
                    </p>
                  </div>
                  <Badge className="bg-muted text-muted-foreground border-border text-[10px]">
                    Criteria not available
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
          <p className="text-[10px] text-muted-foreground/60 italic px-1">
            Rating criteria data is available for 51 common conditions. We're adding more over time.
          </p>
        </div>
      )}

      {/* Summary guidance */}
      {withCriteria.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gold" />
            <p className="text-sm font-semibold text-foreground">Strengthen Your Evidence</p>
          </div>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>
              <span className="text-foreground font-medium">Log consistently.</span>{' '}
              The VA looks for patterns over time, not single entries. Aim for regular logs over 30+ days.
            </p>
            <p>
              <span className="text-foreground font-medium">Describe your worst days.</span>{' '}
              When documenting symptoms, describe how bad it gets at its worst — not your average or best days.
            </p>
            <p>
              <span className="text-foreground font-medium">Document functional impact.</span>{' '}
              Always note how symptoms affect work, daily activities, and relationships. This is what drives VA rating criteria.
            </p>
            <p>
              <span className="text-foreground font-medium">Use specific language.</span>{' '}
              Look at the unmatched keywords (gray badges) above — try using those specific terms when logging symptoms.
            </p>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
