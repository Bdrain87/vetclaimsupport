import { useMemo } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Target,
  Calendar,
  ClipboardCheck,
  Send,
  Award,
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
      { label: 'Add service history', completed: hasServiceHistory, href: '/service-history' },
      { label: 'Log medical visits', completed: hasMedicalVisits, href: '/medical-visits' },
      { label: 'Document exposures', completed: hasExposures, href: '/exposures' },
      { label: 'Set separation date', completed: hasSeparationDate, href: '/' },
    ];
    const phase1Progress = Math.round((phase1Tasks.filter(t => t.completed).length / phase1Tasks.length) * 100);

    // Phase 2: Evidence Gathering
    const hasSymptoms = data.symptoms.length > 0;
    const hasMedications = data.medications.length > 0;
    const hasConditions = (data.claimConditions?.length || 0) > 0;
    const hasBuddyContacts = data.buddyContacts.length > 0;
    
    const phase2Tasks = [
      { label: 'Track symptoms regularly', completed: data.symptoms.length >= 3, href: '/symptoms' },
      { label: 'Log medications', completed: hasMedications, href: '/medications' },
      { label: 'Add conditions to claim', completed: hasConditions, href: '/' },
      { label: 'Add buddy contacts', completed: hasBuddyContacts, href: '/buddy-contacts' },
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
      { label: 'Gather key documents', completed: documentsObtained >= 3, href: '/documents' },
      { label: 'Obtain buddy statements', completed: hasBuddyStatements, href: '/buddy-contacts' },
      { label: 'Upload supporting docs', completed: hasUploadedDocs, href: '/documents' },
      { label: 'Link evidence to conditions', completed: hasLinkedEvidence, href: '/' },
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
      { label: 'File Intent to File', completed: hasItf, href: '/' },
      { label: 'Reach 50%+ evidence per condition', completed: conditionsWithStrongEvidence >= 1, href: '/' },
      { label: 'Review claim checklist', completed: false, href: '/checklist' },
      { label: 'Prepare for C&P exam', completed: false, href: '/exam-prep' },
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
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-background overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Your Claims Journey</CardTitle>
              <p className="text-xs text-muted-foreground">{overallProgress}% complete</p>
            </div>
          </div>
          <Badge variant="outline" className="text-primary border-primary/30">
            Phase {currentPhase.number}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visual Progress Bar */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
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
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                    phase.status === 'completed' && "bg-success border-success text-success-foreground",
                    phase.status === 'current' && "bg-primary border-primary text-primary-foreground",
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
                  "text-[10px] mt-1 text-center max-w-[60px]",
                  phase.status === 'current' ? "text-primary font-medium" : "text-muted-foreground"
                )}>
                  {phase.title}
                </span>
              </div>
            ))}
          </div>
          {/* Connecting line */}
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-border -z-0">
            <div 
              className="h-full bg-primary transition-all duration-500"
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
