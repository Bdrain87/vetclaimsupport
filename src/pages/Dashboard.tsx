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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    {
      title: 'Medical Visits',
      value: data.medicalVisits.length,
      icon: Stethoscope,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/15',
      href: '/medical-visits',
    },
    {
      title: 'Exposures',
      value: data.exposures.length,
      icon: AlertTriangle,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/15',
      href: '/exposures',
    },
    {
      title: 'Symptoms',
      value: data.symptoms.length,
      icon: Activity,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/15',
      href: '/symptoms',
    },
    {
      title: 'Medications',
      value: data.medications.length,
      icon: Pill,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/15',
      href: '/medications',
    },
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

      {/* Privacy Badge - Compact */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
        <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
        <p className="text-xs text-muted-foreground">100% Private · All data stored locally</p>
      </div>

      {/* Stats Grid - Compact 2x2 */}
      <div className="grid grid-cols-4 gap-2">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            to={stat.href}
            className={cn(
              "p-3 rounded-xl text-center",
              "bg-gradient-to-br from-white/[0.06] to-white/[0.02]",
              "border border-white/[0.06]",
              "active:scale-[0.97] transition-all duration-150"
            )}
          >
            <div className={cn("w-8 h-8 mx-auto rounded-lg flex items-center justify-center mb-1", stat.bgColor)}>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </div>
            <p className="text-lg font-bold text-foreground number-display">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground truncate">{stat.title}</p>
          </Link>
        ))}
      </div>

      {/* Quick Log - Compact */}
      <QuickLogWidget />

      {/* Mobile Navigation - Hidden on dashboard now, use bottom tabs */}
      <div className="hidden">
        <MobileNavGrid />
      </div>

      {/* Key Cards - Stacked compact */}
      <div className="space-y-3">
        <IntentToFileCard />
        <ClaimReadinessScore />
      </div>

      {/* BDD & Calculator - Side by side on tablet+ */}
      <div className="grid gap-3 lg:grid-cols-2">
        <BDDCountdown 
          separationDate={separationDate} 
          onSeparationDateChange={handleSeparationDateChange} 
        />
        <RatingCalculator />
      </div>

      {/* Collapsible sections for less scrolling */}
      <details className="group">
        <summary className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] cursor-pointer list-none">
          <span className="text-sm font-medium">More Tools</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-open:rotate-90 transition-transform" />
        </summary>
        <div className="mt-3 space-y-3">
          <DashboardInsights />
          <ClaimBuilder />
          <EvidenceGapAnalyzer />
          <SuggestedDisabilities />
        </div>
      </details>

      {/* Evidence Status - Compact */}
      <div className="rounded-xl overflow-hidden bg-white/[0.04] border border-white/[0.06]">
        <div className="flex items-center justify-between p-3 border-b border-white/[0.04]">
          <div className="flex items-center gap-2">
            <FileWarning className={cn("h-4 w-4", missingSummaries > 0 ? "text-red-400" : "text-emerald-400")} />
            <span className="text-xs">After-Visit Summaries</span>
          </div>
          <span className={cn("text-sm font-bold", missingSummaries > 0 ? "text-red-400" : "text-emerald-400")}>
            {data.medicalVisits.length - missingSummaries}/{data.medicalVisits.length}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 border-b border-white/[0.04]">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-amber-400" />
            <span className="text-xs">Documents</span>
          </div>
          <span className="text-sm font-bold">{documentsObtained}/{data.documents.length}</span>
        </div>
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span className="text-xs">Buddy Statements</span>
          </div>
          <span className="text-sm font-bold">{buddyStatements}</span>
        </div>
      </div>
    </div>
  );
}