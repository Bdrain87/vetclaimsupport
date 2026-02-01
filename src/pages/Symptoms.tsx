import { useState, useMemo } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { useEvidence } from '@/context/EvidenceContext';
import { 
  Activity, Plus, Trash2, Edit, Calendar, Download, Clock, 
  TrendingUp, Filter, BarChart3, CalendarDays, List,
  ChevronDown, ChevronUp, Zap, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { exportSymptoms } from '@/utils/pdfExport';
import { PTSDSymptomLogger } from '@/components/symptoms/PTSDSymptomLogger';
import { SpineSymptomLogger } from '@/components/symptoms/SpineSymptomLogger';
import { VoiceInputButton } from '@/components/ui/voice-input-button';
import { EvidenceAttachment, EvidenceThumbnails } from '@/components/shared/EvidenceAttachment';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { format, subDays, startOfDay, parseISO, isWithinInterval } from 'date-fns';
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

// Time of day options
const timeOfDayOptions = [
  'Morning (6am-12pm)',
  'Afternoon (12pm-6pm)',
  'Evening (6pm-10pm)',
  'Night (10pm-6am)',
  'All Day',
];

// Duration options
const durationOptions = [
  'Less than 30 minutes',
  '30 minutes - 1 hour',
  '1-2 hours',
  '2-4 hours',
  '4-8 hours',
  'More than 8 hours',
  'Ongoing/Constant',
];

// Extended symptom form data
interface ExtendedSymptomForm {
  date: string;
  timeOfDay: string;
  symptom: string;
  bodyArea: string;
  severity: number;
  frequency: string;
  trigger: string;
  duration: string;
  dailyImpact: string;
  notes: string;
}

export default function Symptoms() {
  const { data, addSymptom, updateSymptom, deleteSymptom } = useClaims();
  const { documents, setAllDocuments } = useEvidence();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'timeline' | 'calendar'>('list');
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'7' | '30' | '90' | 'all'>('30');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  
  const [formData, setFormData] = useState<ExtendedSymptomForm>({
    date: '',
    timeOfDay: '',
    symptom: '',
    bodyArea: '',
    severity: 5,
    frequency: '',
    trigger: '',
    duration: '',
    dailyImpact: '',
    notes: '',
  });

  // Get unique body areas/conditions for filtering
  const uniqueConditions = useMemo(() => {
    const conditions = new Set(data.symptoms.map(s => s.bodyArea).filter(Boolean));
    return Array.from(conditions);
  }, [data.symptoms]);

  // Filter symptoms by date range and condition
  const filteredSymptoms = useMemo(() => {
    let symptoms = [...data.symptoms];
    
    // Filter by date range
    if (dateRange !== 'all') {
      const daysAgo = parseInt(dateRange);
      const startDate = startOfDay(subDays(new Date(), daysAgo));
      symptoms = symptoms.filter(s => {
        const symptomDate = parseISO(s.date);
        return symptomDate >= startDate;
      });
    }
    
    // Filter by condition
    if (filterCondition !== 'all') {
      symptoms = symptoms.filter(s => s.bodyArea === filterCondition);
    }
    
    return symptoms.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data.symptoms, dateRange, filterCondition]);

  // Analytics: Severity over time
  const severityTrendData = useMemo(() => {
    const days = dateRange === 'all' ? 90 : parseInt(dateRange);
    const data: { date: string; avgSeverity: number; count: number }[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const daySymptoms = filteredSymptoms.filter(s => s.date === dateStr);
      
      if (daySymptoms.length > 0) {
        const avgSeverity = daySymptoms.reduce((acc, s) => acc + s.severity, 0) / daySymptoms.length;
        data.push({
          date: format(date, 'MMM d'),
          avgSeverity: Math.round(avgSeverity * 10) / 10,
          count: daySymptoms.length
        });
      }
    }
    return data;
  }, [filteredSymptoms, dateRange]);

  // Analytics: Frequency by body area
  const bodyAreaStats = useMemo(() => {
    const stats: Record<string, { count: number; avgSeverity: number }> = {};
    
    filteredSymptoms.forEach(s => {
      const area = s.bodyArea || 'Unspecified';
      if (!stats[area]) {
        stats[area] = { count: 0, avgSeverity: 0 };
      }
      stats[area].count++;
      stats[area].avgSeverity += s.severity;
    });
    
    return Object.entries(stats)
      .map(([area, { count, avgSeverity }]) => ({
        area,
        count,
        avgSeverity: Math.round((avgSeverity / count) * 10) / 10
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [filteredSymptoms]);

  // Group symptoms by date for timeline view
  const symptomsByDate = useMemo(() => {
    const grouped: Record<string, typeof filteredSymptoms> = {};
    filteredSymptoms.forEach(s => {
      if (!grouped[s.date]) grouped[s.date] = [];
      grouped[s.date].push(s);
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());
  }, [filteredSymptoms]);

  const resetForm = () => {
    setFormData({
      date: '',
      timeOfDay: '',
      symptom: '',
      bodyArea: '',
      severity: 5,
      frequency: '',
      trigger: '',
      duration: '',
      dailyImpact: '',
      notes: '',
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine extra fields into notes for backwards compatibility
    const combinedNotes = [
      formData.timeOfDay && `Time: ${formData.timeOfDay}`,
      formData.trigger && `Trigger: ${formData.trigger}`,
      formData.duration && `Duration: ${formData.duration}`,
      formData.notes
    ].filter(Boolean).join('\n');
    
    const symptomData = {
      date: formData.date,
      symptom: formData.symptom,
      bodyArea: formData.bodyArea,
      severity: formData.severity,
      frequency: formData.frequency,
      dailyImpact: formData.dailyImpact,
      notes: combinedNotes,
    };
    
    if (editingId) {
      updateSymptom(editingId, symptomData);
    } else {
      addSymptom(symptomData);
    }
    setIsOpen(false);
    resetForm();
  };

  const handleEdit = (symptom: SymptomEntry) => {
    // Parse notes to extract extended fields
    const notes = symptom.notes || '';
    const timeMatch = notes.match(/Time: ([^\n]+)/);
    const triggerMatch = notes.match(/Trigger: ([^\n]+)/);
    const durationMatch = notes.match(/Duration: ([^\n]+)/);
    const cleanNotes = notes
      .replace(/Time: [^\n]+\n?/, '')
      .replace(/Trigger: [^\n]+\n?/, '')
      .replace(/Duration: [^\n]+\n?/, '')
      .trim();
    
    setFormData({
      date: symptom.date,
      timeOfDay: timeMatch?.[1] || '',
      symptom: symptom.symptom,
      bodyArea: symptom.bodyArea,
      severity: symptom.severity,
      frequency: symptom.frequency,
      trigger: triggerMatch?.[1] || '',
      duration: durationMatch?.[1] || '',
      dailyImpact: symptom.dailyImpact,
      notes: cleanNotes,
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

  const toggleCardExpand = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
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
            <p className="text-muted-foreground text-sm">Track symptoms for C&P exam documentation</p>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" onClick={() => exportSymptoms(data.symptoms)} className="gap-2 hidden sm:flex">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Tabs for General vs Condition-Specific */}
      <Tabs defaultValue="general" className="w-full">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex w-auto min-w-full sm:grid sm:w-full sm:grid-cols-3 h-auto">
            <TabsTrigger value="general" className="text-xs sm:text-sm whitespace-nowrap px-3 py-2">General</TabsTrigger>
            <TabsTrigger value="spine" className="text-xs sm:text-sm whitespace-nowrap px-3 py-2">
              <span className="sm:hidden">Spine</span>
              <span className="hidden sm:inline">Spine (DC 5235-5243)</span>
            </TabsTrigger>
            <TabsTrigger value="ptsd" className="text-xs sm:text-sm whitespace-nowrap px-3 py-2">
              <span className="sm:hidden">PTSD</span>
              <span className="hidden sm:inline">PTSD (DC 9411)</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general" className="mt-4 space-y-6">
          {/* Analytics Dashboard */}
          {data.symptoms.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {/* Severity Trend Chart */}
              <Card className="data-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-medium">Severity Trend</CardTitle>
                  </div>
                  <CardDescription className="text-xs">Average severity over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {severityTrendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={120}>
                      <LineChart data={severityTrendData}>
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                        <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} width={25} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="avgSeverity" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">No data in selected range</p>
                  )}
                </CardContent>
              </Card>

              {/* Body Area Frequency */}
              <Card className="data-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-medium">Symptom Frequency by Area</CardTitle>
                  </div>
                  <CardDescription className="text-xs">Most affected body areas</CardDescription>
                </CardHeader>
                <CardContent>
                  {bodyAreaStats.length > 0 ? (
                    <ResponsiveContainer width="100%" height={120}>
                      <BarChart data={bodyAreaStats} layout="vertical">
                        <XAxis type="number" tick={{ fontSize: 10 }} />
                        <YAxis type="category" dataKey="area" tick={{ fontSize: 10 }} width={80} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                          formatter={(value: number, name: string) => [
                            name === 'count' ? `${value} entries` : `Avg: ${value}/10`,
                            name === 'count' ? 'Frequency' : 'Severity'
                          ]}
                        />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">No data available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filter & View Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              {/* Date Range Filter */}
              <Select value={dateRange} onValueChange={(v: '7' | '30' | '90' | 'all') => setDateRange(v)}>
                <SelectTrigger className="w-[130px] h-9">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>

              {/* Condition Filter */}
              {uniqueConditions.length > 0 && (
                <Select value={filterCondition} onValueChange={setFilterCondition}>
                  <SelectTrigger className="w-[150px] h-9">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Filter by area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas</SelectItem>
                    {uniqueConditions.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Entry Count Badge */}
              <Badge variant="secondary" className="h-9 px-3">
                {filteredSymptoms.length} entries
              </Badge>
            </div>

            <div className="flex gap-2">
              {/* View Mode Toggle */}
              <div className="flex border border-border rounded-lg p-1 bg-muted/50">
                <Button 
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className="h-7 px-2"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'timeline' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className="h-7 px-2"
                  onClick={() => setViewMode('timeline')}
                >
                  <CalendarDays className="h-4 w-4" />
                </Button>
              </div>

              {/* Add Entry Button */}
              <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
                <DialogTrigger asChild>
                  <Button className="gap-2 h-9">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Log Symptom</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[85vh] sm:max-h-[90vh] flex flex-col top-[10%] sm:top-[50%]">
                  <DialogHeader>
                    <DialogTitle>{editingId ? 'Edit Symptom' : 'Log Symptom'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2" style={{ scrollPaddingBottom: '350px' }}>
                      {/* Date & Time Row */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="date">Date *</Label>
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
                          <Label htmlFor="timeOfDay">Time of Day</Label>
                          <Select 
                            value={formData.timeOfDay} 
                            onValueChange={(value) => setFormData({ ...formData, timeOfDay: value })}
                          >
                            <SelectTrigger>
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <SelectValue placeholder="When did it occur?" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOfDayOptions.map((time) => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Symptom & Body Area */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="symptom">Symptom Description *</Label>
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
                        <div className="space-y-2">
                          <Label htmlFor="bodyArea">Body Area / Condition</Label>
                          <Input 
                            id="bodyArea" 
                            placeholder="e.g., Lower back, knees, ears"
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

                      {/* Severity Slider */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Severity (1-10) *</Label>
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

                      {/* Trigger & Duration Row */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="trigger" className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            What Triggered It?
                          </Label>
                          <Input 
                            id="trigger" 
                            placeholder="e.g., Physical activity, stress, weather"
                            value={formData.trigger}
                            onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
                            onFocus={(e) => {
                              setTimeout(() => {
                                e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }, 300);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="duration" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            How Long Did It Last?
                          </Label>
                          <Select 
                            value={formData.duration} 
                            onValueChange={(value) => setFormData({ ...formData, duration: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              {durationOptions.map((dur) => (
                                <SelectItem key={dur} value={dur}>{dur}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Frequency */}
                      <div className="space-y-2">
                        <Label htmlFor="frequency">How Often Does This Occur?</Label>
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

                      {/* Impact on Daily Activities */}
                      <div className="space-y-2">
                        <Label htmlFor="dailyImpact" className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          Impact on Daily Activities *
                        </Label>
                        <div className="relative">
                          <Textarea 
                            id="dailyImpact" 
                            placeholder="How did this affect your work, sleep, activities? Be specific for C&P exams."
                            value={formData.dailyImpact}
                            onChange={(e) => setFormData({ ...formData, dailyImpact: e.target.value })}
                            rows={3}
                            className="pr-12"
                            required
                            onFocus={(e) => {
                              setTimeout(() => {
                                e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }, 300);
                            }}
                          />
                          <div className="absolute right-2 top-2">
                            <VoiceInputButton
                              onTranscript={(text) => setFormData({ ...formData, dailyImpact: text })}
                              existingText={formData.dailyImpact}
                              size="sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Additional Notes */}
                      <div className="space-y-2">
                        <Label htmlFor="notes">Additional Notes</Label>
                        <div className="relative">
                          <Textarea 
                            id="notes" 
                            placeholder="Any other details, what helped, etc."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="pr-12"
                            onFocus={(e) => {
                              setTimeout(() => {
                                e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }, 300);
                            }}
                          />
                          <div className="absolute right-2 top-2">
                            <VoiceInputButton
                              onTranscript={(text) => setFormData({ ...formData, notes: text })}
                              existingText={formData.notes}
                              size="sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Evidence Attachments - only show when editing */}
                      {editingId && (
                        <div className="pt-2 border-t border-border">
                          <EvidenceAttachment
                            entryType="symptom"
                            entryId={editingId}
                            documents={documents}
                            onDocumentsChange={setAllDocuments}
                          />
                        </div>
                      )}
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
          </div>

          {/* Symptoms Display */}
          {filteredSymptoms.length === 0 ? (
            <Card className="data-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Activity className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground text-center">No symptoms logged yet.</p>
                <p className="text-sm text-muted-foreground text-center mt-1">Regular journaling strengthens your claim.</p>
              </CardContent>
            </Card>
          ) : viewMode === 'timeline' ? (
            // Timeline View
            <div className="space-y-6">
              {symptomsByDate.map(([date, symptoms]) => (
                <div key={date} className="relative">
                  {/* Date Header */}
                  <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="font-semibold text-sm">
                        {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
                      </span>
                      <Badge variant="secondary" className="ml-auto">
                        {symptoms.length} {symptoms.length === 1 ? 'entry' : 'entries'}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Symptoms for this date */}
                  <div className="ml-1.5 pl-6 border-l-2 border-muted space-y-3">
                    {symptoms.map((symptom) => (
                      <Card key={symptom.id} className="data-card">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getSeverityColor(symptom.severity)}`}>
                                  {symptom.severity}/10
                                </span>
                                {symptom.bodyArea && (
                                  <Badge variant="outline" className="text-xs">{symptom.bodyArea}</Badge>
                                )}
                                {symptom.frequency && (
                                  <span className="text-xs text-muted-foreground">{symptom.frequency}</span>
                                )}
                              </div>
                              <p className="font-medium mt-1">{symptom.symptom}</p>
                              {symptom.dailyImpact && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{symptom.dailyImpact}</p>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(symptom)}>
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteSymptom(symptom.id)}>
                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List View
            <div className="grid gap-3">
              {filteredSymptoms.map((symptom) => (
                <Collapsible 
                  key={symptom.id} 
                  open={expandedCards.has(symptom.id)}
                  onOpenChange={() => toggleCardExpand(symptom.id)}
                >
                  <Card className="data-card">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="pb-2 cursor-pointer hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getSeverityColor(symptom.severity)}`}>
                                {symptom.severity}/10
                              </span>
                              {symptom.bodyArea && (
                                <Badge variant="outline" className="text-xs">{symptom.bodyArea}</Badge>
                              )}
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(parseISO(symptom.date), 'MMM d, yyyy')}
                              </span>
                            </div>
                            <CardTitle className="text-base">{symptom.symptom}</CardTitle>
                          </div>
                          <div className="flex items-center gap-1">
                            {expandedCards.has(symptom.id) ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent className="pt-0 space-y-3">
                        {symptom.frequency && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Frequency:</span>{' '}
                            <span className="font-medium">{symptom.frequency}</span>
                          </div>
                        )}
                        
                        {symptom.dailyImpact && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Daily Impact</p>
                            <p className="text-sm">{symptom.dailyImpact}</p>
                          </div>
                        )}

                        {symptom.notes && (
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-sm text-muted-foreground whitespace-pre-line">{symptom.notes}</p>
                          </div>
                        )}

                        <EvidenceThumbnails
                          entryType="symptom"
                          entryId={symptom.id}
                          documents={documents}
                        />

                        <div className="flex justify-end gap-2 pt-2 border-t border-border">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(symptom)}>
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deleteSymptom(symptom.id)} className="text-destructive hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="spine" className="mt-4">
          <SpineSymptomLogger />
        </TabsContent>

        <TabsContent value="ptsd" className="mt-4">
          <PTSDSymptomLogger />
        </TabsContent>
      </Tabs>
    </div>
  );
}
