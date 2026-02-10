import { useState, useMemo } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { useUserConditions } from '@/hooks/useUserConditions';
import { useEvidence } from '@/hooks/useEvidence';
import { getConditionById } from '@/data/vaConditions';
import { Moon, Plus, Trash2, Edit, Calendar, Clock, AlertTriangle, CheckCircle2, TrendingUp, Wind, Activity, Zap, Download, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EvidenceAttachment, EvidenceThumbnails } from '@/components/shared/EvidenceAttachment';
import type { SleepEntry, SleepQuality, DaytimeSleepiness } from '@/types/claims';
import { exportSleepLog } from '@/utils/pdfExport';

const qualities: { value: SleepQuality; label: string }[] = [
  { value: 'Very Poor', label: 'Very Poor' },
  { value: 'Poor', label: 'Poor' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Good', label: 'Good' },
  { value: 'Excellent', label: 'Excellent' },
];

const daytimeSleepinessOptions: { value: DaytimeSleepiness; label: string }[] = [
  { value: 'None', label: 'None - Alert all day' },
  { value: 'Mild', label: 'Mild - Occasional drowsiness' },
  { value: 'Moderate', label: 'Moderate - Frequent drowsiness' },
  { value: 'Severe', label: 'Severe - Difficulty staying awake' },
  { value: 'Persistent hypersomnolence', label: 'Persistent hypersomnolence (30% rating)' },
];

export default function Sleep() {
  const { data, addSleepEntry, updateSleepEntry, deleteSleepEntry } = useClaims();
  const { conditions: userConditions } = useUserConditions();
  const { documents, setAllDocuments } = useEvidence();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedConditionTags, setSelectedConditionTags] = useState<string[]>([]);

  const claimConditions = data.claimConditions || [];
  const allConditionNames = useMemo(() => {
    const names = new Set<string>();
    claimConditions.forEach(c => names.add(c.name));
    userConditions.forEach(uc => {
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

  const [formData, setFormData] = useState<Omit<SleepEntry, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    hoursSlept: 6,
    quality: 'Fair',
    usesCPAP: false,
    cpapUsedLastNight: false,
    cpapHoursUsed: 0,
    interruptions: 0,
    nightmares: false,
    notes: '',
    apneaEpisodes: 0,
    oxygenDesaturation: false,
    lowestOxygenLevel: undefined,
    requiresOxygen: false,
    chronicRespiratoryFailure: false,
    daytimeSleepiness: 'None',
    timesWokeGasping: 0,
    spouseObserved: false,
    morningHeadache: false,
    feltRested: false,
    impactOnWork: '',
    severityRating: 5,
  });

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      hoursSlept: 6,
      quality: 'Fair',
      usesCPAP: false,
      cpapUsedLastNight: false,
      cpapHoursUsed: 0,
      interruptions: 0,
      nightmares: false,
      notes: '',
      apneaEpisodes: 0,
      oxygenDesaturation: false,
      lowestOxygenLevel: undefined,
      requiresOxygen: false,
      chronicRespiratoryFailure: false,
      daytimeSleepiness: 'None',
      timesWokeGasping: 0,
      spouseObserved: false,
      morningHeadache: false,
      feltRested: false,
      impactOnWork: '',
      severityRating: 5,
    });
    setSelectedConditionTags([]);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      conditionTags: selectedConditionTags.length > 0 ? selectedConditionTags : undefined,
    };
    if (editingId) {
      updateSleepEntry(editingId, submitData);
    } else {
      addSleepEntry(submitData);
    }
    setIsOpen(false);
    resetForm();
  };

  const handleEdit = (entry: SleepEntry) => {
    setFormData({
      date: entry.date,
      hoursSlept: entry.hoursSlept,
      quality: entry.quality,
      usesCPAP: entry.usesCPAP,
      cpapUsedLastNight: entry.cpapUsedLastNight || false,
      cpapHoursUsed: entry.cpapHoursUsed || 0,
      interruptions: entry.interruptions,
      nightmares: entry.nightmares,
      notes: entry.notes,
      apneaEpisodes: entry.apneaEpisodes || 0,
      oxygenDesaturation: entry.oxygenDesaturation || false,
      lowestOxygenLevel: entry.lowestOxygenLevel,
      requiresOxygen: entry.requiresOxygen || false,
      chronicRespiratoryFailure: entry.chronicRespiratoryFailure || false,
      daytimeSleepiness: entry.daytimeSleepiness || 'None',
      timesWokeGasping: entry.timesWokeGasping || 0,
      spouseObserved: entry.spouseObserved || false,
      morningHeadache: entry.morningHeadache || false,
      feltRested: entry.feltRested || false,
      impactOnWork: entry.impactOnWork || '',
      severityRating: entry.severityRating || 5,
    });
    setSelectedConditionTags(entry.conditionTags || []);
    setEditingId(entry.id);
    setIsOpen(true);
  };

  const sleepEntries = useMemo(() => data.sleepEntries ?? [], [data.sleepEntries]);

  // Statistics with VA-relevant metrics
  const stats = useMemo(() => {
    const last30Days = sleepEntries.filter(e => {
      const date = new Date(e.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return date >= thirtyDaysAgo;
    });

    const avgHours = last30Days.length > 0
      ? (last30Days.reduce((sum, e) => sum + e.hoursSlept, 0) / last30Days.length).toFixed(1)
      : 0;

    const nightmaresCount = last30Days.filter(e => e.nightmares).length;
    const cpapNights = last30Days.filter(e => e.usesCPAP);
    const cpapUsage = cpapNights.filter(e => e.cpapUsedLastNight).length;
    
    // Calculate average CPAP hours when used
    const cpapHoursEntries = last30Days.filter(e => e.cpapUsedLastNight && e.cpapHoursUsed);
    const avgCpapHours = cpapHoursEntries.length > 0
      ? (cpapHoursEntries.reduce((sum, e) => sum + (e.cpapHoursUsed || 0), 0) / cpapHoursEntries.length).toFixed(1)
      : null;

    // VA-relevant metrics
    const gaspingEpisodes = last30Days.reduce((sum, e) => sum + (e.timesWokeGasping || 0), 0);
    const oxygenDrops = last30Days.filter(e => e.oxygenDesaturation).length;
    const severeSleepiness = last30Days.filter(e => 
      e.daytimeSleepiness === 'Persistent hypersomnolence'
    ).length;
    const notRested = last30Days.filter(e => e.feltRested === false).length;

    return {
      avgHours,
      nightmaresLast30Days: nightmaresCount,
      cpapCompliance: cpapNights.length > 0 ? Math.round((cpapUsage / cpapNights.length) * 100) : null,
      avgCpapHours,
      totalEntries: sleepEntries.length,
      gaspingEpisodes,
      oxygenDrops,
      severeSleepiness,
      notRested,
      last30DaysCount: last30Days.length,
    };
  }, [sleepEntries]);

  // Estimate VA rating based on logged data
  const estimatedRating = useMemo(() => {
    if (sleepEntries.length === 0) return null;
    
    const hasRespiratoryFailure = sleepEntries.some(e => e.chronicRespiratoryFailure || e.requiresOxygen);
    const usesCPAP = sleepEntries.some(e => e.usesCPAP);
    const hasSevereSleepiness = sleepEntries.some(e => 
      e.daytimeSleepiness === 'Persistent hypersomnolence'
    );
    
    if (hasRespiratoryFailure) return { rating: '100%', color: 'text-destructive', note: 'Chronic respiratory failure with CO₂ retention or cor pulmonale' };
    if (usesCPAP) return { rating: '50%', color: 'text-warning', note: 'Requires use of breathing assistance device such as CPAP' };
    if (hasSevereSleepiness) return { rating: '30%', color: 'text-blue-500', note: 'Persistent daytime hypersomnolence' };
    return { rating: '0%', color: 'text-muted-foreground', note: 'Asymptomatic with documented sleep disorder' };
  }, [sleepEntries]);

  const getQualityColor = (quality: SleepQuality) => {
    switch (quality) {
      case 'Excellent': return 'bg-success/10 text-success border-success/20';
      case 'Good': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Fair': return 'bg-warning/10 text-warning border-warning/20';
      case 'Poor': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Very Poor': return 'bg-destructive/10 text-destructive border-destructive/20';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in overflow-x-hidden max-w-full">
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#3B82F6]/20 to-[#3B82F6]/5 shadow-[0_0_24px_rgba(59,130,246,0.2)]">
            <Moon className="h-6 w-6 text-[#3B82F6] drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Sleep Tracker</h1>
            <p className="text-muted-foreground text-sm">VA-aligned sleep apnea evidence logging</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => exportSleepLog(sleepEntries)}
          className="gap-2 hidden sm:flex flex-shrink-0"
          disabled={sleepEntries.length === 0}
        >
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {/* VA Rating Info - Premium Card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#3B82F6]/10 to-[#3B82F6]/5 border border-[#3B82F6]/30 p-5 shadow-lg" style={{ boxShadow: '0 4px 24px rgba(59, 130, 246, 0.15)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-[#3B82F6]/20">
            <Moon className="h-5 w-5 text-[#3B82F6]" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">VA Sleep Apnea Ratings</h3>
            <p className="text-xs text-muted-foreground">38 CFR 4.97 DC 6847</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-background/60 rounded-xl p-3 border border-border/50">
            <span className="font-bold text-muted-foreground text-lg">0%</span>
            <p className="text-muted-foreground mt-1">Asymptomatic, documented</p>
          </div>
          <div className="bg-background/60 rounded-xl p-3 border border-blue-500/30">
            <span className="font-bold text-blue-400 text-lg">30%</span>
            <p className="text-muted-foreground mt-1">Persistent daytime sleepiness</p>
          </div>
          <div className="bg-background/60 rounded-xl p-3 border border-warning/30">
            <span className="font-bold text-warning text-lg">50%</span>
            <p className="text-muted-foreground mt-1">Requires CPAP machine</p>
          </div>
          <div className="bg-background/60 rounded-xl p-3 border border-destructive/30">
            <span className="font-bold text-destructive text-lg">100%</span>
            <p className="text-muted-foreground mt-1">Chronic respiratory failure</p>
          </div>
      </div>

      {/* Add Log Button */}
      <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
        <DialogTrigger asChild>
          <Button className="gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-[#102039] shadow-[0_4px_16px_rgba(59,130,246,0.3)]">
            <Plus className="h-4 w-4" />
            Log Sleep
          </Button>
        </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Sleep Entry' : 'Log Sleep'}</DialogTitle>
              <DialogDescription>Track sleep patterns for VA disability documentation</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4 pb-4">
                  {/* Basic Info */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input 
                        id="date" 
                        type="date" 
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hours">Hours Slept</Label>
                      <Input 
                        id="hours" 
                        type="number" 
                        min="0"
                        max="24"
                        step="0.5"
                        value={formData.hoursSlept}
                        onChange={(e) => setFormData({ ...formData, hoursSlept: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="quality">Sleep Quality</Label>
                      <Select 
                        value={formData.quality} 
                        onValueChange={(value: SleepQuality) => setFormData({ ...formData, quality: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {qualities.map((q) => (
                            <SelectItem key={q.value} value={q.value}>{q.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interruptions">Sleep Interruptions</Label>
                      <Input 
                        id="interruptions" 
                        type="number" 
                        min="0"
                        max="30"
                        value={formData.interruptions}
                        onChange={(e) => setFormData({ ...formData, interruptions: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Sleep Apnea Specific - VA Rating Fields */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Wind className="h-4 w-4 text-[#3B82F6]" />
                      Sleep Apnea Symptoms (VA DC 6847)
                    </Label>

                    {/* CPAP Section - CRITICAL for 50% rating */}
                    <div className={`rounded-lg border-2 p-4 ${formData.usesCPAP ? 'border-success bg-success/10' : 'border-warning bg-warning/10'}`}>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-base font-semibold">Do you use a CPAP/breathing device?</Label>
                          <p className="text-sm font-medium text-warning">⭐ Critical for 50% rating</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant={formData.usesCPAP ? "default" : "outline"}
                            className={formData.usesCPAP ? "bg-success hover:bg-success/90 min-h-[44px]" : "min-h-[44px]"}
                            onClick={() => setFormData({ ...formData, usesCPAP: true })}
                          >
                            Yes
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant={!formData.usesCPAP ? "default" : "outline"}
                            className="min-h-[44px]"
                            onClick={() => setFormData({ ...formData, usesCPAP: false })}
                          >
                            No
                          </Button>
                        </div>
                      </div>
                    </div>

                    {formData.usesCPAP && (
                      <div className="ml-4 space-y-3 border-l-2 border-[#3B82F6]/30 pl-4">
                        <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/30">
                          <div className="space-y-0.5">
                            <Label>Used CPAP Last Night?</Label>
                            <p className="text-xs text-muted-foreground">VA checks compliance</p>
                          </div>
                          <Switch 
                            checked={formData.cpapUsedLastNight}
                            onCheckedChange={(checked) => setFormData({ ...formData, cpapUsedLastNight: checked })}
                          />
                        </div>
                        {formData.cpapUsedLastNight && (
                          <div className="space-y-2">
                            <Label htmlFor="cpapHours">CPAP Hours Used</Label>
                            <Input 
                              id="cpapHours" 
                              type="number" 
                              min="0"
                              max="24"
                              step="0.5"
                              placeholder="e.g., 6.5"
                              value={formData.cpapHoursUsed || ''}
                              onChange={(e) => setFormData({ ...formData, cpapHoursUsed: parseFloat(e.target.value) || 0 })}
                            />
                            <p className="text-xs text-muted-foreground">VA typically requires 4+ hours/night</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 100% Rating Section */}
                    <div className="space-y-3 p-3 rounded-lg border-2 border-destructive/50 bg-destructive/5">
                      <Label className="text-sm font-semibold text-destructive">100% Rating Criteria</Label>
                      
                      <div className="flex items-center justify-between rounded-lg border p-3 bg-background/50">
                        <div className="space-y-0.5">
                          <Label className="text-sm">Chronic Respiratory Failure?</Label>
                          <p className="text-xs text-muted-foreground">With CO₂ retention or cor pulmonale</p>
                        </div>
                        <Switch 
                          checked={formData.chronicRespiratoryFailure}
                          onCheckedChange={(checked) => setFormData({ ...formData, chronicRespiratoryFailure: checked })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between rounded-lg border p-3 bg-background/50">
                        <div className="space-y-0.5">
                          <Label className="text-sm">Requires Supplemental Oxygen?</Label>
                        </div>
                        <Switch 
                          checked={formData.requiresOxygen}
                          onCheckedChange={(checked) => setFormData({ ...formData, requiresOxygen: checked })}
                        />
                      </div>
                    </div>

                    {/* Breathing Episodes */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="timesGasping">Times Woke Up Gasping/Choking</Label>
                        <Input 
                          id="timesGasping" 
                          type="number" 
                          min="0"
                          max="20"
                          placeholder="0"
                          value={formData.timesWokeGasping || 0}
                          onChange={(e) => setFormData({ ...formData, timesWokeGasping: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <Label className="text-sm">Morning Headache?</Label>
                        </div>
                        <Switch 
                          checked={formData.morningHeadache}
                          onCheckedChange={(checked) => setFormData({ ...formData, morningHeadache: checked })}
                        />
                    </div>

                    {/* Spouse/Partner Observed */}
                    <div className="flex items-center justify-between rounded-lg border p-3 border-purple-500/30 bg-purple-500/5">
                      <div className="space-y-0.5">
                        <Label className="text-sm">Spouse/Partner Observed Apnea?</Label>
                        <p className="text-xs text-muted-foreground">Supports buddy statement</p>
                      </div>
                      <Switch 
                        checked={formData.spouseObserved}
                        onCheckedChange={(checked) => setFormData({ ...formData, spouseObserved: checked })}
                      />
                    </div>
                    </div>

                    {/* Oxygen Desaturation */}
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <Label className="text-sm">Oxygen Level Dropped?</Label>
                        <p className="text-xs text-muted-foreground">If using pulse oximeter</p>
                      </div>
                      <Switch 
                        checked={formData.oxygenDesaturation}
                        onCheckedChange={(checked) => setFormData({ ...formData, oxygenDesaturation: checked })}
                      />
                    </div>

                    {formData.oxygenDesaturation && (
                      <div className="space-y-2 ml-4">
                        <Label htmlFor="lowestO2">Lowest Oxygen Level (%)</Label>
                        <Input 
                          id="lowestO2" 
                          type="number" 
                          min="0"
                          max="100"
                          placeholder="e.g., 88"
                          value={formData.lowestOxygenLevel || ''}
                          onChange={(e) => setFormData({ ...formData, lowestOxygenLevel: parseInt(e.target.value) || undefined })}
                        />
                      </div>
                    )}

                    {/* Daytime Sleepiness - Key for 30% rating */}
                    <div className="space-y-2">
                      <Label htmlFor="sleepiness">Daytime Sleepiness Level</Label>
                      <Select 
                        value={formData.daytimeSleepiness || 'None'} 
                        onValueChange={(value: DaytimeSleepiness) => setFormData({ ...formData, daytimeSleepiness: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {daytimeSleepinessOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Persistent sleepiness supports 30% rating</p>
                    </div>

                    {/* Felt Rested */}
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <Label className="text-sm">Felt Rested Upon Waking?</Label>
                      </div>
                      <Switch 
                        checked={formData.feltRested}
                        onCheckedChange={(checked) => setFormData({ ...formData, feltRested: checked })}
                      />
                    </div>

                    {/* Severity Rating */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Sleep Issue Severity</Label>
                        <span className={`text-lg font-bold ${
                          formData.severityRating && formData.severityRating >= 8 ? 'text-destructive' :
                          formData.severityRating && formData.severityRating >= 5 ? 'text-warning' :
                          'text-success'
                        }`}>
                          {formData.severityRating}/10
                        </span>
                      </div>
                      <Slider
                        value={[formData.severityRating || 5]}
                        onValueChange={(value) => setFormData({ ...formData, severityRating: value[0] })}
                        min={1}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Mild</span>
                        <span>Moderate</span>
                        <span>Severe</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* PTSD-Related */}
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">Nightmares?</Label>
                      <p className="text-sm text-muted-foreground">Common with PTSD</p>
                    </div>
                    <Switch 
                      checked={formData.nightmares}
                      onCheckedChange={(checked) => setFormData({ ...formData, nightmares: checked })}
                    />
                  </div>

                  {/* Impact */}
                  <div className="space-y-2">
                    <Label htmlFor="impactOnWork">Impact on Work/Daily Activities</Label>
                    <Textarea 
                      id="impactOnWork" 
                      placeholder="How did poor sleep affect your day? (e.g., couldn't concentrate, had to rest, missed work)"
                      value={formData.impactOnWork || ''}
                      onChange={(e) => setFormData({ ...formData, impactOnWork: e.target.value })}
                      rows={2}
                      onFocus={(e) => {
                        setTimeout(() => {
                          e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 300);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Any other details..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={2}
                      onFocus={(e) => {
                        setTimeout(() => {
                          e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 300);
                      }}
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
                        entryType="sleep"
                        entryId={editingId}
                        documents={documents}
                        onDocumentsChange={setAllDocuments}
                      />
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-border bg-background">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? 'Update' : 'Save'} Entry
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estimated Rating Card */}
      {estimatedRating && sleepEntries.length > 0 && (
        <Card className="border-[#3B82F6]/30 bg-[#3B82F6]/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-[#3B82F6]" />
                <div>
                  <p className="font-semibold">Estimated VA Rating</p>
                  <p className="text-xs text-muted-foreground">{estimatedRating.note}</p>
                </div>
              </div>
              <Badge className={`text-lg px-3 py-1 ${estimatedRating.color}`}>
                {estimatedRating.rating}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="data-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-[#3B82F6]" />
              <div>
                <p className="text-2xl font-bold">{stats.avgHours}h</p>
                <p className="text-sm text-muted-foreground">Avg Sleep</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {stats.cpapCompliance !== null && (
          <Card className="data-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className={`h-8 w-8 ${stats.cpapCompliance >= 70 ? 'text-success' : 'text-warning'}`} />
                <div>
                  <p className="text-2xl font-bold">{stats.cpapCompliance}%</p>
                  <p className="text-sm text-muted-foreground">CPAP Compliance</p>
                  {stats.avgCpapHours && (
                    <p className="text-xs text-muted-foreground">{stats.avgCpapHours}h avg/night</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="data-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Wind className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.gaspingEpisodes}</p>
                <p className="text-sm text-muted-foreground">Gasping Episodes</p>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="data-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">{stats.notRested}</p>
                <p className="text-sm text-muted-foreground">Not Rested</p>
                <p className="text-xs text-muted-foreground">of {stats.last30DaysCount} nights</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Row */}
      {(stats.nightmaresLast30Days > 0 || stats.severeSleepiness > 0 || stats.oxygenDrops > 0) && (
        <div className="grid gap-4 grid-cols-3">
          <Card className="data-card">
            <CardContent className="pt-4 pb-4">
              <div className="text-center">
                <p className="text-xl font-bold text-destructive">{stats.nightmaresLast30Days}</p>
                <p className="text-xs text-muted-foreground">Nightmares (30d)</p>
              </div>
            </CardContent>
          </Card>
          <Card className="data-card">
            <CardContent className="pt-4 pb-4">
              <div className="text-center">
                <p className="text-xl font-bold text-blue-500">{stats.severeSleepiness}</p>
                <p className="text-xs text-muted-foreground">Severe Sleepiness</p>
              </div>
            </CardContent>
          </Card>
          <Card className="data-card">
            <CardContent className="pt-4 pb-4">
              <div className="text-center">
                <p className="text-xl font-bold text-warning">{stats.oxygenDrops}</p>
                <p className="text-xs text-muted-foreground">O₂ Desaturations</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sleep Entries List */}
      {sleepEntries.length === 0 ? (
        <Card className="data-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Moon className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">No sleep entries logged yet.</p>
            <p className="text-sm text-muted-foreground text-center mt-1">Track your sleep to build evidence.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sleepEntries
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((entry) => (
            <Card key={entry.id} className="data-card">
              <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={getQualityColor(entry.quality)}>
                        {entry.quality}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {entry.hoursSlept}h
                      </span>
                      {entry.severityRating && (
                        <Badge variant="outline" className={
                          entry.severityRating >= 8 ? 'text-destructive border-destructive/50' :
                          entry.severityRating >= 5 ? 'text-warning border-warning/50' :
                          'text-success border-success/50'
                        }>
                          {entry.severityRating}/10
                        </Badge>
                      )}
                      {entry.nightmares && (
                      <Badge variant="destructive" className="text-xs">Nightmares</Badge>
                    )}
                      {entry.timesWokeGasping && entry.timesWokeGasping > 0 && (
                        <Badge variant="outline" className="text-xs text-blue-500 border-blue-500/50">Gasping x{entry.timesWokeGasping}</Badge>
                      )}
                      {entry.spouseObserved && (
                        <Badge variant="outline" className="text-xs text-purple-500 border-purple-500/50">Witnessed</Badge>
                      )}
                    {entry.requiresOxygen && (
                      <Badge variant="outline" className="text-xs text-destructive border-destructive/50">O₂ Therapy</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)} aria-label="Edit sleep entry">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteSleepEntry(entry.id)} aria-label="Delete sleep entry">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(entry.date).toLocaleDateString()}
                  {entry.interruptions > 0 && (
                    <span>• {entry.interruptions} interruptions</span>
                  )}
                  {entry.feltRested === false && (
                    <Badge variant="outline" className="text-xs">Not Rested</Badge>
                  )}
                </div>
                
                {/* CPAP Info */}
                {entry.usesCPAP && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className={entry.cpapUsedLastNight ? 'text-success' : 'text-warning'}>
                      CPAP: {entry.cpapUsedLastNight ? `Used${entry.cpapHoursUsed ? ` (${entry.cpapHoursUsed}h)` : ''}` : 'Not Used'}
                    </span>
                  </div>
                )}

                {/* Daytime Sleepiness */}
                {entry.daytimeSleepiness && entry.daytimeSleepiness !== 'None' && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Daytime Sleepiness: </span>
                    <span className={(entry.daytimeSleepiness === 'Severe' || entry.daytimeSleepiness === 'Persistent hypersomnolence') ? 'text-destructive font-medium' : ''}>
                      {entry.daytimeSleepiness}
                    </span>
                  </div>
                )}

                {/* Impact on Work */}
                {entry.impactOnWork && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Impact: </span>
                    <span>{entry.impactOnWork}</span>
                  </div>
                )}

                {entry.notes && (
                  <p className="text-sm text-muted-foreground bg-muted/50 rounded p-2">{entry.notes}</p>
                )}
                
                <EvidenceThumbnails
                  entryType="sleep"
                  entryId={entry.id}
                  documents={documents}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
