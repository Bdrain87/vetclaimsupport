import { useClaims } from '@/hooks/useClaims';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Target,
  TrendingUp,
  CheckCircle2,
  Activity,
  FileText,
  Calendar,
} from 'lucide-react';

export function PremiumStatsGrid() {
  const { data } = useClaims();
  
  const claimConditions = data.claimConditions || [];
  
  // Calculate overall evidence score
  const calculateOverallScore = () => {
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
  };

  // Calculate phase completion
  const calculatePhaseProgress = () => {
    let completedTasks = 0;
    const totalTasks = 16; // 4 phases × 4 tasks
    
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
  };

  // Calculate days until separation (if applicable)
  const getDaysUntilSeparation = () => {
    if (!data.separationDate) return null;
    const sepDate = new Date(data.separationDate);
    const today = new Date();
    const diffTime = sepDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };

  const overallScore = calculateOverallScore();
  const phaseProgress = calculatePhaseProgress();
  const daysUntilSep = getDaysUntilSeparation();
  const totalEvidence = data.symptoms.length + data.medicalVisits.length + data.documents.filter(d => d.status === 'Obtained').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Evidence Score - Primary Gradient */}
      <Link to="/" className="group">
        <div className={cn(
          "gradient-stat-primary",
          "transition-all duration-300 ease-out",
          "hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(59,130,246,0.4)]"
        )}>
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-xl bg-white/20">
              <Target className="h-5 w-5 text-white" />
            </div>
            <TrendingUp className="h-4 w-4 text-white/70" />
          </div>
          <div className="stat-value text-white">
            {overallScore}%
          </div>
          <div className="stat-label text-white/70 mt-1">
            Evidence Score
          </div>
        </div>
      </Link>

      {/* Phase Completion - Success Gradient */}
      <Link to="/" className="group">
        <div className={cn(
          "gradient-stat-success",
          "transition-all duration-300 ease-out",
          "hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(34,197,94,0.4)]"
        )}>
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-xl bg-white/20">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="stat-value text-white">
            {phaseProgress}%
          </div>
          <div className="stat-label text-white/70 mt-1">
            Journey Complete
          </div>
        </div>
      </Link>

      {/* Conditions Tracked - Dark Premium Card */}
      <Link to="/" className="group">
        <div className={cn(
          "premium-stat-card",
          "hover:border-primary/30"
        )}>
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="stat-value text-foreground">
            {claimConditions.length}
          </div>
          <div className="stat-label text-muted-foreground mt-1">
            Conditions
          </div>
        </div>
      </Link>

      {/* Evidence Items or Days to Separation */}
      {daysUntilSep ? (
        <div className={cn(
          "gradient-stat-warning",
          "transition-all duration-300 ease-out"
        )}>
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-xl bg-white/20">
              <Calendar className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="stat-value text-white">
            {daysUntilSep}
          </div>
          <div className="stat-label text-white/70 mt-1">
            Days to Sep
          </div>
        </div>
      ) : (
        <Link to="/symptoms" className="group">
          <div className={cn(
            "premium-stat-card",
            "hover:border-success/30"
          )}>
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-xl bg-success/10">
                <Activity className="h-5 w-5 text-success" />
              </div>
            </div>
            <div className="stat-value text-foreground">
              {totalEvidence}
            </div>
            <div className="stat-label text-muted-foreground mt-1">
              Evidence Items
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}
