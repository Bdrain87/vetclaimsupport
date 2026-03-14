/**
 * Readiness Timeline (Phase 5C)
 *
 * Visual timeline showing a veteran's claim preparation progress.
 * Aggregates symptom logs, medical visits, statements, and evidence
 * into a chronological view with readiness scoring.
 */
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, Activity, FileText, Stethoscope, Shield,
  Calendar, CheckCircle2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/PageContainer';
import { WhatNextCard } from '@/components/shared/WhatNextCard';
import { useUserConditions } from '@/hooks/useUserConditions';
import { useClaims } from '@/hooks/useClaims';
import { getConditionDisplayName } from '@/utils/conditionResolver';
import { buildToolLink } from '@/lib/toolRouting';
import type { NextAction } from '@/utils/whatNext';

interface TimelineEvent {
  date: string;
  type: 'symptom' | 'visit' | 'statement' | 'medication' | 'milestone';
  label: string;
  detail?: string;
  conditionId?: string;
}

interface ReadinessScore {
  conditionName: string;
  conditionId: string;
  symptomScore: number;
  evidenceScore: number;
  statementScore: number;
  overallPercent: number;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

function getEventIcon(type: TimelineEvent['type']) {
  switch (type) {
    case 'symptom': return Activity;
    case 'visit': return Stethoscope;
    case 'statement': return FileText;
    case 'medication': return Shield;
    case 'milestone': return CheckCircle2;
  }
}

function getEventColor(type: TimelineEvent['type']) {
  switch (type) {
    case 'symptom': return 'text-blue-400 bg-blue-500/10';
    case 'visit': return 'text-green-400 bg-green-500/10';
    case 'statement': return 'text-purple-400 bg-purple-500/10';
    case 'medication': return 'text-orange-400 bg-orange-500/10';
    case 'milestone': return 'text-gold bg-gold/10';
  }
}

export default function ReadinessTimeline() {
  const navigate = useNavigate();
  const { conditions } = useUserConditions();
  const { data: claimsData } = useClaims();

  // Build timeline events from all data sources
  const events = useMemo(() => {
    const all: TimelineEvent[] = [];

    // Symptom logs
    for (const s of (claimsData.symptoms || [])) {
      all.push({
        date: s.date || s.createdAt || '',
        type: 'symptom',
        label: `${s.symptom || 'Symptom'} logged`,
        detail: s.bodyArea ? `${s.bodyArea}, severity ${s.severity}/10` : `Severity ${s.severity}/10`,
        conditionId: s.conditionId,
      });
    }

    // Medical visits
    for (const v of (claimsData.medicalVisits || [])) {
      all.push({
        date: v.date || v.createdAt || '',
        type: 'visit',
        label: v.provider || 'Medical visit',
        detail: v.notes?.slice(0, 80) || v.type || 'Visit recorded',
        conditionId: v.conditionId,
      });
    }

    // Medications
    for (const m of (claimsData.medications || [])) {
      all.push({
        date: m.startDate || m.createdAt || '',
        type: 'medication',
        label: `Started ${m.name || 'medication'}`,
        detail: m.dosage || undefined,
      });
    }

    // Buddy contacts (statement requests)
    for (const b of (claimsData.buddyContacts || [])) {
      all.push({
        date: b.createdAt || '',
        type: 'statement',
        label: `Buddy statement from ${b.name || 'contact'}`,
        detail: b.status || 'Requested',
      });
    }

    // Sort by date descending
    return all
      .filter(e => e.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 50); // Cap at 50 recent events
  }, [claimsData]);

  // Calculate per-condition readiness
  const readinessScores = useMemo(() => {
    const scores: ReadinessScore[] = [];

    for (const uc of conditions) {
      const name = getConditionDisplayName(uc);
      const symptoms = (claimsData.symptoms || []).filter(s => s.conditionId === uc.conditionId);
      const visits = (claimsData.medicalVisits || []).filter(v => v.conditionId === uc.conditionId);
      const buddies = (claimsData.buddyContacts || []).length;

      const symptomScore = Math.min(100, Math.round((symptoms.length / 10) * 100));
      const evidenceScore = Math.min(100, Math.round((visits.length / 3) * 100));
      const statementScore = Math.min(100, Math.round((buddies / 2) * 100));
      const overallPercent = Math.round(symptomScore * 0.4 + evidenceScore * 0.35 + statementScore * 0.25);

      scores.push({
        conditionName: name,
        conditionId: uc.conditionId,
        symptomScore,
        evidenceScore,
        statementScore,
        overallPercent: Math.min(100, overallPercent),
      });
    }

    return scores.sort((a, b) => a.overallPercent - b.overallPercent);
  }, [conditions, claimsData]);

  // Group timeline events by date
  const groupedEvents = useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = {};
    for (const event of events) {
      const dateKey = event.date.split('T')[0];
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(event);
    }
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [events]);

  // Overall readiness
  const overallReadiness = readinessScores.length > 0
    ? Math.round(readinessScores.reduce((sum, s) => sum + s.overallPercent, 0) / readinessScores.length)
    : 0;

  // Next actions
  const nextActions: NextAction[] = [];
  const weakest = readinessScores[0];
  if (weakest && weakest.overallPercent < 60) {
    if (weakest.symptomScore < 50) {
      nextActions.push({
        label: `Log symptoms for ${weakest.conditionName}`,
        description: 'Consistent symptom tracking builds the strongest evidence.',
        route: buildToolLink('symptoms', { condition: weakest.conditionId }),
        priority: 'high',
      });
    } else if (weakest.evidenceScore < 50) {
      nextActions.push({
        label: `Record a medical visit for ${weakest.conditionName}`,
        description: 'Medical documentation is critical for your claim.',
        route: buildToolLink('medical-visits'),
        priority: 'high',
      });
    }
  }
  if (nextActions.length === 0) {
    nextActions.push({
      label: 'Check your rating gap analysis',
      description: 'See if your evidence supports a higher rating.',
      route: '/claims/rating-gaps',
      priority: 'medium',
    });
  }

  return (
    <PageContainer className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon bg-gold/10">
          <Clock className="h-5 w-5 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Readiness Timeline</h1>
          <p className="text-muted-foreground text-sm">Track your claim preparation progress</p>
        </div>
      </div>

      {/* Overall Readiness */}
      {conditions.length > 0 && (
        <Card className="border-gold/20 bg-gold/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Overall Readiness
              </span>
              <span className="text-2xl font-bold text-foreground">{overallReadiness}%</span>
            </div>
            <Progress value={overallReadiness} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Across {conditions.length} tracked condition{conditions.length !== 1 ? 's' : ''}
              {' '}&middot; {events.length} evidence event{events.length !== 1 ? 's' : ''} logged
            </p>
          </CardContent>
        </Card>
      )}

      {/* Per-Condition Readiness */}
      {readinessScores.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Condition Readiness
          </h2>
          {readinessScores.map((score) => (
            <Card key={score.conditionId}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{score.conditionName}</span>
                  <Badge
                    variant="outline"
                    className={
                      score.overallPercent >= 70 ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      score.overallPercent >= 40 ? 'bg-gold/10 text-gold border-gold/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }
                  >
                    {score.overallPercent}%
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-0.5">Symptoms</div>
                    <Progress value={score.symptomScore} className="h-1" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-0.5">Medical</div>
                    <Progress value={score.evidenceScore} className="h-1" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-0.5">Statements</div>
                    <Progress value={score.statementScore} className="h-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Timeline */}
      {groupedEvents.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Evidence Timeline
          </h2>
          <div className="space-y-4">
            {groupedEvents.slice(0, 15).map(([dateKey, dayEvents]) => (
              <div key={dateKey}>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {formatDate(dateKey)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    ({dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''})
                  </span>
                </div>
                <div className="space-y-1.5 ml-5 border-l border-border pl-3">
                  {dayEvents.map((event, i) => {
                    const Icon = getEventIcon(event.type);
                    const color = getEventColor(event.type);
                    return (
                      <div key={i} className="flex items-start gap-2">
                        <div className={`p-1 rounded-md shrink-0 ${color}`}>
                          <Icon className="h-3 w-3" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-medium text-foreground block">{event.label}</span>
                          {event.detail && (
                            <span className="text-[11px] text-muted-foreground block truncate">{event.detail}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {conditions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">No conditions tracked yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
              Add your conditions and start logging symptoms to build your readiness timeline.
            </p>
            <Button onClick={() => navigate(buildToolLink('conditions'))}>
              Add Conditions
            </Button>
          </CardContent>
        </Card>
      )}

      <WhatNextCard actions={nextActions} />
    </PageContainer>
  );
}
