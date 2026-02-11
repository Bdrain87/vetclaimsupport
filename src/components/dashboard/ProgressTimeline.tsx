import { useMemo } from 'react';
import { CheckCircle2, Circle, Clock, Trophy, FileText, Activity, Users, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  id: string;
  date: Date;
  type: 'milestone' | 'activity' | 'document' | 'goal';
  title: string;
  description?: string;
  icon?: React.ReactNode;
  completed?: boolean;
}

interface ProgressTimelineProps {
  events?: TimelineEvent[];
  className?: string;
}

// Default events based on typical claim journey
function getDefaultEvents(): TimelineEvent[] {
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 86400000);
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const monthAgo = new Date(now.getTime() - 30 * 86400000);

  return [
    {
      id: '1',
      date: monthAgo,
      type: 'milestone',
      title: 'Started Your Claim Journey',
      description: 'Began tracking symptoms and gathering evidence',
      icon: <Trophy className="h-4 w-4" />,
      completed: true,
    },
    {
      id: '2',
      date: weekAgo,
      type: 'activity',
      title: 'Logged First Symptoms',
      description: 'Started daily symptom tracking',
      icon: <Activity className="h-4 w-4" />,
      completed: true,
    },
    {
      id: '3',
      date: dayAgo,
      type: 'document',
      title: 'Uploaded Documents',
      description: 'Added medical records to evidence library',
      icon: <FileText className="h-4 w-4" />,
      completed: true,
    },
    {
      id: '4',
      date: now,
      type: 'goal',
      title: 'Gather Buddy Statements',
      description: 'Collect statements from witnesses',
      icon: <Users className="h-4 w-4" />,
      completed: false,
    },
    {
      id: '5',
      date: new Date(now.getTime() + 7 * 86400000),
      type: 'goal',
      title: 'Schedule C&P Exam Prep',
      description: 'Review exam preparation materials',
      icon: <Shield className="h-4 w-4" />,
      completed: false,
    },
  ];
}

export function ProgressTimeline({ events, className }: ProgressTimelineProps) {
  const timelineEvents = useMemo(() => {
    const allEvents = events ?? getDefaultEvents();
    return allEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [events]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);

    if (date > now) {
      const futureDays = Math.ceil((date.getTime() - now.getTime()) / 86400000);
      if (futureDays === 0) return 'Today';
      if (futureDays === 1) return 'Tomorrow';
      return `In ${futureDays} days`;
    }

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTypeColor = (type: TimelineEvent['type'], completed?: boolean) => {
    if (!completed && type === 'goal') return 'text-muted-foreground';
    switch (type) {
      case 'milestone':
        return 'text-gold';
      case 'activity':
        return 'text-primary';
      case 'document':
        return 'text-success';
      case 'goal':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTypeBg = (type: TimelineEvent['type'], completed?: boolean) => {
    if (!completed && type === 'goal') return 'bg-muted';
    switch (type) {
      case 'milestone':
        return 'bg-[rgba(214,178,94,0.1)]';
      case 'activity':
        return 'bg-primary/10';
      case 'document':
        return 'bg-success/10';
      case 'goal':
        return 'bg-muted';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Your Claim Journey
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-4">
            {timelineEvents.map((event, index) => (
              <div
                key={event.id}
                className={cn(
                  'relative pl-10 animate-fade-in',
                  !event.completed && event.type === 'goal' && 'opacity-70'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Node */}
                <div
                  className={cn(
                    'absolute left-0 w-8 h-8 rounded-full flex items-center justify-center',
                    getTypeBg(event.type, event.completed),
                    getTypeColor(event.type, event.completed)
                  )}
                >
                  {event.completed ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : event.icon ? (
                    event.icon
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </div>

                {/* Content */}
                <div className="min-h-[50px]">
                  <div className="flex items-center gap-2 mb-1 min-w-0">
                    <span
                      className={cn(
                        'font-medium text-sm min-w-0 truncate',
                        event.completed ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {event.title}
                    </span>
                    {event.type === 'milestone' && event.completed && (
                      <span className="text-xs bg-[rgba(214,178,94,0.2)] text-gold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                        Milestone
                      </span>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-xs text-muted-foreground mb-1">
                      {event.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground/70">
                    {formatDate(event.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
