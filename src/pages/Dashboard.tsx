import { useClaims } from '@/context/ClaimsContext';
import { 
  Stethoscope, 
  AlertTriangle, 
  Activity, 
  Pill,
  FileWarning,
  ShieldCheck,
  ChevronRight,
  Plus,
  Target,
  CheckCircle2,
  Circle,
  Trash2,
  Link2,
} from 'lucide-react';
import { BDDCountdown } from '@/components/dashboard/BDDCountdown';
import { RatingCalculator } from '@/components/dashboard/RatingCalculator';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { SuggestedDisabilities } from '@/components/dashboard/SuggestedDisabilities';
import { ClaimReadinessScore } from '@/components/dashboard/ClaimReadinessScore';
import { IntentToFileCard } from '@/components/dashboard/IntentToFileCard';
import { DashboardInsights } from '@/components/dashboard/DashboardInsights';
import { MobileNavGrid } from '@/components/dashboard/MobileNavGrid';
import { QuickLogWidget } from '@/components/dashboard/QuickLogWidget';
import { EvidenceGapAnalyzer } from '@/components/dashboard/EvidenceGapAnalyzer';
import { ShareWithVSO } from '@/components/dashboard/ShareWithVSO';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function Dashboard() {
  const { data, setSeparationDate, addClaimCondition, deleteClaimCondition } = useClaims();
  const navigate = useNavigate();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newConditionName, setNewConditionName] = useState('');

  const claimConditions = data.claimConditions || [];

  const handleAddCondition = () => {
    if (!newConditionName.trim()) return;
    addClaimCondition({
      name: newConditionName.trim(),
      linkedMedicalVisits: [],
      linkedExposures: [],
      linkedSymptoms: [],
      linkedDocuments: [],
      linkedBuddyContacts: [],
      notes: '',
      createdAt: new Date().toISOString(),
    });
    setNewConditionName('');
    setIsAddOpen(false);
  };

  const getEvidenceScore = (condition: typeof claimConditions[0]) => {
    let score = 0;
    if (condition.linkedMedicalVisits.length > 0) score += 25;
    if (condition.linkedExposures.length > 0) score += 25;
    if (condition.linkedSymptoms.length > 0) score += 25;
    if (condition.linkedBuddyContacts.length > 0) score += 25;
    return score;
  };

  const stats = [
    { title: 'Medical', value: data.medicalVisits.length, icon: Stethoscope, href: '/medical-visits' },
    { title: 'Exposures', value: data.exposures.length, icon: AlertTriangle, href: '/exposures' },
    { title: 'Symptoms', value: data.symptoms.length, icon: Activity, href: '/symptoms' },
    { title: 'Meds', value: data.medications.length, icon: Pill, href: '/medications' },
  ];

  const missingSummaries = data.medicalVisits.filter(v => !v.gotAfterVisitSummary).length;
  const documentsObtained = data.documents.filter(d => d.status === 'Obtained' || d.status === 'Submitted').length;
  const buddyStatements = data.buddyContacts.filter(b => b.statementStatus === 'Received' || b.statementStatus === 'Submitted').length;

  const separationDate = data.separationDate ? new Date(data.separationDate) : null;
  
  const handleSeparationDateChange = (date: Date | null) => {
    setSeparationDate(date ? date.toISOString() : null);
  };

  return (
    <div className="space-y-4 animate-fade-in pb-4 overflow-x-hidden max-w-full">
      {/* Hero Header - Clear Purpose */}
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-foreground tracking-tight">VA Claim Evidence</h1>
          <p className="text-xs text-muted-foreground">Build your disability claim</p>
        </div>
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <ShareWithVSO />
          <ExportButton />
        </div>
      </div>

      {/* CONDITIONS - THE FOCAL POINT */}
      <div className={cn(
        "rounded-2xl overflow-hidden",
        "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent",
        "border border-primary/20"
      )}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground">Conditions You're Claiming</h2>
            </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1 h-8">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Condition to Claim</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>What condition are you claiming?</Label>
                    <Input
                      placeholder="e.g., Tinnitus, PTSD, Sleep Apnea, Back Pain"
                      value={newConditionName}
                      onChange={(e) => setNewConditionName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCondition()}
                    />
                    <p className="text-xs text-muted-foreground">
                      Add each disability or condition you plan to file with the VA
                    </p>
                  </div>
                  <Button onClick={handleAddCondition} className="w-full" disabled={!newConditionName.trim()}>
                    Add Condition
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {claimConditions.length === 0 ? (
            <div className="text-center py-6">
              <Target className="h-10 w-10 text-primary/40 mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">No conditions added yet</p>
              <p className="text-xs text-muted-foreground mb-4 max-w-[280px] mx-auto">
                Start by adding the disabilities or conditions you're claiming. Then track evidence for each one.
              </p>
              <Button onClick={() => setIsAddOpen(true)} size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add Your First Condition
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {claimConditions.map((condition) => {
                const score = getEvidenceScore(condition);
                const scoreColor = score >= 75 ? 'text-success' : score >= 50 ? 'text-warning' : 'text-muted-foreground';
                
                return (
                  <div
                    key={condition.id}
                    className={cn(
                      "flex items-center justify-between",
                      "p-3 rounded-xl",
                      "bg-white/[0.06] backdrop-blur-sm",
                      "border border-white/[0.08]",
                      "transition-all duration-200",
                      "active:scale-[0.98]"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={cn(
                        "flex items-center justify-center h-9 w-9 rounded-full flex-shrink-0",
                        score >= 75 ? "bg-success/20" : score >= 50 ? "bg-warning/20" : "bg-muted/30"
                      )}>
                        {score >= 75 ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{condition.name}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={scoreColor}>{score}% evidence</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">
                            {condition.linkedMedicalVisits.length + condition.linkedSymptoms.length + condition.linkedExposures.length + condition.linkedBuddyContacts.length} items linked
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => navigate('/checklist')}
                        title="Link evidence"
                      >
                        <Link2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteClaimCondition(condition.id)}
                        title="Remove condition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              {/* Quick add more */}
              <button
                onClick={() => setIsAddOpen(true)}
                className={cn(
                  "w-full flex items-center justify-center gap-2",
                  "p-3 rounded-xl",
                  "border border-dashed border-primary/30",
                  "text-primary text-sm",
                  "transition-all duration-200",
                  "hover:bg-primary/5 hover:border-primary/50",
                  "active:scale-[0.98]"
                )}
              >
                <Plus className="h-4 w-4" />
                Add another condition
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Evidence Stats - 2x2 on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            to={stat.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5",
              "min-h-[88px] p-4 rounded-2xl",
              "bg-white/[0.04] backdrop-blur-sm",
              "border border-white/[0.06]",
              "transition-all duration-300 ease-out",
              "active:scale-95 active:bg-white/[0.08]",
              "hover:bg-white/[0.06]"
            )}
          >
            <stat.icon className="h-5 w-5 text-foreground/70" />
            <p className="text-2xl font-bold text-foreground number-display">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.title}</p>
          </Link>
        ))}
      </div>

      {/* Quick Log - Compact inline */}
      <QuickLogWidget />

      {/* Navigation Grid - Hidden on mobile */}
      <div className="hidden md:block">
        <MobileNavGrid />
      </div>

      {/* Evidence Status - 2x2 mobile, 3 cols desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className={cn(
          "flex flex-col items-center justify-center gap-1.5",
          "min-h-[80px] p-4 rounded-2xl",
          "bg-white/[0.04] backdrop-blur-sm",
          "border border-white/[0.06]",
          "transition-all duration-300 ease-out"
        )}>
          <FileWarning className="h-5 w-5 text-foreground/70" />
          <span className="text-xl font-bold text-foreground">
            {data.medicalVisits.length - missingSummaries}/{data.medicalVisits.length}
          </span>
          <span className="text-xs text-muted-foreground text-center">Summaries</span>
        </div>
        <div className={cn(
          "flex flex-col items-center justify-center gap-1.5",
          "min-h-[80px] p-4 rounded-2xl",
          "bg-white/[0.04] backdrop-blur-sm",
          "border border-white/[0.06]",
          "transition-all duration-300 ease-out"
        )}>
          <Activity className="h-5 w-5 text-foreground/70" />
          <span className="text-xl font-bold text-foreground">{documentsObtained}/{data.documents.length}</span>
          <span className="text-xs text-muted-foreground text-center">Documents</span>
        </div>
        <div className={cn(
          "flex flex-col items-center justify-center gap-1.5",
          "min-h-[80px] p-4 rounded-2xl",
          "bg-white/[0.04] backdrop-blur-sm",
          "border border-white/[0.06]",
          "transition-all duration-300 ease-out",
          "col-span-2 sm:col-span-1"
        )}>
          <ShieldCheck className="h-5 w-5 text-foreground/70" />
          <span className="text-xl font-bold text-foreground">{buddyStatements}</span>
          <span className="text-xs text-muted-foreground text-center">Buddy Statements</span>
        </div>
      </div>

      {/* Key Cards - Compact */}
      <div className="space-y-3">
        <IntentToFileCard />
        <ClaimReadinessScore />
      </div>

      {/* BDD & Calculator */}
      <div className="grid gap-3 lg:grid-cols-2">
        <BDDCountdown 
          separationDate={separationDate} 
          onSeparationDateChange={handleSeparationDateChange} 
        />
        <RatingCalculator />
      </div>

      {/* Collapsible More Tools */}
      <details className="group">
        <summary className={cn(
          "flex items-center justify-between",
          "min-h-[48px] px-4 py-3 rounded-2xl",
          "bg-white/[0.04] backdrop-blur-sm",
          "border border-white/[0.06]",
          "cursor-pointer list-none",
          "transition-all duration-300 ease-out",
          "hover:bg-white/[0.06]",
          "active:scale-[0.98]"
        )}>
          <span className="text-sm font-medium">More Tools</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-open:rotate-90 transition-transform duration-300" />
        </summary>
        <div className="mt-3 space-y-3">
          <DashboardInsights />
          <EvidenceGapAnalyzer />
          <SuggestedDisabilities />
        </div>
      </details>
    </div>
  );
}