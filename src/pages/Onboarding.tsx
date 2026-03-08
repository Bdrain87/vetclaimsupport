import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, X, Search, Shield, User, Briefcase, Stethoscope, Check, MapPin, Plane, ClipboardList, Activity, FileText, Users, Calculator } from 'lucide-react';
import { useProfileStore, BRANCH_LABELS, BRANCH_COLORS, type Branch, type ClaimGoal } from '@/store/useProfileStore';
import { searchMilitaryJobs, getCodeTypeForBranch, type MilitaryJobCode } from '@/data/militaryMOS';
import { ConditionAutocomplete } from '@/components/shared/ConditionAutocomplete';
import { LocationAutocomplete } from '@/components/shared/LocationAutocomplete';
import { useUserConditions } from '@/hooks/useUserConditions';
import { type VACondition, getConditionById } from '@/data/vaConditions';
import { searchAllConditions } from '@/utils/conditionSearch';
import { resolveConditionId } from '@/utils/conditionResolver';
import useAppStore, { type DutyStation } from '@/store/useAppStore';
import { SuccessAnimation } from '@/components/ui/success-animation';
import { PageContainer } from '@/components/PageContainer';

const TOTAL_STEPS = 12;

const MONTHS = [
  { value: '01', label: 'Jan' }, { value: '02', label: 'Feb' }, { value: '03', label: 'Mar' },
  { value: '04', label: 'Apr' }, { value: '05', label: 'May' }, { value: '06', label: 'Jun' },
  { value: '07', label: 'Jul' }, { value: '08', label: 'Aug' }, { value: '09', label: 'Sep' },
  { value: '10', label: 'Oct' }, { value: '11', label: 'Nov' }, { value: '12', label: 'Dec' },
];
const YEARS = Array.from({ length: 80 }, (_, i) => String(new Date().getFullYear() - i));

function MonthYearPicker({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [year, month] = value ? value.split('-') : ['', ''];
  const selectClass = 'h-12 px-3 bg-white/[0.09] border border-white/[0.14] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all appearance-none';
  const handleChange = (newMonth: string, newYear: string) => {
    if (newMonth && newYear) onChange(`${newYear}-${newMonth}`);
    else if (newYear && !newMonth) onChange(`${newYear}-01`);
    else if (newMonth && !year) onChange(`${YEARS[0]}-${newMonth}`);
    else onChange('');
  };
  return (
    <div className="flex flex-col gap-1">
      {placeholder && <label className="text-white/40 text-xs">{placeholder}</label>}
      <div className="grid grid-cols-2 gap-2">
        <select value={month} onChange={e => handleChange(e.target.value, year)} className={selectClass}>
          <option value="" className="bg-[#000000]">Month</option>
          {MONTHS.map(m => <option key={m.value} value={m.value} className="bg-[#000000]">{m.label}</option>)}
        </select>
        <select value={year} onChange={e => handleChange(month, e.target.value)} className={selectClass}>
          <option value="" className="bg-[#000000]">Year</option>
          {YEARS.map(y => <option key={y} value={y} className="bg-[#000000]">{y}</option>)}
        </select>
      </div>
    </div>
  );
}

const BRANCH_TO_MOS: Record<Branch, string> = {
  army: 'Army',
  marines: 'Marines',
  navy: 'Navy',
  air_force: 'Air Force',
  coast_guard: 'Coast Guard',
  space_force: 'Space Force',
};


const OPERATIONS = [
  'Operation Iraqi Freedom (OIF)',
  'Operation Enduring Freedom (OEF)',
  'Operation New Dawn (OND)',
  'Operation Inherent Resolve (OIR)',
  "Operation Freedom's Sentinel (OFS)",
  'Desert Shield/Desert Storm',
  'Vietnam',
  'Korea',
  'Other',
];

// --- MOS Autocomplete ---
function MOSAutocomplete({
  branch,
  onSelect,
  value,
}: {
  branch: Branch;
  onSelect: (job: MilitaryJobCode) => void;
  value: string;
}) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLButtonElement>(null);

  const mosBranch = BRANCH_TO_MOS[branch];

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchMilitaryJobs(query, mosBranch).slice(0, 20);
  }, [query, mosBranch]);

  useEffect(() => {
    if (results.length > 0 && query.trim()) {
      setIsOpen(true);
      setHighlightIdx(0);
    } else {
      setIsOpen(false);
    }
  }, [results, query]);

  useEffect(() => {
    highlightRef.current?.scrollIntoView({ block: 'nearest' });
  }, [highlightIdx]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (job: MilitaryJobCode) => {
    onSelect(job);
    setQuery(`${job.code} — ${job.title}`);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightIdx(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightIdx(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[highlightIdx]) handleSelect(results[highlightIdx]);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => { if (results.length > 0) setIsOpen(true); }}
        onKeyDown={handleKeyDown}
        placeholder="Type your code or job title..."
        className="w-full h-12 pl-10 pr-4 bg-white/[0.09] border border-white/[0.14] rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/50 transition-all"
      />
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-[#111111] border border-white/[0.14] rounded-xl shadow-2xl shadow-black/50 max-h-60 overflow-y-auto">
          {results.map((job, i) => (
            <button
              key={`${job.code}-${job.branch}`}
              ref={i === highlightIdx ? highlightRef : undefined}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                i === highlightIdx ? 'bg-gold/15 text-white' : 'text-white/80 hover:bg-white/5'
              } ${i > 0 ? 'border-t border-white/[0.04]' : ''}`}
              onClick={() => handleSelect(job)}
              onMouseEnter={() => setHighlightIdx(i)}
            >
              <span className="font-mono text-gold text-sm font-bold w-16 shrink-0">{job.code}</span>
              <span className="text-sm flex-1 truncate">{job.title}</span>
              <span className="text-[10px] text-white/30 uppercase">{job.branch}</span>
            </button>
          ))}
        </div>
      )}
      {!isOpen && query.trim().length > 1 && results.length === 0 && (
        <p className="text-white/40 text-xs mt-2">No results found. Try a different search or use &ldquo;I don&apos;t see my job&rdquo; below.</p>
      )}
    </div>
  );
}


// --- Main Onboarding ---
export default function Onboarding() {
  const navigate = useNavigate();
  const profileStore = useProfileStore();
  const appStore = useAppStore();
  const { addCondition, removeCondition, conditions: userConditions } = useUserConditions();

  const savedProgress = useRef(() => {
    try {
      const raw = localStorage.getItem('vcs_onboarding_progress');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const cached = savedProgress.current();

  const [step, setStep] = useState(cached?.step ?? 0);
  const [firstName, setFirstName] = useState(cached?.firstName ?? profileStore.firstName);
  const [lastName, setLastName] = useState(cached?.lastName ?? profileStore.lastName);
  const [branch, setBranch] = useState<Branch | ''>(cached?.branch ?? profileStore.branch);
  const [selectedBranches, setSelectedBranches] = useState<Branch[]>(
    cached?.selectedBranches ?? (profileStore.branch ? [profileStore.branch] : [])
  );
  const [mosCode, setMosCode] = useState(cached?.mosCode ?? profileStore.mosCode);
  const [mosTitle, setMosTitle] = useState(cached?.mosTitle ?? profileStore.mosTitle);
  const [addedConditions, setAddedConditions] = useState<string[]>(cached?.addedConditions ?? []);
  const [claimGoal, setClaimGoal] = useState<ClaimGoal | ''>(cached?.claimGoal ?? '');
  const [nameError, setNameError] = useState('');
  const [showManualMOS, setShowManualMOS] = useState(false);
  const [manualCode, setManualCode] = useState(cached?.manualCode ?? '');
  const [manualTitle, setManualTitle] = useState(cached?.manualTitle ?? '');

  // Duty Stations
  const [dutyStations, setDutyStations] = useState<Omit<DutyStation, 'id'>[]>([]);
  const [showStationForm, setShowStationForm] = useState(false);
  const [stationBase, setStationBase] = useState('');
  const [stationStart, setStationStart] = useState('');
  const [stationEnd, setStationEnd] = useState('');

  // Deployments
  const [deployments, setDeployments] = useState<Array<{
    operationName: string;
    location: string;
    startDate: string;
    endDate: string;
    combatDeployment: boolean;
  }>>([]);
  const [showDeployForm, setShowDeployForm] = useState(false);
  const [deployOp, setDeployOp] = useState('');
  const [deployLocation, setDeployLocation] = useState('');
  const [deployStart, setDeployStart] = useState('');
  const [deployEnd, setDeployEnd] = useState('');
  const [deployCombat, setDeployCombat] = useState(false);

  // BDD (Benefits Delivery at Discharge)
  const [stillActiveDuty, setStillActiveDuty] = useState<boolean | null>(cached?.stillActiveDuty ?? null);
  const [separationDate, setSeparationDate] = useState(cached?.separationDate ?? '');

  // Existing rated conditions
  const [hasExistingRated, setHasExistingRated] = useState<boolean | null>(null);
  const [existingRated, setExistingRated] = useState<Array<{
    conditionName: string;
    rating: number;
    type: 'primary' | 'secondary';
  }>>([]);
  const [newRatedCondition, setNewRatedCondition] = useState('');
  const [newRatedRating, setNewRatedRating] = useState(0);
  const [newRatedType, setNewRatedType] = useState<'primary' | 'secondary'>('primary');

  const persistProgress = useCallback(() => {
    try {
      localStorage.setItem('vcs_onboarding_progress', JSON.stringify({
        step, firstName, lastName, branch, selectedBranches,
        mosCode, mosTitle, addedConditions, claimGoal, manualCode, manualTitle,
        stillActiveDuty, separationDate,
      }));
    } catch { /* quota exceeded — ignore */ }
  }, [step, firstName, lastName, branch, selectedBranches, mosCode, mosTitle, addedConditions, claimGoal, manualCode, manualTitle, stillActiveDuty, separationDate]);

  useEffect(() => {
    persistProgress();
  }, [persistProgress]);

  useEffect(() => {
    if (profileStore.hasCompletedOnboarding) {
      localStorage.removeItem('vcs_onboarding_progress');
      navigate('/app', { replace: true });
    }
  }, [profileStore.hasCompletedOnboarding, navigate]);

  const canProceed = useMemo(() => {
    switch (step) {
      case 0: return true;
      case 1: return firstName.trim().length > 0;
      case 2: return selectedBranches.length > 0;
      case 3: return true;
      case 4: return true; // Service Status
      case 5: return true; // Duty Stations
      case 6: return true; // Deployments
      case 7: return true; // Goal
      case 8: return true; // Existing Ratings
      case 9: return true; // Conditions
      case 10: return true; // Getting Started
      case 11: return true; // Complete
      default: return true;
    }
  }, [step, firstName, selectedBranches.length]);

  const handleNext = () => {
    if (step === 1 && !firstName.trim()) {
      setNameError('Please enter your first name');
      return;
    }
    if (step < TOTAL_STEPS - 1) {
      setStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const handleSkip = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(s => s + 1);
    }
  };

  const handleAddExistingRated = () => {
    if (!newRatedCondition.trim()) return;
    setExistingRated(prev => [...prev, {
      conditionName: newRatedCondition.trim(),
      rating: newRatedRating,
      type: newRatedType,
    }]);
    setNewRatedCondition('');
    setNewRatedRating(0);
    setNewRatedType('primary');
  };

  const handleRemoveExistingRated = (idx: number) => {
    setExistingRated(prev => prev.filter((_, i) => i !== idx));
  };

  const handleComplete = () => {
    profileStore.setFirstName(firstName.trim());
    profileStore.setLastName(lastName.trim());
    if (branch) profileStore.setBranch(branch);
    if (mosCode) profileStore.setMOS(mosCode, mosTitle);
    if (claimGoal) profileStore.setClaimGoal(claimGoal);
    if (separationDate) profileStore.setSeparationDate(separationDate);

    // Save service periods from selected branches
    const periods = selectedBranches.map((b, i) => ({
      id: crypto.randomUUID(),
      branch: b,
      mos: i === 0 ? mosCode : '',
      jobTitle: i === 0 ? mosTitle : '',
      startDate: '',
      endDate: '',
    }));
    if (periods.length > 0) {
      profileStore.setServicePeriods(periods);
    }

    for (const station of dutyStations) {
      appStore.addDutyStation(station);
    }

    for (const dep of deployments) {
      appStore.addDeployment({
        ...dep,
        unit: '',
        role: '',
        hazardsEncountered: '',
        notes: '',
      });
    }

    // Save existing rated conditions as claim conditions AND as approved user conditions
    for (const rated of existingRated) {
      appStore.addClaimCondition({
        name: rated.conditionName,
        linkedMedicalVisits: [],
        linkedSymptoms: [],
        linkedExposures: [],
        linkedDocuments: [],
        linkedBuddyContacts: [],
        notes: `Existing rated condition: ${rated.rating}% (${rated.type})`,
        createdAt: new Date().toISOString(),
      });

      const matchingConditions = searchAllConditions(rated.conditionName, { limit: 1 });
      const matchedCondition = matchingConditions.length > 0 ? matchingConditions[0] : null;
      const resolved = matchedCondition ? { conditionId: matchedCondition.id, displayName: matchedCondition.abbreviation || matchedCondition.name } : resolveConditionId(rated.conditionName);
      const resolvedId = resolved.conditionId;

      const existing = appStore.userConditions.find((c) => c.conditionId === resolvedId);
      if (existing) {
        appStore.updateUserCondition(existing.id, {
          rating: rated.rating,
          serviceConnected: true,
          claimStatus: 'approved',
          isPrimary: rated.type === 'primary',
        });
      } else {
        appStore.addUserCondition({
          id: crypto.randomUUID(),
          conditionId: resolvedId,
          displayName: resolved.displayName,
          rating: rated.rating,
          serviceConnected: true,
          claimStatus: 'approved',
          isPrimary: rated.type === 'primary',
          dateAdded: new Date().toISOString(),
        });
      }
    }

    profileStore.completeOnboarding();
    navigate('/app', { replace: true });
  };

  const handleAddCondition = (condition: VACondition) => {
    addCondition(condition.id);
    setAddedConditions(prev => [...prev, condition.id]);
  };

  const handleRemoveCondition = (id: string) => {
    const userCondition = userConditions.find(c => c.conditionId === id);
    if (userCondition) {
      removeCondition(userCondition.id);
    }
    setAddedConditions(prev => prev.filter(c => c !== id));
  };

  const handleAddStation = () => {
    if (!stationBase.trim()) return;
    setDutyStations(prev => [...prev, { baseName: stationBase, startDate: stationStart, endDate: stationEnd }]);
    setStationBase('');
    setStationStart('');
    setStationEnd('');
    setShowStationForm(false);
  };

  const handleRemoveStation = (idx: number) => {
    setDutyStations(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddDeployment = () => {
    if (!deployOp.trim()) return;
    setDeployments(prev => [...prev, {
      operationName: deployOp,
      location: deployLocation,
      startDate: deployStart,
      endDate: deployEnd,
      combatDeployment: deployCombat,
    }]);
    setDeployOp('');
    setDeployLocation('');
    setDeployStart('');
    setDeployEnd('');
    setDeployCombat(false);
    setShowDeployForm(false);
  };

  const handleRemoveDeployment = (idx: number) => {
    setDeployments(prev => prev.filter((_, i) => i !== idx));
  };

  const STEP_LABELS = [
    'Welcome', 'Your Name', 'Branch of Service', 'Military Job',
    'Service Status', 'Duty Stations', 'Deployments',
    'Claim Goal', 'Existing Ratings', 'Conditions',
    'Getting Started', 'Complete',
  ];

  const ProgressDots = () => {
    if (step === TOTAL_STEPS - 1) return null;
    return (
      <div
        className="flex justify-center gap-2"
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-label={`Step ${step + 1} of ${TOTAL_STEPS}: ${STEP_LABELS[step] || ''}`}
      >
        {Array.from({ length: TOTAL_STEPS - 1 }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step ? 'w-8 bg-[image:var(--gold-gradient)]' : i < step ? 'w-2 bg-[var(--gold-md)]/50' : 'w-2 bg-white/10'
            }`}
            aria-hidden="true"
          />
        ))}
        <span className="sr-only">Step {step + 1} of {TOTAL_STEPS}: {STEP_LABELS[step]}</span>
      </div>
    );
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <PageContainer className="flex-1 flex flex-col justify-start pt-[15vh] pb-8 overflow-y-auto"
        style={{ paddingBottom: 'calc(2rem + var(--keyboard-height, 0px))' }}>
      <div className="w-full max-w-md mx-auto space-y-8">
        <ProgressDots />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Step 0: Welcome */}
            {step === 0 && (
              <div className="text-center space-y-6">
                <img src="/app-icon.png" alt="Vet Claim Support" className="w-20 h-20 mx-auto rounded-2xl shadow-lg shadow-[var(--gold-glow)]" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Welcome to Vet Claim Support</h1>
                  <p className="text-white/50 mt-2 text-sm leading-relaxed">
                    Built by veterans, for service members &amp; veterans.<br />
                    Let&apos;s personalize your experience in under 2 minutes.
                  </p>
                </div>
                <div className="rounded-xl border border-[#2a2a2a] p-4 text-left space-y-2">
                  <p className="text-white/70 text-xs leading-relaxed">
                    <strong className="text-white/90">Vet Claim Support is an educational and organizational tool.</strong>
                  </p>
                  <p className="text-white/70 text-xs leading-relaxed">
                    <strong className="text-white/90">Not affiliated with the U.S. Department of Veterans Affairs.</strong> Not legal or medical advice.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-success/10 border border-success/20">
                  <Shield className="h-4 w-4 text-success" />
                  <span className="text-xs text-success font-medium">Your data is encrypted in transit and at rest. You control your data, including export and deletion.</span>
                </div>
                <p className="text-white/40 text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[var(--gold-md)] hover:underline font-medium">
                    Sign In
                  </Link>
                </p>
              </div>
            )}

            {/* Step 1: Name */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-white/[0.09] border border-white/[0.14] flex items-center justify-center mb-4">
                    <User className="h-7 w-7 text-gold" />
                  </div>
                  <h2 className="text-xl font-bold text-white">What should we call you?</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={firstName}
                      onChange={e => { setFirstName(e.target.value); setNameError(''); }}
                      onBlur={() => { if (!firstName.trim()) setNameError('Please enter your first name'); }}
                      placeholder="First Name"
                      autoFocus
                      className={`w-full h-12 px-4 bg-white/[0.09] border rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all ${
                        nameError ? 'border-destructive/50' : 'border-white/[0.14]'
                      }`}
                    />
                    {nameError && <p className="text-destructive text-xs mt-1">{nameError}</p>}
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Last Name (optional)"
                    className="w-full h-12 px-4 bg-white/[0.09] border border-white/[0.14] rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Branch (Multi-select) */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white">Which branch(es) did you serve in?</h2>
                  <p className="text-white/40 text-sm mt-1">Select all that apply</p>
                </div>
                <div className="space-y-2">
                  {(Object.entries(BRANCH_LABELS) as [Branch, string][]).map(([key, label]) => {
                    const isSelected = selectedBranches.includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedBranches(prev => {
                            const next = prev.includes(key)
                              ? prev.filter(b => b !== key)
                              : [...prev, key];
                            // Set primary branch to first selected
                            setBranch(next.length > 0 ? next[0] : '');
                            return next;
                          });
                        }}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-gold/10 border-gold/40 text-white'
                            : 'bg-white/[0.07] border-white/[0.12] text-white/70 hover:bg-white/[0.10]'
                        }`}
                      >
                        <div
                          className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0"
                          style={{ borderColor: isSelected ? 'var(--gold-md)' : 'rgba(255,255,255,0.2)', background: isSelected ? 'var(--gold-md)' : 'transparent' }}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="w-2 h-8 rounded-sm shrink-0" style={{ background: BRANCH_COLORS[key] }} />
                        <span className="font-medium text-sm">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: MOS */}
            {step === 3 && (branch ? (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-white/[0.09] border border-white/[0.14] flex items-center justify-center mb-4">
                    <Briefcase className="h-7 w-7 text-gold" />
                  </div>
                  <h2 className="text-xl font-bold text-white">What is or was your military job code?</h2>
                  <p className="text-white/40 text-sm mt-1">
                    {branch === 'army' && 'Enter your MOS (e.g., 11B Infantryman)'}
                    {branch === 'air_force' && 'Enter your AFSC (e.g., 2T1X1 Vehicle Operations)'}
                    {branch === 'navy' && 'Enter your Rating (e.g., HM Hospital Corpsman)'}
                    {branch === 'marines' && 'Enter your MOS (e.g., 0311 Rifleman)'}
                    {branch === 'coast_guard' && "Enter your Rating (e.g., BM Boatswain's Mate)"}
                    {branch === 'space_force' && 'Enter your AFSC (e.g., 5S0X1 Space Systems Operations)'}
                  </p>
                </div>

                {!showManualMOS ? (
                  <>
                    <MOSAutocomplete
                      branch={branch}
                      value={mosCode ? `${mosCode} — ${mosTitle}` : ''}
                      onSelect={(job) => {
                        setMosCode(job.code);
                        setMosTitle(job.title);
                        setShowManualMOS(false);
                      }}
                    />
                    {mosCode && (
                      <div className="flex items-start gap-2 text-sm text-gold min-w-0">
                        <Check className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span className="break-words min-w-0">{getCodeTypeForBranch(BRANCH_TO_MOS[branch])}: {mosCode} — {mosTitle}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowManualMOS(true)}
                      className="text-sm text-white/40 hover:text-white/60 transition-colors underline underline-offset-2"
                    >
                      I don&apos;t see my job
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-white/50">Enter your job code and title manually:</p>
                    <input
                      type="text"
                      value={manualCode}
                      onChange={e => {
                        setManualCode(e.target.value);
                        setMosCode(e.target.value);
                      }}
                      placeholder="Job Code (e.g., 11B)"
                      className="w-full h-12 px-4 bg-white/[0.09] border border-white/[0.14] rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all"
                    />
                    <input
                      type="text"
                      value={manualTitle}
                      onChange={e => {
                        setManualTitle(e.target.value);
                        setMosTitle(e.target.value);
                      }}
                      placeholder="Job Title (e.g., Infantryman)"
                      className="w-full h-12 px-4 bg-white/[0.09] border border-white/[0.14] rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all"
                    />
                    {manualCode && manualTitle && (
                      <div className="flex items-center gap-2 text-sm text-gold min-w-0">
                        <Check className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{manualCode} — {manualTitle}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowManualMOS(false)}
                      className="text-sm text-white/40 hover:text-white/60 transition-colors underline underline-offset-2"
                    >
                      Back to search
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-white/60 text-sm">Please go back and select your branch of service first.</p>
              </div>
            ))}

            {/* Step 4: Service Status (Active Duty / BDD) */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-white/[0.09] border border-white/[0.14] flex items-center justify-center mb-4">
                    <Shield className="h-7 w-7 text-gold" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Are you still on active duty?</h2>
                  <p className="text-white/40 text-sm mt-1">This helps determine if you qualify for BDD (Benefits Delivery at Discharge).</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStillActiveDuty(true)}
                    className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-all ${
                      stillActiveDuty === true
                        ? 'bg-gold/10 border-gold/40 text-white'
                        : 'bg-white/[0.07] border-white/[0.12] text-white/70 hover:bg-white/[0.10]'
                    }`}
                  >
                    Yes, active duty
                  </button>
                  <button
                    onClick={() => { setStillActiveDuty(false); setSeparationDate(''); }}
                    className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-all ${
                      stillActiveDuty === false
                        ? 'bg-gold/10 border-gold/40 text-white'
                        : 'bg-white/[0.07] border-white/[0.12] text-white/70 hover:bg-white/[0.10]'
                    }`}
                  >
                    No, separated / retired
                  </button>
                </div>
                {stillActiveDuty && (
                  <div className="space-y-2">
                    <p className="text-white/50 text-xs">Expected separation / ETS date</p>
                    <input
                      type="date"
                      value={separationDate}
                      onChange={e => setSeparationDate(e.target.value)}
                      className="w-full h-12 px-4 bg-white/[0.09] border border-white/[0.14] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/50 transition-all [color-scheme:dark]"
                    />
                    {separationDate && (() => {
                      const daysOut = Math.round((new Date(separationDate).getTime() - Date.now()) / 86400000);
                      if (daysOut >= 90 && daysOut <= 180) {
                        return (
                          <div className="flex items-center gap-2 p-3 rounded-xl bg-success/10 border border-success/20">
                            <Shield className="h-4 w-4 text-success shrink-0" />
                            <span className="text-xs text-success">You may be eligible for BDD (Benefits Delivery at Discharge). File 90–180 days before separation to get your rating faster.</span>
                          </div>
                        );
                      } else if (daysOut > 0 && daysOut < 90) {
                        return (
                          <p className="text-xs text-gold/80 px-1">Your separation is less than 90 days out — standard filing recommended.</p>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Duty Stations */}
            {step === 5 && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-white/[0.09] border border-white/[0.14] flex items-center justify-center mb-4">
                    <MapPin className="h-7 w-7 text-gold" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Where do you or did you serve?</h2>
                  <p className="text-white/40 text-sm mt-1">This helps identify conditions linked to specific locations and eras.</p>
                </div>

                {dutyStations.length > 0 && (
                  <div className="space-y-2">
                    {dutyStations.map((station, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.07] border border-white/[0.12] gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-white text-sm font-medium truncate">{station.baseName}</p>
                          {(station.startDate || station.endDate) && (
                            <p className="text-white/40 text-xs">{station.startDate} — {station.endDate}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveStation(idx)}
                          className="h-10 w-10 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                          aria-label="Remove station"
                        >
                          <X className="h-4 w-4 text-white/40" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {showStationForm ? (
                  <div className="space-y-3 p-4 rounded-xl border border-white/[0.14] bg-white/[0.02]">
                    <LocationAutocomplete
                      value={stationBase}
                      onChange={setStationBase}
                      onSelect={setStationBase}
                      placeholder="Base/Installation name..."
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <MonthYearPicker value={stationStart} onChange={setStationStart} placeholder="Start" />
                      <MonthYearPicker value={stationEnd} onChange={setStationEnd} placeholder="End" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddStation}
                        disabled={!stationBase.trim()}
                        className="flex-1 h-10 rounded-xl bg-gold text-[#000000] text-sm font-bold disabled:opacity-40 transition-all"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setShowStationForm(false)}
                        className="h-10 px-4 rounded-xl text-white/50 text-sm hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowStationForm(true)}
                    className="w-full h-12 rounded-xl border border-dashed border-white/20 text-white/50 text-sm hover:border-gold/40 hover:text-gold transition-all"
                  >
                    + Add Duty Station
                  </button>
                )}
              </div>
            )}

            {/* Step 6: Deployments */}
            {step === 6 && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-white/[0.09] border border-white/[0.14] flex items-center justify-center mb-4">
                    <Plane className="h-7 w-7 text-gold" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Any Deployments or Combat Tours?</h2>
                  <p className="text-white/40 text-sm mt-1">Deployments may be connected to presumptive conditions under the PACT Act and other VA policies.</p>
                </div>

                {deployments.length > 0 && (
                  <div className="space-y-2">
                    {deployments.map((dep, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.07] border border-white/[0.12] gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-white text-sm font-medium truncate">{dep.operationName}</p>
                            {dep.combatDeployment && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-destructive/20 text-destructive border border-destructive/30">COMBAT</span>
                            )}
                          </div>
                          {dep.location && <p className="text-white/40 text-xs truncate">{dep.location}</p>}
                          {(dep.startDate || dep.endDate) && (
                            <p className="text-white/30 text-xs">{dep.startDate} — {dep.endDate}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveDeployment(idx)}
                          className="h-10 w-10 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                          aria-label="Remove deployment"
                        >
                          <X className="h-4 w-4 text-white/40" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {showDeployForm ? (
                  <div className="space-y-3 p-4 rounded-xl border border-white/[0.14] bg-white/[0.02]">
                    <select
                      value={deployOp}
                      onChange={e => setDeployOp(e.target.value)}
                      className="w-full h-12 px-4 bg-white/[0.09] border border-white/[0.14] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all"
                    >
                      <option value="" className="bg-[#000000]">Select Operation/Theater...</option>
                      {OPERATIONS.map(op => (
                        <option key={op} value={op} className="bg-[#000000]">{op}</option>
                      ))}
                    </select>
                    <LocationAutocomplete
                      value={deployLocation}
                      onChange={setDeployLocation}
                      onSelect={setDeployLocation}
                      placeholder="Location (e.g., Baghdad, Iraq)"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <MonthYearPicker value={deployStart} onChange={setDeployStart} placeholder="Start" />
                      <MonthYearPicker value={deployEnd} onChange={setDeployEnd} placeholder="End" />
                    </div>
                    <button
                      onClick={() => setDeployCombat(!deployCombat)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                        deployCombat ? 'border-destructive/40 bg-destructive/10' : 'border-white/[0.14] bg-white/[0.07]'
                      }`}
                    >
                      <span className="text-white text-sm">Combat Zone?</span>
                      <div className={`w-10 h-6 rounded-full transition-colors ${deployCombat ? 'bg-destructive' : 'bg-white/20'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white mt-0.5 transition-transform ${deployCombat ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                      </div>
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddDeployment}
                        disabled={!deployOp.trim()}
                        className="flex-1 h-10 rounded-xl bg-gold text-[#000000] text-sm font-bold disabled:opacity-40 transition-all"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setShowDeployForm(false)}
                        className="h-10 px-4 rounded-xl text-white/50 text-sm hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeployForm(true)}
                    className="w-full h-12 rounded-xl border border-dashed border-white/20 text-white/50 text-sm hover:border-gold/40 hover:text-gold transition-all"
                  >
                    + Add Deployment
                  </button>
                )}

                <button
                  onClick={handleSkip}
                  className="w-full text-center text-sm text-white/30 hover:text-white/50 transition-colors"
                >
                  I was never deployed
                </button>
              </div>
            )}

            {/* Step 7: What's Your Goal? */}
            {step === 7 && (
              <div className="space-y-5">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white">What are you trying to do?</h2>
                  <p className="text-white/40 text-sm mt-1">This helps us show you the most relevant tools first.</p>
                </div>
                <div className="space-y-2">
                  {([
                    { value: 'initial' as ClaimGoal, label: 'File an initial claim', desc: 'First time filing with the VA' },
                    { value: 'increase' as ClaimGoal, label: 'Increase an existing rating', desc: 'Condition has gotten worse' },
                    { value: 'secondary' as ClaimGoal, label: 'File for secondary conditions', desc: 'Conditions caused by a rated disability' },
                    { value: 'appeal' as ClaimGoal, label: 'Appeal a denied claim', desc: 'Request a review of a VA decision' },
                    { value: 'exploring' as ClaimGoal, label: 'Not sure yet \u2014 just exploring', desc: 'Learn what tools are available' },
                  ]).map(option => (
                    <button
                      key={option.value}
                      onClick={() => setClaimGoal(option.value)}
                      className={`w-full flex items-start gap-3 p-4 rounded-xl border transition-all text-left ${
                        claimGoal === option.value
                          ? 'bg-gold/10 border-gold/40 text-white'
                          : 'bg-white/[0.07] border-white/[0.12] text-white/70 hover:bg-white/[0.10]'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
                        style={{ borderColor: claimGoal === option.value ? 'var(--gold-md)' : 'rgba(255,255,255,0.2)' }}
                      >
                        {claimGoal === option.value && (
                          <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-sm block">{option.label}</span>
                        <span className="text-xs text-white/40">{option.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 8: Existing Rated Conditions */}
            {step === 8 && (
              <div className="space-y-5">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white">Do you have any VA-rated conditions?</h2>
                  <p className="text-white/40 text-sm mt-1">This helps us show your current combined rating and identify secondary conditions.</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setHasExistingRated(true)}
                    className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-all ${
                      hasExistingRated === true
                        ? 'bg-gold/10 border-gold/40 text-white'
                        : 'bg-white/[0.07] border-white/[0.12] text-white/70 hover:bg-white/[0.10]'
                    }`}
                  >
                    Yes, I have rated conditions
                  </button>
                  <button
                    onClick={() => { setHasExistingRated(false); setExistingRated([]); }}
                    className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-all ${
                      hasExistingRated === false
                        ? 'bg-gold/10 border-gold/40 text-white'
                        : 'bg-white/[0.07] border-white/[0.12] text-white/70 hover:bg-white/[0.10]'
                    }`}
                  >
                    No, not yet
                  </button>
                </div>

                {hasExistingRated === true && (
                  <div className="space-y-4">
                    {/* Add new rated condition form */}
                    <div className="space-y-3 p-4 rounded-xl bg-white/[0.07] border border-white/[0.12]">
                      {!newRatedCondition ? (
                        <ConditionAutocomplete
                          onSelect={(condition) => setNewRatedCondition(condition.name)}
                          placeholder="Search conditions (e.g. PTSD, Tinnitus)"
                        />
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gold/10 border border-gold/30">
                          <span className="flex-1 text-sm text-gold font-medium">{newRatedCondition}</span>
                          <button onClick={() => setNewRatedCondition('')} className="text-white/40 hover:text-white" aria-label="Change condition">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <select
                          value={newRatedRating}
                          onChange={(e) => setNewRatedRating(Number(e.target.value))}
                          className="flex-1 px-3 py-2.5 rounded-xl bg-white/[0.09] border border-white/[0.12] text-white text-sm focus:outline-none focus:border-gold/40"
                        >
                          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(v => (
                            <option key={v} value={v} className="bg-[#000000] text-white">{v}%</option>
                          ))}
                        </select>
                        <div className="flex border border-white/[0.12] rounded-xl overflow-hidden">
                          <button
                            onClick={() => setNewRatedType('primary')}
                            className={`px-3 py-2 text-xs font-medium transition-colors ${
                              newRatedType === 'primary' ? 'bg-gold/20 text-white' : 'text-white/50 hover:text-white/80'
                            }`}
                          >
                            Primary
                          </button>
                          <button
                            onClick={() => setNewRatedType('secondary')}
                            className={`px-3 py-2 text-xs font-medium transition-colors ${
                              newRatedType === 'secondary' ? 'bg-gold/20 text-white' : 'text-white/50 hover:text-white/80'
                            }`}
                          >
                            Secondary
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={handleAddExistingRated}
                        disabled={!newRatedCondition.trim()}
                        className="w-full h-10 rounded-xl bg-gold text-[#000000] text-sm font-bold disabled:opacity-40 transition-all"
                      >
                        Save
                      </button>
                    </div>

                    {/* List of added rated conditions */}
                    {existingRated.length > 0 && (
                      <div className="space-y-2">
                        {existingRated.map((rc, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.07] border border-white/[0.12] gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white font-medium truncate">{rc.conditionName}</p>
                              <p className="text-xs text-white/40">{rc.rating}% · {rc.type}</p>
                            </div>
                            <button onClick={() => handleRemoveExistingRated(idx)} className="text-white/40 hover:text-white ml-2" aria-label="Remove">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 9: Conditions */}
            {step === 9 && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-white/[0.09] border border-white/[0.14] flex items-center justify-center mb-4">
                    <Stethoscope className="h-7 w-7 text-gold" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Are you claiming any conditions?</h2>
                  <p className="text-white/40 text-sm mt-1">This helps show you the most relevant tools.</p>
                </div>
                <ConditionAutocomplete
                  onSelect={handleAddCondition}
                  placeholder="Search conditions..."
                  excludeIds={addedConditions}
                />
                {addedConditions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {addedConditions.map(id => {
                      const c = getConditionById(id);
                      if (!c) return null;
                      return (
                        <span key={id} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-sm text-foreground max-w-full">
                          <span className="truncate">{c.abbreviation || c.name}</span>
                          <button onClick={() => handleRemoveCondition(id)} className="ml-1 text-gold/60 hover:text-gold" aria-label={`Remove ${c.abbreviation || c.name}`}>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Step 10: How to Get Results */}
            {step === 10 && (
              <div className="space-y-5">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white">How to Get Results</h2>
                  <p className="text-white/40 text-sm mt-1">Follow these steps to build the strongest claim possible</p>
                </div>
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {[
                    {
                      step: '1',
                      icon: ClipboardList,
                      title: 'File an Intent to File',
                      desc: 'Lock in your effective date today. This preserves your right to back pay from the date you notify the VA. Go to the Prep Hub to get started.',
                    },
                    {
                      step: '2',
                      icon: Activity,
                      title: 'Start Tracking Symptoms Now',
                      desc: 'Log your symptoms, sleep issues, and migraines daily. The VA looks at frequency and severity over time. Consistent entries show your condition is ongoing, not a one-time event.',
                    },
                    {
                      step: '3',
                      icon: Stethoscope,
                      title: 'Prepare Before Your C&P Exam',
                      desc: 'Use the C&P Exam Prep tool to review what the examiner will ask for your specific conditions. Know your worst days, not your best. The DBQ Prep Sheet helps you organize your symptoms, severity, and medications beforehand.',
                    },
                    {
                      step: '4',
                      icon: FileText,
                      title: 'Build Your Statements',
                      desc: 'Write your Personal Statement describing how your conditions affect daily life and work. Use the Buddy Statement Builder to help people who witnessed your condition write their own supporting statements.',
                    },
                    {
                      step: '5',
                      icon: Users,
                      title: 'Find Secondary Conditions',
                      desc: 'If you already have a rated disability, use the Secondary Condition Finder to discover related conditions that may be connected. For example, chronic pain conditions often lead to sleep problems or mental health impacts.',
                    },
                    {
                      step: '6',
                      icon: Calculator,
                      title: 'Understand Your Rating',
                      desc: 'Use the Rating Calculator to see how VA math works. The VA combines ratings using a specific formula, not simple addition. Knowing this helps you set realistic expectations and identify where to focus.',
                    },
                  ].map((card) => (
                    <div key={card.step} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.07] border border-white/[0.12]">
                      <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/25 flex items-center justify-center flex-shrink-0">
                        <card.icon className="h-5 w-5 text-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm">Step {card.step}: {card.title}</p>
                        <p className="text-white/50 text-xs mt-1 leading-relaxed">{card.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-[#2a2a2a] bg-white/[0.03] p-3">
                  <p className="text-white/40 text-xs leading-relaxed text-center">This tool helps you organize and prepare your own claim. It does not file claims, provide legal or medical advice, or guarantee any outcome. Always consult a VA-accredited representative for guidance specific to your situation.</p>
                </div>
                <p className="text-center text-white/30 text-xs break-words">By continuing, you agree to our <Link to="/settings/terms" className="text-gold underline">Terms of Service</Link> and <Link to="/settings/privacy" className="text-gold underline">Privacy Policy</Link>.</p>
              </div>
            )}

            {/* Step 11: Thank You */}
            {step === 11 && (
              <div className="text-center space-y-6">
                <style>{`
                  @keyframes flagWave {
                    0% { transform: perspective(400px) rotateY(0deg); }
                    25% { transform: perspective(400px) rotateY(3deg) skewY(-1deg); }
                    50% { transform: perspective(400px) rotateY(0deg); }
                    75% { transform: perspective(400px) rotateY(-3deg) skewY(1deg); }
                    100% { transform: perspective(400px) rotateY(0deg); }
                  }
                `}</style>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0, duration: 0.5 }}
                  className="flex justify-center"
                >
                  <div style={{ animation: 'flagWave 4s ease-in-out infinite', transformOrigin: 'left center' }}>
                    <svg width="120" height="80" viewBox="0 0 190 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="American flag">
                      {/* 13 stripes */}
                      {Array.from({ length: 13 }).map((_, i) => (
                        <rect key={i} x="0" y={i * (100 / 13)} width="190" height={100 / 13 + 0.5} fill={i % 2 === 0 ? '#B22234' : '#FFFFFF'} />
                      ))}
                      {/* Blue canton */}
                      <rect x="0" y="0" width="76" height={100 * 7 / 13} rx="0" fill="#3C3B6E" />
                      {/* Stars - 5 rows of 6 + 4 rows of 5 = 50 stars */}
                      {[0, 1, 2, 3, 4].map(row =>
                        [0, 1, 2, 3, 4, 5].map(col => (
                          <circle key={`a${row}-${col}`} cx={6.5 + col * 12.5} cy={4.5 + row * 10.8} r="2" fill="#FFFFFF" />
                        ))
                      )}
                      {[0, 1, 2, 3].map(row =>
                        [0, 1, 2, 3, 4].map(col => (
                          <circle key={`b${row}-${col}`} cx={12.75 + col * 12.5} cy={9.9 + row * 10.8} r="2" fill="#FFFFFF" />
                        ))
                      )}
                    </svg>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-white">Thank You for Your Service</h2>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <p className="text-lg text-gold font-medium">God Bless America</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <SuccessAnimation show={true} variant="celebration" size="lg" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <button
                    onClick={handleComplete}
                    className="w-full h-14 rounded-xl text-[#000000] text-base font-bold transition-all hover:brightness-110 hover:shadow-[0_4px_24px_var(--gold-glow)]"
                    style={{ background: 'var(--gold-gradient)' }}
                  >
                    Get Started
                  </button>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {step < TOTAL_STEPS - 1 && (
          <div className="flex items-center justify-between pt-4">
            <div>
              {step > 0 && (
                <button onClick={handleBack} className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors h-11 px-4">
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {(step >= 3 && step <= 9) && (
                <button onClick={handleSkip} className="text-sm text-white/40 hover:text-white/60 transition-colors h-11 px-4">
                  Skip
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className="flex items-center gap-1 h-11 px-6 rounded-xl bg-gold text-[#000000] text-sm font-bold hover:bg-gold/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {step === 0 ? 'Get Started' : 'Continue'}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      </PageContainer>
    </div>
  );
}
