import { useClaims } from '@/context/ClaimsContext';
import { 
  LayoutDashboard, 
  Stethoscope, 
  AlertTriangle, 
  Activity, 
  Pill,
  Clock,
  AlertCircle,
  CheckCircle2,
  FileWarning,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Dashboard() {
  const { data } = useClaims();

  const stats = [
    {
      title: 'Medical Visits',
      value: data.medicalVisits.length,
      icon: Stethoscope,
      color: 'text-medical',
      bgColor: 'bg-medical/10',
      cardClass: 'stat-card-medical',
    },
    {
      title: 'Exposures Logged',
      value: data.exposures.length,
      icon: AlertTriangle,
      color: 'text-exposure',
      bgColor: 'bg-exposure/10',
      cardClass: 'stat-card-exposure',
    },
    {
      title: 'Symptom Entries',
      value: data.symptoms.length,
      icon: Activity,
      color: 'text-symptoms',
      bgColor: 'bg-symptoms/10',
      cardClass: 'stat-card-symptoms',
    },
    {
      title: 'Medications',
      value: data.medications.length,
      icon: Pill,
      color: 'text-medications',
      bgColor: 'bg-medications/10',
      cardClass: 'stat-card-medications',
    },
  ];

  const missingSummaries = data.medicalVisits.filter(v => !v.gotAfterVisitSummary).length;
  const documentsObtained = data.documents.filter(d => d.status === 'Obtained' || d.status === 'Submitted').length;
  const buddyStatements = data.buddyContacts.filter(b => b.statementStatus === 'Received' || b.statementStatus === 'Submitted').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <LayoutDashboard className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Track your VA claims documentation progress</p>
        </div>
      </div>

      {/* BDD Reminder Alert */}
      <Alert className="border-primary/30 bg-primary/5">
        <Clock className="h-5 w-5 text-primary" />
        <AlertTitle className="text-primary font-semibold">BDD Claim Reminder</AlertTitle>
        <AlertDescription className="text-foreground/80">
          File your Benefits Delivery at Discharge (BDD) claim <strong>180-90 days before separation</strong>. 
          This allows the VA to begin processing while you're still on active duty, resulting in faster decisions.
        </AlertDescription>
      </Alert>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.title} className={`stat-card ${stat.cardClass}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} rounded-lg p-3`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Missing Summaries Warning */}
        <Card className={missingSummaries > 0 ? 'border-destructive/30 bg-destructive/5' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              {missingSummaries > 0 ? (
                <FileWarning className="h-5 w-5 text-destructive" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-success" />
              )}
              After-Visit Summaries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {missingSummaries > 0 ? (
              <div>
                <p className="text-2xl font-bold text-destructive">{missingSummaries} Missing</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Request copies from your MTF records office
                </p>
              </div>
            ) : (
              <div>
                <p className="text-2xl font-bold text-success">All Obtained</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Great job keeping your records complete!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents Progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-5 w-5 text-documents" />
              Documents Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{documentsObtained} / {data.documents.length}</p>
            <div className="mt-2 h-2 w-full rounded-full bg-muted">
              <div 
                className="h-2 rounded-full bg-documents transition-all"
                style={{ width: `${(documentsObtained / data.documents.length) * 100}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Documents obtained or submitted
            </p>
          </CardContent>
        </Card>

        {/* Buddy Statements */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-5 w-5 text-buddy" />
              Buddy Statements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{buddyStatements} Received</p>
            <p className="text-sm text-muted-foreground mt-1">
              {data.buddyContacts.length} contacts total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Tips */}
      <Card className="data-card">
        <CardHeader>
          <CardTitle className="text-lg">Quick Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">1</div>
            <p className="text-sm text-muted-foreground">Document everything in real-time. The more contemporaneous your records, the stronger your claim.</p>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">2</div>
            <p className="text-sm text-muted-foreground">Always request after-visit summaries from every medical appointment. If refused, document that too.</p>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">3</div>
            <p className="text-sm text-muted-foreground">Buddy statements from fellow airmen who witnessed your conditions can significantly strengthen claims.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
