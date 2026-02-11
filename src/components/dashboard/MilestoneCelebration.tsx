import { useEffect, useState } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Rocket, Target, Medal, Award, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ClaimsData, BuddyContact, QuickLogEntry } from '@/types/claims';

interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: typeof Trophy;
  condition: (data: ClaimsData) => boolean;
  celebrationMessage: string;
}

const milestones: Milestone[] = [
  {
    id: 'first-visit',
    title: 'First Medical Visit!',
    description: 'You logged your first medical visit',
    icon: Star,
    condition: (data) => data.medicalVisits.length >= 1,
    celebrationMessage: 'Great start! Documenting medical visits is crucial for your claim.',
  },
  {
    id: 'five-visits',
    title: 'Evidence Builder!',
    description: 'You\'ve logged 5 medical visits',
    icon: Target,
    condition: (data) => data.medicalVisits.length >= 5,
    celebrationMessage: 'Excellent work! A strong medical history strengthens your claim.',
  },
  {
    id: 'first-condition',
    title: 'Claim Started!',
    description: 'You added your first condition to claim',
    icon: Rocket,
    condition: (data) => (data.claimConditions || []).length >= 1,
    celebrationMessage: 'You\'re on your way! Link evidence to build a strong case.',
  },
  {
    id: 'three-conditions',
    title: 'Building Your Case!',
    description: 'You\'re tracking 3 or more conditions',
    icon: Trophy,
    condition: (data) => (data.claimConditions || []).length >= 3,
    celebrationMessage: 'Multiple conditions mean potentially higher combined rating!',
  },
  {
    id: 'first-buddy',
    title: 'Witness Added!',
    description: 'You added your first buddy contact',
    icon: Medal,
    condition: (data) => data.buddyContacts.length >= 1,
    celebrationMessage: 'Third-party statements are powerful evidence!',
  },
  {
    id: 'buddy-statement',
    title: 'Statement Received!',
    description: 'You received a buddy statement',
    icon: Award,
    condition: (data) => data.buddyContacts.some((b: BuddyContact) => b.statementStatus === 'Received' || b.statementStatus === 'Submitted'),
    celebrationMessage: 'Amazing! Buddy statements significantly strengthen claims.',
  },
  {
    id: 'ten-symptoms',
    title: 'Symptom Tracker Pro!',
    description: 'You\'ve logged 10 symptom entries',
    icon: PartyPopper,
    condition: (data) => data.symptoms.length >= 10,
    celebrationMessage: 'Consistent symptom logging shows the chronic nature of your conditions.',
  },
  {
    id: 'week-streak',
    title: 'Consistent Logger!',
    description: 'You\'ve logged entries for 7 days',
    icon: Star,
    condition: (data) => {
      const logs = data.quickLogs || [];
      const uniqueDays = new Set(logs.map((l: QuickLogEntry) => l.date)).size;
      return uniqueDays >= 7;
    },
    celebrationMessage: 'Consistency pays off! Keep up the great work.',
  },
];

export function MilestoneCelebration() {
  const { data, addMilestone } = useClaims();
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    const achieved = data.milestonesAchieved || [];
    
    // Check for newly achieved milestones
    for (const milestone of milestones) {
      if (!achieved.includes(milestone.id) && milestone.condition(data)) {
        // New milestone achieved!
        setCurrentMilestone(milestone);
        setShowCelebration(true);
        addMilestone(milestone.id);
        
        // Trigger confetti
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#D6B25E', '#E8CC6E', '#B8962E', '#E8CC6E'],
          });
        }, 200);
        
        break; // Only show one at a time
      }
    }
  }, [data, addMilestone]);

  if (!currentMilestone) return null;

  const Icon = currentMilestone.icon;

  return (
    <Dialog open={showCelebration} onOpenChange={setShowCelebration}>
      <DialogContent className="sm:max-w-md" aria-describedby="milestone-description">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2"><Trophy className="h-5 w-5 text-gold" /> Milestone Achieved!</DialogTitle>
          <DialogDescription id="milestone-description" className="sr-only">
            Congratulations on achieving a new milestone in your evidence tracking journey
          </DialogDescription>
        </DialogHeader>
        <div className="text-center py-6 space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-success/20 to-primary/20 mx-auto flex items-center justify-center">
            <Icon className="h-10 w-10 text-success" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{currentMilestone.title}</h3>
            <p className="text-muted-foreground mt-1">{currentMilestone.description}</p>
          </div>
          <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
            <p className="text-sm text-foreground">{currentMilestone.celebrationMessage}</p>
          </div>
          <Button onClick={() => setShowCelebration(false)} className="w-full">
            Keep Going!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
