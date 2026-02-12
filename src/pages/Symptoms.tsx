import { useState, useMemo } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { useUserConditions } from '@/hooks/useUserConditions';
import { useEvidence } from '@/hooks/useEvidence';
import { getConditionById } from '@/data/vaConditions';
import {
  Activity, Plus, Trash2, Edit, Calendar, Download, Clock,
  TrendingUp, Filter, BarChart3, CalendarDays, List,
  ChevronDown, ChevronUp, Zap, Target, Search, Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { exportSymptoms } from '@/utils/pdfExport';
import { VoiceInputButton } from '@/components/ui/voice-input-button';
import { EvidenceAttachment, EvidenceThumbnails } from '@/components/shared/EvidenceAttachment';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subDays, startOfDay, parseISO } from 'date-fns';
import { PageContainer } from '@/components/PageContainer';
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
  conditionTitle: string; // NEW: Required condition/title field
  symptom: string;
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
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'7' | '30' | '90' | 'all'>('30');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  
  const [formData, setFormData] = useState<ExtendedSymptomForm>({
    date: '',
    timeOfDay: '',
    conditionTitle: '',
    symptom: '',
    severity: 5,
    frequency: '',
    trigger: '',
    duration: '',
    dailyImpact: '',
    notes: '',
  });
  const [selectedConditionTags, setSelectedConditionTags] = useState<string[]>([]);

  // Get user's claimed conditions for tagging
  const { conditions: userConditions } = useUserConditions();
  const claimConditions = useMemo(() => data.claimConditions || [], [data.claimConditions]);

  const allConditionNames = useMemo(() => {
    const names = new Set<string>();
    claimConditions.forEach(c => names.add(c.name));
    userConditions.forEach(uc => {
      const details = getConditionById(uc.conditionId);
      if (details?.name) names.add(details.name);
    });
    return Array.from(names).sort();
  }, [claimConditions, userConditions]);

  // Get unique conditions for filtering dropdown
  const uniqueConditions = useMemo(() => {
    const conditions = new Set(data.symptoms.map(s => s.bodyArea).filter(Boolean));
    return Array.from(conditions).sort();
  }, [data.symptoms]);

  // Filter symptoms by date range, condition, and search query
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
    
    // Filter by condition dropdown
    if (filterCondition !== 'all') {
      symptoms = symptoms.filter(s => s.bodyArea === filterCondition);
    }
    
    // Filter by search query (searches condition title and symptom description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      symptoms = symptoms.filter(s => 
        s.bodyArea?.toLowerCase().includes(query) ||
        s.symptom?.toLowerCase().includes(query) ||
        s.notes?.toLowerCase().includes(query)
      );
    }
    
    return symptoms.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data.symptoms, dateRange, filterCondition, searchQuery]);

  // Analytics: Severity over time
  const severityTrendData = useMemo(() => {
    const days = dateRange === 'all' ? 90 : parseInt(dateRange);
    const chartData: { date: string; avgSeverity: number; count: number }[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const daySymptoms = filteredSymptoms.filter(s => s.date === dateStr);
      
      if (daySymptoms.length > 0) {
        const avgSeverity = daySymptoms.reduce((acc, s) => acc + s.severity, 0) / daySymptoms.length;
        chartData.push({
          date: format(date, 'MMM d'),
          avgSeverity: Math.round(avgSeverity * 10) / 10,
          count: daySymptoms.length
        });
      }
    }
    return chartData;
  }, [filteredSymptoms, dateRange]);

  // Analytics: Frequency by condition
  const conditionStats = useMemo(() => {
    const stats: Record<string, { count: number; avgSeverity: number }> = {};
    
    filteredSymptoms.forEach(s => {
      const condition = s.bodyArea || 'Unspecified';
      if (!stats[condition]) {
        stats[condition] = { count: 0, avgSeverity: 0 };
      }
      stats[condition].count++;
      stats[condition].avgSeverity += s.severity;
    });
    
    return Object.entries(stats)
      .map(([condition, { count, avgSeverity }]) => ({
        condition,
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
      conditionTitle: '',
      symptom: '',
      severity: 5,
      frequency: '',
      trigger: '',
      duration: '',
      dailyImpact: '',
      notes: '',
    });
    setSelectedConditionTags([]);
    setEditingId(null);
  };

  const toggleConditionTag = (name: string) => {
    setSelectedConditionTags(prev =>
      prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
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
        bodyArea: formData.conditionTitle, // Store condition title in bodyArea field
        severity: formData.severity,
        frequency: formData.frequency,
        dailyImpact: formData.dailyImpact,
        notes: combinedNotes,
        conditionTags: selectedConditionTags.length > 0 ? selectedConditionTags : undefined,
      };
      
      if (editingId) {
        updateSymptom(editingId, symptomData);
      } else {
        addSymptom(symptomData);
      }
      
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving symptom:', error);
    }
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
      conditionTitle: symptom.bodyArea || '',
      symptom: symptom.symptom,
      severity: symptom.severity,
      frequency: symptom.frequency,
      trigger: triggerMatch?.[1] || '',
      duration: durationMatch?.[1] || '',
      dailyImpact: symptom.dailyImpact,
      notes: cleanNotes,
    });
    setSelectedConditionTags(symptom.conditionTags || []);
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
    <PageContainer className="space-y-6 animate-fade-in overflow-x-hidden">
      {/* Header - Premium Styling */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#D6B25E]/20 to-[#D6B25E]/5 shadow-[0_0_24px_rgba(214,178,94,0.2)]">
            <Activity className="h-6 w-6 text-[#D6B25E] drop-shadow-[0_0_8px_rgba(214,178,94,0.5)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Symptoms Journal</h1>
            <p className="text-muted-foreground text-sm">Track symptoms for any condition — for C&P exam documentation</p>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" onClick={() => exportSymptoms(data.symptoms)} className="gap-2 hidden sm:flex border-border/50 hover:bg-muted">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Analytics Dashboard - Premium Cards */}
      {data.symptoms.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {/* Severity Trend Chart */}
          <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-lg" style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)' }}>
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-[#D6B25E]/5 via-transparent to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#D6B25E]/20 to-[#D6B25E]/5">
                  <TrendingUp className="h-5 w-5 text-[#D6B25E]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Severity Trend</h3>
                  <p className="text-xs text-muted-foreground">Average severity over time</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              {severityTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={severityTrendData}>
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} interval="preserveStartEnd" />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} width={25} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                      }} 
                    />
                    <Line
                      type="monotone"
                      dataKey="avgSeverity"
                      stroke="#D6B25E"
                      strokeWidth={3}
                      dot={{ fill: '#D6B25E', strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, fill: '#D6B25E', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No data in selected range</p>
              )}
            </div>
          </div>

          {/* Condition Frequency */}
          <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-lg" style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)' }}>
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-[#D6B25E]/5 via-transparent to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#D6B25E]/20 to-[#D6B25E]/5">
                  <BarChart3 className="h-5 w-5 text-[#D6B25E]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Entries by Condition</h3>
                  <p className="text-xs text-muted-foreground">Most logged conditions</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              {conditionStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={conditionStats} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis type="category" dataKey="condition" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} width={80} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                      }}
                      formatter={(value: number, name: string) => [
                        name === 'count' ? `${value} entries` : `Avg: ${value}/10`,
                        name === 'count' ? 'Frequency' : 'Severity'
                      ]}
                    />
                    <Bar dataKey="count" fill="#D6B25E" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No data available</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex flex-col gap-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by condition name, symptom, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            {/* Date Range Filter */}
            <Select value={dateRange} onValueChange={(v: '7' | '30' | '90' | 'all') => setDateRange(v)}>
              <SelectTrigger className="w-full sm:w-[130px] h-12 min-h-[48px]">
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
                <SelectTrigger className="w-full sm:w-[160px] h-12 min-h-[48px]">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  {uniqueConditions.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Entry Count Badge */}
            <Badge variant="secondary" className="h-10 px-3">
              {filteredSymptoms.length} entries
            </Badge>
          </div>

          <div className="flex gap-2">
            {/* View Mode Toggle */}
            <div className="flex border border-border rounded-xl p-1 bg-muted/50">
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-10 w-10 min-h-[44px] min-w-[44px] p-0"
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'timeline' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-10 w-10 min-h-[44px] min-w-[44px] p-0"
                onClick={() => setViewMode('timeline')}
                aria-label="Timeline view"
              >
                <CalendarDays className="h-4 w-4" />
              </Button>
            </div>

            {/* Add Entry Button */}
            <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button className="gap-2 h-12 min-h-[48px] px-4">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Log Symptom</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] sm:max-h-[90vh] flex flex-col">
                <DialogHeader className="p-6 pb-4">
                  <DialogTitle>{editingId ? 'Edit Symptom' : 'Log Symptom'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                  <div className="flex-1 overflow-y-auto space-y-4 px-6 pb-4" style={{ scrollPaddingBottom: '350px' }}>
                    {/* Condition Title - REQUIRED and FIRST */}
                    <div className="space-y-2">
                      <Label htmlFor="conditionTitle" className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        Condition Name *
                      </Label>
                      <Input 
                        id="conditionTitle" 
                        placeholder="e.g., Tinnitus, Knee Pain, Sleep Apnea, Anxiety, PTSD"
                        value={formData.conditionTitle}
                        onChange={(e) => setFormData({ ...formData, conditionTitle: e.target.value })}
                        required
                        list="condition-suggestions"
                        onFocus={(e) => {
                          setTimeout(() => {
                            e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }, 300);
                        }}
                      />
                      {/* Suggest existing conditions */}
                      <datalist id="condition-suggestions">
                        {uniqueConditions.map(c => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                      <p className="text-xs text-muted-foreground">
                        Enter the name of the condition you're tracking (e.g., the VA disability you're claiming)
                      </p>
                    </div>

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

                    {/* Symptom Description */}
                    <div className="space-y-2">
                      <Label htmlFor="symptom">Symptom Description *</Label>
                      <Input 
                        id="symptom" 
                        placeholder="e.g., Sharp pain, numbness, ringing, difficulty breathing"
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
                                  ? 'px-3 py-1.5 rounded-full text-xs font-medium border bg-primary/20 border-primary/50 text-primary transition-colors max-w-full truncate'
                                  : 'px-3 py-1.5 rounded-full text-xs font-medium border bg-muted border-border text-muted-foreground hover:border-primary/30 transition-colors max-w-full truncate'
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
                          entryType="symptom"
                          entryId={editingId}
                          documents={documents}
                          onDocumentsChange={setAllDocuments}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 p-6 pt-4 border-t border-border bg-card sticky bottom-0">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="h-12 min-h-[48px] px-6">
                      Cancel
                    </Button>
                    <Button type="submit" className="h-12 min-h-[48px] px-6">
                      {editingId ? 'Update' : 'Save'} Entry
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Symptoms Display */}
      {filteredSymptoms.length === 0 ? (
        <Card className="data-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Activity className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">
              {searchQuery || filterCondition !== 'all' 
                ? 'No symptoms match your search/filter.' 
                : 'No symptoms logged yet.'}
            </p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              {searchQuery || filterCondition !== 'all'
                ? 'Try adjusting your search or filter.'
                : 'Regular journaling strengthens your claim.'}
            </p>
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
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            {symptom.bodyArea && (
                              <Badge variant="default" className="text-xs font-semibold max-w-[200px] truncate">
                                {symptom.bodyArea}
                              </Badge>
                            )}
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium flex-shrink-0 ${getSeverityColor(symptom.severity)}`}>
                              {symptom.severity}/10
                            </span>
                            {symptom.frequency && (
                              <span className="text-xs text-muted-foreground truncate">{symptom.frequency}</span>
                            )}
                          </div>
                          <p className="font-medium mt-1 break-words">{symptom.symptom}</p>
                          {symptom.dailyImpact && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{symptom.dailyImpact}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-10 w-10 min-h-[44px] min-w-[44px]" onClick={() => handleEdit(symptom)} aria-label="Edit symptom">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-10 w-10 min-h-[44px] min-w-[44px]" onClick={() => deleteSymptom(symptom.id)} aria-label="Delete symptom">
                            <Trash2 className="h-4 w-4 text-destructive" />
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
                          {symptom.bodyArea && (
                            <Badge variant="default" className="text-xs font-semibold max-w-[200px] truncate">
                              {symptom.bodyArea}
                            </Badge>
                          )}
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium flex-shrink-0 ${getSeverityColor(symptom.severity)}`}>
                            {symptom.severity}/10
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 flex-shrink-0">
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
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Frequency: {symptom.frequency}</span>
                      </div>
                    )}
                    
                    {symptom.dailyImpact && (
                      <div className="text-sm">
                        <span className="font-medium">Impact: </span>
                        <span className="text-muted-foreground">{symptom.dailyImpact}</span>
                      </div>
                    )}
                    
                    {symptom.notes && (
                      <div className="text-sm">
                        <span className="font-medium">Notes: </span>
                        <span className="text-muted-foreground whitespace-pre-line">{symptom.notes}</span>
                      </div>
                    )}

                    {/* Evidence Thumbnails */}
                    <EvidenceThumbnails
                      entryType="symptom"
                      entryId={symptom.id}
                      documents={documents}
                    />
                    
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(symptom)} className="h-10 min-h-[44px]">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteSymptom(symptom.id)} className="h-10 min-h-[44px]">
                        <Trash2 className="h-4 w-4 mr-1 text-destructive" />
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
    </PageContainer>
  );
}
