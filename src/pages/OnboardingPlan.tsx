/**
 * OnboardingPlan — One-time interstitial shown after completing onboarding.
 * Shows: top conditions with diagnostic codes, recommended secondaries,
 * 3 personalized first actions, current combined rating of approved conditions.
 */
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { vcsSpring } from '@/constants/animations';
import { PageContainer } from '@/components/PageContainer';
import { useUserConditions } from '@/hooks/useUserConditions';
import { getConditionById } from '@/data/vaConditions';
import { conditionProfiles } from '@/data/secondaryConditions';
import { combineRatings } from '@/utils/vaMath';
import { getConditionDisplayName } from '@/utils/conditionResolver';
import { useProfileStore } from '@/store/useProfileStore';
import useAppStore from '@/store/useAppStore';
import {
  ChevronRight,
  Target,
  Activity,
  FileText,
  Link2,
  Shield,
} from 'lucide-react';
import { AIDisclaimer } from '@/components/ui/AIDisclaimer';

export default function OnboardingPlan() {
  const navigate = useNavigate();
  const { conditions: userConditions } = useUserConditions();
  const claimGoal = useProfileStore((s) => s.claimGoal);

  const conditionDetails = useMemo(() => {
    return userConditions.slice(0, 5).map((uc) => {
      const details = getConditionById(uc.conditionId);
      const profile = conditionProfiles.find((cp) => cp.id === uc.conditionId);
      return {
        id: uc.id,
        name: details?.abbreviation || details?.name || getConditionDisplayName(uc),
        diagnosticCode: details?.diagnosticCode || uc.vaDiagnosticCode || '—',
        rating: uc.rating,
        secondaries: profile?.possibleSecondaries?.slice(0, 3) ?? [],
        isPrimary: uc.isPrimary,
      };
    });
  }, [userConditions]);

  const estimatedCombined = useMemo(() => {
    const ratings = userConditions
      .filter((uc) => uc.rating !== undefined && uc.rating > 0)
      .map((uc) => uc.rating as number);
    return combineRatings(ratings);
  }, [userConditions]);

  const actions = useMemo(() => {
    const items: { title: string; desc: string; route: string; icon: typeof Target }[] = [];
    const symptoms = useAppStore.getState().symptoms;

    if (symptoms.length === 0) {
      items.push({
        title: 'Start logging symptoms',
        desc: 'Daily symptom logs are the #1 evidence type the VA looks for.',
        route: '/health/symptoms',
        icon: Activity,
      });
    }

    items.push({
      title: 'Build your personal statement',
      desc: 'A strong personal statement connects your service to your conditions.',
      route: '/prep/personal-statement',
      icon: FileText,
    });

    if (conditionDetails.some((c) => c.secondaries.length > 0)) {
      items.push({
        title: 'Explore secondary connections',
        desc: 'Your conditions may link to additional secondary conditions.',
        route: '/claims',
        icon: Link2,
      });
    }

    items.push({
      title: 'Prepare for your C&P exam',
      desc: 'Know exactly what the examiner will ask and how to respond.',
      route: '/prep/exam',
      icon: Shield,
    });

    return items.slice(0, 3);
  }, [conditionDetails]);

  return (
    <PageContainer className="space-y-5 animate-fade-in">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={vcsSpring}
        className="text-center pt-4"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 mb-3">
          <Target className="h-7 w-7 text-gold" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Your Personalized Plan</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Based on your profile, here&apos;s your preparation roadmap.
        </p>
      </motion.div>

      {/* Conditions Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...vcsSpring, delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-4 space-y-3"
      >
        <h2 className="text-sm font-bold text-foreground">Your Conditions</h2>
        {conditionDetails.length === 0 ? (
          <p className="text-sm text-muted-foreground">No conditions added yet. You can add them from the dashboard.</p>
        ) : (
          <div className="space-y-2">
            {conditionDetails.map((c) => (
              <div key={c.id} className="p-3 rounded-xl border border-border bg-secondary/50">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      DC {c.diagnosticCode}
                      {c.rating !== undefined && ` — ${c.rating}% rated`}
                      {c.isPrimary ? ' — Primary' : ' — Secondary'}
                    </p>
                  </div>
                </div>
                {c.secondaries.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="text-[10px] text-muted-foreground">Commonly associated:</span>
                    {c.secondaries.map((sec) => (
                      <span
                        key={sec}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20"
                      >
                        {sec.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Estimated Combined Rating */}
      {estimatedCombined > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...vcsSpring, delay: 0.2 }}
          className="rounded-2xl border border-gold/20 bg-gold/5 p-4"
        >
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" className="text-muted/30" strokeWidth="3" />
                <motion.circle
                  cx="18" cy="18" r="15" fill="none"
                  stroke="var(--gold-md, #C5A55A)" strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${estimatedCombined}, 100`}
                  initial={{ strokeDasharray: '0, 100' }}
                  animate={{ strokeDasharray: `${estimatedCombined}, 100` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-foreground font-bold text-sm">
                {estimatedCombined}%
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Current Combined Rating</p>
              <p className="text-xs text-muted-foreground">Based on your approved conditions using VA math</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recommended First Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...vcsSpring, delay: 0.3 }}
        className="rounded-2xl border border-border bg-card p-4 space-y-3"
      >
        <h2 className="text-sm font-bold text-foreground">Your First Steps</h2>
        <div className="space-y-2">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={() => navigate(action.route)}
              className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:bg-accent/50 transition-colors text-left"
            >
              <span className="shrink-0 w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center">
                <action.icon className="h-4 w-4 text-gold" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{action.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Go to Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...vcsSpring, delay: 0.4 }}
      >
        <button
          onClick={() => navigate('/app', { replace: true })}
          className="w-full py-3 rounded-2xl bg-gold text-black font-semibold text-sm hover:bg-gold/90 transition-colors"
        >
          Go to My Dashboard
        </button>
      </motion.div>

      <AIDisclaimer context="onboarding-plan" />
    </PageContainer>
  );
}
