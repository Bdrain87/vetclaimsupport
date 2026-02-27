import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { safeFormatDate } from '@/utils/dateUtils';
import {
  FileText,
  ChevronRight,
  ChevronLeft,
  Check,
  Download,
  AlertCircle,
  Info,
  Stethoscope,
  Calendar,
  User,
  Shield,
  ClipboardList,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useClaims } from '@/hooks/useClaims';
import { useProfileStore } from '@/store/useProfileStore';
import { getAllBranchLabels } from '@/utils/veteranProfile';
import { vaDisabilitiesBySystem } from '@/data/vaDisabilities';
import { PageContainer } from '@/components/PageContainer';
import { exportDoctorSummaryOutlinePDF } from '@/utils/pdfExport';
import { saveToVault } from '@/utils/vaultAutoSave';
import { markJourneyItem } from '@/utils/journeySync';
import { ToastAction } from '@/components/ui/toast';
import { containsBannedPhrases, EXPORT_BLOCKED_MESSAGE } from '@/utils/bannedPhrases';
import { conditionRatingCriteria } from '@/data/ratingCriteria';
import { useToast } from '@/hooks/use-toast';
import { DraftRestoredBanner } from '@/components/ui/DraftRestoredBanner';
import { useToolDraft } from '@/hooks/useToolDraft';

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

interface EvidenceReference {
  id: string;
  type: string;
  date: string;
  provider: string;
  title: string;
}

interface OutlineFormData {
  primaryCondition: string;
  secondaryCondition: string;
  veteranName: string;
  serviceStartDate: string;
  serviceEndDate: string;
  branchOfService: string;
  mosOrJobCode: string;
  inServiceEvent: string;
  onsetTimeline: string;
  continuityDescription: string;
  dutyContext: string;
  symptomTiming: string;
  medicationEffects: string;
  flarePatterns: string;
  functionalInterplay: string;
  baselineSymptoms: string;
  currentSymptoms: string;
  worseningOverTime: string;
  exposures: string[];
  customExposure: string;
  evidenceReferences: EvidenceReference[];
  personalStatementEnabled: boolean;
  personalStatementTimeline: string;
  personalStatementFrequency: string;
  personalStatementFunctionalImpact: string;
  personalStatementTreatmentResponse: string;
  personalStatementTriggers: string;
  personalStatementMissedWork: string;
  personalStatementExamples: string;
  currentSymptomsDetail: string;
  symptomFrequency: string;
  symptomSeverity: string;
  symptomTriggers: string;
  currentMedications: string;
  medicationResponse: string;
  functionalImpact: string;
}

const EXPOSURE_OPTIONS = [
  'Burn pits',
  'Jet fuel / JP-8',
  'Diesel exhaust',
  'Solvents / degreasers',
  'Asbestos',
  'Sand / dust / particulate matter',
  'Depleted uranium',
  'Herbicides (Agent Orange)',
  'PFAS chemicals',
  'Contaminated water',
  'Radiation',
  'Noise',
];

const EVIDENCE_TYPES = [
  'Service Treatment Record (STR)',
  'VA Medical Record',
  'Private Medical Record',
  'Imaging / Labs',
  'Medication List',
  'Buddy Statement',
  'Symptom Log',
];

const STEPS = [
  { id: 1, title: 'Conditions', icon: Stethoscope },
  { id: 2, title: 'Context', icon: Shield },
  { id: 3, title: 'Evidence', icon: ClipboardList },
  { id: 4, title: 'Current Status', icon: User },
  { id: 5, title: 'Review & Export', icon: FileText },
];

export default function DoctorSummaryOutline() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data } = useClaims();
  const profile = useProfileStore();
  const { toast } = useToast();

  const branchLabel = getAllBranchLabels(profile);
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  const buildSymptomSummary = () => {
    const recentSymptoms = data.symptoms.slice(-10);
    if (recentSymptoms.length === 0) return '';
    return recentSymptoms
      .map(s => `${s.symptom} (${s.bodyArea}, severity ${s.severity}/10${s.frequency ? `, ${s.frequency}` : ''})`)
      .join('; ');
  };

  const outlineInitial = useMemo<OutlineFormData>(() => ({
    primaryCondition: searchParams.get('primary') || '',
    secondaryCondition: searchParams.get('secondary') || '',
    veteranName: fullName,
    serviceStartDate: profile.serviceDates?.start || '',
    serviceEndDate: profile.serviceDates?.end || '',
    branchOfService: branchLabel,
    mosOrJobCode: profile.mosCode || '',
    inServiceEvent: '',
    onsetTimeline: '',
    continuityDescription: '',
    dutyContext: '',
    symptomTiming: '',
    medicationEffects: '',
    flarePatterns: '',
    functionalInterplay: '',
    baselineSymptoms: '',
    currentSymptoms: '',
    worseningOverTime: '',
    exposures: [],
    customExposure: '',
    evidenceReferences: [],
    personalStatementEnabled: false,
    personalStatementTimeline: '',
    personalStatementFrequency: '',
    personalStatementFunctionalImpact: '',
    personalStatementTreatmentResponse: '',
    personalStatementTriggers: '',
    personalStatementMissedWork: '',
    personalStatementExamples: '',
    currentSymptomsDetail: buildSymptomSummary(),
    symptomFrequency: '',
    symptomSeverity: '',
    symptomTriggers: '',
    currentMedications: '',
    medicationResponse: '',
    functionalImpact: '',
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const {
    formData, updateField: draftUpdateField, _setFormData, currentStep, setCurrentStep,
    draftRestored, clearDraft, lastSaved,
  } = useToolDraft({
    toolId: 'tool:doctor-summary',
    initialData: outlineInitial,
  });

  const [exportError, setExportError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [primarySearch, setPrimarySearch] = useState(formData.primaryCondition || searchParams.get('primary') || '');
  const [secondarySearch, setSecondarySearch] = useState(formData.secondaryCondition || searchParams.get('secondary') || '');
  const [showPrimaryDropdown, setShowPrimaryDropdown] = useState(false);
  const [showSecondaryDropdown, setShowSecondaryDropdown] = useState(false);
  const [expandedRating, setExpandedRating] = useState<string | null>(null);

  const filteredPrimary = useMemo(() => {
    if (!primarySearch.trim()) return allConditions.slice(0, 50);
    return allConditions.filter(c =>
      c.toLowerCase().includes(primarySearch.toLowerCase())
    ).slice(0, 50);
  }, [primarySearch]);

  const filteredSecondary = useMemo(() => {
    if (!secondarySearch.trim()) return allConditions.slice(0, 50);
    return allConditions.filter(c =>
      c.toLowerCase().includes(secondarySearch.toLowerCase())
    ).slice(0, 50);
  }, [secondarySearch]);

  const updateField = draftUpdateField;

  const addEvidenceReference = () => {
    updateField('evidenceReferences', [
      ...formData.evidenceReferences,
      { id: crypto.randomUUID(), type: '', date: '', provider: '', title: '' },
    ]);
  };

  const updateEvidenceReference = (id: string, field: keyof EvidenceReference, value: string) => {
    updateField(
      'evidenceReferences',
      formData.evidenceReferences.map(ref =>
        ref.id === id ? { ...ref, [field]: value } : ref
      )
    );
  };

  const removeEvidenceReference = (id: string) => {
    updateField(
      'evidenceReferences',
      formData.evidenceReferences.filter(ref => ref.id !== id)
    );
  };

  const toggleExposure = (exposure: string) => {
    const current = formData.exposures;
    if (current.includes(exposure)) {
      updateField('exposures', current.filter(e => e !== exposure));
    } else {
      updateField('exposures', [...current, exposure]);
    }
  };

  const addCustomExposure = () => {
    if (formData.customExposure.trim()) {
      updateField('exposures', [...formData.exposures, formData.customExposure.trim()]);
      updateField('customExposure', '');
    }
  };

  const hasPrimary = formData.primaryCondition.trim() !== '';
  const hasSecondary = formData.secondaryCondition.trim() !== '';

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return hasPrimary || hasSecondary;
      case 2:
      case 3:
      case 4:
      case 5:
        return true;
      default:
        return false;
    }
  };

  const getRatingCriteriaForCondition = (conditionName: string) => {
    const normalizedName = conditionName.toLowerCase().trim();
    return conditionRatingCriteria.find(c =>
      c.conditionName.toLowerCase().includes(normalizedName) ||
      normalizedName.includes(c.conditionName.toLowerCase()) ||
      c.conditionId.toLowerCase() === normalizedName.replace(/\s+/g, '-')
    );
  };

  const collectAllText = (): string => {
    return Object.values(formData)
      .filter((v): v is string => typeof v === 'string')
      .join(' ');
  };

  const handleExport = async () => {
    setExportError('');
    const allText = collectAllText();
    if (containsBannedPhrases(allText)) {
      setExportError(EXPORT_BLOCKED_MESSAGE);
      toast({ title: 'Export blocked', description: 'Contains prohibited language.', variant: 'destructive' });
      return;
    }
    setExporting(true);
    try {
      await exportDoctorSummaryOutlinePDF(formData);
      markJourneyItem('nexus-letter');
      const condition = formData.primaryCondition || '';
      const outlineText = [
        `DOCTOR SUMMARY OUTLINE - ${condition || 'General'}`,
        formData.secondaryCondition ? `Secondary: ${formData.secondaryCondition}` : '',
        '',
        formData.inServiceEvent ? `SERVICE HISTORY:\n${formData.inServiceEvent}` : '',
        formData.onsetTimeline ? `ONSET TIMELINE:\n${formData.onsetTimeline}` : '',
        formData.currentSymptoms ? `CURRENT SYMPTOMS:\n${formData.currentSymptoms}` : '',
        formData.currentSymptomsDetail ? `SYMPTOM DETAIL:\n${formData.currentSymptomsDetail}` : '',
        formData.functionalImpact ? `FUNCTIONAL IMPACT:\n${formData.functionalImpact}` : '',
        formData.currentMedications ? `MEDICATIONS:\n${formData.currentMedications}` : '',
      ].filter(Boolean).join('\n\n');
      saveToVault({
        documentType: 'nexus-letter',
        condition,
        title: `Doctor Summary${condition ? ` - ${condition}` : ''}`,
        content: outlineText,
        fileName: `doctor-summary-${condition || 'outline'}.txt`,
      }).then(() => {
        toast({
          title: 'Saved to Vault',
          action: <ToastAction altText="View in Vault" onClick={() => navigate('/settings/vault')}>View</ToastAction>,
        });
      }).catch(() => {
        toast({ title: 'PDF Exported', description: 'Your doctor summary has been saved.' });
      });
    } catch {
      toast({ title: 'Export failed', description: 'Could not generate PDF. Please try again.', variant: 'destructive' });
    } finally {
      setExporting(false);
    }
  };

  const renderConditionSearch = (
    label: string,
    searchValue: string,
    setSearch: (v: string) => void,
    showDropdown: boolean,
    setShowDropdown: (v: boolean) => void,
    filtered: string[],
    fieldKey: 'primaryCondition' | 'secondaryCondition',
    selectedValue: string,
  ) => (
    <div className="space-y-2">
      <Label>{label} <span className="text-muted-foreground font-normal">(optional)</span></Label>
      <div className="relative">
        <Input
          value={searchValue}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder={`Search conditions...`}
        />
        {showDropdown && filtered.length > 0 && (
          <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-card border border-border rounded-lg shadow-lg">
            {filtered.map(condition => (
              <button
                key={condition}
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-muted text-sm truncate"
                onMouseDown={() => {
                  updateField(fieldKey, condition);
                  setSearch(condition);
                  setShowDropdown(false);
                }}
              >
                {condition}
              </button>
            ))}
          </div>
        )}
      </div>
      {selectedValue && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="truncate max-w-full">{selectedValue}</Badge>
          <button
            type="button"
            onClick={() => {
              updateField(fieldKey, '');
              setSearch('');
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );

  const RatingCriteriaSection = ({ conditionName }: { conditionName: string }) => {
    const criteria = getRatingCriteriaForCondition(conditionName);
    if (!criteria) return null;
    const isExpanded = expandedRating === criteria.conditionId;

    return (
      <Card className="border-muted bg-muted/20">
        <CardHeader
          className="pb-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onClick={() => setExpandedRating(isExpanded ? null : criteria.conditionId)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedRating(isExpanded ? null : criteria.conditionId); } }}
          tabIndex={0}
          role="button"
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${criteria.conditionName} rating criteria`}
        >
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">{criteria.conditionName} - Rating Criteria Reference</CardTitle>
              <CardDescription className="text-xs">
                DC {criteria.diagnosticCode} | {criteria.cfrReference}
              </CardDescription>
            </div>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent className="pt-0 space-y-2">
            <p className="text-xs text-muted-foreground italic">
              Rating criteria reference (informational). VA decides ratings based on the full record.
            </p>
            {criteria.ratingLevels.map(level => (
              <div key={level.percent} className="p-2 rounded border border-border/50 bg-background">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">{level.percent}%</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{level.criteria}</p>
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm text-muted-foreground">
                Select the condition(s) you want to organize information for. You can select a primary condition, a secondary condition, or both. All selections are optional to start.
              </p>
            </div>

            {renderConditionSearch(
              'Primary Condition',
              primarySearch,
              setPrimarySearch,
              showPrimaryDropdown,
              setShowPrimaryDropdown,
              filteredPrimary,
              'primaryCondition',
              formData.primaryCondition,
            )}

            {renderConditionSearch(
              'Secondary Condition',
              secondarySearch,
              setSecondarySearch,
              showSecondaryDropdown,
              setShowSecondaryDropdown,
              filteredSecondary,
              'secondaryCondition',
              formData.secondaryCondition,
            )}

            {hasPrimary && <RatingCriteriaSection conditionName={formData.primaryCondition} />}
            {hasSecondary && <RatingCriteriaSection conditionName={formData.secondaryCondition} />}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Veteran's Full Name</Label>
                <Input
                  value={formData.veteranName}
                  onChange={(e) => updateField('veteranName', e.target.value)}
                  placeholder="Full legal name"
                />
              </div>
              <div className="space-y-2">
                <Label>Branch of Service</Label>
                <Input
                  value={formData.branchOfService}
                  onChange={(e) => updateField('branchOfService', e.target.value)}
                  placeholder="e.g. U.S. Army"
                />
              </div>
              <div className="space-y-2">
                <Label>MOS / Job Code</Label>
                <Input
                  value={formData.mosOrJobCode}
                  onChange={(e) => updateField('mosOrJobCode', e.target.value)}
                  placeholder="e.g. 11B, 2T2X1"
                />
              </div>
              <div className="space-y-2">
                <Label>Service Start Date <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Input
                  type="date"
                  value={formData.serviceStartDate}
                  onChange={(e) => updateField('serviceStartDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Service End Date <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Input
                  type="date"
                  value={formData.serviceEndDate}
                  onChange={(e) => updateField('serviceEndDate', e.target.value)}
                />
              </div>
            </div>

            {hasPrimary && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Service History Context (Patient-Reported)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Describe events, incidents, and timeline from service related to {formData.primaryCondition}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>In-service event or incident details <span className="text-muted-foreground font-normal">(optional)</span></Label>
                    <Textarea
                      value={formData.inServiceEvent}
                      onChange={(e) => updateField('inServiceEvent', e.target.value)}
                      placeholder="Describe what happened during service..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Onset timeline <span className="text-muted-foreground font-normal">(optional)</span></Label>
                    <Textarea
                      value={formData.onsetTimeline}
                      onChange={(e) => updateField('onsetTimeline', e.target.value)}
                      placeholder="When did symptoms first begin? During service or after?"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Continuity of symptoms <span className="text-muted-foreground font-normal">(optional)</span></Label>
                    <Textarea
                      value={formData.continuityDescription}
                      onChange={(e) => updateField('continuityDescription', e.target.value)}
                      placeholder="How have symptoms continued from service to present?"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Relevant duty / MOS context <span className="text-muted-foreground font-normal">(optional)</span></Label>
                    <Textarea
                      value={formData.dutyContext}
                      onChange={(e) => updateField('dutyContext', e.target.value)}
                      placeholder="How did your duties relate to this condition?"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {hasSecondary && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Relationship Context (Patient-Reported)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Describe how {formData.secondaryCondition} relates to your experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Symptom timing <span className="text-muted-foreground font-normal">(optional)</span></Label>
                    <Textarea
                      value={formData.symptomTiming}
                      onChange={(e) => updateField('symptomTiming', e.target.value)}
                      placeholder="When did these symptoms begin relative to your primary condition?"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Medication effects <span className="text-muted-foreground font-normal">(optional)</span></Label>
                    <Textarea
                      value={formData.medicationEffects}
                      onChange={(e) => updateField('medicationEffects', e.target.value)}
                      placeholder="Any medications for one condition that affect the other?"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Flare patterns <span className="text-muted-foreground font-normal">(optional)</span></Label>
                    <Textarea
                      value={formData.flarePatterns}
                      onChange={(e) => updateField('flarePatterns', e.target.value)}
                      placeholder="Do flare-ups of one condition worsen the other?"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Functional interplay <span className="text-muted-foreground font-normal">(optional)</span></Label>
                    <Textarea
                      value={formData.functionalInterplay}
                      onChange={(e) => updateField('functionalInterplay', e.target.value)}
                      placeholder="How do these conditions interact in daily life?"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Worsening Over Time (Patient-Reported)</CardTitle>
                <CardDescription className="text-xs">
                  Optional: Describe changes in symptoms over time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Baseline symptoms (when first noticed) <span className="text-muted-foreground font-normal">(optional)</span></Label>
                  <Textarea
                    value={formData.baselineSymptoms}
                    onChange={(e) => updateField('baselineSymptoms', e.target.value)}
                    placeholder="What were your symptoms like when they started?"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Current symptoms <span className="text-muted-foreground font-normal">(optional)</span></Label>
                  <Textarea
                    value={formData.currentSymptoms}
                    onChange={(e) => updateField('currentSymptoms', e.target.value)}
                    placeholder="What are your symptoms like now?"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>How symptoms have worsened over time <span className="text-muted-foreground font-normal">(optional)</span></Label>
                  <Textarea
                    value={formData.worseningOverTime}
                    onChange={(e) => updateField('worseningOverTime', e.target.value)}
                    placeholder="Describe progression..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Exposures (Patient-Reported)</CardTitle>
                <CardDescription className="text-xs">Select any exposures during service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {EXPOSURE_OPTIONS.map(exposure => (
                    <button
                      key={exposure}
                      type="button"
                      onClick={() => toggleExposure(exposure)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs border transition-colors',
                        formData.exposures.includes(exposure)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                      )}
                    >
                      {formData.exposures.includes(exposure) && <Check className="h-3 w-3 inline mr-1" />}
                      {exposure}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={formData.customExposure}
                    onChange={(e) => updateField('customExposure', e.target.value)}
                    placeholder="Other exposure..."
                    onKeyDown={(e) => e.key === 'Enter' && addCustomExposure()}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addCustomExposure}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.exposures.filter(e => !EXPOSURE_OPTIONS.includes(e)).map(custom => (
                  <Badge key={custom} variant="secondary" className="mr-1">
                    {custom}
                    <button type="button" onClick={() => toggleExposure(custom)} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Evidence References</CardTitle>
                <CardDescription className="text-xs">
                  List records, documents, and evidence you want the clinician to be aware of
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.evidenceReferences.map((ref) => (
                  <div key={ref.id} className="p-3 rounded-lg border border-border space-y-2">
                    <div className="flex justify-between items-start">
                      <select
                        value={ref.type}
                        onChange={(e) => updateEvidenceReference(ref.id, 'type', e.target.value)}
                        className="text-sm bg-background border border-border rounded px-2 py-1 max-w-full"
                      >
                        <option value="">Select type...</option>
                        {EVIDENCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <button type="button" onClick={() => removeEvidenceReference(ref.id)}>
                        <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      <Input
                        type="date"
                        value={ref.date}
                        onChange={(e) => updateEvidenceReference(ref.id, 'date', e.target.value)}
                        placeholder="Date"
                      />
                      <Input
                        value={ref.provider}
                        onChange={(e) => updateEvidenceReference(ref.id, 'provider', e.target.value)}
                        placeholder="Provider / Source"
                      />
                      <Input
                        value={ref.title}
                        onChange={(e) => updateEvidenceReference(ref.id, 'title', e.target.value)}
                        placeholder="Description / Title"
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addEvidenceReference} className="w-full gap-2">
                  <Plus className="h-4 w-4" /> Add Evidence Reference
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm">Personal Statement Outline (Patient-Prepared)</CardTitle>
                    <CardDescription className="text-xs">
                      Optional prompts to help you organize a personal statement
                    </CardDescription>
                  </div>
                  <Switch
                    checked={formData.personalStatementEnabled}
                    onCheckedChange={(v) => updateField('personalStatementEnabled', v)}
                  />
                </div>
              </CardHeader>
              {formData.personalStatementEnabled && (
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Timeline of condition <span className="text-muted-foreground font-normal">(when it started, key dates)</span></Label>
                    <Textarea
                      value={formData.personalStatementTimeline}
                      onChange={(e) => updateField('personalStatementTimeline', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Frequency and severity of symptoms</Label>
                    <Textarea
                      value={formData.personalStatementFrequency}
                      onChange={(e) => updateField('personalStatementFrequency', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Functional impact on daily life</Label>
                    <Textarea
                      value={formData.personalStatementFunctionalImpact}
                      onChange={(e) => updateField('personalStatementFunctionalImpact', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Treatment response</Label>
                    <Textarea
                      value={formData.personalStatementTreatmentResponse}
                      onChange={(e) => updateField('personalStatementTreatmentResponse', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Triggers</Label>
                    <Textarea
                      value={formData.personalStatementTriggers}
                      onChange={(e) => updateField('personalStatementTriggers', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Missed work / accommodations</Label>
                    <Textarea
                      value={formData.personalStatementMissedWork}
                      onChange={(e) => updateField('personalStatementMissedWork', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Dated examples</Label>
                    <Textarea
                      value={formData.personalStatementExamples}
                      onChange={(e) => updateField('personalStatementExamples', e.target.value)}
                      rows={2}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Current Symptoms and Functional Impact (Patient-Reported)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current symptoms <span className="text-muted-foreground font-normal">(optional)</span></Label>
                  <Textarea
                    value={formData.currentSymptomsDetail}
                    onChange={(e) => updateField('currentSymptomsDetail', e.target.value)}
                    placeholder="Describe your current symptoms..."
                    rows={3}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Frequency <span className="text-muted-foreground font-normal">(optional)</span></Label>
                    <Input
                      value={formData.symptomFrequency}
                      onChange={(e) => updateField('symptomFrequency', e.target.value)}
                      placeholder="e.g. Daily, 3x per week"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Severity <span className="text-muted-foreground font-normal">(optional)</span></Label>
                    <Input
                      value={formData.symptomSeverity}
                      onChange={(e) => updateField('symptomSeverity', e.target.value)}
                      placeholder="e.g. Moderate, 7/10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Triggers <span className="text-muted-foreground font-normal">(optional)</span></Label>
                  <Input
                    value={formData.symptomTriggers}
                    onChange={(e) => updateField('symptomTriggers', e.target.value)}
                    placeholder="What makes symptoms worse?"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Current medications <span className="text-muted-foreground font-normal">(optional)</span></Label>
                  <Textarea
                    value={formData.currentMedications}
                    onChange={(e) => updateField('currentMedications', e.target.value)}
                    placeholder="List current medications and dosages..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Medication response <span className="text-muted-foreground font-normal">(optional)</span></Label>
                  <Textarea
                    value={formData.medicationResponse}
                    onChange={(e) => updateField('medicationResponse', e.target.value)}
                    placeholder="How well do your treatments work?"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Functional impact <span className="text-muted-foreground font-normal">(optional)</span></Label>
                  <Textarea
                    value={formData.functionalImpact}
                    onChange={(e) => updateField('functionalImpact', e.target.value)}
                    placeholder="How does this condition affect your daily activities, work, and relationships?"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Clinician Documentation Prompts (Optional)</CardTitle>
                <CardDescription className="text-xs">
                  These are neutral questions your clinician may consider documenting during the visit. No conclusions are provided.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                  <li>What objective findings were observed during examination?</li>
                  <li>What diagnostic testing or imaging has been performed?</li>
                  <li>How frequently do symptoms occur based on clinical records?</li>
                  <li>What is the functional impact observed or reported?</li>
                  <li>How has the veteran responded to treatment?</li>
                  <li>Are there differential diagnostic considerations?</li>
                  <li>What is the current clinical status compared to prior visits?</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/30">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-5 w-5 text-primary" />
                  <span className="font-medium">Review Your Outline</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Review the information below before exporting. The PDF will be a structured outline labeled as patient-prepared. A clinician must independently evaluate and author any medical statements.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4 text-sm">
              <ReviewSection title="Veteran and Service Details">
                <ReviewField label="Name" value={formData.veteranName} />
                <ReviewField label="Branch" value={formData.branchOfService} />
                <ReviewField label="MOS / Job Code" value={formData.mosOrJobCode} />
                <ReviewField label="Service Dates" value={
                  formData.serviceStartDate && formData.serviceEndDate
                    ? `${safeFormatDate(formData.serviceStartDate)} - ${safeFormatDate(formData.serviceEndDate)}`
                    : ''
                } />
              </ReviewSection>

              <ReviewSection title="Conditions Selected">
                {hasPrimary && <ReviewField label="Primary" value={formData.primaryCondition} />}
                {hasSecondary && <ReviewField label="Secondary" value={formData.secondaryCondition} />}
              </ReviewSection>

              {(formData.inServiceEvent || formData.onsetTimeline || formData.continuityDescription || formData.dutyContext) && (
                <ReviewSection title="Service History Context (Patient-Reported)">
                  <ReviewField label="In-service event" value={formData.inServiceEvent} />
                  <ReviewField label="Onset timeline" value={formData.onsetTimeline} />
                  <ReviewField label="Continuity" value={formData.continuityDescription} />
                  <ReviewField label="Duty context" value={formData.dutyContext} />
                </ReviewSection>
              )}

              {(formData.symptomTiming || formData.medicationEffects || formData.flarePatterns || formData.functionalInterplay) && (
                <ReviewSection title="Relationship Context (Patient-Reported)">
                  <ReviewField label="Symptom timing" value={formData.symptomTiming} />
                  <ReviewField label="Medication effects" value={formData.medicationEffects} />
                  <ReviewField label="Flare patterns" value={formData.flarePatterns} />
                  <ReviewField label="Functional interplay" value={formData.functionalInterplay} />
                </ReviewSection>
              )}

              {(formData.baselineSymptoms || formData.currentSymptoms || formData.worseningOverTime) && (
                <ReviewSection title="Worsening Over Time (Patient-Reported)">
                  <ReviewField label="Baseline" value={formData.baselineSymptoms} />
                  <ReviewField label="Current" value={formData.currentSymptoms} />
                  <ReviewField label="Progression" value={formData.worseningOverTime} />
                </ReviewSection>
              )}

              {formData.exposures.length > 0 && (
                <ReviewSection title="Exposures (Patient-Reported)">
                  <div className="flex flex-wrap gap-1">
                    {formData.exposures.map(e => <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>)}
                  </div>
                </ReviewSection>
              )}

              {(formData.currentSymptomsDetail || formData.functionalImpact) && (
                <ReviewSection title="Current Symptoms and Functional Impact (Patient-Reported)">
                  <ReviewField label="Symptoms" value={formData.currentSymptomsDetail} />
                  <ReviewField label="Frequency" value={formData.symptomFrequency} />
                  <ReviewField label="Severity" value={formData.symptomSeverity} />
                  <ReviewField label="Triggers" value={formData.symptomTriggers} />
                  <ReviewField label="Medications" value={formData.currentMedications} />
                  <ReviewField label="Treatment response" value={formData.medicationResponse} />
                  <ReviewField label="Functional impact" value={formData.functionalImpact} />
                </ReviewSection>
              )}

              {formData.evidenceReferences.length > 0 && (
                <ReviewSection title="Evidence References">
                  {formData.evidenceReferences.map(ref => (
                    <div key={ref.id} className="text-xs text-muted-foreground">
                      {ref.type}{ref.date ? ` (${safeFormatDate(ref.date)})` : ''}{ref.provider ? ` - ${ref.provider}` : ''}{ref.title ? `: ${ref.title}` : ''}
                    </div>
                  ))}
                </ReviewSection>
              )}

              {formData.personalStatementEnabled && (
                <ReviewSection title="Personal Statement Outline (Patient-Prepared)">
                  <ReviewField label="Timeline" value={formData.personalStatementTimeline} />
                  <ReviewField label="Frequency/Severity" value={formData.personalStatementFrequency} />
                  <ReviewField label="Functional Impact" value={formData.personalStatementFunctionalImpact} />
                  <ReviewField label="Treatment Response" value={formData.personalStatementTreatmentResponse} />
                  <ReviewField label="Triggers" value={formData.personalStatementTriggers} />
                  <ReviewField label="Missed Work" value={formData.personalStatementMissedWork} />
                  <ReviewField label="Examples" value={formData.personalStatementExamples} />
                </ReviewSection>
              )}

              <ReviewSection title="Clinician Documentation Prompts (Optional)">
                <p className="text-xs text-muted-foreground italic">
                  Included in PDF: Neutral prompts for the clinician to consider during evaluation.
                </p>
              </ReviewSection>

              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground italic">
                  DISCLAIMER: This document was prepared by the veteran to organize information for a clinical visit. It is not medical or legal advice and does not provide a medical opinion or determine service connection. A licensed clinician must independently evaluate the veteran and author any clinical statements or medical opinions.
                </p>
              </div>
            </div>

            {exportError && (
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                    <p className="text-sm text-destructive">{exportError}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button onClick={handleExport} disabled={exporting} className="w-full gap-2" size="lg">
              {exporting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
              {exporting ? 'Exporting...' : 'Export PDF Outline'}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PageContainer className="space-y-6 animate-fade-in">
      <div className="section-header">
        <div className="section-icon">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Doctor Summary Outline</h1>
          <p className="text-muted-foreground">
            Organize your information into a structured outline for your clinician visit
          </p>
        </div>
      </div>

      {draftRestored && lastSaved && (
        <DraftRestoredBanner lastSaved={lastSaved} onStartFresh={clearDraft} />
      )}

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-primary mt-0.5 shrink-0 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              This tool helps you organize facts, timelines, symptoms, and evidence references into a structured outline. A licensed clinician must independently evaluate you and author any clinical statements or medical opinions. This tool does not generate medical opinions or legal guidance.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin gap-0">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => step.id < currentStep && setCurrentStep(step.id)}
              disabled={step.id > currentStep}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg transition-all',
                currentStep === step.id
                  ? 'bg-primary text-primary-foreground'
                  : step.id < currentStep
                  ? 'bg-success/20 text-success cursor-pointer hover:bg-success/30'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <div className={cn(
                'flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
                currentStep === step.id
                  ? 'bg-primary-foreground text-primary'
                  : step.id < currentStep
                  ? 'bg-success text-white'
                  : 'bg-muted-foreground/30 text-muted-foreground'
              )}>
                {step.id < currentStep ? <Check className="h-3 w-3" /> : step.id}
              </div>
              <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
            </button>
            {index < STEPS.length - 1 && (
              <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {(() => {
              const StepIcon = STEPS[currentStep - 1].icon;
              return <StepIcon className="h-5 w-5 text-primary" />;
            })()}
            Step {currentStep}: {STEPS[currentStep - 1].title}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && 'Select conditions to organize information for'}
            {currentStep === 2 && 'Provide context about your service and conditions'}
            {currentStep === 3 && 'Add evidence references, exposures, and personal statement outline'}
            {currentStep === 4 && 'Describe your current symptoms and functional impact'}
            {currentStep === 5 && 'Review your outline and export as PDF'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => prev - 1)}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        {currentStep < 5 ? (
          <Button
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={!canProceed()}
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </PageContainer>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-3 rounded-lg border border-border">
      <h3 className="font-semibold text-sm mb-2">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function ReviewField({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="text-xs">
      <span className="text-muted-foreground">{label}:</span>{' '}
      <span className="text-foreground">{value}</span>
    </div>
  );
}
