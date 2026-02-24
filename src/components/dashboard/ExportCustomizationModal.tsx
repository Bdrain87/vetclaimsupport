import { useState, useMemo } from 'react';
import { useFeatureFlag } from '@/store/useFeatureFlagStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FileDown,
  FileText,
  Stethoscope,
  Activity,
  Pill,
  Shield,
  AlertTriangle,
  Moon,
  Brain,
  Users,
  Clock,
  CheckSquare,
  Square,
  Loader2,
} from 'lucide-react';
import { useClaims } from '@/hooks/useClaims';
import type { ClaimsData, SymptomEntry } from '@/types/claims';

export interface ExportSections {
  personalStatement: boolean;
  medicalVisits: boolean;
  symptoms: boolean;
  medications: boolean;
  serviceHistory: boolean;
  exposures: boolean;
  sleepLog: boolean;
  migraineLog: boolean;
  buddyContacts: boolean;
  timeline: boolean;
}

interface ExportCustomizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (sections: ExportSections) => void | Promise<void>;
}

interface SectionConfig {
  key: keyof ExportSections;
  label: string;
  icon: React.ReactNode;
  getCount: (data: ClaimsData) => number;
  getWordEstimate: (data: ClaimsData) => number;
}

const sectionConfigs: SectionConfig[] = [
  {
    key: 'personalStatement',
    label: 'Personal Statement',
    icon: <FileText className="h-4 w-4" />,
    getCount: () => 1,
    getWordEstimate: () => 150,
  },
  {
    key: 'medicalVisits',
    label: 'Medical Visits',
    icon: <Stethoscope className="h-4 w-4" />,
    getCount: (data) => data.medicalVisits?.length || 0,
    getWordEstimate: (data) => (data.medicalVisits?.length || 0) * 40,
  },
  {
    key: 'symptoms',
    label: 'Symptom Journal Entries',
    icon: <Activity className="h-4 w-4" />,
    getCount: (data) => data.symptoms?.length || 0,
    getWordEstimate: (data) => (data.symptoms?.length || 0) * 35,
  },
  {
    key: 'medications',
    label: 'Medication List',
    icon: <Pill className="h-4 w-4" />,
    getCount: (data) => data.medications?.length || 0,
    getWordEstimate: (data) => (data.medications?.length || 0) * 20,
  },
  {
    key: 'serviceHistory',
    label: 'Service History & Combat Dates',
    icon: <Shield className="h-4 w-4" />,
    getCount: (data) => data.serviceHistory?.length || 0,
    getWordEstimate: (data) => (data.serviceHistory?.length || 0) * 50,
  },
  {
    key: 'exposures',
    label: 'Exposures (Burn Pits, Chemicals)',
    icon: <AlertTriangle className="h-4 w-4" />,
    getCount: (data) => data.exposures?.length || 0,
    getWordEstimate: (data) => (data.exposures?.length || 0) * 25,
  },
  {
    key: 'sleepLog',
    label: 'Sleep Log Entries',
    icon: <Moon className="h-4 w-4" />,
    getCount: (data) => data.sleepEntries?.length || 0,
    getWordEstimate: (data) => (data.sleepEntries?.length || 0) * 20,
  },
  {
    key: 'migraineLog',
    label: 'Migraine Log with Rating Analysis',
    icon: <Brain className="h-4 w-4" />,
    getCount: (data) => data.migraines?.length || 0,
    getWordEstimate: (data) => (data.migraines?.length || 0) * 30 + 100,
  },
  {
    key: 'buddyContacts',
    label: 'Buddy Contact Info',
    icon: <Users className="h-4 w-4" />,
    getCount: (data) => data.buddyContacts?.length || 0,
    getWordEstimate: (data) => (data.buddyContacts?.length || 0) * 25,
  },
  {
    key: 'timeline',
    label: 'Timeline of Key Events',
    icon: <Clock className="h-4 w-4" />,
    getCount: (data) => {
      const events = 
        (data.serviceHistory?.length || 0) +
        (data.medicalVisits?.length || 0) +
        (data.symptoms?.filter((s: SymptomEntry) => s.severity >= 7)?.length || 0);
      return events;
    },
    getWordEstimate: (data) => {
      const events =
        (data.serviceHistory?.length || 0) +
        (data.medicalVisits?.length || 0) +
        (data.symptoms?.filter((s: SymptomEntry) => s.severity >= 7)?.length || 0);
      return events * 15;
    },
  },
];

export function ExportCustomizationModal({
  open,
  onOpenChange,
  onExport,
}: ExportCustomizationModalProps) {
  const { data } = useClaims();
  const showPacketCheck = useFeatureFlag('exportPacketCheck');
  
  const [sections, setSections] = useState<ExportSections>({
    personalStatement: true,
    medicalVisits: true,
    symptoms: true,
    medications: true,
    serviceHistory: true,
    exposures: true,
    sleepLog: true,
    migraineLog: true,
    buddyContacts: true,
    timeline: true,
  });

  const toggleSection = (key: keyof ExportSections) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectAll = () => {
    setSections({
      personalStatement: true,
      medicalVisits: true,
      symptoms: true,
      medications: true,
      serviceHistory: true,
      exposures: true,
      sleepLog: true,
      migraineLog: true,
      buddyContacts: true,
      timeline: true,
    });
  };

  const deselectAll = () => {
    setSections({
      personalStatement: false,
      medicalVisits: false,
      symptoms: false,
      medications: false,
      serviceHistory: false,
      exposures: false,
      sleepLog: false,
      migraineLog: false,
      buddyContacts: false,
      timeline: false,
    });
  };

  const selectedCount = Object.values(sections).filter(Boolean).length;
  const allSelected = selectedCount === 10;
  const noneSelected = selectedCount === 0;

  // Calculate word count estimate
  const wordCountEstimate = useMemo(() => {
    let total = 100; // Base words for header/footer
    
    sectionConfigs.forEach(config => {
      if (sections[config.key]) {
        total += config.getWordEstimate(data);
      }
    });
    
    return total;
  }, [sections, data]);

  // Format word count
  const formatWordCount = (count: number) => {
    if (count >= 1000) {
      return `~${(count / 1000).toFixed(1)}k`;
    }
    return `~${count}`;
  };

  // Packet completeness check
  const packetChecks = useMemo(() => {
    const checks = [
      { label: 'Personal statement', ok: (data.claimConditions?.some(c => c.notes && c.notes.trim().length > 50)) || false },
      { label: 'Medical records', ok: (data.medicalVisits?.length ?? 0) > 0 },
      { label: 'Service history', ok: (data.serviceHistory?.length ?? 0) > 0 },
      { label: 'Symptom logs (5+)', ok: (data.symptoms?.length ?? 0) >= 5 },
      { label: 'Buddy statements', ok: (data.buddyContacts?.length ?? 0) > 0 },
      { label: 'Medication list', ok: (data.medications?.length ?? 0) > 0 },
    ];
    const completedCount = checks.filter(c => c.ok).length;
    return { checks, completedCount, total: checks.length };
  }, [data]);

  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await onExport(sections);
      onOpenChange(false);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-primary" />
            Customize PDF Export
          </DialogTitle>
          <DialogDescription>
            Select which sections to include in your evidence report
          </DialogDescription>
        </DialogHeader>

        {/* Packet Completeness Check */}
        {showPacketCheck && <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground">Packet Completeness</span>
            <Badge variant={packetChecks.completedCount === packetChecks.total ? 'default' : 'secondary'} className="font-mono text-[10px]">
              {packetChecks.completedCount}/{packetChecks.total}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {packetChecks.checks.map((check) => (
              <span key={check.label} className={`text-[11px] flex items-center gap-1.5 ${check.ok ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                {check.ok ? '✓' : '○'} {check.label}
              </span>
            ))}
          </div>
        </div>}

        {/* Select All / Deselect All */}
        <div className="flex items-center justify-between py-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAll}
              disabled={allSelected}
              className="gap-1.5"
            >
              <CheckSquare className="h-3.5 w-3.5" />
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={deselectAll}
              disabled={noneSelected}
              className="gap-1.5"
            >
              <Square className="h-3.5 w-3.5" />
              Deselect All
            </Button>
          </div>
          <Badge variant="secondary" className="font-mono">
            {selectedCount}/10 selected
          </Badge>
        </div>

        <Separator />

        {/* Section Checkboxes */}
        <ScrollArea className="flex-1 max-h-[350px] pr-4">
          <div className="space-y-1">
            {sectionConfigs.map(config => {
              const count = config.getCount(data);
              const isDisabled = count === 0 && config.key !== 'personalStatement' && config.key !== 'timeline';
              
              return (
                <div
                  key={config.key}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    sections[config.key] && !isDisabled
                      ? 'bg-primary/5 border border-primary/20'
                      : 'hover:bg-muted/50'
                  } ${isDisabled ? 'opacity-50' : 'cursor-pointer'}`}
                  onClick={() => !isDisabled && toggleSection(config.key)}
                >
                  <Checkbox
                    id={config.key}
                    checked={sections[config.key] && !isDisabled}
                    disabled={isDisabled}
                    onCheckedChange={() => toggleSection(config.key)}
                    className="pointer-events-none"
                  />
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    <span className="text-muted-foreground shrink-0">{config.icon}</span>
                    <Label
                      htmlFor={config.key}
                      className={`flex-1 cursor-pointer text-sm min-w-0 truncate ${isDisabled ? 'text-muted-foreground' : ''}`}
                    >
                      {config.label}
                    </Label>
                    <Badge 
                      variant={count > 0 ? 'secondary' : 'outline'} 
                      className="text-xs font-mono"
                    >
                      {count} {count === 1 ? 'entry' : 'entries'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <Separator />

        {/* Word Count Preview */}
        <div className="flex items-center justify-between py-2">
          <div className="text-sm text-muted-foreground">
            Estimated document size:
          </div>
          <Badge variant="outline" className="font-mono text-sm">
            {formatWordCount(wordCountEstimate)} words
          </Badge>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={noneSelected || exporting}
            className="gap-2"
          >
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
            {exporting ? 'Exporting...' : 'Export PDF'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
