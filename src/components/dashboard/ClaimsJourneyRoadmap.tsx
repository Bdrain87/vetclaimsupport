import { useMemo } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  FileText,
  Stethoscope,
  Users,
  CheckCircle2,
  Circle,
  ChevronRight,
  Send,
  MapPin,
} from 'lucide-react';

interface JourneyPhase {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'completed' | 'current' | 'upcoming';
  progress: number;
  tasks: {
    label: string;
    completed: boolean;
    href?: string;
  }[];
}

export function ClaimsJourneyRoadmap() {
  const { data } = useClaims();

  const phases = useMemo((): JourneyPhase[] => {
    // Phase 1: Foundation - Service & Medical History
    const hasServiceHistory = data.serviceHistory.length > 0;
    const hasMedicalVisits = data.medicalVisits.length > 0;
    const hasExposures = data.exposures.length > 0;
    const hasSeparationDate = !!data.separationDate;
    
    const phase1Tasks = [
      { label: 'Add service history', completed: hasServiceHistory, href: '/settings/service-history' },
      { label: 'Log medical visits', completed: hasMedicalVisits, href: '/health/visits' },
      { label: 'Document exposures', completed: hasExposures, href: '/health/exposures' },
      { label: 'Set separation date', completed: hasSeparationDate, href: '/settings/service-history' },
    ];
    const phase1Progress = Math.round((phase1Tasks.filter(t => t.completed).length / phase1Tasks.length) * 100);

    // Phase 2: Evidence Gathering
    const hasMedications = data.medications.length > 0;
    const hasConditions = (data.claimConditions?.length || 0) > 0;
    const hasBuddyContacts = data.buddyContacts.length > 0;
    
    const phase2Tasks = [
      { label: 'Track symptoms regularly', completed: data.symptoms.length >= 3, href: '/health/symptoms' },
      { label: 'Log medications', completed: hasMedications, href: '/health/medications' },
      { label: 'Add conditions to claim', completed: hasConditions, href: '/claims' },
      { label: 'Add buddy contacts', completed: hasBuddyContacts, href: '/prep/buddy-statement' },
    ];
    const phase2Progress = Math.round((phase2Tasks.filter(t => t.completed).length / phase2Tasks.length) * 100);

    // Phase 3: Documentation & Strengthening
    const documentsObtained = data.documents.filter(d => d.status === 'Obtained' || d.status === 'Submitted').length;
    const hasBuddyStatements = data.buddyContacts.some(b => b.statementStatus === 'Received');
    const hasUploadedDocs = (data.uploadedDocuments?.length || 0) > 0;
    const hasLinkedEvidence = data.claimConditions?.some(c => 
      c.linkedMedicalVisits.length > 0 || c.linkedSymptoms.length > 0
    ) || false;
    
    const phase3Tasks = [
      { label: 'Gather key documents', completed: documentsObtained >= 3, href: '/settings/vault' },
      { label: 'Obtain buddy statements', completed: hasBuddyStatements, href: '/prep/buddy-statement' },
      { label: 'Upload supporting docs', completed: hasUploadedDocs, href: '/settings/vault' },
      { label: 'Link evidence to conditions', completed: hasLinkedEvidence, href: '/claims' },
    ];
    const phase3Progress = Math.round((phase3Tasks.filter(t => t.completed).length / phase3Tasks.length) * 100);

    // Phase 4: Claim Preparation
    const hasItf = data.deadlines?.some(d => d.type === 'intent_to_file') || false;
    const conditionsWithStrongEvidence = data.claimConditions?.filter(c => {
      const score = (c.linkedMedicalVisits.length > 0 ? 25 : 0) +
                   (c.linkedExposures.length > 0 ? 25 : 0) +
                   (c.linkedSymptoms.length > 0 ? 25 : 0) +
                   (c.linkedBuddyContacts.length > 0 ? 25 : 0);
      return score >= 50;
    }).length || 0;
    
    const phase4Tasks = [
      { label: 'File Intent to File', completed: hasItf, href: '/settings/itf' },
      { label: 'Reach 50%+ evidence per condition', completed: conditionsWithStrongEvidence >= 1, href: '/claims' },
      { label: 'Review claim checklist', completed: false, href: '/claims/checklist' },
      { label: 'Prepare for C&P exam', completed: false, href: '/prep/exam' },
    ];
    const phase4Progress = Math.round((phase4Tasks.filter(t => t.completed).length / phase4Tasks.length) * 100);

    // Determine current phase
    const getPhaseStatus = (progress: number, prevComplete: boolean): 'completed' | 'current' | 'upcoming' => {
      if (progress === 100) return 'completed';
      if (prevComplete || progress > 0) return 'current';
      return 'upcoming';
    };

    return [
      {
        id: 'foundation',
        number: 1,
        title: 'Foundation',
        description: 'Document your service & medical history',
        icon: <FileText className="h-5 w-5" />,
        status: getPhaseStatus(phase1Progress, true),
        progress: phase1Progress,
        tasks: phase1Tasks,
      },
      {
        id: 'evidence',
        number: 2,
        title: 'Evidence',
        description: 'Build your case with symptoms & witnesses',
        icon: <Stethoscope className="h-5 w-5" />,
        status: getPhaseStatus(phase2Progress, phase1Progress >= 50),
        progress: phase2Progress,
        tasks: phase2Tasks,
      },
      {
        id: 'documentation',
        number: 3,
        title: 'Documentation',
        description: 'Gather & organize supporting documents',
        icon: <Users className="h-5 w-5" />,
        status: getPhaseStatus(phase3Progress, phase2Progress >= 50),
        progress: phase3Progress,
        tasks: phase3Tasks,
      },
      {
        id: 'preparation',
        number: 4,
        title: 'Submission',
        description: 'Finalize claim & prepare for exam',
        icon: <Send className="h-5 w-5" />,
        status: getPhaseStatus(phase4Progress, phase3Progress >= 50),
        progress: phase4Progress,
        tasks: phase4Tasks,
      },
    ];
  }, [data]);

  const currentPhase = phases.find(p => p.status === 'current') || phases[0];
  const overallProgress = Math.round(phases.reduce((sum, p) => sum + p.progress, 0) / phases.length);

  return (
    <Card className="border-0 bg-card overflow-hidden shadow-lg" style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}>
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 via-transparent to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-[0_0_20px_rgba(197,164,66,0.2)]">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold tracking-tight">Your Claims Journey</CardTitle>
              <p className="text-sm text-muted-foreground">{overallProgress}% complete</p>
            </div>
          </div>
          <div className="premium-badge-primary">
            Phase {currentPhase.number}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-2">
        {/* Visual Progress Bar - Premium Style */}
        <div className="relative py-2">
          <div className="flex items-center justify-between mb-3">
            {phases.map((phase, idx) => (
              <div
                key={phase.id}
                className={cn(
                  "flex flex-col items-center relative z-10",
                  idx < phases.length - 1 && "flex-1"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-11 h-11 rounded-full border-2 transition-all duration-300",
                    phase.status === 'completed' && "bg-gradient-to-br from-[#22c55e] to-[#16a34a] border-transparent text-white shadow-[0_4px_16px_rgba(34,197,94,0.4)]",
                    phase.status === 'current' && "bg-gradient-to-br from-[#C5A442] to-[#7A672A] border-transparent text-white shadow-[0_4px_16px_rgba(197,164,66,0.4)] animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]",
                    phase.status === 'upcoming' && "bg-muted border-border text-muted-foreground"
                  )}
                >
                  {phase.status === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-bold">{phase.number}</span>
                  )}
                </div>
                <span className={cn(
                  "text-[11px] mt-1.5 text-center max-w-[72px] font-medium break-words",
                  phase.status === 'current' ? "text-primary" : 
                  phase.status === 'completed' ? "text-success" : "text-muted-foreground"
                )}>
                  {phase.title}
                </span>
              </div>
            ))}
          </div>
          {/* Connecting line - Premium gradient */}
          <div className="absolute top-[26px] left-6 right-6 h-1 bg-border rounded-full -z-0 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#22c55e] via-[#C5A442] to-[#C5A442] transition-all duration-700 ease-out rounded-full"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Current Phase Details */}
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-xl",
              "bg-primary/10 text-primary"
            )}>
              {currentPhase.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground">
                Phase {currentPhase.number}: {currentPhase.title}
              </h4>
              <p className="text-xs text-muted-foreground">{currentPhase.description}</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-primary">{currentPhase.progress}%</span>
            </div>
          </div>

          <Progress value={currentPhase.progress} className="h-2 mb-3" />

          {/* Task Checklist */}
          <div className="space-y-2">
            {currentPhase.tasks.map((task, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg transition-colors",
                  task.completed ? "bg-success/5" : "bg-muted/30 hover:bg-muted/50"
                )}
              >
                {task.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
                <span className={cn(
                  "text-sm flex-1",
                  task.completed ? "text-muted-foreground line-through" : "text-foreground"
                )}>
                  {task.label}
                </span>
                {!task.completed && task.href && (
                  <Link to={task.href}>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-primary">
                      Start
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Next Phase Preview */}
        {currentPhase.number < 4 && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-dashed border-border">
            <div className="p-1.5 rounded-lg bg-muted">
              {phases[currentPhase.number]?.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Up Next</p>
              <p className="text-sm font-medium text-foreground truncate">
                Phase {currentPhase.number + 1}: {phases[currentPhase.number]?.title}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
