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
    
    // Save separation date if provided
    if (separationDate) {
      saveSeparationDate(new Date(separationDate).toISOString());
    }
    
    // Save branch to localStorage
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
    // Welcome
    {
      icon: ShieldCheck,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      title: 'Welcome to Service Evidence Tracker',
      content: (
        <div className="space-y-4 text-center">
          <p className="text-muted-foreground">
            This app helps active duty service members and veterans document health issues 
            during service to build strong evidence for future VA disability claims.
          </p>
          <p className="text-muted-foreground">
            Whether you're preparing for a BDD (Benefits Delivery at Discharge) claim or 
            documenting conditions for a future claim, we'll help you stay organized.
          </p>
        </div>
      ),
    },
    // How it works
    {
      icon: ClipboardList,
      iconColor: 'text-medical',
      iconBg: 'bg-medical/10',
      title: 'Track Everything That Matters',
      content: (
        <div className="space-y-3 text-left">
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">1</div>
            <div>
              <p className="font-medium text-foreground">Medical Visits</p>
              <p className="text-sm text-muted-foreground">Log every appointment with dates, providers, and always request after-visit summaries</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">2</div>
            <div>
              <p className="font-medium text-foreground">Symptoms & Medications</p>
              <p className="text-sm text-muted-foreground">Track ongoing symptoms, migraines, and all medications you're prescribed</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">3</div>
            <div>
              <p className="font-medium text-foreground">Exposures & Evidence</p>
              <p className="text-sm text-muted-foreground">Document hazardous exposures and gather buddy statements from fellow service members</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">4</div>
            <div>
              <p className="font-medium text-foreground">Export Your Records</p>
              <p className="text-sm text-muted-foreground">Generate PDF reports to share with your VSO or include in your claim</p>
            </div>
          </div>
        </div>
      ),
    },
    // Privacy
    {
      icon: Lock,
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
      title: 'Your Data Stays Private',
      content: (
        <div className="space-y-4 text-center">
          <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
            <p className="font-medium text-foreground mb-2">
              🔒 100% Local Storage
            </p>
            <p className="text-sm text-muted-foreground">
              All your medical information is stored locally on YOUR device. 
              We never collect, transmit, or have access to your personal health data.
            </p>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>✓ No accounts required</p>
            <p>✓ No data sent to servers</p>
            <p>✓ No tracking or analytics</p>
            <p>✓ Your information, your control</p>
          </div>
          <p className="text-xs text-muted-foreground italic">
            Use the Export feature regularly to back up your data.
          </p>
        </div>
      ),
    },
    // Get Started
    {
      icon: Rocket,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      title: "Let's Get You Started",
      content: (
        <div className="space-y-5">
          <p className="text-sm text-muted-foreground text-center">
            A few quick questions to personalize your experience. You can always change these later.
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="branch">Military Branch</Label>
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
            <Label htmlFor="sepDate">Estimated Separation Date (for BDD Timer)</Label>
            <Input
              id="sepDate"
              type="date"
              value={separationDate}
              onChange={(e) => setSeparationDate(e.target.value)}
              placeholder="When do you expect to separate?"
            />
            <p className="text-xs text-muted-foreground">
              BDD claims can be filed 180-90 days before separation. We'll help you track this window.
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
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden" aria-describedby="onboarding-description">
        <VisuallyHidden.Root>
          <DialogTitle>{currentStepData.title}</DialogTitle>
          <DialogDescription id="onboarding-description">
            Onboarding wizard to help you get started with Service Evidence Tracker
          </DialogDescription>
        </VisuallyHidden.Root>
        {/* Progress indicator */}
        <div className="flex gap-1 px-6 pt-6">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-colors ${
                idx <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className={`h-16 w-16 rounded-full ${currentStepData.iconBg} flex items-center justify-center`}>
              <currentStepData.icon className={`h-8 w-8 ${currentStepData.iconColor}`} />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-center text-foreground">
            {currentStepData.title}
          </h2>

          {/* Content */}
          <div className="min-h-[200px]">
            {currentStepData.content}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 space-y-4">
          {/* Don't show again checkbox */}
          <div className="flex items-center justify-center gap-2">
            <Checkbox
              id="dontShow"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
            />
            <Label htmlFor="dontShow" className="text-sm text-muted-foreground cursor-pointer">
              Don't show this again
            </Label>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-muted-foreground"
            >
              Skip
            </Button>
            
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
              <Button onClick={nextStep}>
                {isLastStep ? (
                  'Get Started'
                ) : (
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
