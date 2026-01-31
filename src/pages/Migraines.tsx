import { useState, useMemo } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { 
  Brain, Plus, Trash2, Edit, Calendar, Clock, AlertTriangle, 
  Download, Info, TrendingUp, Zap 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { 
  MigraineEntry, MigraineSeverity, MigraineDuration, 
  MigraneTrigger, MigraineImpact, MigraineSymptom 
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

export default function Migraines() {
  const { data, addMigraine, updateMigraine, deleteMigraine } = useClaims();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<MigraineEntry, 'id'>>({
    date: '',
    time: '',
    duration: '2hrs',
    severity: 'Moderate',
    symptoms: [],
    triggers: [],
    impact: 'Reduced productivity',
    treatment: '',
    notes: '',
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
      treatment: '',
      notes: '',
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMigraine(editingId, formData);
    } else {
      addMigraine(formData);
    }
    setIsOpen(false);
    resetForm();
  };

  const handleEdit = (entry: MigraineEntry) => {
    setFormData({
      date: entry.date,
      time: entry.time,
      duration: entry.duration,
      severity: entry.severity,
      symptoms: entry.symptoms,
      triggers: entry.triggers,
      impact: entry.impact,
      treatment: entry.treatment,
      notes: entry.notes,
    });
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

  // Statistics
  const stats = useMemo(() => {
    const migraines = data.migraines || [];
    const last30Days = migraines.filter(m => {
      const date = new Date(m.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return date >= thirtyDaysAgo;
    });

    const prostratingCount = last30Days.filter(m => m.severity === 'Prostrating').length;
    const severeOrProstratingCount = last30Days.filter(
      m => m.severity === 'Severe' || m.severity === 'Prostrating'
    ).length;

    return {
      totalLast30Days: last30Days.length,
      prostratingLast30Days: prostratingCount,
      severeOrProstratingLast30Days: severeOrProstratingCount,
      totalAll: migraines.length,
    };
  }, [data.migraines]);

  const getSeverityColor = (severity: MigraineSeverity) => {
    switch (severity) {
      case 'Mild': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Moderate': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'Severe': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Prostrating': return 'bg-red-500/10 text-red-500 border-red-500/20';
    }
  };

  const exportToPDF = () => {
    const migraines = data.migraines || [];
    if (migraines.length === 0) {
      alert('No migraine entries to export');
      return;
    }

    // Create printable HTML content
    const sortedMigraines = [...migraines].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Migraine Log - VA Evidence</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          h1 { color: #1a365d; border-bottom: 2px solid #1a365d; padding-bottom: 10px; }
          h2 { color: #2d3748; margin-top: 30px; }
          .summary { background: #f7fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
          .summary-item { text-align: center; }
          .summary-value { font-size: 32px; font-weight: bold; color: #1a365d; }
          .summary-label { color: #718096; font-size: 14px; }
          .entry { border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px; page-break-inside: avoid; }
          .entry-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
          .entry-date { font-weight: bold; font-size: 16px; }
          .entry-severity { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
          .severity-mild { background: #c6f6d5; color: #22543d; }
          .severity-moderate { background: #fefcbf; color: #744210; }
          .severity-severe { background: #fed7aa; color: #9c4221; }
          .severity-prostrating { background: #fed7d7; color: #9b2c2c; }
          .entry-row { margin-bottom: 10px; }
          .entry-label { font-weight: 600; color: #4a5568; }
          .va-note { background: #ebf8ff; border-left: 4px solid #3182ce; padding: 15px; margin: 30px 0; }
          .footer { margin-top: 40px; text-align: center; color: #718096; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          @media print { .entry { break-inside: avoid; } }
        </style>
      </head>
      <body>
        <h1>Migraine Log - VA Disability Evidence</h1>
        <p>Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        
        <div class="summary">
          <h2 style="margin-top: 0;">Summary Statistics</h2>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-value">${stats.totalLast30Days}</div>
              <div class="summary-label">Attacks (Last 30 Days)</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${stats.prostratingLast30Days}</div>
              <div class="summary-label">Prostrating Attacks (Last 30 Days)</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${stats.totalAll}</div>
              <div class="summary-label">Total Logged Attacks</div>
            </div>
          </div>
        </div>

        <div class="va-note">
          <strong>VA Rating Information:</strong> Migraines are rated under 38 CFR § 4.124a, Diagnostic Code 8100.
          The VA considers the frequency of "prostrating" attacks (requiring bed rest) when determining ratings:
          <ul>
            <li><strong>0%</strong> - Less frequent attacks</li>
            <li><strong>10%</strong> - Prostrating attacks averaging one in 2 months</li>
            <li><strong>30%</strong> - Prostrating attacks averaging once a month</li>
            <li><strong>50%</strong> - Very frequent completely prostrating attacks with prolonged periods of severe economic inadaptability</li>
          </ul>
        </div>

        <h2>Detailed Migraine Log (${migraines.length} entries)</h2>
        
        ${sortedMigraines.map(m => `
          <div class="entry">
            <div class="entry-header">
              <span class="entry-date">${new Date(m.date).toLocaleDateString()} at ${m.time || 'N/A'}</span>
              <span class="entry-severity severity-${m.severity.toLowerCase()}">${m.severity}</span>
            </div>
            <div class="entry-row">
              <span class="entry-label">Duration:</span> ${durations.find(d => d.value === m.duration)?.label || m.duration}
            </div>
            <div class="entry-row">
              <span class="entry-label">Impact:</span> ${m.impact}
            </div>
            ${m.symptoms.length > 0 ? `
              <div class="entry-row">
                <span class="entry-label">Symptoms:</span> ${m.symptoms.join(', ')}
              </div>
            ` : ''}
            ${m.triggers.length > 0 ? `
              <div class="entry-row">
                <span class="entry-label">Triggers:</span> ${m.triggers.join(', ')}
              </div>
            ` : ''}
            ${m.treatment ? `
              <div class="entry-row">
                <span class="entry-label">Treatment:</span> ${m.treatment}
              </div>
            ` : ''}
            ${m.notes ? `
              <div class="entry-row">
                <span class="entry-label">Notes:</span> ${m.notes}
              </div>
            ` : ''}
          </div>
        `).join('')}

        <div class="footer">
          <p>This log was generated from the VA Evidence Tracker application.</p>
          <p>Present this document to your VA representative, VSO, or include with your disability claim.</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main Disclaimer */}
      <div className="p-3 bg-muted/50 border border-border rounded-lg">
        <p className="text-xs text-muted-foreground leading-relaxed">
          The VA migraine rating criteria shown here are for reference only. Your actual rating will be determined by the VA based on your C&P examination and medical evidence. Track your migraines consistently to build a strong evidence record.
        </p>
      </div>

      {/* VA Rating Info Alert */}
      <Alert className="border-primary/50 bg-primary/10">
        <Info className="h-5 w-5 text-primary" />
        <AlertTitle className="text-primary font-semibold">VA Migraine Rating Criteria</AlertTitle>
        <AlertDescription className="text-foreground/90 mt-2">
          <p className="mb-2">
            Migraines are rated based on the frequency of <strong>prostrating</strong> attacks 
            (completely incapacitating, requiring bed rest):
          </p>
          <ul className="text-sm space-y-1 ml-4">
            <li>• <strong>10%</strong> — Prostrating attacks averaging 1 in 2 months</li>
            <li>• <strong>30%</strong> — Prostrating attacks averaging once a month</li>
            <li>• <strong>50%</strong> — Very frequent prostrating attacks + severe economic impact</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-3 italic">
            Source: 38 CFR § 4.124a - Schedule of Ratings for Neurological Conditions
          </p>
        </AlertDescription>
      </Alert>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="section-header mb-0">
          <div className="section-icon bg-purple-500/10">
            <Brain className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Migraine Tracker</h1>
            <p className="text-muted-foreground">Document attacks for VA disability claims</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToPDF} className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          
          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Log Attack
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Migraine Entry' : 'Log Migraine Attack'}</DialogTitle>
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
                    <Label htmlFor="time">Time Started</Label>
                    <Input 
                      id="time" 
                      type="time" 
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Select 
                      value={formData.duration} 
                      onValueChange={(value: MigraineDuration) => setFormData({ ...formData, duration: value })}
                    >
                      <SelectTrigger>
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
                      Severity
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
                      onValueChange={(value: MigraineSeverity) => setFormData({ ...formData, severity: value })}
                    >
                      <SelectTrigger>
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

                <div className="space-y-2">
                  <Label htmlFor="impact">Impact on Activities</Label>
                  <Select 
                    value={formData.impact} 
                    onValueChange={(value: MigraineImpact) => setFormData({ ...formData, impact: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {impacts.map((i) => (
                        <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="treatment">Treatment Used</Label>
                  <Input 
                    id="treatment" 
                    placeholder="e.g., Sumatriptan, dark room, ice pack..."
                    value={formData.treatment}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Any additional details about this attack..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
      </div>

      {/* Statistics Cards */}
      {(data.migraines?.length || 0) > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="data-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-500/10">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalLast30Days}</p>
                  <p className="text-sm text-muted-foreground">Attacks (Last 30 Days)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="data-card border-red-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-red-500/10">
                  <Zap className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-500">{stats.prostratingLast30Days}</p>
                  <p className="text-sm text-muted-foreground">Prostrating (Last 30 Days)</p>
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
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Brain className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">No migraine attacks logged yet.</p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Click "Log Attack" to start tracking your migraines for VA claims.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {[...(data.migraines || [])].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          ).map((entry) => (
            <Card key={entry.id} className="data-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline" className={getSeverityColor(entry.severity)}>
                      {entry.severity}
                    </Badge>
                    <Badge variant="outline">
                      {durations.find(d => d.value === entry.duration)?.label}
                    </Badge>
                    {entry.severity === 'Prostrating' && (
                      <Badge className="bg-red-500 text-white">
                        VA Compensable
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMigraine(entry.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                  {entry.time && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {entry.time}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {entry.impact}
                  </div>
                </div>

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
                  <div>
                    <span className="text-xs text-muted-foreground">Triggers: </span>
                    <span className="text-sm">{entry.triggers.join(', ')}</span>
                  </div>
                )}

                {entry.treatment && (
                  <div>
                    <span className="text-xs text-muted-foreground">Treatment: </span>
                    <span className="text-sm">{entry.treatment}</span>
                  </div>
                )}

                {entry.notes && (
                  <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                    {entry.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
