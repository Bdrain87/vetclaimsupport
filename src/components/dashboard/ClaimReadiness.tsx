import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, FileText, Stethoscope, Link2, Activity, ClipboardCheck } from 'lucide-react';
import { ClaimIntelligence } from '@/services/claimIntelligence';
import { getConditionById } from '@/data/vaConditions';
import type { UserCondition } from '@/store/useAppStore';
import type { ClaimsData } from '@/types/claims';
import { cn } from '@/lib/utils';

interface ClaimReadinessProps {
  userConditions: UserCondition[];
  claimsData: ClaimsData;
}

const COMPONENT_META = [
  { key: 'medicalEvidence' as const, label: 'Medical', icon: Stethoscope },
  { key: 'serviceConnection' as const, label: 'Service Link', icon: Link2 },
  { key: 'currentSeverity' as const, label: 'Severity Logs', icon: Activity },
  { key: 'statements' as const, label: 'Statements', icon: FileText },
  { key: 'examPrep' as const, label: 'Exam Prep', icon: ClipboardCheck },
];

function ScoreBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('h-1.5 rounded-full bg-muted overflow-hidden', className)}>
      <motion.div
        className={cn(
          'h-full rounded-full',
          value >= 70 ? 'bg-emerald-500' : value >= 40 ? 'bg-gold' : 'bg-red-500/70',
        )}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
}

export function ClaimReadiness({ userConditions, claimsData }: ClaimReadinessProps) {
  const perCondition = useMemo(() => {
    const pending = userConditions.filter((uc) => uc.claimStatus !== 'approved');
    return pending.map((uc) => {
      const details = getConditionById(uc.conditionId);
      const name = details?.name ?? uc.conditionId;
      const readiness = ClaimIntelligence.getConditionReadiness(name, claimsData);
      return { uc, name: details?.abbreviation || name, readiness };
    });
  }, [userConditions, claimsData]);

  if (perCondition.length === 0) return null;

  return (
    <div className="space-y-3">
      {perCondition.map(({ uc, name, readiness }) => (
        <Link key={uc.id} to={`/claims/${uc.id}`} className="block">
          <div className="rounded-lg border border-border bg-secondary/30 hover:bg-accent/30 transition-colors p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-foreground truncate">{name}</p>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span
                  className={cn(
                    'text-xs font-bold',
                    readiness.overallScore >= 70
                      ? 'text-emerald-500'
                      : readiness.overallScore >= 40
                        ? 'text-gold'
                        : 'text-red-500',
                  )}
                >
                  {readiness.overallScore}%
                </span>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
            <ScoreBar value={readiness.overallScore} />
            <div className="grid grid-cols-5 gap-1">
              {COMPONENT_META.map(({ key, label, icon: Icon }) => {
                const val = readiness.components[key];
                return (
                  <div key={key} className="flex flex-col items-center gap-0.5">
                    <Icon
                      className={cn(
                        'h-3 w-3',
                        val >= 70
                          ? 'text-emerald-500'
                          : val >= 40
                            ? 'text-gold'
                            : 'text-muted-foreground',
                      )}
                    />
                    <span className="text-[9px] text-muted-foreground leading-none">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
