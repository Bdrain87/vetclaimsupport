import { useState } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { Plus, Trash2, Edit, Calendar, ArrowDownUp, AlertTriangle, Zap, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import type { SpineSymptomEntry, SpineRegion, MuscleSpasm, Guarding, RadiculopathySeverity, RadiculopathySide } from '@/types/spine';
import { NORMAL_ROM, SPINE_RATING_CRITERIA } from '@/types/spine';

const painTypes = ['Sharp', 'Dull', 'Burning', 'Aching', 'Radiating', 'Throbbing', 'Stabbing'];
const radiculopathySymptoms = ['Numbness', 'Tingling', 'Weakness', 'Burning sensation', 'Electric shock feeling', 'Loss of reflexes'];
const assistiveDevices = ['Cane', 'Walker', 'Back brace', 'Lumbar support', 'Wheelchair', 'TENS unit'];
const flareUpTriggers = ['Standing', 'Sitting', 'Walking', 'Bending', 'Lifting', 'Weather changes', 'Stress', 'Physical activity'];

const defaultFormData: Omit<SpineSymptomEntry, 'id'> = {
  date: '',
  region: 'Thoracolumbar',
  painLevel: 5,
  painType: [],
  painConstant: false,
  rangeOfMotion: {
    forwardFlexion: null,
    extension: null,
    leftLateralFlexion: null,
    rightLateralFlexion: null,
    leftRotation: null,
    rightRotation: null,
    painOnMotion: false,
  },
  muscleSpasm: 'None',
  guarding: 'None',
  abnormalSpinalContour: false,
  upperExtremityRadiculopathy: { affected: false, symptoms: [] },
  lowerExtremityRadiculopathy: { affected: false, symptoms: [] },
  hadIncapacitatingEpisode: false,
  impactOnWork: '',
  impactOnDaily: '',
  usesAssistiveDevice: false,
  hadFlareUp: false,
  notes: '',
};

export function SpineSymptomLogger() {
  const { data, addSymptom, updateSymptom, deleteSymptom } = useClaims();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<SpineSymptomEntry, 'id'>>(defaultFormData);
  const [showROMSection, setShowROMSection] = useState(false);
  const [showRadiculopathy, setShowRadiculopathy] = useState(false);

  // Filter spine-specific symptoms from general symptoms
  const spineSymptoms = data.symptoms.filter(s => 
    s.bodyArea?.toLowerCase().includes('spine') || 
    s.bodyArea?.toLowerCase().includes('back') ||
    s.bodyArea?.toLowerCase().includes('cervical') ||
    s.bodyArea?.toLowerCase().includes('lumbar') ||
    s.bodyArea?.toLowerCase().includes('thoracic') ||
    (s as any).region // Has spine-specific data
  );

  const resetForm = () => {
    setFormData(defaultFormData);
    setEditingId(null);
    setShowROMSection(false);
    setShowRadiculopathy(false);
  };

  const calculateCombinedROM = () => {
    const rom = formData.rangeOfMotion;
    const values = [
      rom.forwardFlexion,
      rom.extension,
      rom.leftLateralFlexion,
      rom.rightLateralFlexion,
      rom.leftRotation,
      rom.rightRotation,
    ].filter(v => v !== null) as number[];
    return values.reduce((sum, v) => sum + v, 0);
  };

  const getNormalROM = () => {
    return formData.region === 'Cervical' ? NORMAL_ROM.cervical : NORMAL_ROM.thoracolumbar;
  };

  const getEstimatedRating = () => {
    const rom = formData.rangeOfMotion;
    const combinedROM = calculateCombinedROM();
    const criteria = formData.region === 'Cervical' 
      ? SPINE_RATING_CRITERIA.cervical 
      : SPINE_RATING_CRITERIA.thoracolumbar;

    if (formData.region === 'Thoracolumbar') {
      if (rom.forwardFlexion !== null) {
        if (rom.forwardFlexion <= 30) return '40%';
        if (rom.forwardFlexion <= 60 || combinedROM <= 120) return '20%';
        if (rom.forwardFlexion <= 85 || combinedROM <= 235) return '10%';
      }
    } else {
      if (rom.forwardFlexion !== null) {
        if (rom.forwardFlexion <= 15) return '30%';
        if (rom.forwardFlexion <= 30 || combinedROM <= 170) return '20%';
        if (rom.forwardFlexion <= 40 || combinedROM <= 335) return '10%';
      }
    }
    
    // Check muscle spasm/guarding
    if (formData.muscleSpasm === 'Present with abnormal gait or spinal contour' ||
        formData.guarding === 'Present with abnormal gait or spinal contour') {
      return '20%';
    }
    
    return 'Insufficient data';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert to general symptom format while preserving spine-specific data
    const symptomData = {
      date: formData.date,
      symptom: `${formData.region} spine pain`,
      bodyArea: `${formData.region} Spine`,
      severity: formData.painLevel,
      frequency: formData.painConstant ? 'Constant' : 'Daily',
      dailyImpact: formData.impactOnDaily,
      notes: JSON.stringify({
        ...formData,
        combinedROM: calculateCombinedROM(),
      }),
    };

    if (editingId) {
      updateSymptom(editingId, symptomData);
    } else {
      addSymptom(symptomData);
    }
    setIsOpen(false);
    resetForm();
  };

  const handleEdit = (symptom: any) => {
    try {
      const spineData = JSON.parse(symptom.notes);
      setFormData(spineData);
      setEditingId(symptom.id);
      setIsOpen(true);
    } catch {
      // Not a spine symptom with JSON data
    }
  };

  const parseSpineData = (symptom: any): SpineSymptomEntry | null => {
    try {
      return JSON.parse(symptom.notes);
    } catch {
      return null;
    }
  };

  const getSeverityColor = (level: number) => {
    if (level <= 3) return 'bg-success/20 text-success';
    if (level <= 6) return 'bg-warning/20 text-warning';
    return 'bg-destructive/20 text-destructive';
  };

  return (
    <div className="space-y-4">
      {/* VA Rating Info Banner */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <ArrowDownUp className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">38 CFR 4.71a Spine Rating Criteria</p>
              <p className="text-xs text-muted-foreground mt-1">
                Spine ratings are based on range of motion (ROM), incapacitating episodes, 
                and associated neurological symptoms. Track measurements in degrees using a goniometer.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Entry Button */}
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Log Spine Symptoms
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit' : 'Log'} Spine Symptoms</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-4 pr-2" style={{ scrollPaddingBottom: '350px' }}>
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
                    <Label htmlFor="region">Spine Region</Label>
                    <Select 
                      value={formData.region} 
                      onValueChange={(value: SpineRegion) => setFormData({ ...formData, region: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cervical">Cervical (Neck)</SelectItem>
                        <SelectItem value="Thoracolumbar">Thoracolumbar (Mid/Lower Back)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Pain Level */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Pain Level (1-10)</Label>
                    <span className={`rounded-md px-2 py-1 text-sm font-medium ${getSeverityColor(formData.painLevel)}`}>
                      {formData.painLevel}/10
                    </span>
                  </div>
                  <Slider
                    value={[formData.painLevel]}
                    onValueChange={([value]) => setFormData({ ...formData, painLevel: value })}
                    min={1}
                    max={10}
                    step={1}
                  />
                </div>

                {/* Pain Type */}
                <div className="space-y-2">
                  <Label>Pain Type</Label>
                  <div className="flex flex-wrap gap-2">
                    {painTypes.map((type) => (
                      <Badge
                        key={type}
                        variant={formData.painType.includes(type) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          const newTypes = formData.painType.includes(type)
                            ? formData.painType.filter(t => t !== type)
                            : [...formData.painType, type];
                          setFormData({ ...formData, painType: newTypes });
                        }}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    checked={formData.painConstant}
                    onCheckedChange={(checked) => setFormData({ ...formData, painConstant: checked })}
                  />
                  <Label>Pain is constant (not intermittent)</Label>
                </div>

                {/* Range of Motion Section */}
                <Collapsible open={showROMSection} onOpenChange={setShowROMSection}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <ArrowDownUp className="h-4 w-4" />
                        Range of Motion (Degrees)
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${showROMSection ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4 space-y-4">
                    <p className="text-xs text-muted-foreground">
                      Enter measurements in degrees. Normal {formData.region === 'Cervical' ? 'cervical' : 'thoracolumbar'} ROM: 
                      Forward flexion {getNormalROM().forwardFlexion}°, Extension {getNormalROM().extension}°
                    </p>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Forward Flexion (°)</Label>
                        <Input 
                          type="number" 
                          placeholder={`Normal: ${getNormalROM().forwardFlexion}°`}
                          value={formData.rangeOfMotion.forwardFlexion ?? ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            rangeOfMotion: { ...formData.rangeOfMotion, forwardFlexion: e.target.value ? Number(e.target.value) : null }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Extension (°)</Label>
                        <Input 
                          type="number" 
                          placeholder={`Normal: ${getNormalROM().extension}°`}
                          value={formData.rangeOfMotion.extension ?? ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            rangeOfMotion: { ...formData.rangeOfMotion, extension: e.target.value ? Number(e.target.value) : null }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Left Lateral Flexion (°)</Label>
                        <Input 
                          type="number" 
                          placeholder={`Normal: ${getNormalROM().lateralFlexion}°`}
                          value={formData.rangeOfMotion.leftLateralFlexion ?? ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            rangeOfMotion: { ...formData.rangeOfMotion, leftLateralFlexion: e.target.value ? Number(e.target.value) : null }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Right Lateral Flexion (°)</Label>
                        <Input 
                          type="number" 
                          placeholder={`Normal: ${getNormalROM().lateralFlexion}°`}
                          value={formData.rangeOfMotion.rightLateralFlexion ?? ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            rangeOfMotion: { ...formData.rangeOfMotion, rightLateralFlexion: e.target.value ? Number(e.target.value) : null }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Left Rotation (°)</Label>
                        <Input 
                          type="number" 
                          placeholder={`Normal: ${getNormalROM().rotation}°`}
                          value={formData.rangeOfMotion.leftRotation ?? ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            rangeOfMotion: { ...formData.rangeOfMotion, leftRotation: e.target.value ? Number(e.target.value) : null }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Right Rotation (°)</Label>
                        <Input 
                          type="number" 
                          placeholder={`Normal: ${getNormalROM().rotation}°`}
                          value={formData.rangeOfMotion.rightRotation ?? ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            rangeOfMotion: { ...formData.rangeOfMotion, rightRotation: e.target.value ? Number(e.target.value) : null }
                          })}
                        />
                      </div>
                    </div>

                    {calculateCombinedROM() > 0 && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">
                          <strong>Combined ROM:</strong> {calculateCombinedROM()}° 
                          (Normal: {getNormalROM().combinedMax}°)
                        </p>
                        <p className="text-sm text-primary font-medium mt-1">
                          Estimated Rating: {getEstimatedRating()}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Switch
                        checked={formData.rangeOfMotion.painOnMotion}
                        onCheckedChange={(checked) => setFormData({
                          ...formData,
                          rangeOfMotion: { ...formData.rangeOfMotion, painOnMotion: checked }
                        })}
                      />
                      <Label>Pain on motion</Label>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Muscle Spasm & Guarding */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Muscle Spasm</Label>
                    <Select 
                      value={formData.muscleSpasm} 
                      onValueChange={(value: MuscleSpasm) => setFormData({ ...formData, muscleSpasm: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Present but no abnormal gait">Present (no abnormal gait)</SelectItem>
                        <SelectItem value="Present with abnormal gait or spinal contour">Present with abnormal gait/contour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Guarding</Label>
                    <Select 
                      value={formData.guarding} 
                      onValueChange={(value: Guarding) => setFormData({ ...formData, guarding: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Present but no abnormal gait">Present (no abnormal gait)</SelectItem>
                        <SelectItem value="Present with abnormal gait or spinal contour">Present with abnormal gait/contour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Radiculopathy Section */}
                <Collapsible open={showRadiculopathy} onOpenChange={setShowRadiculopathy}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Radiculopathy (Nerve Symptoms)
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${showRadiculopathy ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4 space-y-4">
                    {/* Lower Extremity */}
                    <div className="space-y-3 p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={formData.lowerExtremityRadiculopathy.affected}
                          onCheckedChange={(checked) => setFormData({
                            ...formData,
                            lowerExtremityRadiculopathy: { ...formData.lowerExtremityRadiculopathy, affected: checked }
                          })}
                        />
                        <Label className="font-medium">Lower Extremity (Legs)</Label>
                      </div>
                      
                      {formData.lowerExtremityRadiculopathy.affected && (
                        <div className="space-y-3 pl-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Side Affected</Label>
                              <Select 
                                value={formData.lowerExtremityRadiculopathy.side || ''} 
                                onValueChange={(value: RadiculopathySide) => setFormData({
                                  ...formData,
                                  lowerExtremityRadiculopathy: { ...formData.lowerExtremityRadiculopathy, side: value }
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select side" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Left">Left</SelectItem>
                                  <SelectItem value="Right">Right</SelectItem>
                                  <SelectItem value="Bilateral">Bilateral (Both)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Severity</Label>
                              <Select 
                                value={formData.lowerExtremityRadiculopathy.severity || ''} 
                                onValueChange={(value: RadiculopathySeverity) => setFormData({
                                  ...formData,
                                  lowerExtremityRadiculopathy: { ...formData.lowerExtremityRadiculopathy, severity: value }
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Mild">Mild</SelectItem>
                                  <SelectItem value="Moderate">Moderate</SelectItem>
                                  <SelectItem value="Severe">Severe</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Symptoms</Label>
                            <div className="flex flex-wrap gap-2">
                              {radiculopathySymptoms.map((symptom) => (
                                <Badge
                                  key={symptom}
                                  variant={formData.lowerExtremityRadiculopathy.symptoms.includes(symptom) ? 'default' : 'outline'}
                                  className="cursor-pointer"
                                  onClick={() => {
                                    const newSymptoms = formData.lowerExtremityRadiculopathy.symptoms.includes(symptom)
                                      ? formData.lowerExtremityRadiculopathy.symptoms.filter(s => s !== symptom)
                                      : [...formData.lowerExtremityRadiculopathy.symptoms, symptom];
                                    setFormData({
                                      ...formData,
                                      lowerExtremityRadiculopathy: { ...formData.lowerExtremityRadiculopathy, symptoms: newSymptoms }
                                    });
                                  }}
                                >
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Upper Extremity */}
                    <div className="space-y-3 p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={formData.upperExtremityRadiculopathy.affected}
                          onCheckedChange={(checked) => setFormData({
                            ...formData,
                            upperExtremityRadiculopathy: { ...formData.upperExtremityRadiculopathy, affected: checked }
                          })}
                        />
                        <Label className="font-medium">Upper Extremity (Arms)</Label>
                      </div>
                      
                      {formData.upperExtremityRadiculopathy.affected && (
                        <div className="space-y-3 pl-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Side Affected</Label>
                              <Select 
                                value={formData.upperExtremityRadiculopathy.side || ''} 
                                onValueChange={(value: RadiculopathySide) => setFormData({
                                  ...formData,
                                  upperExtremityRadiculopathy: { ...formData.upperExtremityRadiculopathy, side: value }
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select side" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Left">Left</SelectItem>
                                  <SelectItem value="Right">Right</SelectItem>
                                  <SelectItem value="Bilateral">Bilateral (Both)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Severity</Label>
                              <Select 
                                value={formData.upperExtremityRadiculopathy.severity || ''} 
                                onValueChange={(value: RadiculopathySeverity) => setFormData({
                                  ...formData,
                                  upperExtremityRadiculopathy: { ...formData.upperExtremityRadiculopathy, severity: value }
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Mild">Mild</SelectItem>
                                  <SelectItem value="Moderate">Moderate</SelectItem>
                                  <SelectItem value="Severe">Severe</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Symptoms</Label>
                            <div className="flex flex-wrap gap-2">
                              {radiculopathySymptoms.map((symptom) => (
                                <Badge
                                  key={symptom}
                                  variant={formData.upperExtremityRadiculopathy.symptoms.includes(symptom) ? 'default' : 'outline'}
                                  className="cursor-pointer"
                                  onClick={() => {
                                    const newSymptoms = formData.upperExtremityRadiculopathy.symptoms.includes(symptom)
                                      ? formData.upperExtremityRadiculopathy.symptoms.filter(s => s !== symptom)
                                      : [...formData.upperExtremityRadiculopathy.symptoms, symptom];
                                    setFormData({
                                      ...formData,
                                      upperExtremityRadiculopathy: { ...formData.upperExtremityRadiculopathy, symptoms: newSymptoms }
                                    });
                                  }}
                                >
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Incapacitating Episode */}
                <div className="space-y-3 p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={formData.hadIncapacitatingEpisode}
                      onCheckedChange={(checked) => setFormData({ ...formData, hadIncapacitatingEpisode: checked })}
                    />
                    <div>
                      <Label className="font-medium">Had Incapacitating Episode</Label>
                      <p className="text-xs text-muted-foreground">Required bed rest prescribed by a physician</p>
                    </div>
                  </div>
                </div>

                {/* Assistive Devices */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={formData.usesAssistiveDevice}
                      onCheckedChange={(checked) => setFormData({ ...formData, usesAssistiveDevice: checked })}
                    />
                    <Label>Uses assistive device(s)</Label>
                  </div>
                  {formData.usesAssistiveDevice && (
                    <div className="flex flex-wrap gap-2 pl-4">
                      {assistiveDevices.map((device) => (
                        <Badge
                          key={device}
                          variant={(formData.assistiveDevices || []).includes(device) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => {
                            const current = formData.assistiveDevices || [];
                            const newDevices = current.includes(device)
                              ? current.filter(d => d !== device)
                              : [...current, device];
                            setFormData({ ...formData, assistiveDevices: newDevices });
                          }}
                        >
                          {device}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Flare-ups */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={formData.hadFlareUp}
                      onCheckedChange={(checked) => setFormData({ ...formData, hadFlareUp: checked })}
                    />
                    <Label>Had flare-up today</Label>
                  </div>
                  {formData.hadFlareUp && (
                    <div className="space-y-3 pl-4">
                      <div className="space-y-2">
                        <Label>Flare-up triggers</Label>
                        <div className="flex flex-wrap gap-2">
                          {flareUpTriggers.map((trigger) => (
                            <Badge
                              key={trigger}
                              variant={(formData.flareUpTriggers || []).includes(trigger) ? 'default' : 'outline'}
                              className="cursor-pointer"
                              onClick={() => {
                                const current = formData.flareUpTriggers || [];
                                const newTriggers = current.includes(trigger)
                                  ? current.filter(t => t !== trigger)
                                  : [...current, trigger];
                                setFormData({ ...formData, flareUpTriggers: newTriggers });
                              }}
                            >
                              {trigger}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Impact */}
                <div className="space-y-2">
                  <Label htmlFor="impactOnWork">Impact on Work/Duties</Label>
                  <Textarea 
                    id="impactOnWork" 
                    placeholder="How does this affect your ability to work?"
                    value={formData.impactOnWork}
                    onChange={(e) => setFormData({ ...formData, impactOnWork: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="impactOnDaily">Impact on Daily Activities</Label>
                  <Textarea 
                    id="impactOnDaily" 
                    placeholder="How does this affect daily activities like dressing, bathing, driving?"
                    value={formData.impactOnDaily}
                    onChange={(e) => setFormData({ ...formData, impactOnDaily: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Any additional details..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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

      {/* Spine Symptoms List */}
      {spineSymptoms.length === 0 ? (
        <Card className="data-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Activity className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">No spine symptoms logged yet.</p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Track range of motion and pain to document your back condition.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {spineSymptoms.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((symptom) => {
            const spineData = parseSpineData(symptom);
            
            return (
              <Card key={symptom.id} className="data-card">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getSeverityColor(symptom.severity)}`}>
                        {symptom.severity}/10
                      </span>
                      <span className="text-sm text-muted-foreground">{symptom.bodyArea}</span>
                    </div>
                    <div className="flex gap-2">
                      {spineData && (
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(symptom)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
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
                  </div>
                  
                  {spineData && (
                    <div className="grid gap-2 text-sm">
                      {spineData.combinedROM && spineData.combinedROM > 0 && (
                        <div className="flex items-center gap-2">
                          <ArrowDownUp className="h-4 w-4 text-primary" />
                          <span>Combined ROM: {spineData.combinedROM}°</span>
                        </div>
                      )}
                      {spineData.lowerExtremityRadiculopathy?.affected && (
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-warning" />
                          <span>Radiculopathy: {spineData.lowerExtremityRadiculopathy.side} leg - {spineData.lowerExtremityRadiculopathy.severity}</span>
                        </div>
                      )}
                      {spineData.hadIncapacitatingEpisode && (
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                          <span>Incapacitating episode</span>
                        </div>
                      )}
                    </div>
                  )}

                  {symptom.dailyImpact && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">{symptom.dailyImpact}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
