import { useState, useMemo } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { useUserConditions } from '@/hooks/useUserConditions';
import { useProfileStore } from '@/store/useProfileStore';
import { getAllBranchLabels } from '@/utils/veteranProfile';
import { safeFormatDate } from '@/utils/dateUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Download,
  Share2,
  Printer,
  Mail,
  CheckCircle2,
  Package,
  Shield,
  FileJson,
  Copy,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { generateExport, downloadExport } from '@/services/exportEngine';
import { PageContainer } from '@/components/PageContainer';

interface PacketSection {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  countLabel: string;
  count: number;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function BuildPacket() {
  const { data } = useClaims();
  const { conditions: userConditions, totalRating } = useUserConditions();
  const profile = useProfileStore();

  const [selected, setSelected] = useState<Record<string, boolean>>({
    claimOverview: true,
    symptomLogs: true,
    medicalVisits: true,
    medications: true,
    buddyContacts: true,
    exposures: true,
    evidenceChecklist: true,
  });

  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingText, setExportingText] = useState(false);
  const [exportingJSON, setExportingJSON] = useState(false);

  // --------------- derived counts ---------------

  const conditionsCount = (data.claimConditions || []).length;
  const symptomCount = (data.symptoms || []).length;
  const medicalVisitCount = (data.medicalVisits || []).length;
  const medicationCount = (data.medications || []).length;
  const buddyCount = (data.buddyContacts || []).length;
  const exposureCount = (data.exposures || []).length;
  const migraineCount = (data.migraines || []).length;
  const sleepCount = (data.sleepEntries || []).length;
  const documentCount = (data.uploadedDocuments || []).length;
  const checklistObtained = (data.documents || []).filter(
    (d) => d.status === 'Obtained' || d.status === 'Submitted',
  ).length;
  const checklistTotal = (data.documents || []).length;

  // --------------- section definitions ---------------

  const sections: PacketSection[] = useMemo(
    () => [
      {
        id: 'claimOverview',
        label: 'Claim Overview',
        description: 'Conditions list, readiness summary, and service info',
        icon: Package,
        countLabel: `${conditionsCount} condition${conditionsCount !== 1 ? 's' : ''}`,
        count: conditionsCount,
      },
      {
        id: 'symptomLogs',
        label: 'Symptom Logs',
        description: 'All symptom journal entries across conditions',
        icon: FileText,
        countLabel: `${symptomCount} entr${symptomCount !== 1 ? 'ies' : 'y'}`,
        count: symptomCount,
      },
      {
        id: 'medicalVisits',
        label: 'Medical Visit Records',
        description: 'Provider visits, diagnoses, and treatment notes',
        icon: FileText,
        countLabel: `${medicalVisitCount} visit${medicalVisitCount !== 1 ? 's' : ''}`,
        count: medicalVisitCount,
      },
      {
        id: 'medications',
        label: 'Medication List',
        description: 'Current and past prescriptions with side effects',
        icon: FileText,
        countLabel: `${medicationCount} medication${medicationCount !== 1 ? 's' : ''}`,
        count: medicationCount,
      },
      {
        id: 'buddyContacts',
        label: 'Buddy Contact List',
        description: 'Fellow service members and witness statement status',
        icon: FileText,
        countLabel: `${buddyCount} contact${buddyCount !== 1 ? 's' : ''}`,
        count: buddyCount,
      },
      {
        id: 'exposures',
        label: 'Exposure Records',
        description: 'Documented hazardous exposures during service',
        icon: Shield,
        countLabel: `${exposureCount} exposure${exposureCount !== 1 ? 's' : ''}`,
        count: exposureCount,
      },
      {
        id: 'evidenceChecklist',
        label: 'Evidence Checklist Status',
        description: 'Document gathering progress and status',
        icon: CheckCircle2,
        countLabel: `${checklistObtained}/${checklistTotal} complete`,
        count: checklistObtained,
      },
    ],
    [
      conditionsCount,
      symptomCount,
      medicalVisitCount,
      medicationCount,
      buddyCount,
      exposureCount,
      checklistObtained,
      checklistTotal,
    ],
  );

  const selectedCount = Object.values(selected).filter(Boolean).length;

  // --------------- toggle helpers ---------------

  const toggle = (id: string) =>
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));

  const selectAll = () =>
    setSelected(Object.fromEntries(sections.map((s) => [s.id, true])));

  const deselectAll = () =>
    setSelected(Object.fromEntries(sections.map((s) => [s.id, false])));

  // --------------- export actions ---------------

  const showMessage = (msg: string) => {
    setExportMessage(msg);
    setTimeout(() => setExportMessage(null), 4000);
  };

  const handleGeneratePDF = async () => {
    setExportingPDF(true);
    try {
      const result = await generateExport({
        format: 'pdf',
        sections: getSectionMapping(),
      });
      downloadExport(result);
    } catch {
      showMessage('Unable to generate PDF. Please try again.');
    } finally {
      setExportingPDF(false);
    }
  };

  const handlePrint = () => {
    if (typeof window.print === 'function' && !('Capacitor' in window)) {
      window.print();
    } else {
      showMessage('Print is not available on this device. Use the PDF export instead.');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'VCS Claim Packet',
          text: `My VA claim packet includes ${conditionsCount} conditions, ${symptomCount} symptom logs, and ${medicalVisitCount} medical visits.`,
        });
      } catch {
        // User cancelled or share failed silently
      }
    } else {
      showMessage('Sharing is not supported on this device. Try printing or emailing instead.');
    }
  };

  const handleEmail = () => {
    const subject = encodeURIComponent('VA Claim Packet Summary');
    const body = encodeURIComponent(
      `VA Claim Packet Summary\n` +
        `========================\n\n` +
        `Veteran: ${profile.firstName} ${profile.lastName}\n` +
        `Branch: ${getAllBranchLabels(profile) || 'Not set'}\n` +
        `MOS: ${profile.mosCode || 'Not set'}${profile.mosTitle ? ` - ${profile.mosTitle}` : ''}\n\n` +
        `Conditions: ${conditionsCount}\n` +
        `Symptom Entries: ${symptomCount}\n` +
        `Medical Visits: ${medicalVisitCount}\n` +
        `Medications: ${medicationCount}\n` +
        `Buddy Contacts: ${buddyCount}\n` +
        `Exposures: ${exposureCount}\n` +
        `Documents Uploaded: ${documentCount}\n` +
        `Evidence Checklist: ${checklistObtained}/${checklistTotal} complete\n\n` +
        `---\n` +
        `Generated by Vet Claim Support`,
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
  };

  const getSectionMapping = () => ({
    personalInfo: !!selected.claimOverview,
    conditions: !!selected.claimOverview,
    evidenceChecklist: !!selected.evidenceChecklist,
    healthLogs: !!(selected.symptomLogs || selected.medicalVisits || selected.medications),
    generatedDocs: !!selected.buddyContacts,
    formDrafts: false,
    romMeasurements: false,
    timeline: !!selected.exposures,
  });

  const handleExportText = async () => {
    setExportingText(true);
    try {
      const result = await generateExport({
        format: 'text',
        sections: getSectionMapping(),
      });
      if (result.content && typeof result.content === 'string') {
        try {
          await navigator.clipboard.writeText(result.content);
          showMessage('Text copied to clipboard.');
        } catch {
          showMessage('Unable to access clipboard.');
        }
      } else {
        downloadExport(result);
      }
    } catch {
      showMessage('Unable to generate text export.');
    } finally {
      setExportingText(false);
    }
  };

  const handleExportJSON = async () => {
    setExportingJSON(true);
    try {
      const result = await generateExport({
        format: 'json',
        sections: getSectionMapping(),
      });
      downloadExport(result);
    } catch {
      showMessage('Unable to generate JSON export.');
    } finally {
      setExportingJSON(false);
    }
  };

  // --------------- evidence score ---------------

  const evidenceScore = useMemo(() => {
    let score = 0;
    if (conditionsCount > 0) score += 15;
    if (symptomCount >= 5) score += 15;
    if (medicalVisitCount >= 3) score += 20;
    if (medicationCount > 0) score += 10;
    if (buddyCount >= 2) score += 15;
    if (exposureCount > 0) score += 10;
    if (checklistObtained >= checklistTotal * 0.5) score += 15;
    return Math.min(score, 100);
  }, [
    conditionsCount,
    symptomCount,
    medicalVisitCount,
    medicationCount,
    buddyCount,
    exposureCount,
    checklistObtained,
    checklistTotal,
  ]);

  // --------------- render ---------------

  return (
    <PageContainer>
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
    >
      {/* ===== Header ===== */}
      <motion.div variants={fadeUp} custom={0}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full scale-150 opacity-50" />
              <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-lg shadow-primary/10">
                <Package className="h-7 w-7 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Build Your Packet
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Select sections and export your VA claim evidence packet
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              'text-sm px-3 py-1 self-start sm:self-auto',
              evidenceScore >= 80
                ? 'border-success/40 bg-success/10 text-success'
                : evidenceScore >= 50
                  ? 'border-gold/40 bg-gold/10 text-foreground'
                  : 'border-destructive/40 bg-destructive/10 text-destructive',
            )}
          >
            Evidence Strength: {evidenceScore}%
          </Badge>
        </div>
      </motion.div>

      {/* ===== Export Message Toast ===== */}
      {exportMessage && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground"
        >
          {exportMessage}
        </motion.div>
      )}

      {/* ===== Summary Stats ===== */}
      <motion.div variants={fadeUp} custom={1}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Conditions', value: conditionsCount, color: 'text-primary' },
            { label: 'Symptom Entries', value: symptomCount, color: 'text-gold' },
            { label: 'Medical Visits', value: medicalVisitCount, color: 'text-success' },
            { label: 'Documents', value: documentCount, color: 'text-gold' },
          ].map((stat) => (
            <Card key={stat.label} className="glass-card">
              <CardContent className="p-4 text-center">
                <p className={cn('text-3xl font-bold', stat.color)}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* ===== Section Selection ===== */}
      <motion.div variants={fadeUp} custom={2}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Sections to Include</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={selectAll}>
                  Select All
                </Button>
                <Button variant="ghost" size="sm" onClick={deselectAll}>
                  Clear
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedCount} of {sections.length} sections selected
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {sections.map((section) => {
              const isChecked = !!selected[section.id];
              const Icon = section.icon;
              return (
                <label
                  key={section.id}
                  className={cn(
                    'flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-all',
                    isChecked
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-border hover:border-primary/20 bg-card',
                  )}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggle(section.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="font-medium text-foreground">{section.label}</span>
                      <Badge variant="secondary" className="text-xs font-mono">
                        {section.countLabel}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                  </div>
                </label>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* ===== Export Actions ===== */}
      <motion.div variants={fadeUp} custom={3}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Export Your Packet</CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose how you want to export your compiled claim evidence
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <Button
                onClick={handleGeneratePDF}
                disabled={selectedCount === 0 || exportingPDF}
                className="h-auto flex-col gap-2 py-4 primary-button"
              >
                {exportingPDF ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                <span className="text-xs font-semibold">{exportingPDF ? 'Exporting...' : 'PDF'}</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleExportText}
                disabled={selectedCount === 0 || exportingText}
                className="h-auto flex-col gap-2 py-4"
              >
                {exportingText ? <Loader2 className="h-5 w-5 animate-spin" /> : <Copy className="h-5 w-5" />}
                <span className="text-xs">{exportingText ? 'Exporting...' : 'Text'}</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleExportJSON}
                disabled={selectedCount === 0 || exportingJSON}
                className="h-auto flex-col gap-2 py-4"
              >
                {exportingJSON ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileJson className="h-5 w-5" />}
                <span className="text-xs">{exportingJSON ? 'Exporting...' : 'JSON'}</span>
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={handleShare}
                disabled={selectedCount === 0}
                className="h-auto flex-col gap-2 py-4"
              >
                <Share2 className="h-5 w-5" />
                <span className="text-xs">Share</span>
              </Button>
              <Button
                variant="outline"
                onClick={handlePrint}
                disabled={selectedCount === 0}
                className="h-auto flex-col gap-2 py-4"
              >
                <Printer className="h-5 w-5" />
                <span className="text-xs">Print</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleEmail}
                disabled={selectedCount === 0}
                className="h-auto flex-col gap-2 py-4"
              >
                <Mail className="h-5 w-5" />
                <span className="text-xs">Email</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ===== Preview Section ===== */}
      <motion.div variants={fadeUp} custom={4}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Packet Preview
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Summary of the data that will be included in your export
            </p>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            {/* Claim Overview */}
            {selected.claimOverview && (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  Claim Overview
                </h3>
                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                    <span className="text-muted-foreground">Veteran</span>
                    <span className="font-medium text-foreground break-words">
                      {profile.firstName && profile.lastName
                        ? `${profile.firstName} ${profile.lastName}`
                        : 'Not set'}
                    </span>
                    <span className="text-muted-foreground">Branch</span>
                    <span className="font-medium text-foreground break-words">
                      {getAllBranchLabels(profile) || 'Not set'}
                    </span>
                    <span className="text-muted-foreground">Service Job Code</span>
                    <span className="font-medium text-foreground break-words">
                      {profile.mosCode || 'Not set'}
                      {profile.mosTitle ? ` - ${profile.mosTitle}` : ''}
                    </span>
                    <span className="text-muted-foreground">Claim Type</span>
                    <span className="font-medium text-foreground capitalize break-words">
                      {profile.claimType || 'Not set'}
                    </span>
                    <span className="text-muted-foreground">Evidence Strength</span>
                    <span className="font-medium text-foreground">{evidenceScore}%</span>
                  </div>
                  {conditionsCount > 0 && (
                    <div className="pt-2 border-t border-border mt-2">
                      <p className="text-muted-foreground mb-1.5">
                        Claimed Conditions ({conditionsCount}):
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {(data.claimConditions || []).map((c) => (
                          <Badge key={c.id} variant="secondary" className="text-xs break-words max-w-full">
                            {c.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {userConditions.length > 0 && (
                    <div className="pt-2 border-t border-border mt-2">
                      <p className="text-muted-foreground mb-1">
                        VA Rated Conditions ({userConditions.length}) &mdash; Combined Rating:{' '}
                        <span className="font-medium text-foreground">{totalRating}%</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Symptom Logs */}
            {selected.symptomLogs && (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gold" />
                  Symptom Logs ({symptomCount})
                </h3>
                {symptomCount === 0 ? (
                  <p className="text-muted-foreground italic pl-6">No symptom entries logged yet.</p>
                ) : (
                  <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 max-h-60 overflow-y-auto">
                    {(data.symptoms || []).slice(0, 20).map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between text-xs border-b border-border/50 pb-1.5 last:border-0"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-muted-foreground w-20 flex-shrink-0">
                            {safeFormatDate(s.date)}
                          </span>
                          <span className="font-medium text-foreground line-clamp-1">{s.symptom}</span>
                          {s.bodyArea && (
                            <Badge variant="outline" className="text-[10px] shrink-0">
                              {s.bodyArea}
                            </Badge>
                          )}
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-[10px]',
                            s.severity >= 7
                              ? 'bg-destructive/10 text-destructive'
                              : s.severity >= 4
                                ? 'bg-gold/10 text-foreground'
                                : '',
                          )}
                        >
                          {s.severity}/10
                        </Badge>
                      </div>
                    ))}
                    {symptomCount > 20 && (
                      <p className="text-xs text-muted-foreground pt-1">
                        ... and {symptomCount - 20} more entries
                      </p>
                    )}
                    {migraineCount > 0 && (
                      <p className="text-xs text-muted-foreground pt-1 border-t border-border/50">
                        + {migraineCount} migraine log{migraineCount !== 1 ? 's' : ''}
                      </p>
                    )}
                    {sleepCount > 0 && (
                      <p className="text-xs text-muted-foreground">
                        + {sleepCount} sleep entr{sleepCount !== 1 ? 'ies' : 'y'}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Medical Visits */}
            {selected.medicalVisits && (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-success" />
                  Medical Visit Records ({medicalVisitCount})
                </h3>
                {medicalVisitCount === 0 ? (
                  <p className="text-muted-foreground italic pl-6">No medical visits logged yet.</p>
                ) : (
                  <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 max-h-60 overflow-y-auto">
                    {(data.medicalVisits || []).slice(0, 15).map((v) => (
                      <div
                        key={v.id}
                        className="flex items-start gap-3 text-xs border-b border-border/50 pb-1.5 last:border-0"
                      >
                        <span className="text-muted-foreground w-20 flex-shrink-0">
                          {safeFormatDate(v.date)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-foreground">{v.visitType}</span>
                          {v.location && (
                            <span className="text-muted-foreground"> at {v.location}</span>
                          )}
                          {v.diagnosis && (
                            <p className="text-muted-foreground mt-0.5">Dx: {v.diagnosis}</p>
                          )}
                        </div>
                        {v.gotAfterVisitSummary && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0 mt-0.5" />
                        )}
                      </div>
                    ))}
                    {medicalVisitCount > 15 && (
                      <p className="text-xs text-muted-foreground pt-1">
                        ... and {medicalVisitCount - 15} more visits
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Medications */}
            {selected.medications && (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gold" />
                  Medication List ({medicationCount})
                </h3>
                {medicationCount === 0 ? (
                  <p className="text-muted-foreground italic pl-6">No medications documented yet.</p>
                ) : (
                  <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
                    {(data.medications || []).map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between gap-2 text-xs border-b border-border/50 pb-1.5 last:border-0"
                      >
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <span className="font-medium text-foreground break-words">{m.name}</span>
                          {m.prescribedFor && (
                            <span className="text-muted-foreground"> -- {m.prescribedFor}</span>
                          )}
                        </div>
                        <Badge variant={m.stillTaking ? 'default' : 'secondary'} className="text-[10px] shrink-0">
                          {m.stillTaking ? 'Current' : 'Past'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Buddy Contacts */}
            {selected.buddyContacts && (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gold" />
                  Buddy Contact List ({buddyCount})
                </h3>
                {buddyCount === 0 ? (
                  <p className="text-muted-foreground italic pl-6">No buddy contacts added yet.</p>
                ) : (
                  <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
                    {(data.buddyContacts || []).map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center justify-between gap-2 text-xs border-b border-border/50 pb-1.5 last:border-0"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-medium text-foreground break-words block">
                            {b.rank ? `${b.rank} ` : ''}
                            {b.name}
                          </span>
                          {b.relationship && (
                            <span className="text-muted-foreground"> ({b.relationship})</span>
                          )}
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-[10px]',
                            b.statementStatus === 'Received' || b.statementStatus === 'Submitted'
                              ? 'border-success/40 text-success'
                              : b.statementStatus === 'Requested'
                                ? 'border-gold/40 text-gold'
                                : '',
                          )}
                        >
                          {b.statementStatus}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Exposures */}
            {selected.exposures && (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gold" />
                  Exposure Records ({exposureCount})
                </h3>
                {exposureCount === 0 ? (
                  <p className="text-muted-foreground italic pl-6">No exposures documented yet.</p>
                ) : (
                  <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
                    {(data.exposures || []).map((e) => (
                      <div
                        key={e.id}
                        className="flex items-start gap-3 text-xs border-b border-border/50 pb-1.5 last:border-0"
                      >
                        <span className="text-muted-foreground w-20 flex-shrink-0">
                          {safeFormatDate(e.date)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-foreground">{e.type}</span>
                          {e.location && (
                            <span className="text-muted-foreground"> -- {e.location}</span>
                          )}
                          {e.duration && (
                            <span className="text-muted-foreground"> ({e.duration})</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Evidence Checklist */}
            {selected.evidenceChecklist && (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Evidence Checklist ({checklistObtained}/{checklistTotal})
                </h3>
                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
                  {(data.documents || []).map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between gap-2 text-xs border-b border-border/50 pb-1.5 last:border-0"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {doc.status === 'Obtained' || doc.status === 'Submitted' ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                        ) : (
                          <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/40" />
                        )}
                        <span className="font-medium text-foreground line-clamp-2">{doc.name}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px]',
                          doc.status === 'Submitted'
                            ? 'border-success/40 text-success'
                            : doc.status === 'Obtained'
                              ? 'border-gold/40 text-gold'
                              : doc.status === 'In Progress'
                                ? 'border-gold/40 text-gold'
                                : '',
                        )}
                      >
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {selectedCount === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground">
                  Select at least one section above to preview your packet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

    </motion.div>
    </PageContainer>
  );
}
