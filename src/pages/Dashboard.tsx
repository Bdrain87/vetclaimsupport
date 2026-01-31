import { useClaims } from '@/context/ClaimsContext';
import { 
  Stethoscope, 
  AlertTriangle, 
  Activity, 
  Pill,
  FileWarning,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { BDDCountdown } from '@/components/dashboard/BDDCountdown';
import { RatingCalculator } from '@/components/dashboard/RatingCalculator';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { SuggestedDisabilities } from '@/components/dashboard/SuggestedDisabilities';
import { ClaimReadinessScore } from '@/components/dashboard/ClaimReadinessScore';
import { IntentToFileCard } from '@/components/dashboard/IntentToFileCard';
import { DashboardInsights } from '@/components/dashboard/DashboardInsights';
import { ClaimBuilder } from '@/components/dashboard/ClaimBuilder';
import { MobileNavGrid } from '@/components/dashboard/MobileNavGrid';
import { QuickLogWidget } from '@/components/dashboard/QuickLogWidget';
import { EvidenceGapAnalyzer } from '@/components/dashboard/EvidenceGapAnalyzer';
import { ShareWithVSO } from '@/components/dashboard/ShareWithVSO';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { data, setSeparationDate } = useClaims();

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
    <div className="space-y-4 animate-fade-in pb-4">
      {/* Header - Compact */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-xs text-muted-foreground">Track your VA evidence</p>
        </div>
        <div className="flex items-center gap-2">
          <ShareWithVSO />
          <ExportButton />
        </div>
      </div>

      {/* Stats Grid - 4 columns with glass effect */}
      <div className="grid grid-cols-4 gap-2">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            to={stat.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1",
              "min-h-[80px] p-3 rounded-2xl",
              "bg-white/[0.04] backdrop-blur-sm",
              "border border-white/[0.06]",
              "transition-all duration-300 ease-out",
              "active:scale-95 active:bg-white/[0.08]",
              "hover:bg-white/[0.06]"
            )}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted/50">
              <stat.icon className="h-5 w-5 text-foreground/70" />
            </div>
            <p className="text-xl font-bold text-foreground number-display">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.title}</p>
          </Link>
        ))}
      </div>

      {/* Quick Log - Compact inline */}
      <QuickLogWidget />

      {/* Navigation Grid - Hidden on mobile, use bottom tab bar instead */}
      <div className="hidden md:block">
        <MobileNavGrid />
      </div>

      {/* Evidence Status - Horizontal cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className={cn(
          "flex flex-col items-center justify-center gap-1",
          "min-h-[72px] p-3 rounded-2xl",
          "bg-white/[0.04] backdrop-blur-sm",
          "border border-white/[0.06]",
          "transition-all duration-300 ease-out"
        )}>
          <FileWarning className="h-5 w-5 text-foreground/70" />
          <span className="text-lg font-bold text-foreground">
            {data.medicalVisits.length - missingSummaries}/{data.medicalVisits.length}
          </span>
          <span className="text-[9px] text-muted-foreground text-center">Summaries</span>
        </div>
        <div className={cn(
          "flex flex-col items-center justify-center gap-1",
          "min-h-[72px] p-3 rounded-2xl",
          "bg-white/[0.04] backdrop-blur-sm",
          "border border-white/[0.06]",
          "transition-all duration-300 ease-out"
        )}>
          <Activity className="h-5 w-5 text-foreground/70" />
          <span className="text-lg font-bold">{documentsObtained}/{data.documents.length}</span>
          <span className="text-[9px] text-muted-foreground text-center">Documents</span>
        </div>
        <div className={cn(
          "flex flex-col items-center justify-center gap-1",
          "min-h-[72px] p-3 rounded-2xl",
          "bg-white/[0.04] backdrop-blur-sm",
          "border border-white/[0.06]",
          "transition-all duration-300 ease-out"
        )}>
          <ShieldCheck className="h-5 w-5 text-foreground/70" />
          <span className="text-lg font-bold">{buddyStatements}</span>
          <span className="text-[9px] text-muted-foreground text-center">Buddy Stmts</span>
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
          <ClaimBuilder />
          <EvidenceGapAnalyzer />
          <SuggestedDisabilities />
        </div>
      </details>
    </div>
  );
}
