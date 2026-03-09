/**
 * ConditionJourney — Per-condition guided pathway with step-by-step
 * completion tracking. Links to relevant tools with condition pre-selected.
 */
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { vcsSpring } from '@/constants/animations';
import { PageContainer } from '@/components/PageContainer';
import { useConditionJourney } from '@/hooks/useConditionJourney';
import { useUserConditions } from '@/hooks/useUserConditions';
import { getConditionById } from '@/data/vaConditions';
import { getConditionDisplayName } from '@/utils/conditionResolver';
import { ChevronRight, CheckCircle2, Circle, ArrowLeft, Target, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { notifySuccess } from '@/lib/haptics';

export default function ConditionJourney() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { conditions: userConditions } = useUserConditions();

  const uc = userConditions.find((c) => c.id === id);
  const details = uc ? getConditionById(uc.conditionId) : undefined;
  const conditionName = uc
    ? details?.abbreviation || details?.name || getConditionDisplayName(uc)
    : '';
  const conditionId = uc?.conditionId ?? '';

  const journey = useConditionJourney(conditionId, conditionName);

  if (!uc) {
    return (
      <PageContainer className="py-12 text-center">
        <p className="text-muted-foreground">Condition not found.</p>
        <button onClick={() => navigate('/claims')} className="text-gold text-sm mt-2">
          Back to Conditions
        </button>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-foreground truncate">{conditionName} Journey</h1>
          <p className="text-sm text-muted-foreground">
            {journey.completedSteps}/{journey.totalSteps} steps complete
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={vcsSpring}
        className="rounded-full h-2 bg-muted overflow-hidden"
      >
        <motion.div
          className="h-full bg-gold rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${journey.overallProgress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </motion.div>

      {/* Completion Celebration */}
      {journey.overallProgress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onAnimationComplete={() => notifySuccess()}
          className="flex items-center gap-3 p-4 rounded-2xl border border-gold/20 bg-gold/5"
        >
          <PartyPopper className="h-6 w-6 text-gold shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gold">
              Journey Complete!
            </p>
            <p className="text-xs text-muted-foreground">
              You've completed all preparation steps for {conditionName}. Review your evidence and consult a VSO before filing.
            </p>
          </div>
        </motion.div>
      )}

      {/* Steps */}
      <div className="space-y-3">
        {journey.steps.map((step, i) => (
          <motion.button
            key={step.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...vcsSpring, delay: i * 0.05 }}
            onClick={() => navigate(step.route)}
            className={cn(
              'w-full flex items-start gap-3 p-4 rounded-2xl border text-left transition-colors',
              step.isComplete
                ? 'border-gold/20 bg-gold/5'
                : 'border-border bg-card hover:bg-accent/50',
            )}
          >
            <div className="mt-0.5 shrink-0">
              {step.isComplete ? (
                <CheckCircle2 className="h-5 w-5 text-gold" />
              ) : (
                <div className="relative">
                  <Circle className="h-5 w-5 text-muted-foreground/30" />
                  {step.progress > 0 && (
                    <svg className="absolute inset-0 h-5 w-5 -rotate-90" viewBox="0 0 20 20">
                      <circle
                        cx="10" cy="10" r="8" fill="none"
                        stroke="var(--gold-md, #C5A55A)" strokeWidth="2"
                        strokeDasharray={`${(step.progress / 100) * 50.3} 50.3`}
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn(
                'text-sm font-medium',
                step.isComplete ? 'text-gold' : 'text-foreground',
              )}>
                {step.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
              {step.detail && (
                <p className="text-xs text-gold mt-1 font-medium">{step.detail}</p>
              )}
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
          </motion.button>
        ))}
      </div>

      {/* Preparation disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/50">
        <Target className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[10px] text-muted-foreground">
          This is a claim preparation guide. All recommendations are for documentation purposes only.
          Final ratings are determined solely by the VA. Consult a VSO for personalized advice.
        </p>
      </div>
    </PageContainer>
  );
}
