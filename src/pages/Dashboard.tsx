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
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your VA evidence</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ShareWithVSO />
          <ExportButton />
        </div>
      </div>

      {/* Privacy Badge - iOS style */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">100% Private</p>
          <p className="text-xs text-muted-foreground">All data stored locally on your device</p>
        </div>
      </div>

      {/* Quick Log Widget */}
      <QuickLogWidget />

      {/* Mobile Navigation Grid */}
      <MobileNavGrid />

      {/* Stats Grid - iOS style cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            to={stat.href}
            className={cn(
              "relative p-4 rounded-2xl overflow-hidden",
              "bg-gradient-to-br from-white/[0.08] to-white/[0.02]",
              "border border-white/[0.06]",
              "shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.04)]",
              "active:scale-[0.97] transition-all duration-150",
              "group"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bgColor)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl font-bold text-foreground number-display">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.title}</p>
          </Link>
        ))}
      </div>

      {/* Intent to File Pro Tip */}
      <IntentToFileCard />

      {/* Dashboard Insights */}
      <DashboardInsights />

      {/* Claim Readiness Score */}
      <ClaimReadinessScore />

      {/* Claim Builder */}
      <ClaimBuilder />

      {/* Evidence Gap Analyzer */}
      <EvidenceGapAnalyzer />

      {/* AI Disability Suggestions */}
      <SuggestedDisabilities />

      {/* BDD Countdown and Calculator */}
      <div className="grid gap-4 lg:grid-cols-2">
        <BDDCountdown 
          separationDate={separationDate} 
          onSeparationDateChange={handleSeparationDateChange} 
        />
        <RatingCalculator />
      </div>

      {/* Status Cards - iOS grouped style */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground px-1">Evidence Status</h2>
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.06]">
          {/* After-Visit Summaries */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                missingSummaries > 0 ? "bg-red-500/15" : "bg-emerald-500/15"
              )}>
                <FileWarning className={cn(
                  "h-5 w-5",
                  missingSummaries > 0 ? "text-red-400" : "text-emerald-400"
                )} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">After-Visit Summaries</p>
                <p className="text-xs text-muted-foreground">
                  {missingSummaries > 0 ? `${missingSummaries} missing` : 'All obtained'}
                </p>
              </div>
            </div>
            <span className={cn(
              "text-lg font-bold number-display",
              missingSummaries > 0 ? "text-red-400" : "text-emerald-400"
            )}>
              {data.medicalVisits.length - missingSummaries}/{data.medicalVisits.length}
            </span>
          </div>
          
          <div className="divider-subtle" />
          
          {/* Documents */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
                <Activity className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Documents</p>
                <p className="text-xs text-muted-foreground">Obtained or submitted</p>
              </div>
            </div>
            <span className="text-lg font-bold text-foreground number-display">
              {documentsObtained}/{data.documents.length}
            </span>
          </div>
          
          <div className="divider-subtle" />
          
          {/* Buddy Statements */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Buddy Statements</p>
                <p className="text-xs text-muted-foreground">{data.buddyContacts.length} contacts total</p>
              </div>
            </div>
            <span className="text-lg font-bold text-foreground number-display">
              {buddyStatements}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Tips - iOS style */}
      <Card className="data-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            "Document everything in real-time. Contemporaneous records strengthen claims.",
            "Always request after-visit summaries. If refused, document that too.",
            "Buddy statements from witnesses can significantly strengthen your claim.",
          ].map((tip, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-lg bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
                {idx + 1}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}