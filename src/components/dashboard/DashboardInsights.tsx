import { useClaims } from '@/hooks/useClaims';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Clock, FileText, Lightbulb, Link2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardInsights() {
  const { data } = useClaims();

  const insights: { icon: React.ReactNode; message: string; action?: { label: string; to: string }; type: 'warning' | 'info' | 'success' }[] = [];

  // BDD Window insight
  if (data.separationDate) {
    const sepDate = new Date(data.separationDate);
    const today = new Date();
    const daysUntilSep = Math.ceil((sepDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilSep > 90 && daysUntilSep <= 180) {
      insights.push({
        icon: <Clock className="h-5 w-5 text-success" />,
        message: `You're in the BDD window! ${daysUntilSep} days until separation. This is the optimal time to file your claim.`,
        type: 'success',
      });
    } else if (daysUntilSep > 0 && daysUntilSep <= 90) {
      insights.push({
        icon: <AlertTriangle className="h-5 w-5 text-warning" />,
        message: `Only ${daysUntilSep} days until separation. Your BDD window is closing - consider filing soon!`,
        type: 'warning',
      });
    } else if (daysUntilSep > 180) {
      insights.push({
        icon: <Clock className="h-5 w-5 text-primary" />,
        message: `Your BDD window opens in ${daysUntilSep - 180} days. Use this time to gather evidence.`,
        type: 'info',
      });
    }
  }

  // Exposures not linked
  if (data.exposures.length > 0 && (!data.claimConditions || data.claimConditions.length === 0)) {
    insights.push({
      icon: <Link2 className="h-5 w-5 text-warning" />,
      message: `You logged ${data.exposures.length} exposure${data.exposures.length > 1 ? 's' : ''} but haven't linked them to any conditions. Use the Claim Builder below to explore related disabilities.`,
      action: { label: 'Link Exposures', to: '/claims' },
      type: 'warning',
    });
  }

  // Missing After-Visit Summaries
  const missingSummaries = data.medicalVisits.filter(v => !v.gotAfterVisitSummary).length;
  if (missingSummaries > 0) {
    insights.push({
      icon: <FileText className="h-5 w-5 text-destructive" />,
      message: `${missingSummaries} medical visit${missingSummaries > 1 ? 's are' : ' is'} missing After-Visit Summaries. Request these from your MTF records office.`,
      action: { label: 'View Medical Visits', to: '/health/visits' },
      type: 'warning',
    });
  }

  // Encourage symptoms tracking
  if (data.symptoms.length === 0 && data.medicalVisits.length > 0) {
    insights.push({
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
      message: `You have medical visits logged but no symptom journal entries. Regular symptom tracking strengthens your claim.`,
      action: { label: 'Start Tracking', to: '/health/symptoms' },
      type: 'info',
    });
  }

  // Buddy statements reminder
  if (data.buddyContacts.length > 0) {
    const pending = data.buddyContacts.filter(b => b.statementStatus === 'Requested').length;
    const notRequested = data.buddyContacts.filter(b => b.statementStatus === 'Not Requested').length;
    
    if (pending > 0) {
      insights.push({
        icon: <Clock className="h-5 w-5 text-warning" />,
        message: `${pending} buddy statement${pending > 1 ? 's are' : ' is'} pending. Follow up with your contacts.`,
        action: { label: 'View Contacts', to: '/prep/buddy-statement' },
        type: 'warning',
      });
    } else if (notRequested > 0) {
      insights.push({
        icon: <Lightbulb className="h-5 w-5 text-primary" />,
        message: `You have ${notRequested} buddy contact${notRequested > 1 ? 's' : ''} who haven't been asked for statements yet.`,
        action: { label: 'Request Statements', to: '/prep/buddy-statement' },
        type: 'info',
      });
    }
  }

  // No insights - show encouragement
  if (insights.length === 0) {
    if (data.medicalVisits.length === 0 && data.exposures.length === 0 && data.symptoms.length === 0) {
      insights.push({
        icon: <Lightbulb className="h-5 w-5 text-primary" />,
        message: `Start by logging your service history and any medical visits. The more evidence you gather, the stronger your claim.`,
        action: { label: 'Add Service History', to: '/settings/service-history' },
        type: 'info',
      });
    }
  }

  if (insights.length === 0) return null;

  return (
    <Card className="data-card border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Next Steps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.slice(0, 3).map((insight, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-3 p-3 rounded-lg border ${
              insight.type === 'warning' ? 'bg-warning/5 border-warning/20' :
              insight.type === 'success' ? 'bg-success/5 border-success/20' :
              'bg-muted/30 border-border'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">{insight.icon}</div>
            <div className="flex-1">
              <p className="text-sm text-foreground">{insight.message}</p>
              {insight.action && (
                <Link 
                  to={insight.action.to} 
                  className="text-xs text-primary hover:underline mt-1 inline-block"
                >
                  {insight.action.label} →
                </Link>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
