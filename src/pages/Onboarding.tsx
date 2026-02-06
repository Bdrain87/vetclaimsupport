import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, Search, Shield, User, Briefcase, Stethoscope, Check } from 'lucide-react';
import { useProfileStore, BRANCH_LABELS, BRANCH_COLORS, type Branch } from '@/store/useProfileStore';
import { militaryJobCodes, searchMilitaryJobs, type MilitaryJobCode } from '@/data/militaryMOS';
import { ConditionAutocomplete } from '@/components/shared/ConditionAutocomplete';
import { useUserConditions } from '@/hooks/useUserConditions';
import { type VACondition, getConditionById } from '@/data/vaConditions';

const TOTAL_STEPS = 6;

// MOS branch mapping
const BRANCH_TO_MOS: Record<Branch, string> = {
  army: 'Army',
  marines: 'Marines',
  navy: 'Navy',
  air_force: 'Air Force',
  coast_guard: 'Coast Guard',
  space_force: 'Space Force',
};

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
        className="w-full h-12 pl-10 pr-4 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#C8A628]/40 focus:border-[#C8A628]/50 transition-all"
      />
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-[#1a2d44] border border-white/10 rounded-xl shadow-2xl shadow-black/50 max-h-60 overflow-y-auto">
          {results.map((job, i) => (
            <button
              key={`${job.code}-${job.branch}`}
              ref={i === highlightIdx ? highlightRef : undefined}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                i === highlightIdx ? 'bg-[#C8A628]/15 text-white' : 'text-white/80 hover:bg-white/5'
              } ${i > 0 ? 'border-t border-white/[0.04]' : ''}`}
              onClick={() => handleSelect(job)}
              onMouseEnter={() => setHighlightIdx(i)}
            >
              <span className="font-mono text-[#C8A628] text-sm font-bold w-16 shrink-0">{job.code}</span>
              <span className="text-sm flex-1 truncate">{job.title}</span>
              <span className="text-[10px] text-white/30 uppercase">{job.branch}</span>
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
  const store = useProfileStore();
  const { addCondition, conditions: userConditions } = useUserConditions();

  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState(store.firstName);
  const [lastName, setLastName] = useState(store.lastName);
  const [branch, setBranch] = useState<Branch | ''>(store.branch);
  const [mosCode, setMosCode] = useState(store.mosCode);
  const [mosTitle, setMosTitle] = useState(store.mosTitle);
  const [addedConditions, setAddedConditions] = useState<string[]>([]);
  const [nameError, setNameError] = useState('');

  // If already onboarded, redirect to dashboard
  useEffect(() => {
    if (store.hasCompletedOnboarding) {
      navigate('/dashboard', { replace: true });
    }
  }, [store.hasCompletedOnboarding, navigate]);

  const canProceed = useMemo(() => {
    switch (step) {
      case 0: return true; // Welcome
      case 1: return firstName.trim().length > 0; // Name
      case 2: return branch !== ''; // Branch
      case 3: return true; // MOS (optional)
      case 4: return true; // Conditions (optional)
      case 5: return true; // Complete
      default: return true;
    }
  }, [step, firstName, branch]);

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

  const handleComplete = () => {
    store.setFirstName(firstName.trim());
    store.setLastName(lastName.trim());
    if (branch) store.setBranch(branch);
    if (mosCode) store.setMOS(mosCode, mosTitle);
    store.completeOnboarding();
    navigate('/dashboard', { replace: true });
  };

  const handleAddCondition = (condition: VACondition) => {
    addCondition(condition.id);
    setAddedConditions(prev => [...prev, condition.id]);
  };

  const handleRemoveCondition = (id: string) => {
    setAddedConditions(prev => prev.filter(c => c !== id));
  };

  // Progress dots
  const ProgressDots = () => (
    <div className="flex justify-center gap-2">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            i === step ? 'w-8 bg-[#C8A628]' : i < step ? 'w-2 bg-[#C8A628]/50' : 'w-2 bg-white/10'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-[#102039] flex flex-col items-center justify-center px-4 py-8">
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
                <div className="w-20 h-20 mx-auto rounded-2xl bg-[#C8A628] flex items-center justify-center shadow-lg shadow-[#C8A628]/20">
                  <span className="text-[#102039] font-black italic text-3xl">V</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Welcome to Vet Claim Support</h1>
                  <p className="text-white/50 mt-2 text-sm leading-relaxed">
                    Built by veterans, for veterans.<br />
                    Let&apos;s personalize your experience in under 2 minutes.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-medium">100% Private — Your data never leaves your device</span>
                </div>
              </div>
            )}

            {/* Step 1: Name */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center mb-4">
                    <User className="h-7 w-7 text-[#C8A628]" />
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
                      className={`w-full h-12 px-4 bg-white/[0.06] border rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#C8A628]/40 transition-all ${
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
                    className="w-full h-12 px-4 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#C8A628]/40 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Branch */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white">Which branch did you serve in?</h2>
                </div>
                <div className="space-y-2">
                  {(Object.entries(BRANCH_LABELS) as [Branch, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setBranch(key)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                        branch === key
                          ? 'bg-[#C8A628]/10 border-[#C8A628]/40 text-white'
                          : 'bg-white/[0.04] border-white/[0.08] text-white/70 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                        style={{ borderColor: branch === key ? '#C8A628' : 'rgba(255,255,255,0.2)' }}
                      >
                        {branch === key && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#C8A628]" />
                        )}
                      </div>
                      <div className="w-2 h-8 rounded-sm shrink-0" style={{ background: BRANCH_COLORS[key] }} />
                      <span className="font-medium text-sm">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: MOS */}
            {step === 3 && branch && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center mb-4">
                    <Briefcase className="h-7 w-7 text-[#C8A628]" />
                  </div>
                  <h2 className="text-xl font-bold text-white">What was your military job?</h2>
                  <p className="text-white/40 text-sm mt-1">Type your code or job title</p>
                </div>
                <MOSAutocomplete
                  branch={branch}
                  value={mosCode ? `${mosCode} — ${mosTitle}` : ''}
                  onSelect={(job) => {
                    setMosCode(job.code);
                    setMosTitle(job.title);
                  }}
                />
                {mosCode && (
                  <div className="flex items-center gap-2 text-sm text-[#C8A628]">
                    <Check className="h-4 w-4" />
                    <span>{mosCode} — {mosTitle}</span>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Conditions */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center mb-4">
                    <Stethoscope className="h-7 w-7 text-[#C8A628]" />
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
                        <span key={id} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#C8A628]/10 border border-[#C8A628]/30 text-sm text-[#C8A628]">
                          {c.abbreviation || c.name}
                          <button onClick={() => handleRemoveCondition(id)} className="ml-1 text-[#C8A628]/60 hover:text-[#C8A628]" aria-label={`Remove ${c.abbreviation}`}>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Complete */}
            {step === 5 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
                  <Check className="h-10 w-10 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">You&apos;re all set, {firstName.trim() || 'Veteran'}!</h2>
                  <p className="text-white/50 mt-2 text-sm">Your personalized dashboard is ready.</p>
                </div>
                <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-4 text-left space-y-2">
                  {branch && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">Branch</span>
                      <span className="text-white font-medium">{BRANCH_LABELS[branch]}</span>
                    </div>
                  )}
                  {mosCode && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">MOS/AFSC</span>
                      <span className="text-white font-medium">{mosCode} — {mosTitle}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">Conditions</span>
                    <span className="text-white font-medium">{addedConditions.length} tracked</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <div>
            {step > 0 && step < TOTAL_STEPS - 1 && (
              <button onClick={handleBack} className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors h-11 px-4">
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {(step === 3 || step === 4) && (
              <button onClick={handleSkip} className="text-sm text-white/40 hover:text-white/60 transition-colors h-11 px-4">
                Skip
              </button>
            )}
            {step < TOTAL_STEPS - 1 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className="flex items-center gap-1 h-11 px-6 rounded-xl bg-[#C8A628] text-[#102039] text-sm font-bold hover:bg-[#C8A628]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {step === 0 ? 'Get Started' : 'Continue'}
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex items-center gap-1 h-11 px-6 rounded-xl bg-[#C8A628] text-[#102039] text-sm font-bold hover:bg-[#C8A628]/90 transition-all"
              >
                Go to Dashboard
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
