import { useState, useMemo } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { Moon, Plus, Trash2, Edit, Calendar, Clock, AlertTriangle, CheckCircle2, TrendingUp, Wind, Activity, Zap } from 'lucide-react';
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
import type { SleepEntry, SleepQuality, DaytimeSleepiness } from '@/types/claims';

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
  { value: 'Severe - falling asleep during activities', label: 'Severe - Falling asleep during activities' },
];

export default function Sleep() {
  const { data, addSleepEntry, updateSleepEntry, deleteSleepEntry } = useClaims();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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
    daytimeSleepiness: 'None',
    wokeGasping: false,
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
      daytimeSleepiness: 'None',
      wokeGasping: false,
      morningHeadache: false,
      feltRested: false,
      impactOnWork: '',
      severityRating: 5,
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateSleepEntry(editingId, formData);
    } else {
      addSleepEntry(formData);
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
      daytimeSleepiness: entry.daytimeSleepiness || 'None',
      wokeGasping: entry.wokeGasping || false,
      morningHeadache: entry.morningHeadache || false,
      feltRested: entry.feltRested || false,
      impactOnWork: entry.impactOnWork || '',
      severityRating: entry.severityRating || 5,
    });
    setEditingId(entry.id);
    setIsOpen(true);
  };

  const sleepEntries = data.sleepEntries || [];

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
    const gaspingEpisodes = last30Days.filter(e => e.wokeGasping).length;
    const oxygenDrops = last30Days.filter(e => e.oxygenDesaturation).length;
    const severeSleepiness = last30Days.filter(e => 
      e.daytimeSleepiness === 'Severe - falling asleep during activities'
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
    
    const hasOxygenTherapy = sleepEntries.some(e => e.requiresOxygen);
    const usesCPAP = sleepEntries.some(e => e.usesCPAP);
    const hasSevereSleepiness = sleepEntries.some(e => 
      e.daytimeSleepiness === 'Severe - falling asleep during activities'
    );
    
    if (hasOxygenTherapy) return { rating: '100%', color: 'text-destructive', note: 'Requires chronic respiratory failure with CO2 retention or cor pulmonale' };
    if (usesCPAP) return { rating: '50%', color: 'text-warning', note: 'Requires use of breathing assistance device such as CPAP' };
    if (hasSevereSleepiness) return { rating: '30%', color: 'text-orange-500', note: 'Persistent daytime hypersomnolence' };
    return { rating: '0%', color: 'text-muted-foreground', note: 'Asymptomatic with documented sleep disorder' };
  }, [sleepEntries]);

  const getQualityColor = (quality: SleepQuality) => {
    switch (quality) {
      case 'Excellent': return 'bg-success/10 text-success border-success/20';
      case 'Good': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Fair': return 'bg-warning/10 text-warning border-warning/20';
      case 'Poor': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Very Poor': return 'bg-destructive/10 text-destructive border-destructive/20';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in overflow-x-hidden max-w-full">
      {/* VA Rating Info */}
      <Alert className="border-primary/50 bg-primary/10">
        <Moon className="h-5 w-5 text-primary" />
        <AlertTitle className="text-primary font-semibold">VA Sleep Apnea Ratings (38 CFR 4.97 DC 6847)</AlertTitle>
        <AlertDescription className="text-foreground/90 mt-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mt-2">
            <div className="bg-background/50 rounded p-2">
              <span className="font-bold text-muted-foreground">0%</span>
              <p>Asymptomatic, documented</p>
            </div>
            <div className="bg-background/50 rounded p-2">
              <span className="font-bold text-orange-500">30%</span>
              <p>Persistent daytime sleepiness</p>
            </div>
            <div className="bg-background/50 rounded p-2">
              <span className="font-bold text-warning">50%</span>
              <p>Requires CPAP machine</p>
            </div>
            <div className="bg-background/50 rounded p-2">
              <span className="font-bold text-destructive">100%</span>
              <p>Chronic respiratory failure</p>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="section-header mb-0">
          <div className="section-icon bg-indigo-500/10">
            <Moon className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sleep Tracker</h1>
            <p className="text-muted-foreground text-sm">VA-aligned sleep apnea evidence logging</p>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
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
                        value={formData.interruptions}
                        onChange={(e) => setFormData({ ...formData, interruptions: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Sleep Apnea Specific - VA Rating Fields */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Wind className="h-4 w-4 text-indigo-500" />
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
                            className={formData.usesCPAP ? "bg-success hover:bg-success/90" : ""}
                            onClick={() => setFormData({ ...formData, usesCPAP: true })}
                          >
                            Yes
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant={!formData.usesCPAP ? "default" : "outline"}
                            onClick={() => setFormData({ ...formData, usesCPAP: false })}
                          >
                            No
                          </Button>
                        </div>
                      </div>
                    </div>

                    {formData.usesCPAP && (
                      <div className="ml-4 space-y-3 border-l-2 border-indigo-500/30 pl-4">
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

                    {/* Supplemental Oxygen */}
                    <div className="flex items-center justify-between rounded-lg border p-4 border-destructive/30 bg-destructive/5">
                      <div className="space-y-0.5">
                        <Label className="text-base">Requires Supplemental Oxygen?</Label>
                        <p className="text-sm text-muted-foreground">Required for 100% rating</p>
                      </div>
                      <Switch 
                        checked={formData.requiresOxygen}
                        onCheckedChange={(checked) => setFormData({ ...formData, requiresOxygen: checked })}
                      />
                    </div>

                    {/* Breathing Episodes */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <Label className="text-sm">Woke Gasping/Choking?</Label>
                        </div>
                        <Switch 
                          checked={formData.wokeGasping}
                          onCheckedChange={(checked) => setFormData({ ...formData, wokeGasping: checked })}
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
        <Card className="border-indigo-500/30 bg-indigo-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-indigo-500" />
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
              <Clock className="h-8 w-8 text-indigo-500" />
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
              <Wind className="h-8 w-8 text-orange-500" />
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
                <p className="text-xl font-bold text-orange-500">{stats.severeSleepiness}</p>
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
                    {entry.wokeGasping && (
                      <Badge variant="outline" className="text-xs text-orange-500 border-orange-500/50">Gasping</Badge>
                    )}
                    {entry.requiresOxygen && (
                      <Badge variant="outline" className="text-xs text-destructive border-destructive/50">O₂ Therapy</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteSleepEntry(entry.id)}>
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
                    <span className={entry.daytimeSleepiness.includes('Severe') ? 'text-destructive font-medium' : ''}>
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
