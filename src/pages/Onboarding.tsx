import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, Search, Shield, User, Briefcase, Stethoscope, Check, MapPin, Plane } from 'lucide-react';
import { useProfileStore, BRANCH_LABELS, BRANCH_COLORS, type Branch, type ClaimGoal } from '@/store/useProfileStore';
import { searchMilitaryJobs, getCodeTypeForBranch, type MilitaryJobCode } from '@/data/militaryMOS';
import { ConditionAutocomplete } from '@/components/shared/ConditionAutocomplete';
import { useUserConditions } from '@/hooks/useUserConditions';
import { type VACondition, getConditionById } from '@/data/vaConditions';
import useAppStore, { type DutyStation } from '@/store/useAppStore';
import { SuccessAnimation } from '@/components/ui/success-animation';
import { PageContainer } from '@/components/PageContainer';

const TOTAL_STEPS = 11;

const BRANCH_TO_MOS: Record<Branch, string> = {
  army: 'Army',
  marines: 'Marines',
  navy: 'Navy',
  air_force: 'Air Force',
  coast_guard: 'Coast Guard',
  space_force: 'Space Force',
};

const MAJOR_INSTALLATIONS = [
  'Fort Liberty', 'Fort Cavazos', 'Camp Lejeune', 'Joint Base Lewis-McChord',
  'Fort Campbell', 'Naval Station Norfolk', 'Camp Pendleton', 'Travis AFB',
  'Lackland AFB', 'Fort Drum', 'Fort Stewart', 'Fort Carson', 'Fort Bliss',
  'Fort Riley', 'Fort Sill', 'Fort Leonard Wood', 'Fort Jackson',
  'Fort Gordon', 'Fort Polk', 'Fort Huachuca',
  'Schofield Barracks', 'Fort Shafter', 'Fort Wainwright',
  'NAS Jacksonville', 'NAS Pensacola', 'NAS Oceana', 'Naval Base San Diego',
  'Naval Station Great Lakes', 'MCAS Cherry Point', 'MCAS Miramar',
  'MCB Quantico', 'MCRD Parris Island', 'MCRD San Diego',
  'Eglin AFB', 'Wright-Patterson AFB', 'Ramstein AB', 'Kadena AB',
  'Osan AB', 'Yokota AB', 'Aviano AB', 'RAF Lakenheath',
  'Peterson SFB', 'Vandenberg SFB', 'Other',
];

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
        className="w-full h-12 pl-10 pr-4 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 focus:border-[#3B82F6]/50 transition-all"
      />
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-[#1a2d44] border border-white/10 rounded-xl shadow-2xl shadow-black/50 max-h-60 overflow-y-auto">
          {results.map((job, i) => (
            <button
              key={`${job.code}-${job.branch}`}
              ref={i === highlightIdx ? highlightRef : undefined}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                i === highlightIdx ? 'bg-[#3B82F6]/15 text-white' : 'text-white/80 hover:bg-white/5'
              } ${i > 0 ? 'border-t border-white/[0.04]' : ''}`}
              onClick={() => handleSelect(job)}
              onMouseEnter={() => setHighlightIdx(i)}
            >
              <span className="font-mono text-[#3B82F6] text-sm font-bold w-16 shrink-0">{job.code}</span>
              <span className="text-sm flex-1 truncate">{job.title}</span>
              <span className="text-[10px] text-white/30 uppercase">{job.branch}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Installation Autocomplete ---
function InstallationAutocomplete({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!value.trim()) return MAJOR_INSTALLATIONS.slice(0, 10);
    return MAJOR_INSTALLATIONS.filter(b =>
      b.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 10);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={e => { onChange(e.target.value); setIsOpen(true); }}
        onFocus={() => setIsOpen(true)}
        placeholder="Base/Installation name..."
        className="w-full h-12 px-4 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 transition-all"
      />
      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-[#1a2d44] border border-white/10 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
          {filtered.map((base) => (
            <button
              key={base}
              className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 transition-colors border-b border-white/[0.04] last:border-0"
              onClick={() => { onChange(base); setIsOpen(false); }}
            >
              {base}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Main Onboarding ---
export default function Onboarding() {
  const navigate = useNavigate();
  const profileStore = useProfileStore();
  const appStore = useAppStore();
  const { addCondition } = useUserConditions();

  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState(profileStore.firstName);
  const [lastName, setLastName] = useState(profileStore.lastName);
  const [branch, setBranch] = useState<Branch | ''>(profileStore.branch);
  const [selectedBranches, setSelectedBranches] = useState<Branch[]>(
    profileStore.branch ? [profileStore.branch] : []
  );
  const [mosCode, setMosCode] = useState(profileStore.mosCode);
  const [mosTitle, setMosTitle] = useState(profileStore.mosTitle);
  const [addedConditions, setAddedConditions] = useState<string[]>([]);
  const [claimGoal, setClaimGoal] = useState<ClaimGoal | ''>('');
  const [nameError, setNameError] = useState('');
  const [showManualMOS, setShowManualMOS] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [manualTitle, setManualTitle] = useState('');

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

  // Existing rated conditions
  const [hasExistingRated, setHasExistingRated] = useState(false);
  const [existingRated, setExistingRated] = useState<Array<{
    conditionName: string;
    rating: number;
    type: 'primary' | 'secondary';
  }>>([]);
  const [newRatedCondition, setNewRatedCondition] = useState('');
  const [newRatedRating, setNewRatedRating] = useState(0);
  const [newRatedType, setNewRatedType] = useState<'primary' | 'secondary'>('primary');

  useEffect(() => {
    if (profileStore.hasCompletedOnboarding) {
      navigate('/', { replace: true });
    }
  }, [profileStore.hasCompletedOnboarding, navigate]);

  const canProceed = useMemo(() => {
    switch (step) {
      case 0: return true;
      case 1: return firstName.trim().length > 0;
      case 2: return selectedBranches.length > 0;
      case 3: return true;
      case 4: return true;
      case 5: return true;
      case 6: return true;
      case 7: return true; // Goal step
      case 8: return true;
      case 9: return true;
      case 10: return true;
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

    // Save existing rated conditions as claim conditions
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
    }

    profileStore.completeOnboarding();
    navigate('/', { replace: true });
  };

  const handleAddCondition = (condition: VACondition) => {
    addCondition(condition.id);
    setAddedConditions(prev => [...prev, condition.id]);
  };

  const handleRemoveCondition = (id: string) => {
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

  const ProgressDots = () => {
    if (step === TOTAL_STEPS - 1) return null;
    return (
      <div className="flex justify-center gap-2">
        {Array.from({ length: TOTAL_STEPS - 1 }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step ? 'w-8 bg-[#3B82F6]' : i < step ? 'w-2 bg-[#3B82F6]/50' : 'w-2 bg-white/10'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <PageContainer className="flex-1 flex flex-col justify-center py-8">
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
                <div className="w-20 h-20 mx-auto rounded-2xl bg-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#3B82F6]/20">
                  <span className="text-[#102039] font-black italic text-3xl">V</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Welcome to Vet Claim Support</h1>
                  <p className="text-white/50 mt-2 text-sm leading-relaxed">
                    Built by veterans, for service members &amp; veterans.<br />
                    Let&apos;s personalize your experience in under 2 minutes.
                  </p>
                </div>
                <div className="rounded-xl border border-[#243447] p-4 text-left space-y-2">
                  <p className="text-white/70 text-xs leading-relaxed">
                    <strong className="text-white/90">Vet Claim Support is an educational and organizational tool.</strong>
                  </p>
                  <p className="text-white/70 text-xs leading-relaxed">
                    <strong className="text-white/90">Not affiliated with the U.S. Department of Veterans Affairs.</strong> Not legal or medical advice.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-medium">Your data is encrypted in transit and at rest. You control your data, including export and deletion.</span>
                </div>
              </div>
            )}

            {/* Step 1: Name */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center mb-4">
                    <User className="h-7 w-7 text-[#3B82F6]" />
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
                      className={`w-full h-12 px-4 bg-white/[0.06] border rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 transition-all ${
                        nameError ? 'border-red-400/50' : 'border-white/[0.1]'
                      }`}
                    />
                    {nameError && <p className="text-red-400 text-xs mt-1">{nameError}</p>}
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Last Name (optional)"
                    className="w-full h-12 px-4 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 transition-all"
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
                            ? 'bg-[#3B82F6]/10 border-[#3B82F6]/40 text-white'
                            : 'bg-white/[0.04] border-white/[0.08] text-white/70 hover:bg-white/[0.06]'
                        }`}
                      >
                        <div
                          className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0"
                          style={{ borderColor: isSelected ? '#3B82F6' : 'rgba(255,255,255,0.2)', background: isSelected ? '#3B82F6' : 'transparent' }}
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
            {step === 3 && branch && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center mb-4">
                    <Briefcase className="h-7 w-7 text-[#3B82F6]" />
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
                      <div className="flex items-center gap-2 text-sm text-[#3B82F6]">
                        <Check className="h-4 w-4" />
                        <span>{getCodeTypeForBranch(BRANCH_TO_MOS[branch])}: {mosCode} — {mosTitle}</span>
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
                      className="w-full h-12 px-4 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 transition-all"
                    />
                    <input
                      type="text"
                      value={manualTitle}
                      onChange={e => {
                        setManualTitle(e.target.value);
                        setMosTitle(e.target.value);
                      }}
                      placeholder="Job Title (e.g., Infantryman)"
                      className="w-full h-12 px-4 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 transition-all"
                    />
                    {manualCode && manualTitle && (
                      <div className="flex items-center gap-2 text-sm text-[#3B82F6]">
                        <Check className="h-4 w-4" />
                        <span>{manualCode} — {manualTitle}</span>
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
            )}

            {/* Step 4: Duty Stations */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center mb-4">
                    <MapPin className="h-7 w-7 text-[#3B82F6]" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Where do you or did you serve?</h2>
                  <p className="text-white/40 text-sm mt-1">This helps identify conditions linked to specific locations and eras.</p>
                </div>

                {dutyStations.length > 0 && (
                  <div className="space-y-2">
                    {dutyStations.map((station, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                        <div>
                          <p className="text-white text-sm font-medium">{station.baseName}</p>
                          {(station.startDate || station.endDate) && (
                            <p className="text-white/40 text-xs">{station.startDate} — {station.endDate}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveStation(idx)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <X className="h-4 w-4 text-white/40" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {showStationForm ? (
                  <div className="space-y-3 p-4 rounded-xl border border-white/[0.1] bg-white/[0.02]">
                    <InstallationAutocomplete value={stationBase} onChange={setStationBase} />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="month"
                        value={stationStart}
                        onChange={e => setStationStart(e.target.value)}
                        placeholder="Start"
                        className="h-12 px-4 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 transition-all"
                      />
                      <input
                        type="month"
                        value={stationEnd}
                        onChange={e => setStationEnd(e.target.value)}
                        placeholder="End"
                        className="h-12 px-4 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 transition-all"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddStation}
                        disabled={!stationBase.trim()}
                        className="flex-1 h-10 rounded-xl bg-[#3B82F6] text-[#102039] text-sm font-bold disabled:opacity-40 transition-all"
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
                    className="w-full h-12 rounded-xl border border-dashed border-white/20 text-white/50 text-sm hover:border-[#3B82F6]/40 hover:text-[#3B82F6] transition-all"
                  >
                    + Add Duty Station
                  </button>
                )}
              </div>
            )}

            {/* Step 5: Deployments */}
            {step === 5 && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center mb-4">
                    <Plane className="h-7 w-7 text-[#3B82F6]" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Any Deployments or Combat Tours?</h2>
                  <p className="text-white/40 text-sm mt-1">Deployments may be connected to presumptive conditions under the PACT Act and other VA policies.</p>
                </div>

                {deployments.length > 0 && (
                  <div className="space-y-2">
                    {deployments.map((dep, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white text-sm font-medium">{dep.operationName}</p>
                            {dep.combatDeployment && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">COMBAT</span>
                            )}
                          </div>
                          {dep.location && <p className="text-white/40 text-xs">{dep.location}</p>}
                          {(dep.startDate || dep.endDate) && (
                            <p className="text-white/30 text-xs">{dep.startDate} — {dep.endDate}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveDeployment(idx)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <X className="h-4 w-4 text-white/40" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {showDeployForm ? (
                  <div className="space-y-3 p-4 rounded-xl border border-white/[0.1] bg-white/[0.02]">
                    <select
                      value={deployOp}
                      onChange={e => setDeployOp(e.target.value)}
                      className="w-full h-12 px-4 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 transition-all"
                    >
                      <option value="" className="bg-[#102039]">Select Operation/Theater...</option>
                      {OPERATIONS.map(op => (
                        <option key={op} value={op} className="bg-[#102039]">{op}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={deployLocation}
                      onChange={e => setDeployLocation(e.target.value)}
                      placeholder="Location (e.g., Baghdad, Iraq)"
                      className="w-full h-12 px-4 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 transition-all"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="month"
                        value={deployStart}
                        onChange={e => setDeployStart(e.target.value)}
                        className="h-12 px-4 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 transition-all"
                      />
                      <input
                        type="month"
                        value={deployEnd}
                        onChange={e => setDeployEnd(e.target.value)}
                        className="h-12 px-4 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 transition-all"
                      />
                    </div>
                    <button
                      onClick={() => setDeployCombat(!deployCombat)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                        deployCombat ? 'border-red-500/40 bg-red-500/10' : 'border-white/[0.1] bg-white/[0.04]'
                      }`}
                    >
                      <span className="text-white text-sm">Combat Zone?</span>
                      <div className={`w-10 h-6 rounded-full transition-colors ${deployCombat ? 'bg-red-500' : 'bg-white/20'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white mt-0.5 transition-transform ${deployCombat ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                      </div>
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddDeployment}
                        disabled={!deployOp.trim()}
                        className="flex-1 h-10 rounded-xl bg-[#3B82F6] text-[#102039] text-sm font-bold disabled:opacity-40 transition-all"
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
                    className="w-full h-12 rounded-xl border border-dashed border-white/20 text-white/50 text-sm hover:border-[#3B82F6]/40 hover:text-[#3B82F6] transition-all"
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

            {/* Step 6: Conditions */}
            {step === 6 && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center mb-4">
                    <Stethoscope className="h-7 w-7 text-[#3B82F6]" />
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
                        <span key={id} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-sm text-[#3B82F6]">
                          {c.abbreviation || c.name}
                          <button onClick={() => handleRemoveCondition(id)} className="ml-1 text-[#3B82F6]/60 hover:text-[#3B82F6]" aria-label={`Remove ${c.abbreviation || c.name}`}>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
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
                          ? 'bg-[#3B82F6]/10 border-[#3B82F6]/40 text-white'
                          : 'bg-white/[0.04] border-white/[0.08] text-white/70 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
                        style={{ borderColor: claimGoal === option.value ? '#3B82F6' : 'rgba(255,255,255,0.2)' }}
                      >
                        {claimGoal === option.value && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
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
                      hasExistingRated
                        ? 'bg-[#3B82F6]/10 border-[#3B82F6]/40 text-white'
                        : 'bg-white/[0.04] border-white/[0.08] text-white/70 hover:bg-white/[0.06]'
                    }`}
                  >
                    Yes, I have rated conditions
                  </button>
                  <button
                    onClick={() => { setHasExistingRated(false); setExistingRated([]); }}
                    className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-all ${
                      !hasExistingRated && existingRated.length === 0
                        ? 'bg-white/[0.04] border-white/[0.08] text-white/70'
                        : !hasExistingRated
                          ? 'bg-[#3B82F6]/10 border-[#3B82F6]/40 text-white'
                          : 'bg-white/[0.04] border-white/[0.08] text-white/70 hover:bg-white/[0.06]'
                    }`}
                  >
                    No, not yet
                  </button>
                </div>

                {hasExistingRated && (
                  <div className="space-y-4">
                    {/* Add new rated condition form */}
                    <div className="space-y-3 p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                      <input
                        type="text"
                        value={newRatedCondition}
                        onChange={(e) => setNewRatedCondition(e.target.value)}
                        placeholder="Condition name (e.g. PTSD, Tinnitus)"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#3B82F6]/40"
                      />
                      <div className="flex gap-3">
                        <select
                          value={newRatedRating}
                          onChange={(e) => setNewRatedRating(Number(e.target.value))}
                          className="flex-1 px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#3B82F6]/40"
                        >
                          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(v => (
                            <option key={v} value={v} className="bg-[#102039] text-white">{v}%</option>
                          ))}
                        </select>
                        <div className="flex border border-white/[0.08] rounded-xl overflow-hidden">
                          <button
                            onClick={() => setNewRatedType('primary')}
                            className={`px-3 py-2 text-xs font-medium transition-colors ${
                              newRatedType === 'primary' ? 'bg-[#3B82F6]/20 text-[#3B82F6]' : 'text-white/50 hover:text-white/80'
                            }`}
                          >
                            Primary
                          </button>
                          <button
                            onClick={() => setNewRatedType('secondary')}
                            className={`px-3 py-2 text-xs font-medium transition-colors ${
                              newRatedType === 'secondary' ? 'bg-[#3B82F6]/20 text-[#3B82F6]' : 'text-white/50 hover:text-white/80'
                            }`}
                          >
                            Secondary
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={handleAddExistingRated}
                        disabled={!newRatedCondition.trim()}
                        className="w-full h-10 rounded-xl bg-[#3B82F6]/20 text-[#3B82F6] text-sm font-medium hover:bg-[#3B82F6]/30 disabled:opacity-40 transition-colors"
                      >
                        Add Condition
                      </button>
                    </div>

                    {/* List of added rated conditions */}
                    {existingRated.length > 0 && (
                      <div className="space-y-2">
                        {existingRated.map((rc, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
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

            {/* Step 9: Feature Showcase */}
            {step === 9 && (
              <div className="space-y-5">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white">Here's what's inside</h2>
                  <p className="text-white/40 text-sm mt-1">Tools built to help you prepare your claim</p>
                </div>
                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                  {[
                    { title: 'Rating Calculator', desc: 'Calculate your combined VA disability rating using the bilateral factor formula' },
                    { title: 'C&P Exam Prep', desc: 'Prepare for your compensation exam with condition-specific checklists' },
                    { title: 'Personal Statement Generator', desc: 'Build a compelling personal statement step-by-step' },
                    { title: 'Doctor Summary Builder', desc: 'Create a medical summary letter for your provider' },
                    { title: 'Symptom & Sleep Tracking', desc: 'Log symptoms, sleep patterns, and medications to build your evidence trail' },
                    { title: 'Buddy Statement Builder', desc: 'Draft lay statements from people who witnessed your condition' },
                    { title: 'VA-Speak Translator', desc: 'Translate VA jargon and acronyms into plain English' },
                    { title: 'Back Pay Estimator', desc: 'Estimate your potential retroactive compensation' },
                    { title: 'Condition Explorer', desc: 'Discover conditions related to your MOS with rating criteria breakdowns' },
                  ].map((card) => (
                    <div key={card.title} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] mt-1.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm">{card.title}</p>
                        <p className="text-white/40 text-xs mt-0.5">{card.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-white/30 text-xs">By continuing, you agree to our <Link to="/settings/terms" className="text-[#3B82F6] underline">Terms of Service</Link> and <Link to="/settings/privacy" className="text-[#3B82F6] underline">Privacy Policy</Link>. This is a claim preparation tool &mdash; not a substitute for professional consultation with a VA-accredited representative.</p>
              </div>
            )}

            {/* Step 10: Thank You */}
            {step === 10 && (
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0, duration: 0.5 }}
                >
                  <span className="text-[80px] leading-none" role="img" aria-label="American flag">&#x1F1FA;&#x1F1F8;</span>
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
                  <p className="text-lg text-blue-500 font-medium">God Bless America</p>
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
                    className="w-full h-14 rounded-xl bg-blue-500 text-white text-base font-bold hover:bg-blue-600 transition-colors"
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
              {(step === 3 || step === 4 || step === 5 || step === 6 || step === 7 || step === 8) && (
                <button onClick={handleSkip} className="text-sm text-white/40 hover:text-white/60 transition-colors h-11 px-4">
                  Skip
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className="flex items-center gap-1 h-11 px-6 rounded-xl bg-[#3B82F6] text-[#102039] text-sm font-bold hover:bg-[#3B82F6]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
