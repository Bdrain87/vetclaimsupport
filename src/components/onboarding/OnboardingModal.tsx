import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Shield,
  ChevronRight,
  ChevronLeft,
  Search,
  Lock,
} from 'lucide-react';
import { useClaims } from '@/context/ClaimsContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const ONBOARDING_KEY = 'hasSeenOnboarding';

const militaryBranches = [
  { value: 'army', label: 'Army' },
  { value: 'navy', label: 'Navy' },
  { value: 'air-force', label: 'Air Force' },
  { value: 'marines', label: 'Marine Corps' },
  { value: 'coast-guard', label: 'Coast Guard' },
  { value: 'space-force', label: 'Space Force' },
];

const popularConditions = ['PTSD', 'Tinnitus', 'Back Pain', 'Knee Pain', 'Sleep Apnea', 'Migraines'];

interface OnboardingModalProps {
  forceShow?: boolean;
  onComplete?: () => void;
}

export function OnboardingModal({ forceShow = false, onComplete }: OnboardingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState({
    branch: '',
    serviceStart: '',
    serviceEnd: '',
  });
  const [conditionSearch, setConditionSearch] = useState('');
  const { setSeparationDate: saveSeparationDate, addClaimCondition } = useClaims();

  useEffect(() => {
    if (forceShow) {
      setIsOpen(true);
      return;
    }

    const hasSeenOnboarding = localStorage.getItem(ONBOARDING_KEY);
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, [forceShow]);

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');

    // Save profile if provided
    if (profile.branch) {
      localStorage.setItem('militaryBranch', profile.branch);
    }
    if (profile.serviceStart) {
      localStorage.setItem('serviceStart', profile.serviceStart);
    }
    if (profile.serviceEnd) {
      saveSeparationDate(new Date(profile.serviceEnd + '-01').toISOString());
    }

    setIsOpen(false);
    onComplete?.();
  };

  const handleSkip = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddCondition = (conditionName: string) => {
    addClaimCondition({
      name: conditionName,
      linkedMedicalVisits: [],
      linkedExposures: [],
      linkedSymptoms: [],
      linkedDocuments: [],
      linkedBuddyContacts: [],
      notes: '',
      createdAt: new Date().toISOString(),
    });
    handleComplete();
  };

  const steps = [
    // Step 0: Welcome
    {
      title: 'Welcome to Service Evidence Tracker',
      subtitle: 'Built to help you get the rating you earned',
      content: (
        <div className="space-y-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-lg"
          >
            <Shield className="h-10 w-10 text-white" />
          </motion.div>

          <div className="space-y-2">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Document your health issues and build strong evidence for your VA disability claim.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-success-500/10 border border-success-500/20">
            <Lock className="h-4 w-4 text-success-500" />
            <span className="text-xs text-success-600 dark:text-success-400 font-medium">
              100% Private - Your data never leaves your device
            </span>
          </div>
        </div>
      ),
      skippable: false,
    },
    // Step 1: Quick Profile (Optional)
    {
      title: 'Personalize Your Experience',
      subtitle: 'Optional - you can skip this',
      content: (
        <div className="space-y-4 w-full">
          <div className="space-y-2 w-full">
            <Label htmlFor="branch" className="text-sm font-medium">Military Branch</Label>
            <Select value={profile.branch} onValueChange={(value) => setProfile({ ...profile, branch: value })}>
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="Select your branch" />
              </SelectTrigger>
              <SelectContent>
                {militaryBranches.map((b) => (
                  <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="serviceStart" className="text-sm font-medium">Service Start</Label>
              <Input
                id="serviceStart"
                type="month"
                value={profile.serviceStart}
                onChange={(e) => setProfile({ ...profile, serviceStart: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceEnd" className="text-sm font-medium">Service End</Label>
              <Input
                id="serviceEnd"
                type="month"
                value={profile.serviceEnd}
                onChange={(e) => setProfile({ ...profile, serviceEnd: e.target.value })}
                className="h-11"
                placeholder="Present if active"
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            This helps calculate BDD filing windows and personalize your experience.
          </p>
        </div>
      ),
      skippable: true,
    },
    // Step 2: First Condition (Optional)
    {
      title: 'What brings you here?',
      subtitle: 'Add a condition to get started',
      content: (
        <div className="space-y-4 w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search conditions (e.g., PTSD, back pain)"
              value={conditionSearch}
              onChange={(e) => setConditionSearch(e.target.value)}
              className="pl-10 h-12"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && conditionSearch.trim()) {
                  handleAddCondition(conditionSearch.trim());
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Popular conditions:</p>
            <div className="flex flex-wrap gap-2">
              {popularConditions.map((condition) => (
                <button
                  key={condition}
                  onClick={() => handleAddCondition(condition)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium",
                    "bg-secondary hover:bg-secondary/80",
                    "border border-border hover:border-primary/30",
                    "transition-all duration-200",
                    "active:scale-95"
                  )}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Not sure? You can always add conditions later from the dashboard.
          </p>
        </div>
      ),
      skippable: true,
    },
  ];

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="sm:max-w-md max-w-[calc(100vw-2rem)] mx-auto [&>button]:hidden overflow-hidden p-0"
        aria-describedby="onboarding-description"
      >
        <VisuallyHidden.Root>
          <DialogTitle>{currentStepData.title}</DialogTitle>
          <DialogDescription id="onboarding-description">
            Onboarding wizard to help you get started with Service Evidence Tracker
          </DialogDescription>
        </VisuallyHidden.Root>

        <div className="p-6 space-y-6 w-full overflow-hidden">
          {/* Progress dots */}
          <div className="flex justify-center gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  idx === currentStep
                    ? "w-8 bg-success-500"
                    : idx < currentStep
                      ? "w-2 bg-success-500/50"
                      : "w-2 bg-border"
                )}
              />
            ))}
          </div>

          {/* Step content with animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Title */}
              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold text-foreground">{currentStepData.title}</h2>
                <p className="text-sm text-muted-foreground">{currentStepData.subtitle}</p>
              </div>

              {/* Content */}
              <div className="w-full">
                {currentStepData.content}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <div>
              {currentStep > 0 ? (
                <Button variant="ghost" onClick={handleBack} className="gap-1 h-11">
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
              ) : currentStepData.skippable ? (
                <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground h-11">
                  Skip
                </Button>
              ) : (
                <div />
              )}
            </div>

            <div className="flex gap-2">
              {currentStepData.skippable && currentStep > 0 && (
                <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground h-11">
                  Skip
                </Button>
              )}
              <Button
                onClick={handleNext}
                className="gap-1 h-11 bg-success-500 hover:bg-success-600 text-white"
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
