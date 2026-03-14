/**
 * Post-Filing Tracker (Phase 5)
 *
 * Tracks a veteran's claim after submission. Provides timeline estimates,
 * milestone tracking, and guidance on what to expect during VA processing.
 */
import { useState } from 'react';
import {
  Clock, CheckCircle2, Circle, AlertTriangle,
  ExternalLink, Plus, Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageContainer } from '@/components/PageContainer';
import { WhatNextCard } from '@/components/shared/WhatNextCard';
import { buildToolLink } from '@/lib/toolRouting';
import type { NextAction } from '@/utils/whatNext';

interface FiledClaim {
  id: string;
  conditionName: string;
  filingDate: string;
  claimType: 'initial' | 'increase' | 'supplemental' | 'hlr' | 'bva';
  status: 'submitted' | 'evidence-gathering' | 'review' | 'decision-pending' | 'decided';
}

const CLAIM_TYPES: Record<FiledClaim['claimType'], string> = {
  initial: 'Initial Claim',
  increase: 'Increased Rating',
  supplemental: 'Supplemental Claim',
  hlr: 'Higher-Level Review',
  bva: 'Board Appeal',
};

const STATUS_LABELS: Record<FiledClaim['status'], string> = {
  submitted: 'Submitted',
  'evidence-gathering': 'Evidence Gathering',
  review: 'Under Review',
  'decision-pending': 'Decision Pending',
  decided: 'Decided',
};

const STATUS_ORDER: FiledClaim['status'][] = [
  'submitted', 'evidence-gathering', 'review', 'decision-pending', 'decided',
];

const AVERAGE_DAYS: Record<FiledClaim['claimType'], number> = {
  initial: 150,
  increase: 120,
  supplemental: 125,
  hlr: 125,
  bva: 365,
};

const STORAGE_KEY = 'vcs-filed-claims';

function loadClaims(): FiledClaim[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveClaims(claims: FiledClaim[]): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(claims)); } catch { /* */ }
}

function daysSince(dateStr: string): number {
  const filed = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - filed.getTime()) / (1000 * 60 * 60 * 24));
}

function estimatedCompletion(filingDate: string, claimType: FiledClaim['claimType']): string {
  const avg = AVERAGE_DAYS[claimType];
  const filed = new Date(filingDate);
  const estimated = new Date(filed.getTime() + avg * 24 * 60 * 60 * 1000);
  return estimated.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function PostFilingTracker() {
  const [claims, setClaims] = useState<FiledClaim[]>(loadClaims);
  const [adding, setAdding] = useState(false);
  const [newCondition, setNewCondition] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newType, setNewType] = useState<FiledClaim['claimType']>('initial');

  const handleAdd = () => {
    if (!newCondition.trim() || !newDate) return;
    const claim: FiledClaim = {
      id: `${Date.now()}`,
      conditionName: newCondition.trim(),
      filingDate: newDate,
      claimType: newType,
      status: 'submitted',
    };
    const updated = [...claims, claim];
    setClaims(updated);
    saveClaims(updated);
    setNewCondition('');
    setNewDate('');
    setAdding(false);
  };

  const handleStatusChange = (id: string, status: FiledClaim['status']) => {
    const updated = claims.map(c => c.id === id ? { ...c, status } : c);
    setClaims(updated);
    saveClaims(updated);
  };

  const handleRemove = (id: string) => {
    const updated = claims.filter(c => c.id !== id);
    setClaims(updated);
    saveClaims(updated);
  };

  const activeClaims = claims.filter(c => c.status !== 'decided');
  const decidedClaims = claims.filter(c => c.status === 'decided');

  const nextActions: NextAction[] = [];
  if (activeClaims.length > 0) {
    nextActions.push({
      label: 'Keep logging symptoms',
      description: 'Continue documenting while your claim is processed.',
      route: buildToolLink('symptoms'),
      priority: 'medium',
    });
  }
  if (decidedClaims.length > 0) {
    nextActions.push({
      label: 'Analyze your decision letter',
      description: 'Upload your decision letter to understand the results.',
      route: buildToolLink('decision-decoder'),
      priority: 'high',
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
          <h1 className="text-2xl font-bold text-foreground">Post-Filing Tracker</h1>
          <p className="text-muted-foreground text-sm">Track your submitted claims through VA processing</p>
        </div>
      </div>

      {/* VA Processing Info */}
      <Card className="border-gold/20 bg-gold/5">
        <CardContent className="p-4 space-y-2">
          <h3 className="text-sm font-semibold text-foreground">VA Processing Timeline</h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>Initial Claims: ~150 days avg</div>
            <div>Increased Rating: ~120 days avg</div>
            <div>Supplemental: ~125 days avg</div>
            <div>Board Appeal: ~365 days avg</div>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Check real-time status at{' '}
            <a href="https://www.va.gov/claim-or-appeal-status/" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold/80 inline-flex items-center gap-0.5">
              VA.gov <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </CardContent>
      </Card>

      {/* Active Claims */}
      {activeClaims.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Active Claims ({activeClaims.length})
          </h2>
          {activeClaims.map((claim) => {
            const days = daysSince(claim.filingDate);
            const statusIdx = STATUS_ORDER.indexOf(claim.status);

            return (
              <Card key={claim.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{claim.conditionName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px]">{CLAIM_TYPES[claim.claimType]}</Badge>
                        <span className="text-[11px] text-muted-foreground">Filed {new Date(claim.filingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                    <button onClick={() => handleRemove(claim.id)} className="p-1 text-muted-foreground hover:text-destructive" aria-label={`Remove ${claim.conditionName}`}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Status Steps */}
                  <div className="flex items-center gap-1">
                    {STATUS_ORDER.slice(0, -1).map((step, i) => {
                      const isComplete = i < statusIdx;
                      const isCurrent = i === statusIdx;
                      return (
                        <div key={step} className="flex items-center gap-1 flex-1">
                          <button
                            onClick={() => handleStatusChange(claim.id, step)}
                            className="shrink-0"
                            aria-label={`Set status to ${STATUS_LABELS[step]}`}
                          >
                            {isComplete ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : isCurrent ? (
                              <div className="h-4 w-4 rounded-full border-2 border-gold bg-gold/20" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground/30" />
                            )}
                          </button>
                          {i < STATUS_ORDER.length - 2 && (
                            <div className={`flex-1 h-0.5 ${isComplete ? 'bg-green-500' : 'bg-border'}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Submitted</span>
                    <span>Review</span>
                    <span>Decision</span>
                  </div>

                  {/* Status Selector */}
                  <Select value={claim.status} onValueChange={(v) => handleStatusChange(claim.id, v as FiledClaim['status'])}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_ORDER.map(s => (
                        <SelectItem key={s} value={s} className="text-xs">{STATUS_LABELS[s]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Timeline Info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{days} day{days !== 1 ? 's' : ''} since filing</span>
                    <span>Est. completion: {estimatedCompletion(claim.filingDate, claim.claimType)}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Decided Claims */}
      {decidedClaims.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Decided ({decidedClaims.length})
          </h2>
          {decidedClaims.map((claim) => (
            <Card key={claim.id} className="opacity-70">
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-foreground">{claim.conditionName}</span>
                  <span className="text-xs text-muted-foreground ml-2">{CLAIM_TYPES[claim.claimType]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/20">Decided</Badge>
                  <button onClick={() => handleRemove(claim.id)} className="p-1 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Claim Form */}
      {adding ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Track a Filed Claim</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs">Condition Name</Label>
              <Input
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="e.g., PTSD, Sleep Apnea"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Filing Date</Label>
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Claim Type</Label>
              <Select value={newType} onValueChange={(v) => setNewType(v as FiledClaim['claimType'])}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CLAIM_TYPES).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={!newCondition.trim() || !newDate} className="flex-1">
                Add Claim
              </Button>
              <Button variant="outline" onClick={() => setAdding(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button variant="outline" onClick={() => setAdding(true)} className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Track a Filed Claim
        </Button>
      )}

      {/* Empty State */}
      {claims.length === 0 && !adding && (
        <Card>
          <CardContent className="py-8 text-center">
            <Clock className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="font-medium text-foreground mb-1">No filed claims tracked</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              After you file a claim with the VA, add it here to track processing milestones
              and estimated completion dates.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-gold" />
            While You Wait
          </h3>
          <ul className="text-xs text-muted-foreground space-y-1.5">
            <li>Continue logging symptoms daily to strengthen any future appeals</li>
            <li>Respond promptly to any VA requests for additional evidence</li>
            <li>Attend all scheduled C&P exams (missing one can delay or deny your claim)</li>
            <li>Do not withdraw a pending claim without consulting a VSO</li>
            <li>If you receive a decision, analyze it with the Decision Decoder tool</li>
          </ul>
        </CardContent>
      </Card>

      <WhatNextCard actions={nextActions} />
    </PageContainer>
  );
}
