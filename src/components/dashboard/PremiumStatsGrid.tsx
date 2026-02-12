import { useMemo } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  Activity,
  FileText,
  Calendar,
} from 'lucide-react';
import { motion } from 'framer-motion';

export function PremiumStatsGrid() {
  const { data } = useClaims();

  const claimConditions = data.claimConditions || [];

  const overallScore = useMemo(() => {
    if (claimConditions.length === 0) return 0;

    const totalScore = claimConditions.reduce((sum, condition) => {
      let score = 0;
      if (condition.linkedMedicalVisits.length > 0) score += 25;
      if (condition.linkedExposures.length > 0) score += 25;
      if (condition.linkedSymptoms.length > 0) score += 25;
      if (condition.linkedBuddyContacts.length > 0) score += 25;
      return sum + score;
    }, 0);

    return Math.round(totalScore / claimConditions.length);
  }, [claimConditions]);

  const phaseProgress = useMemo(() => {
    let completedTasks = 0;
    const totalTasks = 12; // 3 phases × 4 tasks

    // Phase 1
    if (data.serviceHistory.length > 0) completedTasks++;
    if (data.medicalVisits.length > 0) completedTasks++;
    if (data.exposures.length > 0) completedTasks++;
    if (data.separationDate) completedTasks++;

    // Phase 2
    if (data.symptoms.length >= 3) completedTasks++;
    if (data.medications.length > 0) completedTasks++;
    if (claimConditions.length > 0) completedTasks++;
    if (data.buddyContacts.length > 0) completedTasks++;

    // Phase 3
    const docsObtained = data.documents.filter(d => d.status === 'Obtained' || d.status === 'Submitted').length;
    if (docsObtained >= 3) completedTasks++;
    if (data.buddyContacts.some(b => b.statementStatus === 'Received')) completedTasks++;
    if ((data.uploadedDocuments?.length || 0) > 0) completedTasks++;
    if (claimConditions.some(c => c.linkedMedicalVisits.length > 0 || c.linkedSymptoms.length > 0)) completedTasks++;

    return Math.round((completedTasks / totalTasks) * 100);
  }, [data, claimConditions]);

  const daysUntilSep = useMemo(() => {
    if (!data.separationDate) return null;
    const sepDate = new Date(data.separationDate);
    const today = new Date();
    const diffTime = sepDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  }, [data.separationDate]);

  const totalEvidence = useMemo(() =>
    data.symptoms.length + data.medicalVisits.length + data.documents.filter(d => d.status === 'Obtained').length,
    [data.symptoms.length, data.medicalVisits.length, data.documents],
  );

  const glassCard = "bg-white/[0.07] backdrop-blur-sm border border-white/[0.10] rounded-2xl p-4 transition-all duration-300 ease-out overflow-hidden";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Evidence Score - Glass Card with Gold Readiness Ring */}
      <Link to="/claims" className="group">
        <div className={cn(
          glassCard,
          "hover:scale-[1.02] hover:shadow-[0_12px_40px_var(--gold-glow)] hover:border-[rgba(197,164,66,0.3)]"
        )}>
          <div className="flex items-center justify-center mb-2">
            <div className="relative w-16 h-16">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" className="text-white/[0.06]" strokeWidth="2.5" />
                <motion.circle
                  cx="18" cy="18" r="15" fill="none" stroke="var(--gold-md, #C5A442)" strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${overallScore}, 100` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                {overallScore}%
              </span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] font-medium text-white/50 mt-1">
              Evidence Score
            </div>
          </div>
        </div>
      </Link>

      {/* Phase Completion - Glass Card */}
      <Link to="/settings/journey" className="group">
        <div className={cn(
          glassCard,
          "hover:scale-[1.02] hover:shadow-[0_12px_40px_var(--gold-glow)] hover:border-[rgba(197,164,66,0.3)]"
        )}>
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-xl bg-[rgba(197,164,66,0.1)] border border-[rgba(197,164,66,0.2)]">
              <CheckCircle2 className="h-5 w-5 text-gold" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {phaseProgress}%
          </div>
          <div className="text-[10px] font-medium text-white/50 mt-1">
            Journey Complete
          </div>
        </div>
      </Link>

      {/* Conditions Tracked - Glass Card */}
      <Link to="/claims" className="group">
        <div className={cn(
          glassCard,
          "hover:scale-[1.02] hover:shadow-[0_12px_40px_var(--gold-glow)] hover:border-[rgba(197,164,66,0.2)]"
        )}>
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-xl bg-[rgba(197,164,66,0.1)] border border-[rgba(197,164,66,0.2)]">
              <FileText className="h-5 w-5 text-gold" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {claimConditions.length}
          </div>
          <div className="text-[10px] font-medium text-white/50 mt-1">
            Conditions
          </div>
        </div>
      </Link>

      {/* Evidence Items or Days to Separation */}
      {daysUntilSep ? (
        <div className={cn(
          glassCard,
          "border-[rgba(197,164,66,0.2)]"
        )}>
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-xl bg-[rgba(197,164,66,0.1)] border border-[rgba(197,164,66,0.2)]">
              <Calendar className="h-5 w-5 text-gold" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {daysUntilSep}
          </div>
          <div className="text-[10px] font-medium text-white/50 mt-1">
            Days to Sep
          </div>
        </div>
      ) : (
        <Link to="/health/symptoms" className="group">
          <div className={cn(
            glassCard,
            "hover:scale-[1.02] hover:shadow-[0_12px_40px_var(--gold-glow)] hover:border-[rgba(197,164,66,0.2)]"
          )}>
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-xl bg-[rgba(197,164,66,0.1)] border border-[rgba(197,164,66,0.2)]">
                <Activity className="h-5 w-5 text-gold" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">
              {totalEvidence}
            </div>
            <div className="text-[10px] font-medium text-white/50 mt-1">
              Evidence Items
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}
