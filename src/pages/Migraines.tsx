import { useState, useMemo, useRef } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { useUserConditions } from '@/hooks/useUserConditions';
import { useEvidence } from '@/hooks/useEvidence';
import { safeFormatDate } from '@/utils/dateUtils';
import { getConditionById } from '@/data/vaConditions';
import {
  Brain, Plus, Trash2, Edit, Calendar, Clock, AlertTriangle,
  Download, Info, TrendingUp, Zap, DollarSign, Target, BedDouble,
  Briefcase, Activity, Tag, Loader2
} from 'lucide-react';
import { exportMigraines } from '@/utils/pdfExport';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';
import { EvidenceAttachment, EvidenceThumbnails } from '@/components/shared/EvidenceAttachment';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PageContainer } from '@/components/PageContainer';
import { EmptyState } from '@/components/EmptyState';
import type {
  MigraineEntry, MigraineSeverity, MigraineDuration,
  MigraneTrigger, MigraineImpact, MigraineSymptom, EconomicImpactType
} from '@/types/claims';

const durations: { value: MigraineDuration; label: string }[] = [
  { value: '30min', label: '30 minutes' },
  { value: '1hr', label: '1 hour' },
  { value: '2hrs', label: '2 hours' },
  { value: '4hrs', label: '4 hours' },
  { value: '8hrs', label: '8 hours' },
  { value: '12hrs', label: '12 hours' },
  { value: '24hrs+', label: '24+ hours' },
];

const severities: { value: MigraineSeverity; label: string; description: string }[] = [
  { value: 'Mild', label: 'Mild', description: 'Noticeable but can continue activities' },
  { value: 'Moderate', label: 'Moderate', description: 'Difficult to concentrate, reduced productivity' },
  { value: 'Severe', label: 'Severe', description: 'Very difficult to function, need to rest' },
  { value: 'Prostrating', label: 'Prostrating', description: 'VA term: Requires bed rest, completely incapacitating' },
];

const symptoms: MigraineSymptom[] = [
  'Aura', 'Nausea', 'Vomiting', 'Light sensitivity', 
  'Sound sensitivity', 'Vision changes', 'Numbness/tingling', 'Dizziness'
];

const triggers: MigraneTrigger[] = [
  'Stress', 'Lack of sleep', 'Weather', 'Food', 'Bright lights', 
  'Loud noise', 'Physical exertion', 'Hormonal', 'Dehydration', 'Other'
];

const impacts: { value: MigraineImpact; label: string }[] = [
  { value: 'Continued normal activities', label: 'Continued normal activities' },
  { value: 'Reduced productivity', label: 'Reduced productivity' },
  { value: 'Had to rest', label: 'Had to rest' },
  { value: 'Missed work/duty', label: 'Missed work/duty' },
  { value: 'Went to ER', label: 'Went to ER' },
];

const economicImpacts: { value: EconomicImpactType; label: string; description: string }[] = [
  { value: 'none', label: 'No work impact', description: 'Did not affect work' },
  { value: 'reduced_hours', label: 'Reduced hours/productivity', description: 'Worked but less effective' },
  { value: 'left_early', label: 'Left work early', description: 'Had to leave before shift ended' },
  { value: 'missed_partial_day', label: 'Missed partial day', description: 'Called in late or left early' },
  { value: 'missed_full_day', label: 'Missed full day', description: 'Could not work entire day' },
  { value: 'missed_multiple_days', label: 'Missed multiple days', description: 'Out for 2+ days' },
  { value: 'called_out', label: 'Called out sick', description: 'Called in unable to work' },
];

// VA Rating calculation based on 38 CFR 4.124a DC 8100
function calculateEstimatedRating(prostratingPerMonth: number, hasEconomicImpact: boolean): { rating: number; description: string; confidence: string } {
  if (prostratingPerMonth >= 2 && hasEconomicImpact) {
    return { rating: 50, description: 'Very frequent prostrating attacks with severe economic inadaptability', confidence: 'Strong evidence' };
  }
  if (prostratingPerMonth >= 1) {
    return { rating: 30, description: 'Prostrating attacks averaging once a month', confidence: 'Good evidence' };
  }
  if (prostratingPerMonth >= 0.5) {
    return { rating: 10, description: 'Prostrating attacks averaging 1 in 2 months', confidence: 'Moderate evidence' };
  }
  return { rating: 0, description: 'Less frequent attacks (below rating threshold)', confidence: 'Continue documenting' };
}

interface MigraineFormData extends Omit<MigraineEntry, 'id'> {
  impacts: MigraineImpact[];
}

export default function Migraines() {
  const today = new Date().toISOString().split('T')[0];
  const { data, addMigraine, updateMigraine, deleteMigraine } = useClaims();
  const { conditions: userConditions } = useUserConditions();
  const { toast } = useToast();
  const { documents, setAllDocuments } = useEvidence();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedConditionTags, setSelectedConditionTags] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const claimConditions = useMemo(() => data.claimConditions || [], [data.claimConditions]);
  const allConditionNames = useMemo(() => {
    const names = new Set<string>();
    claimConditions.forEach(c => names.add(c.name));
    (userConditions ?? []).forEach(uc => {
      const details = getConditionById(uc.conditionId);
      if (details?.name) names.add(details.name);
    });
    return Array.from(names).sort();
  }, [claimConditions, userConditions]);

  const toggleConditionTag = (name: string) => {
    setSelectedConditionTags(prev =>
      prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]
    );
  };
  const [formData, setFormData] = useState<MigraineFormData>({
    date: '',
    time: '',
    duration: '2hrs',
    severity: 'Moderate',
    symptoms: [],
    triggers: [],
    impact: 'Reduced productivity',
    impacts: [],
    treatment: '',
    notes: '',
    wasProstrating: false,
    requiredBedRest: false,
    couldNotWork: false,
    economicImpact: 'none',
    hoursLostToMigraine: 0,
    medicationEffective: undefined,
    functioningLevel: 50,
  });

  const resetForm = () => {
    setFormData({
      date: '',
      time: '',
      duration: '2hrs',
      severity: 'Moderate',
      symptoms: [],
      triggers: [],
      impact: 'Reduced productivity',
      impacts: [],
      treatment: '',
      notes: '',
      wasProstrating: false,
      requiredBedRest: false,
      couldNotWork: false,
      economicImpact: 'none',
      hoursLostToMigraine: 0,
      medicationEffective: undefined,
      functioningLevel: 50,
    });
    setSelectedConditionTags([]);
    setEditingId(null);
  };

  // Handle input focus for mobile keyboard
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement>) => {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-set wasProstrating based on severity selection
    // Set first impact for backwards compatibility, store all in impacts array
    const primaryImpact = formData.impacts.length > 0 ? formData.impacts[0] : formData.impact;
    const finalData = {
      ...formData,
      impact: primaryImpact,
      impacts: formData.impacts,
      wasProstrating: formData.severity === 'Prostrating' || formData.wasProstrating || formData.requiredBedRest,
      conditionTags: selectedConditionTags.length > 0 ? selectedConditionTags : undefined,
    };

    if (editingId) {
      updateMigraine(editingId, finalData);
    } else {
      addMigraine(finalData);
    }
    setIsOpen(false);
    resetForm();
    toast({
      title: finalData.wasProstrating ? 'Prostrating migraine logged' : 'Migraine logged',
      description: finalData.wasProstrating
        ? 'Prostrating episodes count toward higher DC 8100 rating thresholds.'
        : 'Track frequency and severity — the VA uses this for DC 8100 ratings.',
    });
  };

  const handleEdit = (entry: MigraineEntry) => {
    // Load impacts array or fall back to legacy single impact
    const loadedImpacts = entry.impacts?.length ? entry.impacts : (entry.impact ? [entry.impact] : []);
    setFormData({
      date: entry.date,
      time: entry.time,
      duration: entry.duration,
      severity: entry.severity,
      symptoms: entry.symptoms,
      triggers: entry.triggers,
      impact: entry.impact,
      impacts: loadedImpacts,
      treatment: entry.treatment,
      notes: entry.notes,
      wasProstrating: entry.wasProstrating ?? false,
      requiredBedRest: entry.requiredBedRest ?? false,
      couldNotWork: entry.couldNotWork ?? false,
      economicImpact: entry.economicImpact ?? 'none',
      hoursLostToMigraine: entry.hoursLostToMigraine ?? 0,
      medicationEffective: entry.medicationEffective,
      functioningLevel: entry.functioningLevel ?? 50,
    });
    setSelectedConditionTags(entry.conditionTags || []);
    setEditingId(entry.id);
    setIsOpen(true);
  };

  const toggleSymptom = (symptom: MigraineSymptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const toggleTrigger = (trigger: MigraneTrigger) => {
    setFormData(prev => ({
      ...prev,
      triggers: prev.triggers.includes(trigger)
        ? prev.triggers.filter(t => t !== trigger)
        : [...prev.triggers, trigger],
    }));
  };

  const toggleImpact = (impact: MigraineImpact) => {
    setFormData(prev => ({
      ...prev,
      impacts: prev.impacts.includes(impact)
        ? prev.impacts.filter(i => i !== impact)
        : [...prev.impacts, impact],
    }));
  };

  // Statistics with VA rating alignment
  const stats = useMemo(() => {
    const migraines = data.migraines || [];

    // Last 30 days
    const last30Days = migraines.filter(m => {
      const date = new Date(m.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return date >= thirtyDaysAgo;
    });

    // Last 90 days for better average
    const last90Days = migraines.filter(m => {
      const date = new Date(m.date);
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      return date >= ninetyDaysAgo;
    });

    const prostratingLast30 = last30Days.filter(m => 
      m.severity === 'Prostrating' || m.wasProstrating || m.requiredBedRest
    ).length;
    
    const prostratingLast90 = last90Days.filter(m => 
      m.severity === 'Prostrating' || m.wasProstrating || m.requiredBedRest
    ).length;

    // Economic impact count
    const economicImpactCount = last90Days.filter(m => 
      m.economicImpact && m.economicImpact !== 'none'
    ).length;

    // Total hours lost
    const totalHoursLost = last90Days.reduce((acc, m) => acc + (m.hoursLostToMigraine || 0), 0);

    // Monthly average of prostrating attacks
    const monthsTracked = Math.max(1, last90Days.length > 0 ? 3 : 1);
    const prostratingPerMonth = prostratingLast90 / monthsTracked;
    
    const hasSignificantEconomicImpact = economicImpactCount >= 3 || totalHoursLost >= 16;
    const estimatedRating = calculateEstimatedRating(prostratingPerMonth, hasSignificantEconomicImpact);

    return {
      totalLast30Days: last30Days.length,
      prostratingLast30Days: prostratingLast30,
      prostratingLast90Days: prostratingLast90,
      prostratingPerMonth,
      economicImpactCount,
      totalHoursLost,
      totalAll: migraines.length,
      estimatedRating,
      hasSignificantEconomicImpact,
    };
  }, [data.migraines]);

  const getSeverityColor = (severity: MigraineSeverity) => {
    switch (severity) {
      case 'Mild': return 'bg-success/10 text-success border-success/20';
      case 'Moderate': return 'bg-gold/10 text-gold border-gold/20';
      case 'Severe': return 'bg-gold/10 text-gold border-gold/20';
      case 'Prostrating': return 'bg-destructive/10 text-destructive border-destructive/20';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 50) return 'text-success';
    if (rating >= 30) return 'text-gold';
    if (rating >= 10) return 'text-gold';
    return 'text-muted-foreground';
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await exportMigraines(data.migraines || [], stats);
    } catch {
      toast({ title: 'Export failed', description: 'Could not generate PDF. Please try again.', variant: 'destructive' });
    } finally {
      setExporting(false);
    }
  };

  return (
    <PageContainer className="space-y-6 animate-fade-in overflow-x-hidden">
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-linear-to-br from-gold/20 to-gold/5 shadow-[0_0_24px_var(--gold-glow)]">
            <Brain className="h-6 w-6 text-gold drop-shadow-[0_0_8px_rgba(240,192,0,0.5)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Migraine Tracker</h1>
            <p className="text-muted-foreground text-sm">Aligned with VA migraine rating criteria</p>
          </div>
        </div>
        <Button onClick={handleExportPDF} disabled={exporting} variant="outline" className="gap-2 border-border/50 hover:bg-muted">
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {exporting ? 'Exporting...' : 'Export PDF'}
        </Button>
      </div>

      {/* Main Disclaimer */}
      <div className="p-4 bg-muted/50 border border-border rounded-xl">
        <p className="text-xs text-muted-foreground leading-relaxed">
          The VA migraine rating criteria shown here are for reference only. Your actual rating will be determined by the VA based on your VA examination and medical evidence. Track your migraines consistently to build a strong evidence record.
        </p>
      </div>

      {/* VA Rating Estimator Card - Premium Design */}
      {(data.migraines?.length || 0) > 0 && (
        <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-lg" style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)' }}>
          <div className="p-4 border-b border-border/50 bg-linear-to-r from-primary/10 via-transparent to-transparent">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 shrink-0">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">Estimated VA Rating — Migraines</h3>
            </div>
          </div>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className={`text-4xl font-bold ${getRatingColor(stats.estimatedRating.rating)}`}>
                  {stats.estimatedRating.rating}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.estimatedRating.description}
                </p>
              </div>
              <Badge variant="outline" className="text-xs shrink-0">
                {stats.estimatedRating.confidence}
              </Badge>
            </div>
            
            {/* Rating Threshold Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>10%</span>
                <span>30%</span>
                <span>50%</span>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="absolute h-full bg-linear-to-r from-gold/60 via-gold to-gold-hl rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (stats.estimatedRating.rating / 50) * 100)}%` }}
                />
                {/* Threshold markers */}
                <div className="absolute top-0 bottom-0 left-[20%] w-px bg-white/50" />
                <div className="absolute top-0 bottom-0 left-[60%] w-px bg-white/50" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-2xl font-bold text-destructive">{stats.prostratingPerMonth.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Prostrating/Month (avg)</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-2xl font-bold text-gold">{stats.totalHoursLost}</p>
                <p className="text-xs text-muted-foreground">Hours Lost (90 days)</p>
              </div>
            </div>

            {!stats.hasSignificantEconomicImpact && stats.prostratingPerMonth >= 2 && (
              <Alert className="border-gold/50 bg-gold/10">
                <DollarSign className="h-4 w-4 text-gold" />
                <AlertDescription className="text-xs">
                  <strong>50% Rating Tip:</strong> Document economic impact (missed work, lost wages) to support the "severe economic inadaptability" criteria required for 50%.
                </AlertDescription>
              </Alert>
            )}

            <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/50">
              For educational reference only. This is not a determination of benefits. Your actual rating will be decided by the VA based on your C&P exam and medical evidence.
            </p>
          </CardContent>
        </div>
      )}

      {/* VA Rating Info Alert */}
      <Alert className="border-primary/50 bg-primary/10">
        <Info className="h-5 w-5 text-primary" />
        <AlertTitle className="text-primary font-semibold">VA Migraine Rating Criteria (38 CFR § 4.124a)</AlertTitle>
        <AlertDescription className="text-foreground/90 mt-2">
          <p className="mb-2">
            Migraines are rated based on the frequency of <strong>prostrating</strong> attacks 
            (completely incapacitating, requiring bed rest):
          </p>
          <ul className="text-sm space-y-1 ml-4">
            <li>• <strong>10%</strong> — Prostrating attacks averaging 1 in 2 months (~6/year)</li>
            <li>• <strong>30%</strong> — Prostrating attacks averaging once a month (~12/year)</li>
            <li>• <strong>50%</strong> — Very frequent prostrating + severe economic impact</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-3 italic">
            "Prostrating" = so severe you MUST lie down and cannot function. Document this explicitly!
          </p>
        </AlertDescription>
      </Alert>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-2 shrink-0">
          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Log Attack
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
              <DialogHeader className="shrink-0">
                <DialogTitle>{editingId ? 'Edit Migraine Entry' : 'Log Migraine Attack'}</DialogTitle>
                <DialogDescription className="sr-only">Record migraine attack details</DialogDescription>
              </DialogHeader>
              <div 
                ref={modalContentRef}
                className="flex-1 overflow-y-auto px-1 pb-32"
                style={{ scrollPaddingBottom: '350px' }}
              >
                <form id="migraine-form" onSubmit={handleSubmit} className="space-y-5">
                  {/* Date & Time */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        min="1940-01-01"
                        max={today}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        onFocus={handleInputFocus}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time Started</Label>
                      <Input 
                        id="time" 
                        type="time" 
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        onFocus={handleInputFocus}
                      />
                    </div>
                  </div>

                  {/* Duration & Severity */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Select 
                        value={formData.duration} 
                        onValueChange={(value: MigraineDuration) => setFormData({ ...formData, duration: value })}
                      >
                        <SelectTrigger onFocus={handleInputFocus}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {durations.map((d) => (
                            <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="severity" className="flex items-center gap-2">
                        Severity Level
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p><strong>Prostrating</strong> is the VA's term for a migraine so severe it requires complete bed rest and you cannot function at all.</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Select 
                        value={formData.severity} 
                        onValueChange={(value: MigraineSeverity) => {
                          const isProstrating = value === 'Prostrating';
                          setFormData({ 
                            ...formData, 
                            severity: value,
                            wasProstrating: isProstrating || formData.wasProstrating,
                            requiredBedRest: isProstrating || formData.requiredBedRest,
                          });
                        }}
                      >
                        <SelectTrigger onFocus={handleInputFocus}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {severities.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              <div>
                                <div className="font-medium">{s.label}</div>
                                <div className="text-xs text-muted-foreground">{s.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* VA-CRITICAL: Prostrating Documentation Section */}
                  <Card className="border-destructive/30 bg-destructive/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2 text-destructive">
                        <BedDouble className="h-4 w-4" />
                        VA Rating Evidence (Critical for Claims)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-3 bg-background/50 rounded-lg border border-destructive/20">
                          <Checkbox
                            id="wasProstrating"
                            checked={formData.wasProstrating}
                            onCheckedChange={(checked) => setFormData({
                              ...formData,
                              wasProstrating: checked as boolean,
                              requiredBedRest: checked as boolean || formData.requiredBedRest
                            })}
                          />
                          <div className="space-y-1">
                            <Label htmlFor="wasProstrating" className="font-medium cursor-pointer text-destructive">
                              This was a PROSTRATING attack
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              VA Definition: "So severe that you HAD to stop all activity and lie down. Could not perform any tasks."
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 p-3 bg-background/50 rounded-lg">
                          <Checkbox 
                            id="requiredBedRest"
                            checked={formData.requiredBedRest}
                            onCheckedChange={(checked) => setFormData({ 
                              ...formData, 
                              requiredBedRest: checked as boolean,
                              wasProstrating: checked as boolean || formData.wasProstrating
                            })}
                          />
                          <div className="space-y-1">
                            <Label htmlFor="requiredBedRest" className="font-medium cursor-pointer">
                              Required complete bed rest
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Could not sit up, watch TV, or do basic tasks
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 p-3 bg-background/50 rounded-lg">
                          <Checkbox 
                            id="couldNotWork"
                            checked={formData.couldNotWork}
                            onCheckedChange={(checked) => setFormData({ ...formData, couldNotWork: checked as boolean })}
                          />
                          <div className="space-y-1">
                            <Label htmlFor="couldNotWork" className="font-medium cursor-pointer">
                              Could not work or perform duties
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Unable to perform job responsibilities
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Functioning Level Slider */}
                      <div className="space-y-3 pt-2">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm">Functioning Level During Attack</Label>
                          <span className="text-sm font-medium text-primary">{formData.functioningLevel}%</span>
                        </div>
                        <Slider
                          value={[formData.functioningLevel ?? 50]}
                          onValueChange={([value]) => setFormData({ ...formData, functioningLevel: value })}
                          max={100}
                          step={10}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0% (Prostrating)</span>
                          <span>50%</span>
                          <span>100% (Normal)</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Economic Impact Section - Critical for 50% Rating */}
                  <Card className="border-gold/30 bg-gold/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gold-dk">
                        <Briefcase className="h-4 w-4" />
                        Economic Impact (Required for 50% Rating)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Work/Duty Impact</Label>
                        <Select 
                          value={formData.economicImpact || 'none'} 
                          onValueChange={(value: EconomicImpactType) => setFormData({ ...formData, economicImpact: value })}
                        >
                          <SelectTrigger onFocus={handleInputFocus}>
                            <SelectValue placeholder="Select impact on work" />
                          </SelectTrigger>
                          <SelectContent>
                            {economicImpacts.map((e) => (
                              <SelectItem key={e.value} value={e.value}>
                                <div>
                                  <div className="font-medium">{e.label}</div>
                                  <div className="text-xs text-muted-foreground">{e.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hoursLost">Hours Lost to Migraine</Label>
                        <Input 
                          id="hoursLost" 
                          type="number" 
                          min="0"
                          max="72"
                          placeholder="Hours of work/productivity lost"
                          value={formData.hoursLostToMigraine || ''}
                          onChange={(e) => setFormData({ ...formData, hoursLostToMigraine: parseInt(e.target.value) || 0 })}
                          onFocus={handleInputFocus}
                        />
                        <p className="text-xs text-muted-foreground">
                          Include time unable to work, care for family, or perform normal activities
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Symptoms */}
                  <div className="space-y-2">
                    <Label>Symptoms</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {symptoms.map((symptom) => (
                        <div key={symptom} className="flex items-center space-x-2">
                          <Checkbox 
                            id={symptom}
                            checked={formData.symptoms.includes(symptom)}
                            onCheckedChange={() => toggleSymptom(symptom)}
                          />
                          <Label htmlFor={symptom} className="text-sm font-normal cursor-pointer">
                            {symptom}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Triggers */}
                  <div className="space-y-2">
                    <Label>Triggers (if known)</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {triggers.map((trigger) => (
                        <div key={trigger} className="flex items-center space-x-2">
                          <Checkbox 
                            id={trigger}
                            checked={formData.triggers.includes(trigger)}
                            onCheckedChange={() => toggleTrigger(trigger)}
                          />
                          <Label htmlFor={trigger} className="text-sm font-normal cursor-pointer">
                            {trigger}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Impact on Activities - Multi-select */}
                  <div className="space-y-2">
                    <Label>Overall Impact on Activities</Label>
                    <p className="text-xs text-muted-foreground">Select all that apply</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {impacts.map((impactOption) => (
                        <div key={impactOption.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`impact-${impactOption.value}`}
                            checked={formData.impacts.includes(impactOption.value)}
                            onCheckedChange={() => toggleImpact(impactOption.value)}
                          />
                          <Label htmlFor={`impact-${impactOption.value}`} className="text-sm font-normal cursor-pointer">
                            {impactOption.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Treatment & Effectiveness */}
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="treatment">Treatment Used</Label>
                      <Input 
                        id="treatment" 
                        placeholder="e.g., Sumatriptan, dark room, ice pack..."
                        value={formData.treatment}
                        onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                        onFocus={handleInputFocus}
                      />
                    </div>
                    
                    {formData.treatment && (
                      <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                        <Label className="text-sm">Was treatment effective?</Label>
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            size="sm"
                            variant={formData.medicationEffective === true ? 'default' : 'outline'}
                            onClick={() => setFormData({ ...formData, medicationEffective: true })}
                          >
                            Yes
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant={formData.medicationEffective === false ? 'default' : 'outline'}
                            onClick={() => setFormData({ ...formData, medicationEffective: false })}
                          >
                            No
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Any additional details about this attack..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      onFocus={handleInputFocus}
                    />
                  </div>

                  {/* Condition Tags */}
                  {allConditionNames.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        Tag to Conditions (optional)
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {allConditionNames.map(name => (
                          <button
                            key={name}
                            type="button"
                            onClick={() => toggleConditionTag(name)}
                            className={
                              selectedConditionTags.includes(name)
                                ? 'px-3 py-1.5 rounded-full text-xs font-medium border bg-primary/20 border-primary/50 text-primary transition-colors'
                                : 'px-3 py-1.5 rounded-full text-xs font-medium border bg-muted border-border text-muted-foreground hover:border-primary/30 transition-colors'
                            }
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Evidence Attachments - only show when editing */}
                  {editingId && (
                    <div className="pt-2 border-t border-border">
                      <EvidenceAttachment
                        entryType="migraine"
                        entryId={editingId}
                        documents={documents}
                        onDocumentsChange={setAllDocuments}
                      />
                    </div>
                  )}
                </form>
              </div>
              
              {/* Sticky Footer */}
              <div className="shrink-0 border-t border-border bg-background pt-4 pb-2 px-1 -mx-1">
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" form="migraine-form">
                    {editingId ? 'Update' : 'Save'} Entry
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      {(data.migraines?.length || 0) > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="data-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-gold/10">
                  <TrendingUp className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalLast30Days}</p>
                  <p className="text-sm text-muted-foreground">Attacks (30 Days)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="data-card border-destructive/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-destructive/10">
                  <Zap className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">{stats.prostratingLast30Days}</p>
                  <p className="text-sm text-muted-foreground">Prostrating (30 Days)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="data-card border-gold/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-gold/10">
                  <DollarSign className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gold">{stats.economicImpactCount}</p>
                  <p className="text-sm text-muted-foreground">Work Impact (90 Days)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="data-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-muted">
                  <Brain className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalAll}</p>
                  <p className="text-sm text-muted-foreground">Total Logged</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Migraine List */}
      {(data.migraines?.length || 0) === 0 ? (
        <Card className="data-card">
          <CardContent>
            <EmptyState
              icon={<Brain className="h-12 w-12" />}
              title="No migraine attacks logged yet"
              description="Track your migraines with severity, duration, and triggers to build evidence for VA claims."
              whyItMatters="A 50% migraine rating requires documented prostrating attacks. The difference between 30% and 50% is $200+/month."
              actionLabel="Log Attack"
              onAction={() => setIsOpen(true)}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {[...(data.migraines || [])].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          ).map((entry) => (
            <Card key={entry.id} className="data-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap min-w-0 flex-1">
                    <Badge variant="outline" className={getSeverityColor(entry.severity)}>
                      {entry.severity}
                    </Badge>
                    <Badge variant="outline">
                      {durations.find(d => d.value === entry.duration)?.label}
                    </Badge>
                    {(entry.severity === 'Prostrating' || entry.wasProstrating || entry.requiredBedRest) && (
                      <Badge className="bg-destructive text-white gap-1">
                        <BedDouble className="h-3 w-3" />
                        Prostrating
                      </Badge>
                    )}
                    {entry.economicImpact && entry.economicImpact !== 'none' && (
                      <Badge variant="outline" className="border-gold/50 text-gold-dk gap-1">
                        <DollarSign className="h-3 w-3" />
                        Work Impact
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="min-h-[44px] min-w-[44px]" onClick={() => handleEdit(entry)} aria-label="Edit migraine">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="min-h-[44px] min-w-[44px]" onClick={() => setDeleteTarget(entry.id)} aria-label="Delete migraine">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap min-w-0">
                  <div className="flex items-center gap-2 shrink-0">
                    <Calendar className="h-4 w-4 shrink-0" />
                    {safeFormatDate(entry.date)}
                  </div>
                  {entry.time && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Clock className="h-4 w-4 shrink-0" />
                      {entry.time}
                    </div>
                  )}
                  <div className="flex items-center gap-2 min-w-0">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span className="line-clamp-2">{entry.impacts?.length ? entry.impacts.join(', ') : entry.impact}</span>
                  </div>
                  {entry.functioningLevel !== undefined && entry.functioningLevel < 50 && (
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      {entry.functioningLevel}% functioning
                    </div>
                  )}
                </div>

                {/* VA Evidence Summary */}
                {(entry.requiredBedRest || entry.couldNotWork || (entry.hoursLostToMigraine && entry.hoursLostToMigraine > 0)) && (
                  <div className="flex flex-wrap gap-2 p-2 bg-destructive/5 rounded-lg border border-destructive/20">
                    {entry.requiredBedRest && (
                      <span className="text-xs text-destructive flex items-center gap-1">
                        <BedDouble className="h-3 w-3" /> Bed rest required
                      </span>
                    )}
                    {entry.couldNotWork && (
                      <span className="text-xs text-destructive flex items-center gap-1">
                        <Briefcase className="h-3 w-3" /> Unable to work
                      </span>
                    )}
                    {entry.hoursLostToMigraine && entry.hoursLostToMigraine > 0 && (
                      <span className="text-xs text-gold-dk flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {entry.hoursLostToMigraine}h lost
                      </span>
                    )}
                  </div>
                )}

                {entry.symptoms.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {entry.symptoms.map((symptom) => (
                      <Badge key={symptom} variant="secondary" className="text-xs">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                )}

                {entry.triggers.length > 0 && (
                  <div className="min-w-0">
                    <span className="text-xs text-muted-foreground">Triggers: </span>
                    <span className="text-sm">{entry.triggers.join(', ')}</span>
                  </div>
                )}

                {entry.treatment && (
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className="text-xs text-muted-foreground shrink-0">Treatment: </span>
                    <span className="text-sm min-w-0">{entry.treatment}</span>
                    {entry.medicationEffective !== undefined && (
                      <Badge variant="outline" className={entry.medicationEffective ? 'text-success border-success/50' : 'text-destructive border-destructive/50'}>
                        {entry.medicationEffective ? 'Effective' : 'Not Effective'}
                      </Badge>
                    )}
                  </div>
                )}

                {entry.notes && (
                  <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                    {entry.notes}
                  </p>
                )}

                <EvidenceThumbnails
                  entryType="migraine"
                  entryId={entry.id}
                  documents={documents}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete Migraine Entry?"
        description="This action cannot be undone. This will permanently delete this migraine record."
        confirmText="Delete"
        variant="destructive"
        onConfirm={() => { if (deleteTarget) deleteMigraine(deleteTarget); }}
      />
    </PageContainer>
  );
}
