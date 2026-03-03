import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ChevronLeft,
  Shield,
  Pill,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Heart,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { PageContainer } from '@/components/PageContainer';
import { useUserConditions } from '@/hooks/useUserConditions';
import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';
import {
  conditionRatingCriteria,
  type ConditionRatingCriteria,
} from '@/data/ratingCriteria';
import { format, subDays } from 'date-fns';

// ---------------------------------------------------------------------------
// General exam tips (publicly available knowledge)
// ---------------------------------------------------------------------------

const GENERAL_EXAM_TIPS = [
  'Describe your WORST days, not your average or best days',
  'Be honest and specific — do not minimize or exaggerate',
  'Mention every symptom, even ones that seem minor',
  'Describe how symptoms affect work, daily tasks, and relationships',
  'If you have flare-ups, describe how often and how long they last',
  'Bring copies of any private medical records the VA may not have',
  'Arrive early — rushing increases anxiety and can affect your presentation',
  'You can bring a buddy or spouse for moral support (they wait outside)',
];

const THINGS_TO_AVOID = [
  'Don\'t say "I\'m fine" or "I\'m doing okay" out of habit',
  'Don\'t dress up more than your normal daily routine',
  'Don\'t downplay symptoms to appear tougher',
  'Don\'t volunteer that you have "good days" unless asked',
  'Don\'t argue with the examiner — just describe your experience',
  'Don\'t bring legal or claim strategy documents to the exam',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function findCriteria(conditionId: string, displayName?: string): ConditionRatingCriteria | null {
  const direct = conditionRatingCriteria.find((c) => c.conditionId === conditionId);
  if (direct) return direct;
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ExamDayMode() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const focusCondition = searchParams.get('condition');
  const { conditions: userConditions } = useUserConditions();
  const profile = useProfileStore();
  const symptoms = useAppStore((s) => s.symptoms);
  const medications = useAppStore((s) => s.medications);
  const medicalVisits = useAppStore((s) => s.medicalVisits);

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['tips', 'conditions']),
  );

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Recent symptoms (last 90 days) grouped by condition
  const recentSymptoms = useMemo(() => {
    const cutoff = subDays(new Date(), 90).toISOString().slice(0, 10);
    const recent = symptoms.filter((s) => s.date >= cutoff);
    const grouped: Record<string, typeof recent> = {};
    for (const s of recent) {
      const key = s.bodyArea || 'General';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(s);
    }
    return grouped;
  }, [symptoms]);

  // Current medications
  const currentMeds = useMemo(
    () => medications.filter((m) => !m.endDate || m.endDate >= new Date().toISOString().slice(0, 10)),
    [medications],
  );

  // Recent medical visits (last 6 months)
  const recentVisits = useMemo(() => {
    const cutoff = subDays(new Date(), 180).toISOString().slice(0, 10);
    return medicalVisits
      .filter((v) => (v.date || '') >= cutoff)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 5);
  }, [medicalVisits]);

  // Build per-condition exam data
  const conditionExamData = useMemo(() => {
    return userConditions.map((uc) => {
      const name = uc.displayName || uc.conditionId;
      const criteria = findCriteria(uc.conditionId, name);
      const condSymptoms = recentSymptoms[name] || [];

      // Severity stats
      const severities = condSymptoms.map((s) => s.severity).filter((v): v is number => v > 0);
      const avgSeverity = severities.length > 0
        ? severities.reduce((a, b) => a + b, 0) / severities.length
        : 0;
      const maxSeverity = severities.length > 0 ? Math.max(...severities) : 0;

      // Frequency summary
      const frequencies: Record<string, number> = {};
      condSymptoms.forEach((s) => {
        if (s.frequency) frequencies[s.frequency] = (frequencies[s.frequency] || 0) + 1;
      });
      const topFrequency = Object.entries(frequencies).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

      // Unique symptoms list
      const uniqueSymptoms = [...new Set(condSymptoms.map((s) => s.symptom).filter(Boolean))];

      return { uc, name, criteria, condSymptoms, avgSeverity, maxSeverity, topFrequency, uniqueSymptoms };
    });
  }, [userConditions, recentSymptoms]);

  return (
    <PageContainer className="py-6 space-y-5">
      {/* Header — calm, focused styling */}
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
          <div className="p-2.5 rounded-xl bg-success/10 border border-success/20">
            <Shield className="h-6 w-6 text-success" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Exam Day</h1>
            <p className="text-muted-foreground text-sm">
              Quick reference for your C&P exam — review before you go in
            </p>
          </div>
        </div>
      </div>

      {/* Profile quick reference */}
      <Card className="border-success/20 bg-success/5">
        <CardContent className="py-3 px-4">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {profile.firstName && (
              <div>
                <span className="text-muted-foreground">Name: </span>
                <span className="text-foreground font-medium">{profile.firstName} {profile.lastName}</span>
              </div>
            )}
            {profile.branch && (
              <div>
                <span className="text-muted-foreground">Branch: </span>
                <span className="text-foreground font-medium">{profile.branch}</span>
              </div>
            )}
            {profile.mosTitle && (
              <div className="col-span-2">
                <span className="text-muted-foreground">MOS: </span>
                <span className="text-foreground font-medium">
                  {profile.mosCode && `${profile.mosCode} — `}{profile.mosTitle}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* General Exam Tips */}
      <Collapsible open={expandedSections.has('tips')} onOpenChange={() => toggleSection('tips')}>
        <Card>
          <CollapsibleTrigger className="w-full text-left p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm font-semibold text-foreground">General Exam Tips</span>
              </div>
              {expandedSections.has('tips') ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 space-y-3">
              <div className="space-y-1.5">
                {GENERAL_EXAM_TIPS.map((tip, i) => (
                  <div key={i} className="flex gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3 w-3 text-success flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-1.5">
                <p className="text-xs font-semibold text-destructive/80">Things to Avoid</p>
                {THINGS_TO_AVOID.map((item, i) => (
                  <div key={i} className="flex gap-2 text-xs text-muted-foreground">
                    <AlertTriangle className="h-3 w-3 text-destructive/60 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Per-Condition Exam Prep */}
      <Collapsible open={expandedSections.has('conditions')} onOpenChange={() => toggleSection('conditions')}>
        <CollapsibleTrigger className="w-full text-left">
          <div className="flex items-center justify-between px-1 py-2">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-gold" />
              <span className="text-sm font-semibold text-foreground">
                Your Conditions ({conditionExamData.length})
              </span>
            </div>
            {expandedSections.has('conditions') ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-3">
            {conditionExamData.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No conditions added yet. Add conditions from your Claims page.
                  </p>
                </CardContent>
              </Card>
            )}

            {conditionExamData.map(({ uc, name, criteria, condSymptoms, avgSeverity, maxSeverity, topFrequency, uniqueSymptoms }) => (
              <Card key={uc.id} className={focusCondition === uc.conditionId ? 'ring-1 ring-gold' : ''}>
                <CardContent className="py-3 px-4 space-y-3">
                  {/* Condition header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{name}</p>
                      {criteria && (
                        <p className="text-[10px] text-muted-foreground">
                          {criteria.cfrReference} (DC {criteria.diagnosticCode})
                        </p>
                      )}
                    </div>
                    {condSymptoms.length > 0 && (
                      <Badge className="bg-gold/20 text-gold border-gold/30 text-[10px]">
                        {condSymptoms.length} logs
                      </Badge>
                    )}
                  </div>

                  {/* Your symptom summary */}
                  {condSymptoms.length > 0 && (
                    <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Your Logged Data (90 days)
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-sm font-bold text-foreground">{avgSeverity.toFixed(1)}</p>
                          <p className="text-[10px] text-muted-foreground">Avg Severity</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{maxSeverity}</p>
                          <p className="text-[10px] text-muted-foreground">Peak Severity</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{topFrequency || '--'}</p>
                          <p className="text-[10px] text-muted-foreground">Most Common</p>
                        </div>
                      </div>
                      {uniqueSymptoms.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {uniqueSymptoms.slice(0, 8).map((s) => (
                            <Badge key={s} variant="outline" className="text-[10px] px-1.5 py-0">
                              {s}
                            </Badge>
                          ))}
                          {uniqueSymptoms.length > 8 && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              +{uniqueSymptoms.length - 8} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Condition-specific exam tips */}
                  {criteria?.examTips && criteria.examTips.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        What the Examiner Will Evaluate
                      </p>
                      {criteria.examTips.map((tip, i) => (
                        <div key={i} className="flex gap-2 text-xs text-muted-foreground">
                          <span className="text-gold flex-shrink-0">&#x2022;</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Common mistakes */}
                  {criteria?.commonMistakes && criteria.commonMistakes.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-semibold text-destructive/70 uppercase tracking-wider">
                        Don't Make These Mistakes
                      </p>
                      {criteria.commonMistakes.map((m, i) => (
                        <div key={i} className="flex gap-2 text-xs text-muted-foreground">
                          <AlertTriangle className="h-3 w-3 text-destructive/50 flex-shrink-0 mt-0.5" />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Current Medications */}
      {currentMeds.length > 0 && (
        <Collapsible>
          <Card>
            <CollapsibleTrigger className="w-full text-left p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pill className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Current Medications ({currentMeds.length})
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-4 space-y-1.5">
                {currentMeds.map((med) => (
                  <div key={med.id} className="flex items-center justify-between text-xs py-1 border-b border-border/50 last:border-0">
                    <div>
                      <span className="text-foreground font-medium">{med.name}</span>
                      {med.dosage && <span className="text-muted-foreground ml-2">{med.dosage}</span>}
                    </div>
                    {med.frequency && (
                      <span className="text-muted-foreground">{med.frequency}</span>
                    )}
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Recent Medical Visits */}
      {recentVisits.length > 0 && (
        <Collapsible>
          <Card>
            <CollapsibleTrigger className="w-full text-left p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gold" />
                  <span className="text-sm font-semibold text-foreground">
                    Recent Medical Visits ({recentVisits.length})
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-4 space-y-2">
                {recentVisits.map((visit) => (
                  <div key={visit.id} className="text-xs py-1.5 border-b border-border/50 last:border-0">
                    <div className="flex justify-between">
                      <span className="text-foreground font-medium">{visit.provider || 'Provider not recorded'}</span>
                      {visit.date && <span className="text-muted-foreground">{format(new Date(visit.date), 'MMM d, yyyy')}</span>}
                    </div>
                    {visit.reason && <p className="text-muted-foreground mt-0.5">{visit.reason}</p>}
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Disclaimer */}
      <div className="flex gap-3 p-3 rounded-xl border border-border bg-card">
        <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          This is a personal reference tool showing your own logged data and publicly available exam
          information. It is not legal or medical advice. For personalized guidance, consult a{' '}
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
    </PageContainer>
  );
}
