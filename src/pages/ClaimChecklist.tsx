import { useMemo } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { ClipboardCheck, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  isComplete: boolean;
  link: string;
  linkText: string;
}

export default function ClaimChecklist() {
  const { data } = useClaims();

  const checklistItems = useMemo((): ChecklistItem[] => {
    return [
      // Service Connection Evidence
      {
        id: 'service-history',
        category: 'Service Connection',
        title: 'Document your service history',
        description: 'Add at least one duty station or deployment',
        isComplete: data.serviceHistory.length >= 1,
        link: '/service-history',
        linkText: 'Add Service History',
      },
      {
        id: 'dd214',
        category: 'Service Connection',
        title: 'Obtain your DD-214',
        description: 'This shows your service dates and discharge type',
        isComplete: data.documents.some(d => d.name.includes('DD-214') && (d.status === 'Obtained' || d.status === 'Submitted')),
        link: '/documents',
        linkText: 'Update Documents',
      },
      {
        id: 'separation-date',
        category: 'Service Connection',
        title: 'Set your separation date',
        description: 'Important for BDD timeline tracking',
        isComplete: !!data.separationDate,
        link: '/',
        linkText: 'Set Date',
      },

      // Medical Evidence
      {
        id: 'strs',
        category: 'Medical Evidence',
        title: 'Request Service Treatment Records',
        description: 'Your in-service medical records are critical',
        isComplete: data.documents.some(d => d.name.includes('STR') && (d.status === 'Obtained' || d.status === 'Submitted')),
        link: '/documents',
        linkText: 'Update Documents',
      },
      {
        id: 'medical-visits',
        category: 'Medical Evidence',
        title: 'Log medical visits',
        description: 'Document at least 3 medical appointments',
        isComplete: data.medicalVisits.length >= 3,
        link: '/medical-visits',
        linkText: 'Add Visits',
      },
      {
        id: 'after-visit-summaries',
        category: 'Medical Evidence',
        title: 'Collect after-visit summaries',
        description: 'Get documentation from each visit',
        isComplete: data.medicalVisits.length > 0 && data.medicalVisits.every(v => v.gotAfterVisitSummary),
        link: '/medical-visits',
        linkText: 'Review Visits',
      },
      {
        id: 'nexus-letter',
        category: 'Medical Evidence',
        title: 'Obtain a nexus letter',
        description: 'A doctor\'s letter linking your condition to service',
        isComplete: data.documents.some(d => d.name.includes('Nexus') && (d.status === 'Obtained' || d.status === 'Submitted')),
        link: '/documents',
        linkText: 'Update Documents',
      },

      // Condition Documentation
      {
        id: 'symptoms',
        category: 'Condition Documentation',
        title: 'Document your symptoms',
        description: 'Log at least 5 symptom entries',
        isComplete: data.symptoms.length >= 5,
        link: '/symptoms',
        linkText: 'Log Symptoms',
      },
      {
        id: 'medications',
        category: 'Condition Documentation',
        title: 'Track your medications',
        description: 'Document prescriptions related to your conditions',
        isComplete: data.medications.length >= 1,
        link: '/medications',
        linkText: 'Add Medications',
      },

      // Exposure Documentation
      {
        id: 'exposures',
        category: 'Exposure Documentation',
        title: 'Document hazardous exposures',
        description: 'Log any toxic exposures during service',
        isComplete: data.exposures.length >= 1,
        link: '/exposures',
        linkText: 'Add Exposures',
      },

      // Supporting Evidence
      {
        id: 'buddy-contact',
        category: 'Supporting Evidence',
        title: 'Add buddy contacts',
        description: 'Find witnesses who can support your claim',
        isComplete: data.buddyContacts.length >= 1,
        link: '/buddy-contacts',
        linkText: 'Add Contacts',
      },
      {
        id: 'buddy-statement',
        category: 'Supporting Evidence',
        title: 'Obtain buddy statements',
        description: 'Get at least one statement from a witness',
        isComplete: data.buddyContacts.some(b => b.statementStatus === 'Received' || b.statementStatus === 'Submitted'),
        link: '/buddy-contacts',
        linkText: 'Track Statements',
      },
    ];
  }, [data]);

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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <ClipboardCheck className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Claim Readiness Checklist</h1>
          <p className="text-muted-foreground">Track your progress building a strong VA claim</p>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{progressPercentage}%</h2>
              <p className="text-sm text-muted-foreground">
                {completedCount} of {totalCount} items complete
              </p>
            </div>
            {progressPercentage === 100 ? (
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-6 w-6" />
                <span className="font-medium">Ready!</span>
              </div>
            ) : (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {totalCount - completedCount} items remaining
                </p>
              </div>
            )}
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </CardContent>
      </Card>

      {/* Checklist Categories */}
      {itemsByCategory.map(([category, items]) => {
        const categoryComplete = items.filter(i => i.isComplete).length;
        const categoryTotal = items.length;

        return (
          <Card key={category}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category}</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {categoryComplete}/{categoryTotal}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    item.isComplete 
                      ? 'bg-success/5 border-success/20' 
                      : 'bg-card border-border'
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {item.isComplete ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium ${
                      item.isComplete ? 'text-muted-foreground line-through' : 'text-foreground'
                    }`}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                  {!item.isComplete && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild
                      className="flex-shrink-0"
                    >
                      <Link to={item.link}>
                        {item.linkText}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {/* Encouragement */}
      {progressPercentage < 100 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">💪 Keep going!</strong> Each item you complete 
              strengthens your VA claim. A well-documented claim has a much higher chance of success.
            </p>
          </CardContent>
        </Card>
      )}

      {progressPercentage === 100 && (
        <Card className="bg-success/10 border-success/30">
          <CardContent className="py-6 text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto text-success mb-4" />
            <h3 className="font-semibold text-lg mb-2">Excellent Work!</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              You've completed all recommended steps. Your claim documentation is comprehensive 
              and ready for submission to the VA.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
