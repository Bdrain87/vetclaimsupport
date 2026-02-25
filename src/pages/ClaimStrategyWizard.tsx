import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Wand2,
  ChevronRight,
  ChevronLeft,
  Shield,
  Activity,
  FileText,
  Sparkles,
  User,
  AlertCircle,
  CheckCircle2,
  Info,
  Loader2,
  TrendingUp,
  Target,
  Clock,
  Lightbulb,
  Download,
  RefreshCw,
  Scale,
  Link2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { sanitizePHI } from '@/utils/phiSanitizer';
import { exportClaimStrategy } from '@/utils/pdfExport';
import { useClaims } from '@/hooks/useClaims';
import { PageContainer } from '@/components/PageContainer';
import { AIDisclaimer } from '@/components/ui/AIDisclaimer';
import { AIContentBadge } from '@/components/ui/AIContentBadge';
import { useProfileStore } from '@/store/useProfileStore';
import { useFeatureFlag } from '@/store/useFeatureFlagStore';
import { getAllBranchLabels } from '@/utils/veteranProfile';

interface ServiceInfo {
  branch: string;
  startDate: string;
  endDate: string;
  deployments: string;
  combatZones: string[];
  mos: string;
}

interface HealthConditions {
  conditions: string[];
  customConditions: string;
  primaryConcern: string;
}

interface ExistingRatings {
  hasExisting: boolean;
  currentRating: string;
  ratedConditions: string;
}

interface EvidenceAvailable {
  hasMedicalRecords: boolean;
  hasServiceRecords: boolean;
  hasBuddyStatements: boolean;
  hasDoctorSummary: boolean;
  hasPrivateMedical: boolean;
  evidenceNotes: string;
}

interface WizardData {
  serviceInfo: ServiceInfo;
  healthConditions: HealthConditions;
  existingRatings: ExistingRatings;
  evidence: EvidenceAvailable;
}

interface StrategyResult {
  summary: string;
  filingType: string;
  priorityConditions: Array<{
    condition: string;
    reason: string;
    estimatedRating: string;
  }>;
  evidenceGaps: string[];
  timeline: string;
  nextSteps: string[];
  warnings: string[];
}

const initialData: WizardData = {
  serviceInfo: {
    branch: '',
    startDate: '',
    endDate: '',
    deployments: '',
    combatZones: [],
    mos: '',
  },
  healthConditions: {
    conditions: [],
    customConditions: '',
    primaryConcern: '',
  },
  existingRatings: {
    hasExisting: false,
    currentRating: '0',
    ratedConditions: '',
  },
  evidence: {
    hasMedicalRecords: false,
    hasServiceRecords: false,
    hasBuddyStatements: false,
    hasDoctorSummary: false,
    hasPrivateMedical: false,
    evidenceNotes: '',
  },
};

const steps = [
  { id: 1, title: 'Service Info', icon: User, description: 'Your military service details' },
  { id: 2, title: 'Health Conditions', icon: Activity, description: 'Current conditions you want to claim' },
  { id: 3, title: 'Existing Ratings', icon: Shield, description: 'Any current VA ratings' },
  { id: 4, title: 'Evidence', icon: FileText, description: 'Documentation you have available' },
  { id: 5, title: 'Plan', icon: Sparkles, description: 'Your personalized claim preparation plan' },
];

const commonConditions = [
  'PTSD', 'Depression', 'Anxiety', 'Tinnitus', 'Hearing Loss',
  'Lower Back Pain', 'Knee Condition', 'Neck Pain', 'Shoulder Condition',
  'Migraines', 'Sleep Apnea', 'TBI', 'GERD', 'Hypertension',
  'Radiculopathy', 'Plantar Fasciitis', 'Hip Condition', 'Ankle Condition',
  'Sinusitis', 'Allergic Rhinitis', 'Asthma', 'Erectile Dysfunction',
  'Diabetes', 'Peripheral Neuropathy', 'Scars', 'Skin Condition',
];

// Common secondary conditions linked to primary conditions
const secondaryConditionsMap: Record<string, { secondary: string; link: string }[]> = {
  'PTSD': [
    { secondary: 'Depression', link: 'Commonly co-occurs with PTSD and may be rated separately' },
    { secondary: 'Insomnia', link: 'Sleep disturbance secondary to PTSD is well-established' },
    { secondary: 'Migraines', link: 'Tension headaches frequently secondary to PTSD/stress' },
    { secondary: 'GERD', link: 'Stress-related gastrointestinal issues linked to mental health conditions' },
    { secondary: 'Erectile Dysfunction', link: 'Often secondary to PTSD medications (SSRIs)' },
  ],
  'Depression': [
    { secondary: 'Insomnia', link: 'Sleep difficulties commonly co-occur with depression' },
    { secondary: 'GERD', link: 'Stress-induced digestive issues' },
    { secondary: 'Erectile Dysfunction', link: 'Side effect of antidepressant medications' },
  ],
  'Lower Back Pain': [
    { secondary: 'Radiculopathy', link: 'Nerve root compression from spinal condition' },
    { secondary: 'Peripheral Neuropathy', link: 'Nerve damage secondary to spinal pathology' },
    { secondary: 'Hip Condition', link: 'Altered gait from back pain causes hip deterioration' },
    { secondary: 'Knee Condition', link: 'Compensatory weight-bearing changes affect knees' },
    { secondary: 'Erectile Dysfunction', link: 'Nerve damage or pain medication side effect' },
  ],
  'Knee Condition': [
    { secondary: 'Hip Condition', link: 'Altered gait and compensatory biomechanics' },
    { secondary: 'Lower Back Pain', link: 'Changed movement patterns stress the lumbar spine' },
    { secondary: 'Ankle Condition', link: 'Compensatory gait changes affect ankle joints' },
  ],
  'Sleep Apnea': [
    { secondary: 'Hypertension', link: 'Sleep apnea is a well-known cause of secondary hypertension' },
    { secondary: 'Depression', link: 'Chronic sleep disruption contributes to depression' },
    { secondary: 'GERD', link: 'Apneic events increase acid reflux' },
    { secondary: 'Migraines', link: 'Morning headaches from oxygen desaturation during sleep' },
  ],
  'Migraines': [
    { secondary: 'Depression', link: 'Chronic pain and disability from migraines' },
    { secondary: 'Insomnia', link: 'Pain disrupts sleep patterns' },
  ],
  'Tinnitus': [
    { secondary: 'Insomnia', link: 'Ringing prevents ability to fall/stay asleep' },
    { secondary: 'Depression', link: 'Chronic tinnitus associated with depressive episodes' },
    { secondary: 'Migraines', link: 'Auditory disturbance triggering headaches' },
  ],
  'TBI': [
    { secondary: 'Migraines', link: 'Post-traumatic headaches are very common after TBI' },
    { secondary: 'Depression', link: 'Mood changes secondary to brain injury' },
    { secondary: 'Tinnitus', link: 'Auditory nerve damage from blast/impact injury' },
    { secondary: 'Insomnia', link: 'Sleep disturbance from neurological disruption' },
    { secondary: 'Vertigo', link: 'Vestibular damage from traumatic brain injury' },
  ],
  'Diabetes': [
    { secondary: 'Peripheral Neuropathy', link: 'Nerve damage from chronic elevated blood sugar' },
    { secondary: 'Hypertension', link: 'Vascular damage associated with diabetes' },
    { secondary: 'Erectile Dysfunction', link: 'Vascular and nerve damage from diabetes' },
  ],
  'Hypertension': [
    { secondary: 'Heart Condition', link: 'Chronic hypertension leads to cardiac complications' },
  ],
  'Neck Pain': [
    { secondary: 'Radiculopathy', link: 'Cervical nerve root compression' },
    { secondary: 'Migraines', link: 'Cervicogenic headaches from neck pathology' },
    { secondary: 'Shoulder Condition', link: 'Compensatory changes and shared nerve pathways' },
  ],
  'Anxiety': [
    { secondary: 'Insomnia', link: 'Anxiety-driven hyperarousal disrupts sleep onset and maintenance' },
    { secondary: 'GERD', link: 'Stress and anxiety increase gastric acid production' },
    { secondary: 'Migraines', link: 'Tension-type headaches commonly co-occur with anxiety disorders' },
    { secondary: 'Depression', link: 'Anxiety and depression frequently co-occur as comorbid conditions' },
  ],
  'Hearing Loss': [
    { secondary: 'Tinnitus', link: 'Almost always co-occurs with sensorineural hearing loss' },
    { secondary: 'Depression', link: 'Social isolation from hearing impairment linked to depression' },
  ],
  'Shoulder Condition': [
    { secondary: 'Neck Pain', link: 'Shared cervical nerve pathways and compensatory posture changes' },
    { secondary: 'Radiculopathy', link: 'Nerve impingement radiating from cervical spine to shoulder' },
  ],
  'Hip Condition': [
    { secondary: 'Lower Back Pain', link: 'Altered biomechanics from hip dysfunction stress the lumbar spine' },
    { secondary: 'Knee Condition', link: 'Compensatory gait changes transfer stress to the knee' },
  ],
  'Ankle Condition': [
    { secondary: 'Knee Condition', link: 'Altered gait from ankle instability impacts knee joints' },
    { secondary: 'Plantar Fasciitis', link: 'Ankle dysfunction changes foot mechanics and weight distribution' },
  ],
  'Radiculopathy': [
    { secondary: 'Peripheral Neuropathy', link: 'Chronic nerve root compression leads to distal nerve damage' },
  ],
  'GERD': [
    { secondary: 'Asthma', link: 'Acid reflux can trigger or worsen asthma symptoms (reflux-induced bronchoconstriction)' },
    { secondary: 'Sinusitis', link: 'Acid reflux reaching the nasopharynx contributes to chronic sinusitis' },
  ],
  'Sinusitis': [
    { secondary: 'Allergic Rhinitis', link: 'Chronic nasal inflammation and shared mucosal pathway' },
    { secondary: 'Migraines', link: 'Sinus pressure and inflammation can trigger migraine episodes' },
  ],
  'Asthma': [
    { secondary: 'GERD', link: 'Bronchodilator medications and hyperinflation worsen acid reflux' },
    { secondary: 'Sinusitis', link: 'Shared airway inflammation and nasal-bronchial reflex' },
  ],
};

const combatZones = [
  'Vietnam', 'Iraq (OIF)', 'Afghanistan (OEF)', 'Persian Gulf', 'Korea (DMZ)',
  'Somalia', 'Bosnia', 'Kosovo', 'Syria', 'Other',
];

const branches = ['Army', 'Navy', 'Air Force', 'Marine Corps', 'Coast Guard', 'Space Force'];

export default function ClaimStrategyWizard() {
  const { data: claimsData } = useClaims();
  const profile = useProfileStore();
  const branchLabel = getAllBranchLabels(profile);

  // Pre-populate from stored data
  const prePopulated = useMemo<WizardData>(() => {
    const conditionNames = (claimsData.claimConditions || []).map(c => c.name);
    const deploymentLocations = (claimsData.deployments || []).map(d => d.location).filter(Boolean);
    const hasBuddy = (claimsData.buddyContacts || []).length > 0;
    const hasUploaded = (claimsData.uploadedDocuments || []).length > 0;
    const hasMedVisits = (claimsData.medicalVisits || []).length > 0;

    return {
      serviceInfo: {
        branch: branchLabel || initialData.serviceInfo.branch,
        startDate: profile.serviceDates?.start || initialData.serviceInfo.startDate,
        endDate: profile.serviceDates?.end || initialData.serviceInfo.endDate,
        deployments: deploymentLocations.join(', ') || initialData.serviceInfo.deployments,
        combatZones: (claimsData.combatHistory || []).map(c => c.location).filter(Boolean),
        mos: profile.mosTitle || profile.mosCode || initialData.serviceInfo.mos,
      },
      healthConditions: {
        conditions: conditionNames.length > 0 ? conditionNames : initialData.healthConditions.conditions,
        customConditions: initialData.healthConditions.customConditions,
        primaryConcern: conditionNames[0] || initialData.healthConditions.primaryConcern,
      },
      existingRatings: {
        hasExisting: (claimsData.approvedConditions || []).length > 0,
        currentRating: initialData.existingRatings.currentRating,
        ratedConditions: (claimsData.approvedConditions || []).map(c => `${c.name} (${c.rating}%)`).join(', '),
      },
      evidence: {
        hasMedicalRecords: hasMedVisits,
        hasServiceRecords: hasUploaded,
        hasBuddyStatements: hasBuddy,
        hasDoctorSummary: false,
        hasPrivateMedical: hasMedVisits,
        evidenceNotes: initialData.evidence.evidenceNotes,
      },
    };
  }, [claimsData, profile, branchLabel]);

  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>(prePopulated);
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategy, setStrategy] = useState<StrategyResult | null>(null);
  const [isOfflineFallback, setIsOfflineFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const showSecondarySuggestions = useFeatureFlag('secondaryConditionSuggestions');
  const aiStrategyEnabled = useFeatureFlag('aiClaimStrategy');
  const [exportingStrategy, setExportingStrategy] = useState(false);
  const { toast } = useToast();

  // Sync form data when profile/claims load asynchronously, but only while
  // the user hasn't advanced past the first step (avoid clobbering edits).
  useEffect(() => {
    if (currentStep === 1) {
      setData(prePopulated);
    }
  }, [prePopulated, currentStep]);

  // Compute secondary condition suggestions based on selected conditions
  const secondarySuggestions = useMemo(() => {
    const selectedConditions = data.healthConditions.conditions;
    const suggestions: { primary: string; secondary: string; link: string }[] = [];
    const alreadyClaimed = new Set(selectedConditions.map(c => c.toLowerCase()));
    const alreadySuggested = new Set<string>();

    for (const condition of selectedConditions) {
      const secondaries = secondaryConditionsMap[condition];
      if (!secondaries) continue;
      for (const s of secondaries) {
        if (!alreadyClaimed.has(s.secondary.toLowerCase()) && !alreadySuggested.has(s.secondary.toLowerCase())) {
          alreadySuggested.add(s.secondary.toLowerCase());
          suggestions.push({ primary: condition, secondary: s.secondary, link: s.link });
        }
      }
    }
    return suggestions;
  }, [data.healthConditions.conditions]);

  const updateServiceInfo = useCallback((field: keyof ServiceInfo, value: string | string[]) => {
    setData(prev => ({
      ...prev,
      serviceInfo: { ...prev.serviceInfo, [field]: value }
    }));
  }, []);

  const updateHealthConditions = useCallback((field: keyof HealthConditions, value: string | string[]) => {
    setData(prev => ({
      ...prev,
      healthConditions: { ...prev.healthConditions, [field]: value }
    }));
  }, []);

  const toggleCondition = useCallback((condition: string) => {
    setData(prev => {
      const current = prev.healthConditions.conditions;
      const updated = current.includes(condition)
        ? current.filter(c => c !== condition)
        : [...current, condition];
      return {
        ...prev,
        healthConditions: { ...prev.healthConditions, conditions: updated }
      };
    });
  }, []);

  const toggleCombatZone = useCallback((zone: string) => {
    setData(prev => {
      const current = prev.serviceInfo.combatZones;
      const updated = current.includes(zone)
        ? current.filter(z => z !== zone)
        : [...current, zone];
      return {
        ...prev,
        serviceInfo: { ...prev.serviceInfo, combatZones: updated }
      };
    });
  }, []);

  const updateExistingRatings = useCallback((field: keyof ExistingRatings, value: boolean | string) => {
    setData(prev => ({
      ...prev,
      existingRatings: { ...prev.existingRatings, [field]: value }
    }));
  }, []);

  const updateEvidence = useCallback((field: keyof EvidenceAvailable, value: boolean | string) => {
    setData(prev => ({
      ...prev,
      evidence: { ...prev.evidence, [field]: value }
    }));
  }, []);

  const generateStrategy = async () => {
    setIsGenerating(true);
    setError(null);

    const prompt = `You are a VA disability claims preparation assistant. Based on the following veteran's information, provide a comprehensive claim preparation plan.

VETERAN INFORMATION:
- Branch: ${data.serviceInfo.branch}
- Service Dates: ${data.serviceInfo.startDate} to ${data.serviceInfo.endDate}
- MOS/Rate: ${data.serviceInfo.mos}
- Deployments: ${data.serviceInfo.deployments}
- Combat Zones: ${data.serviceInfo.combatZones.join(', ') || 'None specified'}

CONDITIONS TO CLAIM:
${data.healthConditions.conditions.join(', ')}
${data.healthConditions.customConditions ? `Additional conditions: ${data.healthConditions.customConditions}` : ''}
Primary concern: ${data.healthConditions.primaryConcern}

EXISTING VA RATINGS:
${data.existingRatings.hasExisting ? `Current combined rating: ${data.existingRatings.currentRating}%` : 'No existing ratings'}
${data.existingRatings.ratedConditions ? `Currently rated for: ${data.existingRatings.ratedConditions}` : ''}

EVIDENCE AVAILABLE:
- Service treatment records: ${data.evidence.hasServiceRecords ? 'Yes' : 'No'}
- VA/Military medical records: ${data.evidence.hasMedicalRecords ? 'Yes' : 'No'}
- Private medical records: ${data.evidence.hasPrivateMedical ? 'Yes' : 'No'}
- Buddy statements: ${data.evidence.hasBuddyStatements ? 'Yes' : 'No'}
- Doctor summary/nexus letter(s): ${data.evidence.hasDoctorSummary ? 'Yes' : 'No'}
${data.evidence.evidenceNotes ? `Notes: ${data.evidence.evidenceNotes}` : ''}

Provide a strategic claim analysis in the following JSON format:
{
  "summary": "2-3 sentence overview of the recommended approach",
  "filingType": "BDD/Standard/Supplemental/Increase - explain which and why",
  "priorityConditions": [
    {"condition": "name", "reason": "why prioritize this", "estimatedRating": "X-Y%"}
  ],
  "evidenceGaps": ["list of missing evidence items needed"],
  "timeline": "realistic timeline for filing and decision",
  "nextSteps": ["ordered list of immediate actions to take"],
  "warnings": ["any cautions or things to be aware of"]
}

Consider:
- Presumptive conditions based on service era/location
- Secondary conditions that could be claimed
- Anti-pyramiding rules
- Evidence requirements for each condition
- Strongest claims to prioritize
- PACT Act benefits if applicable`;

    try {
      if (!aiStrategyEnabled) {
        throw new Error('AI strategy generation is disabled');
      }

      // Ensure we have a valid session (refresh or anonymous sign-in)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Try refreshing first (handles expired access token with valid refresh token)
        const { data: refreshed } = await supabase.auth.refreshSession();
        if (!refreshed.session) {
          const { error: anonError } = await supabase.auth.signInAnonymously();
          if (anonError) {
            throw new Error('Unable to authenticate. Please sign in and try again.');
          }
        }
      }

      const sanitizedPrompt = sanitizePHI(prompt);
      const { data: result, error: apiError } = await supabase.functions.invoke('analyze-disabilities', {
        body: { prompt: sanitizedPrompt },
      });

      if (apiError) {
        throw new Error(apiError.message);
      }

      // Parse the response
      const responseText = result?.analysis || result?.response || '';

      // Try to parse the response as JSON — first try the whole text, then extract
      let parsed: StrategyResult | null = null;
      try {
        parsed = JSON.parse(responseText) as StrategyResult;
      } catch {
        // Response has surrounding text; extract the outermost JSON object
        const start = responseText.indexOf('{');
        const end = responseText.lastIndexOf('}');
        if (start !== -1 && end > start) {
          try {
            parsed = JSON.parse(responseText.slice(start, end + 1)) as StrategyResult;
          } catch {
            parsed = null;
          }
        }
      }
      if (parsed && parsed.summary && Array.isArray(parsed.nextSteps)) {
        setStrategy(parsed);
        setIsOfflineFallback(false);
      } else {
        setIsOfflineFallback(true);
        setStrategy({
          summary: responseText.slice(0, 500),
          filingType: 'Standard Claim - Review the full analysis for details',
          priorityConditions: data.healthConditions.conditions.map(c => ({
            condition: c,
            reason: 'Evaluate based on service connection evidence',
            estimatedRating: 'TBD'
          })),
          evidenceGaps: !data.evidence.hasDoctorSummary ? ['Doctor summary recommended'] : [],
          timeline: 'Standard processing: 3-6 months',
          nextSteps: ['Gather all medical records', 'Obtain doctor summaries', 'File claim on VA.gov'],
          warnings: ['Consult with a VSO for personalized guidance']
        });
      }
    } catch {
      setError('Unable to generate strategy. Please try again or check your connection.');
      setIsOfflineFallback(true);
      setStrategy({
        summary: 'Based on your information, you have a foundation for a VA disability claim. Review the recommendations below.',
        filingType: (() => {
          const endDate = data.serviceInfo.endDate ? new Date(data.serviceInfo.endDate) : null;
          const now = Date.now();
          const msPerDay = 24 * 60 * 60 * 1000;
          if (endDate && endDate.getTime() > now && endDate.getTime() <= now + 180 * msPerDay) {
            return 'Benefits Delivery at Discharge (BDD) - File 180-90 days before discharge';
          }
          return 'Standard Claim - File through VA.gov or with VSO assistance';
        })(),
        priorityConditions: data.healthConditions.conditions.slice(0, 5).map(c => ({
          condition: c,
          reason: 'Document service connection and current severity',
          estimatedRating: 'Depends on severity and evidence'
        })),
        evidenceGaps: [
          !data.evidence.hasServiceRecords ? 'Service treatment records' : '',
          !data.evidence.hasMedicalRecords ? 'Current medical records' : '',
          !data.evidence.hasDoctorSummary ? 'Doctor summary/nexus letter(s)' : '',
          !data.evidence.hasBuddyStatements ? 'Buddy/lay statements' : '',
        ].filter(Boolean),
        timeline: 'Typical processing: 3-6 months after submission',
        nextSteps: [
          'Request service treatment records from NPRC if not available',
          'Get current diagnoses for each condition',
          'Obtain doctor summaries connecting conditions to service',
          'Gather buddy statements from fellow service members/family',
          'File claim online at VA.gov or with VSO help'
        ],
        warnings: [
          'This is AI-generated guidance - consult with an accredited VSO or attorney',
          'Ensure all conditions have current diagnoses before filing',
          'Don\'t file without evidence - weak claims can be denied'
        ]
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    // Validate service dates before proceeding past step 1
    if (currentStep === 1) {
      const { startDate, endDate } = data.serviceInfo;
      if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        toast({ title: 'Invalid dates', description: 'Service end date cannot be before start date.', variant: 'destructive' });
        return;
      }
    }
    // Require at least one condition before proceeding past step 2
    if (currentStep === 2 && data.healthConditions.conditions.length === 0 && !data.healthConditions.customConditions.trim()) {
      toast({ title: 'No conditions selected', description: 'Select at least one condition or enter a custom condition.', variant: 'destructive' });
      return;
    }
    if (currentStep === 4) {
      generateStrategy();
    }
    setCurrentStep(prev => Math.min(5, prev + 1));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const resetWizard = () => {
    setData(prePopulated);
    setStrategy(null);
    setIsOfflineFallback(false);
    setError(null);
    setCurrentStep(1);
  };

  const downloadStrategy = async () => {
    if (!strategy) return;

    const content = `
VA DISABILITY CLAIM STRATEGY
Generated: ${new Date().toLocaleDateString()}

SUMMARY
${strategy.summary}

RECOMMENDED FILING TYPE
${strategy.filingType}

PRIORITY CONDITIONS
${strategy.priorityConditions.map((c, i) =>
  `${i + 1}. ${c.condition}
   - Why: ${c.reason}
   - Estimated Rating: ${c.estimatedRating}`
).join('\n\n')}

EVIDENCE GAPS TO ADDRESS
${strategy.evidenceGaps.map(g => `• ${g}`).join('\n')}

TIMELINE
${strategy.timeline}

NEXT STEPS
${strategy.nextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

IMPORTANT WARNINGS
${strategy.warnings.map(w => `⚠️ ${w}`).join('\n')}

---
DISCLAIMER: This strategy was generated by AI for educational purposes only.
Consult with an accredited Veterans Service Officer (VSO) or VA-accredited
attorney for official guidance on your specific claim.
    `.trim();

    setExportingStrategy(true);
    try {
      await exportClaimStrategy(content);
      toast({ title: 'Strategy downloaded as PDF', description: 'Check your downloads folder.' });
    } finally {
      setExportingStrategy(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Branch of Service</Label>
                <Select
                  value={data.serviceInfo.branch}
                  onValueChange={(v) => updateServiceInfo('branch', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(b => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>MOS/Rate/AFSC</Label>
                <Input
                  placeholder="e.g., 11B Infantry, HM Corpsman"
                  value={data.serviceInfo.mos}
                  onChange={(e) => updateServiceInfo('mos', e.target.value)}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Service Start Date</Label>
                <Input
                  type="date"
                  value={data.serviceInfo.startDate}
                  onChange={(e) => updateServiceInfo('startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Service End Date (or expected)</Label>
                <Input
                  type="date"
                  value={data.serviceInfo.endDate}
                  onChange={(e) => updateServiceInfo('endDate', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Deployments</Label>
              <Textarea
                placeholder="List your deployments with approximate dates..."
                value={data.serviceInfo.deployments}
                onChange={(e) => updateServiceInfo('deployments', e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Combat Zones (select all that apply)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {combatZones.map(zone => (
                  <div key={zone} className="flex items-center gap-2">
                    <Checkbox
                      id={`zone-${zone}`}
                      checked={data.serviceInfo.combatZones.includes(zone)}
                      onCheckedChange={() => toggleCombatZone(zone)}
                    />
                    <label htmlFor={`zone-${zone}`} className="text-sm">{zone}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Select conditions you want to claim (check all that apply)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-2 border rounded-lg">
                {commonConditions.map(condition => (
                  <div key={condition} className="flex items-center gap-2 min-w-0">
                    <Checkbox
                      id={`cond-${condition}`}
                      checked={data.healthConditions.conditions.includes(condition)}
                      onCheckedChange={() => toggleCondition(condition)}
                      className="shrink-0"
                    />
                    <label htmlFor={`cond-${condition}`} className="text-sm truncate">{condition}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Other conditions not listed above</Label>
              <Textarea
                placeholder="List any additional conditions..."
                value={data.healthConditions.customConditions}
                onChange={(e) => updateHealthConditions('customConditions', e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>What is your primary concern or goal?</Label>
              <Textarea
                placeholder="e.g., I need to reach 100% for TDIU, my back pain prevents me from working..."
                value={data.healthConditions.primaryConcern}
                onChange={(e) => updateHealthConditions('primaryConcern', e.target.value)}
                rows={3}
              />
            </div>

            {data.healthConditions.conditions.length > 0 && (
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">Selected conditions:</p>
                <div className="flex flex-wrap gap-2">
                  {data.healthConditions.conditions.map(c => (
                    <Badge key={c} variant="secondary" className="truncate max-w-full">{c}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Checkbox
                id="hasExisting"
                checked={data.existingRatings.hasExisting}
                onCheckedChange={(checked) => updateExistingRatings('hasExisting', !!checked)}
              />
              <label htmlFor="hasExisting" className="text-sm font-medium">
                I already have a VA disability rating
              </label>
            </div>

            {data.existingRatings.hasExisting && (
              <>
                <div className="space-y-2">
                  <Label>Current Combined Rating</Label>
                  <Select
                    value={data.existingRatings.currentRating}
                    onValueChange={(v) => updateExistingRatings('currentRating', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(r => (
                        <SelectItem key={r} value={r.toString()}>{r}%</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Currently rated conditions</Label>
                  <Textarea
                    placeholder="List conditions you're already rated for and their individual ratings..."
                    value={data.existingRatings.ratedConditions}
                    onChange={(e) => updateExistingRatings('ratedConditions', e.target.value)}
                    rows={4}
                  />
                </div>
              </>
            )}

            {!data.existingRatings.hasExisting && (
              <Card className="bg-primary/5 border-primary/30">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    No problem! This will be your initial claim. We'll help you strategize which
                    conditions to prioritize for the strongest initial filing.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground text-sm">
              Check all types of evidence you currently have available:
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="hasServiceRecords"
                  checked={data.evidence.hasServiceRecords}
                  onCheckedChange={(checked) => updateEvidence('hasServiceRecords', !!checked)}
                />
                <label htmlFor="hasServiceRecords" className="text-sm">
                  <span className="font-medium">Service Treatment Records (STRs)</span>
                  <p className="text-xs text-muted-foreground">Medical records from during your service</p>
                </label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="hasMedicalRecords"
                  checked={data.evidence.hasMedicalRecords}
                  onCheckedChange={(checked) => updateEvidence('hasMedicalRecords', !!checked)}
                />
                <label htmlFor="hasMedicalRecords" className="text-sm">
                  <span className="font-medium">VA Medical Records</span>
                  <p className="text-xs text-muted-foreground">Records from VA treatment after service</p>
                </label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="hasPrivateMedical"
                  checked={data.evidence.hasPrivateMedical}
                  onCheckedChange={(checked) => updateEvidence('hasPrivateMedical', !!checked)}
                />
                <label htmlFor="hasPrivateMedical" className="text-sm">
                  <span className="font-medium">Private Medical Records</span>
                  <p className="text-xs text-muted-foreground">Records from civilian doctors</p>
                </label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="hasBuddyStatements"
                  checked={data.evidence.hasBuddyStatements}
                  onCheckedChange={(checked) => updateEvidence('hasBuddyStatements', !!checked)}
                />
                <label htmlFor="hasBuddyStatements" className="text-sm">
                  <span className="font-medium">Buddy/Lay Statements</span>
                  <p className="text-xs text-muted-foreground">Written statements from witnesses</p>
                </label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="hasDoctorSummary"
                  checked={data.evidence.hasDoctorSummary}
                  onCheckedChange={(checked) => updateEvidence('hasDoctorSummary', !!checked)}
                />
                <label htmlFor="hasDoctorSummary" className="text-sm">
                  <span className="font-medium">Doctor Summary</span>
                  <p className="text-xs text-muted-foreground">Doctor's opinion connecting condition to service</p>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Additional notes about your evidence</Label>
              <Textarea
                placeholder="Any other relevant information about your documentation..."
                value={data.evidence.evidenceNotes}
                onChange={(e) => updateEvidence('evidenceNotes', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {isGenerating && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-lg font-medium">Analyzing your claim...</p>
                  <p className="text-sm text-muted-foreground">
                    Our AI is reviewing your information and developing a personalized strategy
                  </p>
                </CardContent>
              </Card>
            )}

            {error && (
              <Card className="border-warning/30 bg-warning/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Connection Issue</p>
                      <p className="text-sm text-muted-foreground">{error}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {strategy && !isGenerating && (
              <>
                {isOfflineFallback ? (
                  <Card className="border-muted bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Offline Guidance</p>
                          <p className="text-xs text-muted-foreground">
                            This strategy was generated using general VA claim rules, not AI.
                            Reconnect to the internet and retry for a personalized AI analysis.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <AIDisclaimer variant="banner" />
                )}

                <AIContentBadge timestamp={new Date().toISOString()} />

                {/* Summary */}
                <Card className="bg-primary/5 border-primary/30">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Strategy Summary
                    </h3>
                    <p className="text-muted-foreground">{strategy.summary}</p>
                  </CardContent>
                </Card>

                {/* Filing Type */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Recommended Filing Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{strategy.filingType}</p>
                  </CardContent>
                </Card>

                {/* Priority Conditions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Priority Conditions
                    </CardTitle>
                    <CardDescription>Conditions to prioritize in your claim</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {strategy.priorityConditions.map((cond, i) => (
                        <div key={i} className="p-4 rounded-lg border overflow-hidden">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="font-semibold min-w-0 break-words">{cond.condition}</span>
                            <Badge variant="outline" className="shrink-0">{cond.estimatedRating}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{cond.reason}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Secondary Condition Suggestions */}
                {showSecondarySuggestions && secondarySuggestions.length > 0 && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Link2 className="h-5 w-5 text-primary" />
                        Secondary Conditions to Consider
                      </CardTitle>
                      <CardDescription>
                        Conditions commonly linked to your claimed conditions that may qualify for secondary service connection
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {secondarySuggestions.slice(0, 8).map((s, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background/60 border border-border/50">
                            <Badge variant="secondary" className="shrink-0 mt-0.5">{s.secondary}</Badge>
                            <div className="min-w-0">
                              <p className="text-sm text-muted-foreground">{s.link}</p>
                              <p className="text-xs text-muted-foreground/70 mt-0.5">
                                Secondary to: <span className="font-medium text-foreground/70">{s.primary}</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-3 italic">
                        Secondary service connection requires a medical nexus linking the secondary condition to your service-connected primary condition.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Evidence Gaps */}
                {strategy.evidenceGaps.length > 0 && (
                  <Card className="border-warning/30">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-warning">
                        <AlertCircle className="h-5 w-5" />
                        Evidence Gaps to Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {strategy.evidenceGaps.map((gap, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-warning">•</span>
                            <span>{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Expected Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{strategy.timeline}</p>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      Next Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-2">
                      {strategy.nextSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>

                {/* Warnings */}
                {strategy.warnings.length > 0 && (
                  <Card className="border-destructive/30 bg-destructive/5">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        Important Warnings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {strategy.warnings.map((warning, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-destructive">⚠️</span>
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Research Legal Precedent */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Scale className="h-5 w-5 text-gold" />
                      Research Legal Precedent
                    </CardTitle>
                    <CardDescription>Use verified legal databases to find case law relevant to your claim</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-[rgba(212,175,55,0.08)] border border-gold/20 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        Use these verified legal databases to find case law relevant to your claim:
                      </p>
                      <div className="space-y-2 overflow-hidden">
                        <a href="https://www.va.gov/vbs/bva/" target="_blank" rel="noopener noreferrer"
                           className="flex items-center gap-2 text-gold hover:text-gold-hl text-sm break-words min-w-0">
                          Board of Veterans' Appeals (BVA) Decisions
                        </a>
                        <a href="https://www.uscourts.cavc.gov/decisions.php" target="_blank" rel="noopener noreferrer"
                           className="flex items-center gap-2 text-gold hover:text-gold-hl text-sm break-words min-w-0">
                          Court of Appeals for Veterans Claims (CAVC)
                        </a>
                        <a href="https://scholar.google.com/" target="_blank" rel="noopener noreferrer"
                           className="flex items-center gap-2 text-gold hover:text-gold-hl text-sm break-words min-w-0">
                          Google Scholar — Legal Opinions
                        </a>
                        <a href="https://www.law.cornell.edu/uscode/text/38" target="_blank" rel="noopener noreferrer"
                           className="flex items-center gap-2 text-gold hover:text-gold-hl text-sm break-words min-w-0">
                          38 U.S.C. — Veterans' Benefits (Cornell Law)
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button onClick={downloadStrategy} disabled={exportingStrategy} className="gap-2">
                    {exportingStrategy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    {exportingStrategy ? 'Exporting...' : 'Download Strategy'}
                  </Button>
                  <Button variant="outline" onClick={resetWizard} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Start Over
                  </Button>
                </div>
              </>
            )}
          </div>
        );
    }
  };

  return (
    <PageContainer className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <Wand2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Claim Preparation Wizard</h1>
          <p className="text-muted-foreground">
            Get a personalized VA disability claim preparation plan powered by AI
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center overflow-x-auto pb-2 gap-0">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isComplete = step.id < currentStep;

          return (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex flex-col items-center ${
                  isActive ? 'text-primary' : isComplete ? 'text-success' : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : isComplete
                      ? 'bg-success text-success-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {isComplete ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span className="text-xs hidden sm:block whitespace-nowrap truncate">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-16 h-0.5 mx-2 ${
                    step.id < currentStep ? 'bg-success' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
      </Card>

      {/* Navigation */}
      {currentStep < 5 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNext} className="gap-2">
            {currentStep === 4 ? (
              <>
                Generate Strategy
                <Sparkles className="h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Disclaimer */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Disclaimer</p>
              <p>
                This AI-powered tool provides educational guidance only and is not a substitute for
                professional legal or medical advice. Always consult with an accredited Veterans Service
                Officer (VSO) or VA-accredited attorney before filing your claim.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
