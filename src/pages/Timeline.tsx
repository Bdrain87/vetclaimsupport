import { useMemo } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { Clock, Shield, Stethoscope, AlertTriangle, Activity, Pill, Brain, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { PageContainer } from '@/components/PageContainer';

interface TimelineEvent {
  id: string;
  date: Date;
  type: 'service' | 'medical' | 'exposure' | 'symptom' | 'medication' | 'migraine' | 'sleep' | 'document';
  title: string;
  description: string;
  icon: typeof Shield;
  color: string;
}

export default function Timeline() {
  const { data } = useClaims();

  const events = useMemo(() => {
    const allEvents: TimelineEvent[] = [];

    // Service history (start dates)
    data.serviceHistory.forEach(entry => {
      if (entry.startDate) {
        allEvents.push({
          id: `service-start-${entry.id}`,
          date: parseISO(entry.startDate),
          type: 'service',
          title: `Started at ${entry.base || 'New Assignment'}`,
          description: entry.unit ? `Unit: ${entry.unit}` : (entry.duties || 'Service began'),
          icon: Shield,
          color: 'bg-emerald-500',
        });
      }
      if (entry.endDate) {
        allEvents.push({
          id: `service-end-${entry.id}`,
          date: parseISO(entry.endDate),
          type: 'service',
          title: `Left ${entry.base || 'Assignment'}`,
          description: 'Service period ended',
          icon: Shield,
          color: 'bg-emerald-600/70',
        });
      }
    });

    // Medical visits
    data.medicalVisits.forEach(visit => {
      if (visit.date) {
        allEvents.push({
          id: `medical-${visit.id}`,
          date: parseISO(visit.date),
          type: 'medical',
          title: `${visit.visitType} Visit`,
          description: visit.reason || visit.diagnosis || 'Medical appointment',
          icon: Stethoscope,
          color: 'bg-blue-500',
        });
      }
    });

    // Exposures
    data.exposures.forEach(exposure => {
      if (exposure.date) {
        allEvents.push({
          id: `exposure-${exposure.id}`,
          date: parseISO(exposure.date),
          type: 'exposure',
          title: `${exposure.type} Exposure`,
          description: exposure.location || exposure.details || 'Hazardous exposure',
          icon: AlertTriangle,
          color: 'bg-blue-500',
        });
      }
    });

    // Symptoms (first entry for each unique symptom)
    const symptomsByName = new Map<string, typeof data.symptoms[0]>();
    data.symptoms.forEach(symptom => {
      if (symptom.date && symptom.symptom) {
        const existing = symptomsByName.get(symptom.symptom);
        if (!existing || parseISO(symptom.date) < parseISO(existing.date)) {
          symptomsByName.set(symptom.symptom, symptom);
        }
      }
    });
    symptomsByName.forEach(symptom => {
      allEvents.push({
        id: `symptom-${symptom.id}`,
        date: parseISO(symptom.date),
        type: 'symptom',
        title: `${symptom.symptom} Started`,
        description: symptom.bodyArea ? `Affecting: ${symptom.bodyArea}` : 'Symptom onset',
        icon: Activity,
        color: 'bg-rose-500',
      });
    });

    // Medications (start dates)
    data.medications.forEach(med => {
      if (med.startDate) {
        allEvents.push({
          id: `medication-${med.id}`,
          date: parseISO(med.startDate),
          type: 'medication',
          title: `Started ${med.name}`,
          description: med.prescribedFor || 'Prescription started',
          icon: Pill,
          color: 'bg-violet-500',
        });
      }
    });

    // Migraines (prostrating ones)
    data.migraines
      .filter(m => m.severity === 'Prostrating' || m.severity === 'Severe')
      .forEach(migraine => {
        if (migraine.date) {
          allEvents.push({
            id: `migraine-${migraine.id}`,
            date: parseISO(migraine.date),
            type: 'migraine',
            title: `${migraine.severity} Migraine`,
            description: `Duration: ${migraine.duration}`,
            icon: Brain,
            color: 'bg-pink-500',
          });
        }
      });

    // Sort by date (newest first)
    return allEvents.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [data]);

  // Group events by year
  const eventsByYear = useMemo(() => {
    const groups = new Map<number, TimelineEvent[]>();
    events.forEach(event => {
      const year = event.date.getFullYear();
      if (!groups.has(year)) {
        groups.set(year, []);
      }
      groups.get(year)!.push(event);
    });
    return Array.from(groups.entries()).sort((a, b) => b[0] - a[0]);
  }, [events]);

  if (events.length === 0) {
    return (
      <PageContainer className="space-y-8 animate-fade-in">
        <div className="section-header">
          <div className="section-icon">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Service Timeline</h1>
            <p className="text-muted-foreground">Visualize your service history and conditions</p>
          </div>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Timeline Events Yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Add service history, medical visits, exposures, and symptoms to build your timeline.
            </p>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Service Timeline</h1>
          <p className="text-muted-foreground">
            {events.length} events from your service history
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30">
          <Shield className="h-3 w-3 mr-1" /> Service
        </Badge>
        <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30">
          <Stethoscope className="h-3 w-3 mr-1" /> Medical
        </Badge>
        <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30">
          <AlertTriangle className="h-3 w-3 mr-1" /> Exposure
        </Badge>
        <Badge variant="outline" className="bg-rose-500/10 border-rose-500/30">
          <Activity className="h-3 w-3 mr-1" /> Symptom
        </Badge>
        <Badge variant="outline" className="bg-violet-500/10 border-violet-500/30">
          <Pill className="h-3 w-3 mr-1" /> Medication
        </Badge>
        <Badge variant="outline" className="bg-pink-500/10 border-pink-500/30">
          <Brain className="h-3 w-3 mr-1" /> Migraine
        </Badge>
      </div>

      {/* Timeline */}
      {eventsByYear.map(([year, yearEvents]) => (
        <Card key={year}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{year}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

              {/* Events */}
              <div className="space-y-6">
                {yearEvents.map((event, _index) => (
                  <div key={event.id} className="relative flex gap-4 pl-10">
                    {/* Timeline dot */}
                    <div className={`absolute left-2 w-5 h-5 rounded-full ${event.color} flex items-center justify-center ring-4 ring-background`}>
                      <event.icon className="h-3 w-3 text-white" />
                    </div>

                    {/* Event content */}
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {event.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(event.date, 'MMM d')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* VA Connection Tip */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground inline-flex items-center gap-1"><Lightbulb className="h-4 w-4 text-blue-500" /> Tip:</strong> This timeline helps demonstrate service connection 
            by showing how events, exposures, and symptoms relate to your military service.
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
