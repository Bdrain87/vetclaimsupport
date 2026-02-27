import { useMemo } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { safeFormatDate } from '@/utils/dateUtils';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  AlertCircle,
  TrendingUp,
  Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/PageContainer';

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  isComplete: boolean;
  currentCount: number;
  recommendedCount: number;
  progressText: string;
  guidance: string;
  link: string;
  linkText: string;
  priority: 'high' | 'medium' | 'low';
}

export default function ClaimChecklist() {
  const { data } = useClaims();

  // Calculate specific metrics
  const metrics = useMemo(() => {
    const missingSummaries = (data.medicalVisits || []).filter(v => !v.gotAfterVisitSummary).length;
    const buddyStatementsReceived = (data.buddyContacts || []).filter(
      b => b.statementStatus === 'Received' || b.statementStatus === 'Submitted'
    ).length;
    const severeSymptoms = (data.symptoms || []).filter(s => s.severity >= 7).length;
    const currentMeds = (data.medications || []).filter(m => m.stillTaking).length;

    return {
      missingSummaries,
      buddyStatementsReceived,
      severeSymptoms,
      currentMeds,
      hasDD214: (data.documents || []).some(d => d.name?.includes('DD-214') && (d.status === 'Obtained' || d.status === 'Submitted')),
      hasSTRs: (data.documents || []).some(d => d.name?.includes('STR') && (d.status === 'Obtained' || d.status === 'Submitted')),
      hasNexus: (data.documents || []).some(d => (d.name?.includes('Nexus') || d.name?.includes('Doctor Summar')) && (d.status === 'Obtained' || d.status === 'Submitted')),
    };
  }, [data]);

  const checklistItems = useMemo((): ChecklistItem[] => {
    const serviceHistory = data.serviceHistory || [];
    const medicalVisits = data.medicalVisits || [];
    const symptoms = data.symptoms || [];
    const medications = data.medications || [];
    const exposures = data.exposures || [];
    const buddyContacts = data.buddyContacts || [];
    return [
      // Service Connection Evidence
      {
        id: 'service-history',
        category: 'Service Connection',
        title: 'Service History',
        description: 'Document your duty stations and deployments',
        isComplete: serviceHistory.length >= 2,
        currentCount: serviceHistory.length,
        recommendedCount: 2,
        progressText: `${serviceHistory.length} ${serviceHistory.length === 1 ? 'entry' : 'entries'} logged`,
        guidance: serviceHistory.length === 0
          ? 'Start by adding your primary duty station and any deployments.'
          : serviceHistory.length < 2
            ? 'Add additional duty stations or deployments for a complete service record.'
            : 'Great! Your service history is well documented.',
        link: '/settings/service-history',
        linkText: 'Add Entry',
        priority: 'high',
      },
      {
        id: 'dd214',
        category: 'Service Connection',
        title: 'DD-214 (Discharge Papers)',
        description: 'Essential document proving your military service',
        isComplete: metrics.hasDD214,
        currentCount: metrics.hasDD214 ? 1 : 0,
        recommendedCount: 1,
        progressText: metrics.hasDD214 ? 'Obtained ✓' : 'Not obtained',
        guidance: metrics.hasDD214 
          ? 'Your DD-214 is ready for your claim.'
          : 'Request from National Personnel Records Center (NPRC) if you don\'t have a copy.',
        link: '/claims/vault',
        linkText: 'Update Status',
        priority: 'high',
      },
      {
        id: 'separation-date',
        category: 'Service Connection',
        title: 'Separation Date',
        description: 'Required for BDD timeline tracking',
        isComplete: !!data.separationDate,
        currentCount: data.separationDate ? 1 : 0,
        recommendedCount: 1,
        progressText: data.separationDate 
          ? `Set: ${safeFormatDate(data.separationDate)}`
          : 'Not set',
        guidance: data.separationDate 
          ? 'Your BDD timeline is being tracked on the dashboard.'
          : 'Set this to track your Benefits Delivery at Discharge window.',
        link: '/settings/service-history',
        linkText: 'Set Date',
        priority: 'medium',
      },

      // Medical Evidence
      {
        id: 'strs',
        category: 'Medical Evidence',
        title: 'Service Treatment Records (STRs)',
        description: 'Your in-service medical history',
        isComplete: metrics.hasSTRs,
        currentCount: metrics.hasSTRs ? 1 : 0,
        recommendedCount: 1,
        progressText: metrics.hasSTRs ? 'Obtained ✓' : 'Not obtained',
        guidance: metrics.hasSTRs 
          ? 'Your STRs will help establish service connection.'
          : 'Request from your last duty station or NPRC. These are critical for proving in-service events.',
        link: '/claims/vault',
        linkText: 'Update Status',
        priority: 'high',
      },
      {
        id: 'medical-visits',
        category: 'Medical Evidence',
        title: 'Medical Visits',
        description: 'Documented healthcare appointments',
        isComplete: medicalVisits.length >= 5,
        currentCount: medicalVisits.length,
        recommendedCount: 5,
        progressText: `${medicalVisits.length} of 5+ recommended`,
        guidance: medicalVisits.length === 0
          ? 'Log every medical visit related to your conditions, including dates and diagnoses.'
          : medicalVisits.length < 5
            ? `Add ${5 - medicalVisits.length} more visits. Include sick call, ER visits, and specialist appointments.`
            : 'Excellent documentation! Keep logging new visits.',
        link: '/health/visits',
        linkText: 'Add Visit',
        priority: 'high',
      },
      {
        id: 'after-visit-summaries',
        category: 'Medical Evidence',
        title: 'After-Visit Summaries',
        description: 'Documentation from each medical appointment',
        isComplete: medicalVisits.length > 0 && metrics.missingSummaries === 0,
        currentCount: medicalVisits.length - metrics.missingSummaries,
        recommendedCount: medicalVisits.length || 1,
        progressText: medicalVisits.length === 0
          ? 'No visits logged yet'
          : `${medicalVisits.length - metrics.missingSummaries} of ${medicalVisits.length} obtained`,
        guidance: metrics.missingSummaries > 0
          ? `${metrics.missingSummaries} ${metrics.missingSummaries === 1 ? 'summary is' : 'summaries are'} missing. Request copies from your MTF or clinic.`
          : medicalVisits.length === 0
            ? 'Log medical visits first, then track your summaries.'
            : 'All summaries collected! These strengthen your medical evidence.',
        link: '/health/visits',
        linkText: 'Review Visits',
        priority: 'medium',
      },
      {
        id: 'nexus-letter',
        category: 'Medical Evidence',
        title: 'Doctor Summary',
        description: 'Medical opinion linking condition to service',
        isComplete: metrics.hasNexus,
        currentCount: metrics.hasNexus ? 1 : 0,
        recommendedCount: 1,
        progressText: metrics.hasNexus ? 'Obtained ✓' : 'Not obtained',
        guidance: metrics.hasNexus
          ? 'Your doctor summary provides crucial medical opinion for service connection.'
          : 'A doctor summary from your physician can significantly strengthen claims. Use the Doctor Summary Builder to get started.',
        link: '/claims/vault',
        linkText: 'Update Status',
        priority: 'high',
      },

      // Condition Documentation
      {
        id: 'symptoms',
        category: 'Condition Documentation',
        title: 'Symptom Journal',
        description: 'Ongoing record of your symptoms',
        isComplete: symptoms.length >= 10,
        currentCount: symptoms.length,
        recommendedCount: 10,
        progressText: `${symptoms.length} entries (${metrics.severeSymptoms} severe)`,
        guidance: symptoms.length === 0
          ? 'Start logging symptoms daily. Include severity, frequency, and impact on daily life.'
          : symptoms.length < 10
            ? `Add ${10 - symptoms.length} more entries. Consistent logging shows chronic conditions.`
            : `Strong symptom history! ${metrics.severeSymptoms} severe episodes documented.`,
        link: '/health/symptoms',
        linkText: 'Log Symptom',
        priority: 'medium',
      },
      {
        id: 'medications',
        category: 'Condition Documentation',
        title: 'Medications',
        description: 'Prescriptions for service-connected conditions',
        isComplete: medications.length >= 2,
        currentCount: medications.length,
        recommendedCount: 2,
        progressText: `${medications.length} documented (${metrics.currentMeds} current)`,
        guidance: medications.length === 0
          ? 'Document all medications prescribed for your conditions, including dosages and side effects.'
          : medications.length < 2
            ? 'Add any other medications, including over-the-counter treatments for your conditions.'
            : 'Good medication history. Remember to log any new prescriptions.',
        link: '/health/medications',
        linkText: 'Add Medication',
        priority: 'low',
      },

      // Exposure Documentation
      {
        id: 'exposures',
        category: 'Exposure Documentation',
        title: 'Hazardous Exposures',
        description: 'Toxic substances, burn pits, chemicals, etc.',
        isComplete: exposures.length >= 1,
        currentCount: exposures.length,
        recommendedCount: 1,
        progressText: exposures.length === 0
          ? 'None documented'
          : `${exposures.length} ${exposures.length === 1 ? 'exposure' : 'exposures'} logged`,
        guidance: exposures.length === 0
          ? 'If you were near burn pits, chemicals, or other hazards, document them. PACT Act may apply.'
          : 'Exposures documented. Check if you qualify for PACT Act presumptive conditions.',
        link: '/health/exposures',
        linkText: 'Add Exposure',
        priority: 'medium',
      },

      // Supporting Evidence
      {
        id: 'buddy-contacts',
        category: 'Supporting Evidence',
        title: 'Buddy Contacts',
        description: 'Fellow service members who can support your claim',
        isComplete: buddyContacts.length >= 2,
        currentCount: buddyContacts.length,
        recommendedCount: 2,
        progressText: `${buddyContacts.length} of 2+ recommended`,
        guidance: buddyContacts.length === 0
          ? 'Add contacts who witnessed your injury, symptoms, or service conditions.'
          : buddyContacts.length < 2
            ? 'Add at least one more contact. Multiple witnesses strengthen your claim.'
            : 'Good network of witnesses identified.',
        link: '/prep/buddy-statement',
        linkText: 'Add Contact',
        priority: 'medium',
      },
      {
        id: 'buddy-statements',
        category: 'Supporting Evidence',
        title: 'Buddy Statements',
        description: 'Written statements from witnesses',
        isComplete: metrics.buddyStatementsReceived >= 2,
        currentCount: metrics.buddyStatementsReceived,
        recommendedCount: Math.max(2, buddyContacts.length),
        progressText: buddyContacts.length === 0
          ? 'Add contacts first'
          : `${metrics.buddyStatementsReceived} of ${buddyContacts.length} received`,
        guidance: buddyContacts.length === 0
          ? 'Add buddy contacts first, then request statements from them.'
          : metrics.buddyStatementsReceived === 0
            ? 'Request statements from your contacts. Use the templates in the Reference section.'
            : metrics.buddyStatementsReceived < data.buddyContacts.length
              ? `${buddyContacts.length - metrics.buddyStatementsReceived} statement(s) pending. Follow up with your contacts.`
              : 'All statements collected! These provide valuable third-party evidence.',
        link: '/prep/buddy-statement',
        linkText: 'Track Status',
        priority: 'high',
      },
    ];
  }, [data, metrics]);

  const completedCount = checklistItems.filter(item => item.isComplete).length;
  const totalCount = checklistItems.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  // Group by category
  const itemsByCategory = useMemo(() => {
    const groups = new Map<string, ChecklistItem[]>();
    checklistItems.forEach(item => {
      if (!groups.has(item.category)) {
        groups.set(item.category, []);
      }
      groups.get(item.category)!.push(item);
    });
    return Array.from(groups.entries());
  }, [checklistItems]);

  const getProgressColor = (current: number, recommended: number) => {
    const ratio = current / recommended;
    if (ratio >= 1) return 'text-success';
    if (ratio >= 0.5) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low', isComplete: boolean) => {
    if (isComplete) return null;
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High Priority</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Recommended</Badge>;
      default:
        return null;
    }
  };

  return (
    <PageContainer className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <ClipboardCheck className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Claim Readiness Checklist</h1>
          <p className="text-muted-foreground">Your personalized guide to building a strong VA claim</p>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-foreground">{progressPercentage}%</span>
                {progressPercentage >= 80 && (
                  <Badge className="bg-success text-success-foreground">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Strong
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {completedCount} of {totalCount} milestones complete
              </p>
            </div>
            {progressPercentage === 100 ? (
              <div className="flex items-center gap-2 text-success bg-success/10 px-4 py-2 rounded-full">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Claim Ready!</span>
              </div>
            ) : (
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{totalCount - completedCount}</p>
                <p className="text-sm text-muted-foreground">items remaining</p>
              </div>
            )}
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>
      </Card>

      {/* Quick Insight */}
      {progressPercentage < 100 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex gap-3">
              <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Next Priority</p>
                <p className="text-sm text-muted-foreground">
                  {checklistItems.find(i => !i.isComplete && i.priority === 'high')?.guidance || 
                   checklistItems.find(i => !i.isComplete)?.guidance}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Checklist Categories */}
      {itemsByCategory.map(([category, items]) => {
        const categoryComplete = items.filter(i => i.isComplete).length;
        const categoryTotal = items.length;
        const categoryProgress = Math.round((categoryComplete / categoryTotal) * 100);

        return (
          <Card key={category}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{category}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {categoryComplete === categoryTotal 
                      ? 'All items complete!'
                      : `${categoryTotal - categoryComplete} item${categoryTotal - categoryComplete > 1 ? 's' : ''} need attention`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24">
                    <Progress value={categoryProgress} className="h-2" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground w-12 text-right">
                    {categoryComplete}/{categoryTotal}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3" role="list">
              {items.map(item => (
                <div
                  key={item.id}
                  role="listitem"
                  aria-label={`${item.title} — ${item.isComplete ? 'Complete' : 'Incomplete'}`}
                  className={`rounded-lg border transition-all ${
                    item.isComplete
                      ? 'bg-success/5 border-success/20'
                      : 'bg-card border-border hover:border-primary/30'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-0.5" aria-hidden="true">
                        {item.isComplete ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`font-medium ${
                            item.isComplete ? 'text-muted-foreground' : 'text-foreground'
                          }`}>
                            {item.title}
                          </h3>
                          {getPriorityBadge(item.priority, item.isComplete)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                        
                        {/* Progress indicator */}
                        <div className="mt-3 flex items-center gap-4">
                          <div className={`text-sm font-medium ${getProgressColor(item.currentCount, item.recommendedCount)}`}>
                            {item.progressText}
                          </div>
                          {!item.isComplete && item.currentCount > 0 && item.recommendedCount > 1 && (
                            <div className="flex-1 max-w-32">
                              <Progress 
                                value={Math.min((item.currentCount / item.recommendedCount) * 100, 100)} 
                                className="h-1.5" 
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        variant={item.isComplete ? "ghost" : "outline"}
                        size="sm" 
                        asChild
                        className="flex-shrink-0"
                      >
                        <Link to={item.link}>
                          {item.isComplete ? 'View' : item.linkText}
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>

                    {/* Guidance text */}
                    {!item.isComplete && (
                      <div className="mt-3 ml-9 flex items-start gap-2 p-3 rounded-md bg-muted/50">
                        <AlertCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">{item.guidance}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {/* Completion Message */}
      {progressPercentage === 100 && (
        <Card className="bg-success/10 border-success/30">
          <CardContent className="py-8 text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto text-success mb-4" />
            <h3 className="font-semibold text-xl mb-2">Outstanding Work!</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              You've completed all recommended evidence milestones. Your claim documentation 
              is comprehensive and ready for submission.
            </p>
            <Button asChild>
              <Link to="/claims/vault">
                View Your Documents
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
