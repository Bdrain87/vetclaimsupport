import { useState } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { Activity, Plus, Trash2, Edit, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { exportSymptoms } from '@/utils/pdfExport';
import { PTSDSymptomLogger } from '@/components/symptoms/PTSDSymptomLogger';
import type { SymptomEntry, SymptomFrequency } from '@/types/claims';

// Simplified VA-relevant frequency options
const frequencyOptions: SymptomFrequency[] = [
  'Constant',
  'Daily',
  'Several times per week',
  'Weekly',
  'Monthly',
  'Occasional',
];

export default function Symptoms() {
  const { data, addSymptom, updateSymptom, deleteSymptom } = useClaims();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<SymptomEntry, 'id'>>({
    date: '',
    symptom: '',
    bodyArea: '',
    severity: 5,
    frequency: '',
    dailyImpact: '',
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      date: '',
      symptom: '',
      bodyArea: '',
      severity: 5,
      frequency: '',
      dailyImpact: '',
      notes: '',
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateSymptom(editingId, formData);
    } else {
      addSymptom(formData);
    }
    setIsOpen(false);
    resetForm();
  };

  const handleEdit = (symptom: SymptomEntry) => {
    setFormData({
      date: symptom.date,
      symptom: symptom.symptom,
      bodyArea: symptom.bodyArea,
      severity: symptom.severity,
      frequency: symptom.frequency,
      dailyImpact: symptom.dailyImpact,
      notes: symptom.notes,
    });
    setEditingId(symptom.id);
    setIsOpen(true);
  };

  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return 'bg-success/20 text-success';
    if (severity <= 6) return 'bg-warning/20 text-warning';
    return 'bg-destructive/20 text-destructive';
  };

  const getSeverityLabel = (severity: number) => {
    if (severity <= 3) return 'Mild';
    if (severity <= 6) return 'Moderate';
    return 'Severe';
  };

  return (
    <div className="space-y-6 animate-fade-in overflow-x-hidden max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="section-header mb-0">
          <div className="section-icon bg-symptoms/10">
            <Activity className="h-5 w-5 text-symptoms" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Symptoms Journal</h1>
            <p className="text-muted-foreground text-sm">Track symptoms and their impact on daily life</p>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" onClick={() => exportSymptoms(data.symptoms)} className="gap-2 hidden sm:flex">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Tabs for General vs PTSD */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General Symptoms</TabsTrigger>
          <TabsTrigger value="ptsd">PTSD (DC 9411)</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 space-y-4">
          {/* Add Entry Button for General */}
          <div className="flex justify-end">
            <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>{editingId ? 'Edit Symptom' : 'Log Symptom'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2" style={{ scrollPaddingBottom: '350px' }}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input 
                          id="date" 
                          type="date" 
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          required
                          onFocus={(e) => {
                            setTimeout(() => {
                              e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 300);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bodyArea">Body Area</Label>
                        <Input 
                          id="bodyArea" 
                          placeholder="e.g., Lower back, knees"
                          value={formData.bodyArea}
                          onChange={(e) => setFormData({ ...formData, bodyArea: e.target.value })}
                          onFocus={(e) => {
                            setTimeout(() => {
                              e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 300);
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="symptom">Symptom</Label>
                      <Input 
                        id="symptom" 
                        placeholder="e.g., Sharp pain, numbness, ringing"
                        value={formData.symptom}
                        onChange={(e) => setFormData({ ...formData, symptom: e.target.value })}
                        required
                        onFocus={(e) => {
                          setTimeout(() => {
                            e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }, 300);
                        }}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Severity (1-10)</Label>
                        <span className={`rounded-md px-2 py-1 text-sm font-medium ${getSeverityColor(formData.severity)}`}>
                          {formData.severity} - {getSeverityLabel(formData.severity)}
                        </span>
                      </div>
                      <Slider
                        value={[formData.severity]}
                        onValueChange={([value]) => setFormData({ ...formData, severity: value })}
                        min={1}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select 
                        value={formData.frequency} 
                        onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencyOptions.map((freq) => (
                            <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dailyImpact">Impact on Daily Life</Label>
                      <Textarea 
                        id="dailyImpact" 
                        placeholder="How does this affect your work, sleep, activities?"
                        value={formData.dailyImpact}
                        onChange={(e) => setFormData({ ...formData, dailyImpact: e.target.value })}
                        rows={3}
                        onFocus={(e) => {
                          setTimeout(() => {
                            e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }, 300);
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea 
                        id="notes" 
                        placeholder="Triggers, what helps, additional context..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        onFocus={(e) => {
                          setTimeout(() => {
                            e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }, 300);
                        }}
                      />
                    </div>
                  </div>
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

          {/* Symptoms List */}
          {data.symptoms.length === 0 ? (
            <Card className="data-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Activity className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground text-center">No symptoms logged yet.</p>
                <p className="text-sm text-muted-foreground text-center mt-1">Regular journaling strengthens your claim.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {data.symptoms.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((symptom) => (
                <Card key={symptom.id} className="data-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getSeverityColor(symptom.severity)}`}>
                          {symptom.severity}/10
                        </span>
                        {symptom.bodyArea && (
                          <span className="text-sm text-muted-foreground">{symptom.bodyArea}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(symptom)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteSymptom(symptom.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-2">{symptom.symptom}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(symptom.date).toLocaleDateString()}
                      {symptom.frequency && (
                        <span className="ml-2">• {symptom.frequency}</span>
                      )}
                    </div>
                    
                    {symptom.dailyImpact && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Daily Impact</p>
                        <p className="text-sm">{symptom.dailyImpact}</p>
                      </div>
                    )}

                    {symptom.notes && (
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">{symptom.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ptsd" className="mt-4">
          <PTSDSymptomLogger />
        </TabsContent>
      </Tabs>
    </div>
  );
}
