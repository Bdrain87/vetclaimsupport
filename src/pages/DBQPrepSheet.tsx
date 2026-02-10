import { useState, useMemo, useRef } from 'react';
import {
  ClipboardList,
  Search,
  Printer,
  AlertCircle,
  Info,
  Calendar,
  Activity,
  Zap,
  Clock,
  Briefcase,
  Moon,
  Pill,
  ChevronDown,
  ChevronRight,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { vaDisabilitiesBySystem } from '@/data/vaDisabilities';
import { cn } from '@/lib/utils';
import { useClaims } from '@/hooks/useClaims';
import { useUserConditions } from '@/hooks/useUserConditions';

// Get all conditions
const getAllConditions = (): string[] => {
  const conditions = new Set<string>();
  vaDisabilitiesBySystem.forEach(system => {
    system.conditions.forEach(condition => {
      conditions.add(condition.name);
    });
  });
  return [...conditions].sort();
};

const allConditions = getAllConditions();

// Condition-specific reminders
const conditionReminders: Record<string, string[]> = {
  'PTSD': [
    'Describe frequency and intensity of nightmares',
    'Mention hypervigilance behaviors (checking locks, sitting with back to wall)',
    'Note any isolation or avoidance behaviors',
    'Describe difficulty concentrating or memory issues',
    'Mention any startle response to loud noises',
    'Note relationship difficulties due to symptoms',
  ],
  'Sleep Apnea': [
    'Note CPAP usage hours per night',
    'Describe daytime sleepiness (falling asleep driving, at work)',
    'Mention morning headaches',
    'Note choking/gasping episodes per night',
    'Describe impact on partner\'s sleep',
    'Bring recent sleep study results',
  ],
  'Migraines': [
    'Track frequency of prostrating attacks',
    'Note duration of each episode',
    'Describe aura symptoms if present',
    'Mention sensitivity to light, sound, smell',
    'Note work days missed due to migraines',
    'Describe what you do during an attack (dark room, bed rest)',
  ],
  'Depression': [
    'Describe sleep disturbances',
    'Note changes in appetite and weight',
    'Mention difficulty with concentration',
    'Describe any suicidal thoughts (past or present)',
    'Note impact on work performance',
    'Describe withdrawal from activities you used to enjoy',
  ],
  'Tinnitus': [
    'Describe the sound (ringing, buzzing, hissing)',
    'Note if constant or intermittent',
    'Describe impact on concentration',
    'Mention interference with sleep',
    'Note difficulty hearing conversations',
  ],
};

// Common symptoms by body system
const commonSymptomsBySystem: Record<string, string[]> = {
  'Musculoskeletal': ['Pain', 'Stiffness', 'Limited range of motion', 'Weakness', 'Swelling', 'Instability', 'Numbness/Tingling'],
  'Mental Health': ['Anxiety', 'Depression', 'Irritability', 'Sleep problems', 'Nightmares', 'Flashbacks', 'Concentration issues', 'Memory problems'],
  'Respiratory': ['Shortness of breath', 'Wheezing', 'Coughing', 'Chest tightness', 'Fatigue', 'Sleep disruption'],
  'Cardiovascular': ['Chest pain', 'Shortness of breath', 'Fatigue', 'Dizziness', 'Rapid heartbeat', 'Swelling in legs'],
  'Neurological': ['Headaches', 'Dizziness', 'Numbness', 'Tingling', 'Weakness', 'Memory issues', 'Seizures'],
  'Gastrointestinal': ['Abdominal pain', 'Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Bloating', 'Heartburn'],
};

type AppointmentType = 'cp_exam' | 'specialist' | 'regular' | 'followup';

interface PrepFormData {
  condition: string;
  appointmentType: AppointmentType;
  appointmentDate: string;
  // Symptom tracking
  currentSymptoms: string[];
  customSymptoms: string;
  averagePain: number;
  worstPain: number;
  bestPain: number;
  // Flare-ups
  hasFlareups: boolean;
  flareupFrequency: string;
  flareupDuration: string;
  flareupTriggers: string;
  flareupLimitations: string;
  // Functional impact
  walkingLimit: string;
  standingLimit: string;
  sittingLimit: string;
  liftingLimit: string;
  sleepImpact: string;
  workImpact: string;
  daysMissed: string;
  // Medications
  currentMedications: string;
  sideEffects: string;
  // Notes
  additionalNotes: string;
}

export default function DBQPrepSheet() {
  const printRef = useRef<HTMLDivElement>(null);
  const { data } = useClaims();
  const { conditions: userConditions } = useUserConditions();
  const [conditionSearch, setConditionSearch] = useState('');
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    symptoms: true,
    flareups: true,
    functional: true,
    medications: true,
  });

  // Build medications pre-fill from store data
  const storedMedicationsText = useMemo(() => {
    if (!data.medications || data.medications.length === 0) return '';
    return data.medications
      .map(m => `${m.name}${m.dosage ? ` (${m.dosage})` : ''}${m.frequency ? ` - ${m.frequency}` : ''}`)
      .join('\n');
  }, [data.medications]);

  // Build side effects pre-fill from store data
  const storedSideEffectsText = useMemo(() => {
    if (!data.medications || data.medications.length === 0) return '';
    return data.medications
      .filter(m => m.sideEffects)
      .map(m => `${m.name}: ${m.sideEffects}`)
      .join('\n');
  }, [data.medications]);

  const [formData, setFormData] = useState<PrepFormData>({
    condition: '',
    appointmentType: 'cp_exam',
    appointmentDate: '',
    currentSymptoms: [],
    customSymptoms: '',
    averagePain: 5,
    worstPain: 8,
    bestPain: 3,
    hasFlareups: false,
    flareupFrequency: '',
    flareupDuration: '',
    flareupTriggers: '',
    flareupLimitations: '',
    walkingLimit: '',
    standingLimit: '',
    sittingLimit: '',
    liftingLimit: '',
    sleepImpact: '',
    workImpact: '',
    daysMissed: '',
    currentMedications: storedMedicationsText,
    sideEffects: storedSideEffectsText,
    additionalNotes: '',
  });

  // Combine user's tracked conditions with the full VA conditions list for search
  const userConditionNames = useMemo(() => {
    const names = new Set<string>();
    (data.claimConditions || []).forEach(c => names.add(c.name));
    userConditions.forEach(uc => {
      const details = uc.conditionId;
      if (details) names.add(details);
    });
    return [...names];
  }, [data.claimConditions, userConditions]);

  const filteredConditions = useMemo(() => {
    if (!conditionSearch) {
      // Show user's tracked conditions first, then general list
      const userFirst = userConditionNames.filter(c => !allConditions.includes(c));
      return [...userConditionNames, ...allConditions.filter(c => !userConditionNames.includes(c))].slice(0, 50);
    }
    const search = conditionSearch.toLowerCase();
    // Prioritize user's conditions in search results
    const userMatches = userConditionNames.filter(c => c.toLowerCase().includes(search));
    const otherMatches = allConditions.filter(c =>
      c.toLowerCase().includes(search) && !userMatches.includes(c)
    );
    return [...userMatches, ...otherMatches].slice(0, 50);
  }, [conditionSearch, userConditionNames]);

  // Get condition-specific reminders
  const reminders = useMemo(() => {
    for (const [key, value] of Object.entries(conditionReminders)) {
      if (formData.condition.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }
    return [];
  }, [formData.condition]);

  // Get common symptoms based on condition
  const commonSymptoms = useMemo(() => {
    // Try to match condition to a body system
    if (formData.condition.toLowerCase().includes('ptsd') ||
        formData.condition.toLowerCase().includes('depression') ||
        formData.condition.toLowerCase().includes('anxiety')) {
      return commonSymptomsBySystem['Mental Health'];
    }
    if (formData.condition.toLowerCase().includes('spine') ||
        formData.condition.toLowerCase().includes('knee') ||
        formData.condition.toLowerCase().includes('shoulder') ||
        formData.condition.toLowerCase().includes('back') ||
        formData.condition.toLowerCase().includes('arthritis')) {
      return commonSymptomsBySystem['Musculoskeletal'];
    }
    if (formData.condition.toLowerCase().includes('apnea') ||
        formData.condition.toLowerCase().includes('respiratory') ||
        formData.condition.toLowerCase().includes('asthma')) {
      return commonSymptomsBySystem['Respiratory'];
    }
    if (formData.condition.toLowerCase().includes('migraine') ||
        formData.condition.toLowerCase().includes('neuropathy') ||
        formData.condition.toLowerCase().includes('tbi')) {
      return commonSymptomsBySystem['Neurological'];
    }
    if (formData.condition.toLowerCase().includes('gerd') ||
        formData.condition.toLowerCase().includes('ibs') ||
        formData.condition.toLowerCase().includes('gastric')) {
      return commonSymptomsBySystem['Gastrointestinal'];
    }
    return ['Pain', 'Fatigue', 'Discomfort', 'Limited function', 'Sleep issues'];
  }, [formData.condition]);

  const updateFormData = <K extends keyof PrepFormData>(field: K, value: PrepFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleSymptom = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      currentSymptoms: prev.currentSymptoms.includes(symptom)
        ? prev.currentSymptoms.filter(s => s !== symptom)
        : [...prev.currentSymptoms, symptom]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const generateDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">DBQ Prep Sheet</h1>
          <p className="text-muted-foreground">
            Prepare for your C&P exam or medical appointment
          </p>
        </div>
      </div>

      {/* Condition Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Appointment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Condition</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={conditionSearch}
                  onChange={(e) => {
                    setConditionSearch(e.target.value);
                    setShowConditionDropdown(true);
                  }}
                  onFocus={() => setShowConditionDropdown(true)}
                  placeholder="Search conditions..."
                  className="pl-9"
                />
                {showConditionDropdown && filteredConditions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-card border border-border rounded-lg shadow-lg">
                    {filteredConditions.map(condition => (
                      <button
                        key={condition}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-muted text-sm"
                        onClick={() => {
                          updateFormData('condition', condition);
                          setConditionSearch(condition);
                          setShowConditionDropdown(false);
                        }}
                      >
                        {condition}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {formData.condition && (
                <Badge variant="secondary">{formData.condition}</Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label>Appointment Date</Label>
              <Input
                type="date"
                value={formData.appointmentDate}
                onChange={(e) => updateFormData('appointmentDate', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Appointment Type</Label>
            <RadioGroup
              value={formData.appointmentType}
              onValueChange={(value) => updateFormData('appointmentType', value as AppointmentType)}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cp_exam" id="cp_exam" />
                <Label htmlFor="cp_exam" className="cursor-pointer">C&P Exam</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="specialist" id="specialist" />
                <Label htmlFor="specialist" className="cursor-pointer">Specialist</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="regular" />
                <Label htmlFor="regular" className="cursor-pointer">Regular Visit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="followup" id="followup" />
                <Label htmlFor="followup" className="cursor-pointer">Follow-up</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Condition-Specific Reminders */}
      {reminders.length > 0 && (
        <Card className="bg-primary/5 border-primary/30">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm mb-2">
                  Reminders for {formData.condition}
                </p>
                <ul className="space-y-1">
                  {reminders.map((reminder, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {reminder}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Symptoms Section */}
      <Card>
        <CardHeader
          className="cursor-pointer"
          onClick={() => toggleSection('symptoms')}
        >
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Symptoms & Pain Levels
            </span>
            {expandedSections.symptoms ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </CardTitle>
        </CardHeader>
        {expandedSections.symptoms && (
          <CardContent className="space-y-6">
            {/* Current Symptoms */}
            <div className="space-y-2">
              <Label>Current Symptoms (select all that apply)</Label>
              <div className="flex flex-wrap gap-2">
                {commonSymptoms.map(symptom => (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleSymptom(symptom)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm border transition-all',
                      formData.currentSymptoms.includes(symptom)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted border-border hover:border-primary/50'
                    )}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
              <Input
                value={formData.customSymptoms}
                onChange={(e) => updateFormData('customSymptoms', e.target.value)}
                placeholder="Add other symptoms (comma-separated)..."
                className="mt-2"
              />
            </div>

            {/* Pain Levels */}
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-3">
                <Label>Average Pain Level: {formData.averagePain}/10</Label>
                <Slider
                  value={[formData.averagePain]}
                  onValueChange={([value]) => updateFormData('averagePain', value)}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="space-y-3">
                <Label>Worst Pain Level: {formData.worstPain}/10</Label>
                <Slider
                  value={[formData.worstPain]}
                  onValueChange={([value]) => updateFormData('worstPain', value)}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="space-y-3">
                <Label>Best Pain Level: {formData.bestPain}/10</Label>
                <Slider
                  value={[formData.bestPain]}
                  onValueChange={([value]) => updateFormData('bestPain', value)}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Flare-ups Section */}
      <Card>
        <CardHeader
          className="cursor-pointer"
          onClick={() => toggleSection('flareups')}
        >
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Flare-ups
            </span>
            {expandedSections.flareups ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </CardTitle>
        </CardHeader>
        {expandedSections.flareups && (
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasFlareups"
                checked={formData.hasFlareups}
                onCheckedChange={(checked) => updateFormData('hasFlareups', !!checked)}
              />
              <Label htmlFor="hasFlareups" className="cursor-pointer">
                I experience flare-ups of my condition
              </Label>
            </div>

            {formData.hasFlareups && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>How often do flare-ups occur?</Label>
                  <Input
                    value={formData.flareupFrequency}
                    onChange={(e) => updateFormData('flareupFrequency', e.target.value)}
                    placeholder="e.g., 2-3 times per week"
                  />
                </div>
                <div className="space-y-2">
                  <Label>How long do they last?</Label>
                  <Input
                    value={formData.flareupDuration}
                    onChange={(e) => updateFormData('flareupDuration', e.target.value)}
                    placeholder="e.g., 1-2 days"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>What triggers flare-ups?</Label>
                  <Input
                    value={formData.flareupTriggers}
                    onChange={(e) => updateFormData('flareupTriggers', e.target.value)}
                    placeholder="e.g., weather changes, stress, physical activity"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>What can't you do during a flare-up?</Label>
                  <Textarea
                    value={formData.flareupLimitations}
                    onChange={(e) => updateFormData('flareupLimitations', e.target.value)}
                    placeholder="Describe activities you cannot perform during flare-ups..."
                    rows={3}
                  />
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Functional Impact Section */}
      <Card>
        <CardHeader
          className="cursor-pointer"
          onClick={() => toggleSection('functional')}
        >
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Functional Impact
            </span>
            {expandedSections.functional ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </CardTitle>
        </CardHeader>
        {expandedSections.functional && (
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Walking Limit</Label>
                <Input
                  value={formData.walkingLimit}
                  onChange={(e) => updateFormData('walkingLimit', e.target.value)}
                  placeholder="e.g., Can only walk 1 block"
                />
              </div>
              <div className="space-y-2">
                <Label>Standing Limit</Label>
                <Input
                  value={formData.standingLimit}
                  onChange={(e) => updateFormData('standingLimit', e.target.value)}
                  placeholder="e.g., 10-15 minutes max"
                />
              </div>
              <div className="space-y-2">
                <Label>Sitting Limit</Label>
                <Input
                  value={formData.sittingLimit}
                  onChange={(e) => updateFormData('sittingLimit', e.target.value)}
                  placeholder="e.g., Must stand/stretch every 30 min"
                />
              </div>
              <div className="space-y-2">
                <Label>Lifting Limit</Label>
                <Input
                  value={formData.liftingLimit}
                  onChange={(e) => updateFormData('liftingLimit', e.target.value)}
                  placeholder="e.g., Cannot lift over 10 lbs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                Sleep Impact
              </Label>
              <Textarea
                value={formData.sleepImpact}
                onChange={(e) => updateFormData('sleepImpact', e.target.value)}
                placeholder="How does this condition affect your sleep? (hours per night, waking up, quality)"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Work Impact</Label>
              <Textarea
                value={formData.workImpact}
                onChange={(e) => updateFormData('workImpact', e.target.value)}
                placeholder="How does this affect your ability to work? Any accommodations needed?"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Days Missed (past 12 months)</Label>
              <Input
                value={formData.daysMissed}
                onChange={(e) => updateFormData('daysMissed', e.target.value)}
                placeholder="e.g., Approximately 15 days"
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Medications Section */}
      <Card>
        <CardHeader
          className="cursor-pointer"
          onClick={() => toggleSection('medications')}
        >
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" />
              Medications & Treatments
            </span>
            {expandedSections.medications ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </CardTitle>
        </CardHeader>
        {expandedSections.medications && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Medications for This Condition</Label>
              <Textarea
                value={formData.currentMedications}
                onChange={(e) => updateFormData('currentMedications', e.target.value)}
                placeholder="List medications, dosages, and frequency..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Side Effects Experienced</Label>
              <Textarea
                value={formData.sideEffects}
                onChange={(e) => updateFormData('sideEffects', e.target.value)}
                placeholder="List any side effects from medications..."
                rows={2}
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Additional Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.additionalNotes}
            onChange={(e) => updateFormData('additionalNotes', e.target.value)}
            placeholder="Any other information you want to remember to tell the examiner..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Print Button */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handlePrint} className="gap-2">
          <Printer className="h-4 w-4" />
          Print Prep Sheet
        </Button>
      </div>

      {/* Printable Version */}
      <div className="hidden print:block" ref={printRef}>
        <div className="p-8 text-black">
          <h1 className="text-2xl font-bold text-center mb-2">C&P EXAM PREP SHEET</h1>
          <p className="text-center text-gray-600 mb-6">Prepared: {generateDate()}</p>

          <div className="border-2 border-black p-4 mb-4">
            <h2 className="font-bold text-lg mb-2">FOR MEDICAL PROVIDER</h2>
            <p><strong>Condition:</strong> {formData.condition}</p>
            <p><strong>Appointment Type:</strong> {formData.appointmentType.replace('_', ' ').toUpperCase()}</p>
            {formData.appointmentDate && (
              <p><strong>Date:</strong> {new Date(formData.appointmentDate).toLocaleDateString()}</p>
            )}
          </div>

          <div className="mb-4">
            <h2 className="font-bold text-lg border-b-2 border-black pb-1 mb-2">SYMPTOMS</h2>
            <p><strong>Current Symptoms:</strong> {[...formData.currentSymptoms, formData.customSymptoms].filter(Boolean).join(', ') || 'None specified'}</p>
            <p><strong>Pain Levels:</strong> Average: {formData.averagePain}/10 | Worst: {formData.worstPain}/10 | Best: {formData.bestPain}/10</p>
          </div>

          {formData.hasFlareups && (
            <div className="mb-4">
              <h2 className="font-bold text-lg border-b-2 border-black pb-1 mb-2">FLARE-UPS</h2>
              <p><strong>Frequency:</strong> {formData.flareupFrequency || 'Not specified'}</p>
              <p><strong>Duration:</strong> {formData.flareupDuration || 'Not specified'}</p>
              <p><strong>Triggers:</strong> {formData.flareupTriggers || 'Not specified'}</p>
              <p><strong>Limitations During Flare:</strong> {formData.flareupLimitations || 'Not specified'}</p>
            </div>
          )}

          <div className="mb-4">
            <h2 className="font-bold text-lg border-b-2 border-black pb-1 mb-2">FUNCTIONAL LIMITATIONS</h2>
            <p><strong>Walking:</strong> {formData.walkingLimit || 'Not specified'}</p>
            <p><strong>Standing:</strong> {formData.standingLimit || 'Not specified'}</p>
            <p><strong>Sitting:</strong> {formData.sittingLimit || 'Not specified'}</p>
            <p><strong>Lifting:</strong> {formData.liftingLimit || 'Not specified'}</p>
            <p><strong>Sleep Impact:</strong> {formData.sleepImpact || 'Not specified'}</p>
            <p><strong>Work Impact:</strong> {formData.workImpact || 'Not specified'}</p>
            <p><strong>Days Missed:</strong> {formData.daysMissed || 'Not specified'}</p>
          </div>

          <div className="mb-4">
            <h2 className="font-bold text-lg border-b-2 border-black pb-1 mb-2">MEDICATIONS</h2>
            <p><strong>Current:</strong> {formData.currentMedications || 'None specified'}</p>
            <p><strong>Side Effects:</strong> {formData.sideEffects || 'None specified'}</p>
          </div>

          {formData.additionalNotes && (
            <div className="mb-4">
              <h2 className="font-bold text-lg border-b-2 border-black pb-1 mb-2">ADDITIONAL NOTES</h2>
              <p>{formData.additionalNotes}</p>
            </div>
          )}

          <div className="border-t-2 border-black pt-4 mt-6">
            <h2 className="font-bold text-lg mb-2">FOR VETERAN - REMEMBER:</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Describe your WORST days, not your best</li>
              <li>Be specific about frequency and duration</li>
              <li>Mention ALL limitations, don't minimize</li>
              <li>Bring copies of relevant medical records</li>
              <li>It's okay to say "I don't know" or ask for clarification</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Exam Tips */}
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-2">C&P Exam Tips</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Describe your <strong>worst days</strong>, not your average or best days</li>
                <li>• Be specific about how often symptoms occur and how long they last</li>
                <li>• Don't minimize your symptoms or try to appear "tough"</li>
                <li>• Bring this prep sheet and any relevant medical records</li>
                <li>• It's okay to take a moment to think before answering</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block,
          .print\\:block * {
            visibility: visible;
          }
          .print\\:block {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
