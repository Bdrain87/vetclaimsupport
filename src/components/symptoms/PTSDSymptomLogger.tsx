import { useState } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Brain, 
  AlertTriangle, 
  Trash2, 
  Edit, 
  Calendar,
  TrendingUp,
  Info,
  Clock,
} from 'lucide-react';
import type { PTSDSymptomEntry, PTSDSymptomFrequency, PTSDSymptomWithFrequency } from '@/types/claims';

// Frequency options
const FREQUENCY_OPTIONS: PTSDSymptomFrequency[] = [
  'Daily',
  'Several times/week',
  'Weekly',
  'Monthly',
  'Occasional',
];

// 38 CFR 4.130 Rating Criteria Symptoms organized by rating level
const PTSD_SYMPTOM_CATEGORIES = {
  mild: {
    label: '10-30% Criteria',
    color: 'text-success',
    bgColor: 'bg-success/10',
    symptoms: [
      { id: 'depressed_mood', label: 'Depressed mood' },
      { id: 'anxiety', label: 'Anxiety' },
      { id: 'suspiciousness', label: 'Suspiciousness' },
      { id: 'chronic_sleep_impairment', label: 'Chronic sleep impairment' },
      { id: 'mild_memory_loss', label: 'Mild memory loss (forgetting names, directions, recent events)' },
    ],
  },
  moderate: {
    label: '50% Criteria',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    symptoms: [
      { id: 'flattened_affect', label: 'Flattened affect' },
      { id: 'circumstantial_speech', label: 'Circumstantial, circumlocutory, or stereotyped speech' },
      { id: 'panic_attacks', label: 'Panic attacks (more than once a week)' },
      { id: 'difficulty_understanding', label: 'Difficulty understanding complex commands' },
      { id: 'impaired_judgment', label: 'Impaired judgment' },
      { id: 'impaired_abstract_thinking', label: 'Impaired abstract thinking' },
      { id: 'disturbances_motivation_mood', label: 'Disturbances of motivation and mood' },
      { id: 'difficulty_relationships', label: 'Difficulty establishing and maintaining effective work and social relationships' },
    ],
  },
  severe: {
    label: '70% Criteria',
    color: 'text-gold',
    bgColor: 'bg-gold/10',
    symptoms: [
      { id: 'suicidal_ideation', label: 'Suicidal ideation' },
      { id: 'obsessional_rituals', label: 'Obsessional rituals interfering with routine activities' },
      { id: 'intermittent_illogical_speech', label: 'Intermittently illogical, obscure, or irrelevant speech' },
      { id: 'near_continuous_panic', label: 'Near-continuous panic or depression affecting ability to function' },
      { id: 'impaired_impulse_control', label: 'Impaired impulse control (unprovoked irritability with periods of violence)' },
      { id: 'spatial_disorientation', label: 'Spatial disorientation' },
      { id: 'neglect_hygiene', label: 'Neglect of personal appearance and hygiene' },
      { id: 'difficulty_adapting', label: 'Difficulty adapting to stressful circumstances' },
      { id: 'inability_relationships', label: 'Inability to establish and maintain effective relationships' },
    ],
  },
  total: {
    label: '100% Criteria',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    symptoms: [
      { id: 'gross_impairment_thought', label: 'Gross impairment in thought processes or communication' },
      { id: 'persistent_delusions', label: 'Persistent delusions or hallucinations' },
      { id: 'grossly_inappropriate', label: 'Grossly inappropriate behavior' },
      { id: 'persistent_danger', label: 'Persistent danger of hurting self or others' },
      { id: 'inability_self_care', label: 'Intermittent inability to perform activities of daily living (including maintenance of minimal personal hygiene)' },
      { id: 'disorientation', label: 'Disorientation to time or place' },
      { id: 'memory_loss_severe', label: 'Memory loss for names of close relatives, own occupation, or own name' },
    ],
  },
};

const ALL_SYMPTOMS = Object.values(PTSD_SYMPTOM_CATEGORIES).flatMap(cat => cat.symptoms);

interface PTSDSymptomLoggerProps {
  onEntryAdded?: () => void;
}

export function PTSDSymptomLogger({ onEntryAdded }: PTSDSymptomLoggerProps) {
  const { data, addPTSDSymptom, updatePTSDSymptom, deletePTSDSymptom } = useClaims();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<PTSDSymptomEntry, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    selectedSymptoms: [],
    symptomFrequencies: [],
    overallSeverity: 5,
    occupationalImpairment: '',
    socialImpairment: '',
    notes: '',
    triggeredBy: '',
  });

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      selectedSymptoms: [],
      symptomFrequencies: [],
      overallSeverity: 5,
      occupationalImpairment: '',
      socialImpairment: '',
      notes: '',
      triggeredBy: '',
    });
    setEditingId(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) resetForm();
  };

  const isSymptomSelected = (symptomId: string) => {
    return formData.symptomFrequencies?.some(sf => sf.symptomId === symptomId) || 
           formData.selectedSymptoms.includes(symptomId);
  };

  const getSymptomFrequency = (symptomId: string): PTSDSymptomFrequency | undefined => {
    return formData.symptomFrequencies?.find(sf => sf.symptomId === symptomId)?.frequency;
  };

  const toggleSymptom = (symptomId: string) => {
    const currentFrequencies = formData.symptomFrequencies || [];
    const exists = currentFrequencies.some(sf => sf.symptomId === symptomId);
    
    if (exists) {
      // Remove symptom
      setFormData(prev => ({
        ...prev,
        symptomFrequencies: currentFrequencies.filter(sf => sf.symptomId !== symptomId),
        selectedSymptoms: prev.selectedSymptoms.filter(id => id !== symptomId),
      }));
    } else {
      // Add symptom with default frequency
      setFormData(prev => ({
        ...prev,
        symptomFrequencies: [...currentFrequencies, { symptomId, frequency: 'Weekly' }],
        selectedSymptoms: [...prev.selectedSymptoms, symptomId],
      }));
    }
  };

  const updateSymptomFrequency = (symptomId: string, frequency: PTSDSymptomFrequency) => {
    const currentFrequencies = formData.symptomFrequencies || [];
    setFormData(prev => ({
      ...prev,
      symptomFrequencies: currentFrequencies.map(sf => 
        sf.symptomId === symptomId ? { ...sf, frequency } : sf
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure selectedSymptoms stays in sync with symptomFrequencies
    const symptomIds = formData.symptomFrequencies?.map(sf => sf.symptomId) || [];
    const dataToSave = {
      ...formData,
      selectedSymptoms: symptomIds,
    };
    
    if (editingId) {
      updatePTSDSymptom(editingId, dataToSave);
    } else {
      addPTSDSymptom(dataToSave);
    }
    setIsOpen(false);
    resetForm();
    onEntryAdded?.();
  };

  const handleEdit = (entry: PTSDSymptomEntry) => {
    // Convert legacy entries to new format
    const symptomFrequencies: PTSDSymptomWithFrequency[] = entry.symptomFrequencies || 
      entry.selectedSymptoms.map(id => ({ symptomId: id, frequency: 'Weekly' as PTSDSymptomFrequency }));
    
    setFormData({
      date: entry.date,
      selectedSymptoms: entry.selectedSymptoms,
      symptomFrequencies,
      overallSeverity: entry.overallSeverity,
      occupationalImpairment: entry.occupationalImpairment,
      socialImpairment: entry.socialImpairment,
      notes: entry.notes,
      triggeredBy: entry.triggeredBy || '',
    });
    setEditingId(entry.id);
    setIsOpen(true);
  };

  const calculateEstimatedRating = (symptoms: string[]): { rating: string; color: string } => {
    const has100 = symptoms.some(s => 
      PTSD_SYMPTOM_CATEGORIES.total.symptoms.some(ts => ts.id === s)
    );
    const has70 = symptoms.some(s => 
      PTSD_SYMPTOM_CATEGORIES.severe.symptoms.some(ts => ts.id === s)
    );
    const has50 = symptoms.some(s => 
      PTSD_SYMPTOM_CATEGORIES.moderate.symptoms.some(ts => ts.id === s)
    );
    const hasMild = symptoms.some(s => 
      PTSD_SYMPTOM_CATEGORIES.mild.symptoms.some(ts => ts.id === s)
    );

    if (has100) return { rating: '100%', color: 'text-destructive' };
    if (has70) return { rating: '70%', color: 'text-gold' };
    if (has50) return { rating: '50%', color: 'text-warning' };
    if (hasMild) return { rating: '10-30%', color: 'text-success' };
    return { rating: '0%', color: 'text-muted-foreground' };
  };

  const getSeverityLabel = (severity: number) => {
    if (severity <= 3) return { label: 'Mild', color: 'text-success' };
    if (severity <= 5) return { label: 'Moderate', color: 'text-warning' };
    if (severity <= 7) return { label: 'Moderately Severe', color: 'text-gold' };
    return { label: 'Severe', color: 'text-destructive' };
  };

  const getFrequencyBadgeColor = (frequency: PTSDSymptomFrequency) => {
    switch (frequency) {
      case 'Daily': return 'bg-destructive/20 text-destructive';
      case 'Several times/week': return 'bg-gold/20 text-gold';
      case 'Weekly': return 'bg-warning/20 text-warning';
      case 'Monthly': return 'bg-success/20 text-success';
      case 'Occasional': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted';
    }
  };

  const ptsdEntries = data.ptsdSymptoms || [];
  const selectedCount = formData.symptomFrequencies?.length || 0;

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          <h3 className="font-semibold">PTSD Symptom Log</h3>
          <Badge variant="outline" className="text-xs">
            DC 9411 • 38 CFR 4.130
          </Badge>
        </div>
        <Button onClick={() => setIsOpen(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Log PTSD Episode
        </Button>
      </div>

      {/* Info Card */}
      <Card className="border-purple-500/20 bg-purple-500/5">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">VA Rating Criteria Alignment</p>
              <p>Track symptoms with frequency to match VA rating criteria. Higher frequency strengthens your claim documentation.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {ptsdEntries.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="data-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-500">{ptsdEntries.length}</p>
              <p className="text-xs text-muted-foreground">Episodes Logged</p>
            </CardContent>
          </Card>
          <Card className="data-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {(ptsdEntries.reduce((sum, e) => sum + e.overallSeverity, 0) / ptsdEntries.length).toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">Avg Severity</p>
            </CardContent>
          </Card>
          <Card className="data-card">
            <CardContent className="p-4 text-center">
              {(() => {
                const allSymptoms = ptsdEntries.flatMap(e => e.selectedSymptoms);
                const uniqueSymptoms = [...new Set(allSymptoms)];
                return (
                  <>
                    <p className="text-2xl font-bold">{uniqueSymptoms.length}</p>
                    <p className="text-xs text-muted-foreground">Unique Symptoms</p>
                  </>
                );
              })()}
            </CardContent>
          </Card>
          <Card className="data-card">
            <CardContent className="p-4 text-center">
              {(() => {
                const allSymptoms = ptsdEntries.flatMap(e => e.selectedSymptoms);
                const { rating, color } = calculateEstimatedRating(allSymptoms);
                return (
                  <>
                    <p className={`text-2xl font-bold ${color}`}>{rating}</p>
                    <p className="text-xs text-muted-foreground">Est. Rating</p>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Entries List */}
      {ptsdEntries.length === 0 ? (
        <Card className="data-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Brain className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">No PTSD episodes logged yet.</p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Track your symptoms using VA rating criteria
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {ptsdEntries
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(entry => {
              const { rating, color } = calculateEstimatedRating(entry.selectedSymptoms);
              const severityInfo = getSeverityLabel(entry.overallSeverity);
              
              return (
                <Card key={entry.id} className="data-card">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                        <Badge variant="outline" className={severityInfo.color}>
                          {entry.overallSeverity}/10 - {severityInfo.label}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)} aria-label="Edit PTSD symptom entry">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deletePTSDSymptom(entry.id)} aria-label="Delete PTSD symptom entry">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Symptoms with Frequencies */}
                    <div className="flex flex-wrap gap-1.5">
                      {(entry.symptomFrequencies || entry.selectedSymptoms.map(id => ({ symptomId: id, frequency: 'Weekly' as PTSDSymptomFrequency }))).map(sf => {
                        const symptom = ALL_SYMPTOMS.find(s => s.id === sf.symptomId);
                        if (!symptom) return null;
                        return (
                          <Badge 
                            key={sf.symptomId} 
                            variant="secondary" 
                            className="text-xs flex items-center gap-1"
                          >
                            <span className="max-w-[150px] truncate">
                              {symptom.label.length > 25 ? symptom.label.substring(0, 25) + '...' : symptom.label}
                            </span>
                            <span className={`text-[10px] px-1 py-0.5 rounded ${getFrequencyBadgeColor(sf.frequency)}`}>
                              {sf.frequency}
                            </span>
                          </Badge>
                        );
                      })}
                    </div>

                    {/* Rating Estimate */}
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-muted-foreground">Estimated Rating:</span>
                      <span className={`font-semibold ${color}`}>{rating}</span>
                    </div>

                    {/* Impacts */}
                    {(entry.occupationalImpairment || entry.socialImpairment) && (
                      <div className="grid gap-2 text-sm">
                        {entry.occupationalImpairment && (
                          <div>
                            <span className="text-muted-foreground">Work Impact: </span>
                            <span>{entry.occupationalImpairment}</span>
                          </div>
                        )}
                        {entry.socialImpairment && (
                          <div>
                            <span className="text-muted-foreground">Social Impact: </span>
                            <span>{entry.socialImpairment}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {entry.notes && (
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">{entry.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              {editingId ? 'Edit PTSD Episode' : 'Log PTSD Episode'}
            </DialogTitle>
            <DialogDescription>
              Select symptoms and set frequency for each (38 CFR 4.130)
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <ScrollArea className="flex-1 pr-4" style={{ scrollPaddingBottom: '350px' }}>
              <div className="space-y-6 pb-4">
                {/* Date and Trigger */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ptsd-date">Date</Label>
                    <Input
                      id="ptsd-date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="triggered-by">Triggered By (optional)</Label>
                    <Input
                      id="triggered-by"
                      placeholder="e.g., Loud noise, crowd, news"
                      value={formData.triggeredBy}
                      onChange={(e) => setFormData({ ...formData, triggeredBy: e.target.value })}
                    />
                  </div>
                </div>

                {/* Overall Severity */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Overall Episode Severity (1-10)</Label>
                    <Badge variant="outline" className={getSeverityLabel(formData.overallSeverity).color}>
                      {formData.overallSeverity} - {getSeverityLabel(formData.overallSeverity).label}
                    </Badge>
                  </div>
                  <Slider
                    value={[formData.overallSeverity]}
                    onValueChange={([value]) => setFormData({ ...formData, overallSeverity: value })}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>

                <Separator />

                {/* Symptom Categories with Frequency */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Symptoms & Frequency</Label>
                    <Badge variant="secondary">
                      {selectedCount} selected
                    </Badge>
                  </div>

                  {Object.entries(PTSD_SYMPTOM_CATEGORIES).map(([key, category]) => (
                    <div key={key} className={`rounded-lg border p-4 ${category.bgColor}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className={`h-4 w-4 ${category.color}`} />
                        <span className={`font-medium ${category.color}`}>{category.label}</span>
                      </div>
                      <div className="space-y-2">
                        {category.symptoms.map(symptom => {
                          const isSelected = isSymptomSelected(symptom.id);
                          const currentFreq = getSymptomFrequency(symptom.id);
                          
                          return (
                            <div
                              key={symptom.id}
                              className={`rounded-lg transition-colors ${
                                isSelected
                                  ? 'bg-background/80 border border-primary/30'
                                  : 'hover:bg-background/50'
                              }`}
                            >
                              <div 
                                className="flex items-start gap-3 p-2 cursor-pointer"
                                onClick={() => toggleSymptom(symptom.id)}
                              >
                                <Checkbox
                                  id={symptom.id}
                                  checked={isSelected}
                                  onCheckedChange={() => toggleSymptom(symptom.id)}
                                  className="mt-0.5 pointer-events-none"
                                />
                                <Label
                                  htmlFor={symptom.id}
                                  className="flex-1 cursor-pointer text-sm leading-snug"
                                >
                                  {symptom.label}
                                </Label>
                              </div>
                              
                              {/* Frequency selector - only show when selected */}
                              {isSelected && (
                                <div className="px-2 pb-2 ml-7">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <Select
                                      value={currentFreq || 'Weekly'}
                                      onValueChange={(val) => updateSymptomFrequency(symptom.id, val as PTSDSymptomFrequency)}
                                    >
                                      <SelectTrigger className="h-7 text-xs w-[140px]">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {FREQUENCY_OPTIONS.map(freq => (
                                          <SelectItem key={freq} value={freq} className="text-xs">
                                            {freq}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Impact Questions */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="occupational">Occupational Impairment</Label>
                    <Textarea
                      id="occupational"
                      placeholder="How did this affect your work/job duties today?"
                      value={formData.occupationalImpairment}
                      onChange={(e) => setFormData({ ...formData, occupationalImpairment: e.target.value })}
                      rows={2}
                      onFocus={(e) => {
                        setTimeout(() => {
                          e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 300);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social">Social Impairment</Label>
                    <Textarea
                      id="social"
                      placeholder="How did this affect your relationships/social activities?"
                      value={formData.socialImpairment}
                      onChange={(e) => setFormData({ ...formData, socialImpairment: e.target.value })}
                      rows={2}
                      onFocus={(e) => {
                        setTimeout(() => {
                          e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 300);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ptsd-notes">Additional Notes</Label>
                    <Textarea
                      id="ptsd-notes"
                      placeholder="Any other details about this episode..."
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

                {/* Estimated Rating Preview */}
                {selectedCount > 0 && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          <span className="font-medium">Estimated Rating Level</span>
                        </div>
                        {(() => {
                          const symptomIds = formData.symptomFrequencies?.map(sf => sf.symptomId) || [];
                          const { rating, color } = calculateEstimatedRating(symptomIds);
                          return (
                            <Badge className={`${color} text-lg px-3 py-1`}>
                              {rating}
                            </Badge>
                          );
                        })()}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Based on highest-level symptoms selected. Frequency documentation strengthens evidence.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>

            {/* Sticky Footer */}
            <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-border bg-background">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={selectedCount === 0}>
                {editingId ? 'Update' : 'Save'} Entry
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
