import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ShieldCheck, 
  ClipboardList, 
  Lock, 
  Rocket,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useClaims } from '@/context/ClaimsContext';
import { cn } from '@/lib/utils';

const ONBOARDING_KEY = 'hasSeenOnboarding';

const militaryBranches = [
  'Army',
  'Navy', 
  'Air Force',
  'Marine Corps',
  'Coast Guard',
  'Space Force',
];

interface OnboardingModalProps {
  forceShow?: boolean;
  onComplete?: () => void;
}

export function OnboardingModal({ forceShow = false, onComplete }: OnboardingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(true);
  const [separationDate, setSeparationDate] = useState('');
  const [branch, setBranch] = useState('');
  const { setSeparationDate: saveSeparationDate } = useClaims();

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
    if (dontShowAgain) {
      localStorage.setItem(ONBOARDING_KEY, 'true');
    }
    
    if (separationDate) {
      saveSeparationDate(new Date(separationDate).toISOString());
    }
    
    if (branch) {
      localStorage.setItem('militaryBranch', branch);
    }
    
    setIsOpen(false);
    onComplete?.();
  };

  const handleSkip = () => {
    if (dontShowAgain) {
      localStorage.setItem(ONBOARDING_KEY, 'true');
    }
    setIsOpen(false);
    onComplete?.();
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      icon: ShieldCheck,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/15',
      title: 'Welcome',
      subtitle: 'Service Evidence Tracker',
      content: (
        <div className="space-y-4 text-center">
          <p className="text-muted-foreground text-sm leading-relaxed">
            Document health issues during service to build strong evidence for VA disability claims.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Perfect for BDD claims or documenting conditions for future claims.
          </p>
        </div>
      ),
    },
    {
      icon: ClipboardList,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/15',
      title: 'Track Everything',
      subtitle: 'That matters for your claim',
      content: (
        <div className="space-y-3">
          {[
            { num: '1', title: 'Medical Visits', desc: 'Log appointments with dates and providers' },
            { num: '2', title: 'Symptoms', desc: 'Track ongoing issues and medications' },
            { num: '3', title: 'Exposures', desc: 'Document hazardous exposures and evidence' },
            { num: '4', title: 'Export', desc: 'Generate PDFs to share with your VSO' },
          ].map((item) => (
            <div key={item.num} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
              <div className="h-6 w-6 rounded-lg bg-primary/15 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                {item.num}
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: Lock,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/15',
      title: '100% Private',
      subtitle: 'Your data stays on your device',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
            <p className="font-medium text-foreground text-sm mb-2">🔒 Local Storage Only</p>
            <p className="text-xs text-muted-foreground">
              We never collect, transmit, or have access to your personal health data.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            {['No accounts', 'No servers', 'No tracking', 'Your control'].map((item) => (
              <div key={item} className="p-3 rounded-xl bg-muted/50 text-xs text-muted-foreground">
                ✓ {item}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: Rocket,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/15',
      title: 'Get Started',
      subtitle: 'Quick setup (optional)',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="branch" className="text-sm">Military Branch</Label>
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger>
                <SelectValue placeholder="Select your branch" />
              </SelectTrigger>
              <SelectContent>
                {militaryBranches.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sepDate" className="text-sm">Separation Date</Label>
            <Input
              id="sepDate"
              type="date"
              value={separationDate}
              onChange={(e) => setSeparationDate(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              For BDD timer (file 180-90 days before)
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md [&>button]:hidden" aria-describedby="onboarding-description">
        <VisuallyHidden.Root>
          <DialogTitle>{currentStepData.title}</DialogTitle>
          <DialogDescription id="onboarding-description">
            Onboarding wizard to help you get started with Service Evidence Tracker
          </DialogDescription>
        </VisuallyHidden.Root>

        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {/* Progress dots */}
          <div className="flex justify-center gap-1.5">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx === currentStep ? "w-5 bg-primary" : "w-1.5 bg-white/20"
                )}
              />
            ))}
          </div>

          {/* Icon */}
          <div className="flex justify-center">
            <div className={cn(
              "h-12 w-12 sm:h-14 sm:w-14 rounded-xl flex items-center justify-center",
              currentStepData.iconBg
            )}>
              <currentStepData.icon className={cn("h-6 w-6 sm:h-7 sm:w-7", currentStepData.iconColor)} />
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">{currentStepData.title}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{currentStepData.subtitle}</p>
          </div>

          {/* Content */}
          <div className="min-h-[140px] sm:min-h-[160px]">
            {currentStepData.content}
          </div>

          {/* Don't show again */}
          <label className="flex items-center justify-center gap-2 cursor-pointer py-1">
            <Checkbox
              id="dontShow"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
            />
            <span className="text-xs text-muted-foreground">Don't show again</span>
          </label>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-2">
            <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground h-10">
              Skip
            </Button>
            
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={prevStep} size="icon" className="h-10 w-10">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              <Button onClick={nextStep} className="h-10">
                {isLastStep ? 'Get Started' : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}