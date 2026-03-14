/**
 * ConditionCompletenessDashboard — All conditions side-by-side with progress
 * rings showing per-condition evidence completeness.
 */
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserConditions } from '@/hooks/useUserConditions';
import { useClaims } from '@/hooks/useClaims';
import { ClaimIntelligence } from '@/services/claimIntelligence';
import { getConditionById } from '@/data/vaConditions';
import { getConditionDisplayName } from '@/utils/conditionResolver';
import useAppStore from '@/store/useAppStore';
import { useShallow } from 'zustand/react/shallow';
import { getConditionSymptoms, getConditionMedications } from '@/utils/prefillHelpers';
import { ChevronRight, CheckCircle2 } from 'lucide-react';

interface ConditionProgress {
  id: string;
  name: string;
  overallPercent: number;
  categories: {
    label: string;
    count: number;
    target: number;
    percent: number;
  }[];
}

function MiniProgressRing({ percent }: { percent: number }) {
  const circumference = 2 * Math.PI * 12;
  const offset = circumference - (percent / 100) * circumference;
  const color = percent >= 70 ? '#22c55e' : percent >= 40 ? '#B8AB80' : '#ef4444';

  return (
    <svg width="32" height="32" viewBox="0 0 32 32" className="shrink-0">
      <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="2.5" />
      <circle
        cx="16" cy="16" r="12" fill="none" stroke={color} strokeWidth="2.5"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 16 16)"
        className="transition-all duration-700"
      />
      <text x="16" y="18" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold">
        {percent}
      </text>
    </svg>
  );
}

export function ConditionCompletenessDashboard({ compact = false }: { compact?: boolean }) {
  const { conditions: userConditions } = useUserConditions();
  const { data: claimsData } = useClaims();
  const navigate = useNavigate();
  const { symptoms, medications, buddyContacts, medicalVisits } = useAppStore(
    useShallow((s) => ({
      symptoms: s.symptoms,
      medications: s.medications,
      buddyContacts: s.buddyContacts,
      medicalVisits: s.medicalVisits,
    })),
  );

  const progressData: ConditionProgress[] = useMemo(() => {
    return userConditions.slice(0, compact ? 3 : 10).map((uc) => {
      const details = getConditionById(uc.conditionId);
      const name = details?.abbreviation || details?.name || getConditionDisplayName(uc);
      const condName = getConditionDisplayName(uc);

      const condSymptoms = getConditionSymptoms(condName, symptoms);
      const condMeds = getConditionMedications(condName, medications);
      const condVisits = medicalVisits.filter(
        (v) =>
          v.reason?.toLowerCase().includes(condName.toLowerCase()) ||
          v.notes?.toLowerCase().includes(condName.toLowerCase()),
      );

      const symptomPercent = Math.min(100, Math.round((condSymptoms.length / 10) * 100));
      const visitPercent = Math.min(100, Math.round((condVisits.length / 3) * 100));
      const medPercent = Math.min(100, Math.round((condMeds.length / 1) * 100));
      const buddyPercent = Math.min(100, Math.round((buddyContacts.length / 2) * 100));

      const overallPercent = Math.round(
        symptomPercent * 0.35 + visitPercent * 0.3 + medPercent * 0.15 + buddyPercent * 0.2,
      );

      return {
        id: uc.id,
        name,
        overallPercent: Math.min(100, overallPercent),
        categories: [
          { label: 'Symptoms', count: condSymptoms.length, target: 10, percent: symptomPercent },
          { label: 'Medical Visits', count: condVisits.length, target: 3, percent: visitPercent },
          { label: 'Medications', count: condMeds.length, target: 1, percent: medPercent },
          { label: 'Buddy Statements', count: buddyContacts.length, target: 2, percent: buddyPercent },
        ],
      };
    });
  }, [userConditions, symptoms, medications, medicalVisits, buddyContacts, compact]);

  if (progressData.length === 0) return null;

  if (compact) {
    return (
      <div className="space-y-2">
        {progressData.map((cp) => (
          <button
            key={cp.id}
            onClick={() => navigate('/claims')}
            className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border bg-secondary/30 hover:bg-accent/50 transition-colors text-left"
          >
            <MiniProgressRing percent={cp.overallPercent} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{cp.name}</p>
              <p className="text-xs text-muted-foreground">
                {cp.overallPercent >= 70 ? 'Well documented' : cp.overallPercent >= 40 ? 'In progress' : 'Needs attention'}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {progressData.map((cp) => (
        <div key={cp.id} className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-3">
            <MiniProgressRing percent={cp.overallPercent} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground">{cp.name}</p>
              <p className="text-xs text-muted-foreground">
                {cp.overallPercent}% evidence completeness
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {cp.categories.map((cat) => (
              <div key={cat.label} className="flex items-center gap-2 text-xs">
                <CheckCircle2
                  className={`h-3 w-3 shrink-0 ${cat.percent >= 100 ? 'text-gold' : cat.percent > 0 ? 'text-gold' : 'text-muted-foreground/30'}`}
                />
                <span className="text-muted-foreground">
                  {cat.label}: {cat.count}/{cat.target}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
