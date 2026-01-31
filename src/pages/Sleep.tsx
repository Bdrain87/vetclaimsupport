import { useState, useMemo } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { Moon, Plus, Trash2, Edit, Calendar, Clock, Download, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { SleepEntry, SleepQuality } from '@/types/claims';

const qualities: { value: SleepQuality; label: string }[] = [
  { value: 'Very Poor', label: 'Very Poor' },
  { value: 'Poor', label: 'Poor' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Good', label: 'Good' },
  { value: 'Excellent', label: 'Excellent' },
];

export default function Sleep() {
  const { data, addSleepEntry, updateSleepEntry, deleteSleepEntry } = useClaims();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<SleepEntry, 'id'>>({
    date: '',
    hoursSlept: 6,
    quality: 'Fair',
    usesCPAP: false,
    cpapUsedLastNight: false,
    interruptions: 0,
    nightmares: false,
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      date: '',
      hoursSlept: 6,
      quality: 'Fair',
      usesCPAP: false,
      cpapUsedLastNight: false,
      interruptions: 0,
      nightmares: false,
      notes: '',
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
      interruptions: entry.interruptions,
      nightmares: entry.nightmares,
      notes: entry.notes,
    });
    setEditingId(entry.id);
    setIsOpen(true);
  };

  const sleepEntries = data.sleepEntries || [];

  // Statistics
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
    const cpapUsage = last30Days.filter(e => e.usesCPAP && e.cpapUsedLastNight).length;
    const cpapTotal = last30Days.filter(e => e.usesCPAP).length;

    return {
      avgHours,
      nightmaresLast30Days: nightmaresCount,
      cpapCompliance: cpapTotal > 0 ? Math.round((cpapUsage / cpapTotal) * 100) : null,
      totalEntries: sleepEntries.length,
    };
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
        <AlertTitle className="text-primary font-semibold">VA Sleep Condition Ratings</AlertTitle>
        <AlertDescription className="text-foreground/90 mt-2">
          <p className="mb-2">
            Sleep conditions like <strong>sleep apnea</strong>, <strong>insomnia</strong>, and <strong>nightmares</strong> (often secondary to PTSD) are rated by the VA:
          </p>
          <ul className="text-sm space-y-1 ml-4">
            <li>• <strong>Sleep Apnea:</strong> 0-100% based on CPAP use and oxygen levels</li>
            <li>• <strong>Insomnia:</strong> Often rated with mental health conditions</li>
            <li>• <strong>Nightmares:</strong> Typically rated as part of PTSD (10-100%)</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-2 italic">
            CPAP compliance is important - the VA may check your usage data.
          </p>
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
            <p className="text-muted-foreground text-sm">Track sleep patterns for VA disability claims</p>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Log Sleep
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Sleep Entry' : 'Log Sleep'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Use CPAP Machine?</Label>
                  <p className="text-sm text-muted-foreground">For sleep apnea treatment</p>
                </div>
                <Switch 
                  checked={formData.usesCPAP}
                  onCheckedChange={(checked) => setFormData({ ...formData, usesCPAP: checked })}
                />
              </div>

              {formData.usesCPAP && (
                <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/30">
                  <div className="space-y-0.5">
                    <Label className="text-base">Used CPAP Last Night?</Label>
                    <p className="text-sm text-muted-foreground">Track your compliance</p>
                  </div>
                  <Switch 
                    checked={formData.cpapUsedLastNight}
                    onCheckedChange={(checked) => setFormData({ ...formData, cpapUsedLastNight: checked })}
                  />
                </div>
              )}

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

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Additional details about your sleep..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
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

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="data-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-indigo-500" />
              <div>
                <p className="text-2xl font-bold">{stats.avgHours}h</p>
                <p className="text-sm text-muted-foreground">Avg Sleep (30 days)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="data-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">{stats.nightmaresLast30Days}</p>
                <p className="text-sm text-muted-foreground">Nightmares (30 days)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {stats.cpapCompliance !== null && (
          <Card className="data-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-success" />
                <div>
                  <p className="text-2xl font-bold">{stats.cpapCompliance}%</p>
                  <p className="text-sm text-muted-foreground">CPAP Compliance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <Card className="data-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats.totalEntries}</p>
                <p className="text-sm text-muted-foreground">Total Entries</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                  <div className="flex items-center gap-3">
                    <Badge className={getQualityColor(entry.quality)}>
                      {entry.quality}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {entry.hoursSlept} hours
                    </span>
                    {entry.nightmares && (
                      <Badge variant="destructive" className="text-xs">Nightmares</Badge>
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
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(entry.date).toLocaleDateString()}
                  {entry.interruptions > 0 && (
                    <span className="ml-2">• {entry.interruptions} interruptions</span>
                  )}
                </div>
                {entry.usesCPAP && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className={entry.cpapUsedLastNight ? 'text-success' : 'text-warning'}>
                      CPAP: {entry.cpapUsedLastNight ? 'Used' : 'Not Used'}
                    </span>
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
