import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClaims } from '@/hooks/useClaims';
import { useToast } from '@/hooks/use-toast';
import { ExportCustomizationModal, ExportSections } from './ExportCustomizationModal';

// Colors (matching the app's design tokens)
const colors = {
  primary: [26, 54, 93] as [number, number, number],
  secondary: [45, 55, 72] as [number, number, number],
  muted: [113, 128, 150] as [number, number, number],
  success: [34, 84, 61] as [number, number, number],
  warning: [116, 66, 16] as [number, number, number],
  danger: [155, 44, 44] as [number, number, number],
  border: [226, 232, 240] as [number, number, number],
  background: [247, 250, 252] as [number, number, number],
  infoBg: [235, 248, 255] as [number, number, number],
  successBg: [198, 246, 213] as [number, number, number],
  warningBg: [254, 252, 191] as [number, number, number],
  dangerBg: [254, 215, 215] as [number, number, number],
};

interface ExportButtonProps {
  variant?: 'default' | 'prominent';
}

export function ExportButton({ variant = 'default' }: ExportButtonProps) {
  const { data } = useClaims();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  const exportPDF = async (sections: ExportSections) => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const now = new Date();
    
    let yPos = 20;
    
    // Title
    doc.setFontSize(18);
    doc.setTextColor(...colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('Vet Claim Support - Evidence Report', 20, yPos);
    
    // Underline
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(0.5);
    doc.line(20, yPos + 3, pageWidth - 20, yPos + 3);
    yPos += 12;
    
    // Generated date
    doc.setFontSize(9);
    doc.setTextColor(...colors.muted);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, 20, yPos);
    doc.text('This report contains selected evidence for VA disability claim purposes.', 20, yPos + 5);
    yPos += 15;
    
    // Count selected sections for summary
    const selectedSections = Object.entries(sections)
      .filter(([_, selected]) => selected)
      .map(([key]) => key);
    
    // Summary Box
    doc.setFillColor(...colors.background);
    doc.roundedRect(20, yPos, pageWidth - 40, 40, 2, 2, 'F');
    
    const summaryItems = [
      sections.serviceHistory ? { value: data.serviceHistory.length, label: 'Service Entries' } : null,
      sections.medicalVisits ? { value: data.medicalVisits.length, label: 'Medical Visits' } : null,
      sections.symptoms ? { value: data.symptoms.length, label: 'Symptom Entries' } : null,
      sections.exposures ? { value: data.exposures.length, label: 'Exposures' } : null,
      sections.medications ? { value: data.medications.length, label: 'Medications' } : null,
      sections.buddyContacts ? { value: data.buddyContacts.length, label: 'Buddy Contacts' } : null,
    ].filter(Boolean) as { value: number; label: string }[];
    
    if (summaryItems.length > 0) {
      const boxWidth = (pageWidth - 50) / Math.min(summaryItems.length, 6);
      summaryItems.slice(0, 6).forEach((item, index) => {
        const x = 25 + (boxWidth * index) + (boxWidth / 2);
        doc.setFontSize(16);
        doc.setTextColor(...colors.primary);
        doc.setFont('helvetica', 'bold');
        doc.text(String(item.value), x, yPos + 18, { align: 'center' });
        
        doc.setFontSize(7);
        doc.setTextColor(...colors.muted);
        doc.setFont('helvetica', 'normal');
        doc.text(item.label, x, yPos + 26, { align: 'center' });
      });
    }
    yPos += 50;

    // Helper to check page break
    const checkPageBreak = (neededHeight: number = 30): number => {
      const pageHeight = doc.internal.pageSize.getHeight();
      if (yPos + neededHeight > pageHeight - 50) {
        doc.addPage();
        return 20;
      }
      return yPos;
    };

    // Personal Statement Section
    if (sections.personalStatement) {
      yPos = checkPageBreak(50);
      doc.setFontSize(14);
      doc.setTextColor(...colors.secondary);
      doc.setFont('helvetica', 'bold');
      doc.text('Personal Statement Summary', 20, yPos);
      yPos += 8;
      
      doc.setFillColor(...colors.infoBg);
      doc.roundedRect(20, yPos - 2, pageWidth - 40, 25, 2, 2, 'F');
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.secondary);
      const conditions = data.claimConditions?.length || 0;
      doc.text(`This evidence package documents ${conditions} claimed condition(s) with supporting`, 25, yPos + 6);
      doc.text(`medical visits, symptom logs, and lay/buddy statements for VA rating purposes.`, 25, yPos + 12);
      doc.text(`Separation Date: ${data.separationDate ? new Date(data.separationDate).toLocaleDateString() : 'Not set'}`, 25, yPos + 18);
      yPos += 35;
    }

    // Service History Section
    if (sections.serviceHistory && data.serviceHistory.length > 0) {
      yPos = checkPageBreak(40);
      doc.setFontSize(14);
      doc.setTextColor(...colors.secondary);
      doc.setFont('helvetica', 'bold');
      doc.text('Service History & Combat Dates', 20, yPos);
      yPos += 8;
      
      const sortedHistory = [...data.serviceHistory].sort((a, b) => 
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      
      sortedHistory.forEach(entry => {
        yPos = checkPageBreak(25);
        
        doc.setDrawColor(...colors.border);
        doc.roundedRect(22, yPos - 2, pageWidth - 44, 22, 1, 1, 'S');
        
        doc.setFontSize(10);
        doc.setTextColor(...colors.secondary);
        doc.setFont('helvetica', 'bold');
        const dateRange = `${new Date(entry.startDate).toLocaleDateString()} - ${entry.endDate ? new Date(entry.endDate).toLocaleDateString() : 'Present'}`;
        doc.text(dateRange, 25, yPos + 5);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(`Location: ${entry.base || 'N/A'}`, 25, yPos + 11);
        if (entry.unit) doc.text(`Unit: ${entry.unit}`, 100, yPos + 11);
        
        if (entry.hazards) {
          doc.setTextColor(...colors.danger);
          doc.text(`⚠ ${entry.hazards.substring(0, 50)}`, 25, yPos + 17);
        }
        
        yPos += 27;
      });
      yPos += 5;
    }

    // Medical Visits Section
    if (sections.medicalVisits && data.medicalVisits.length > 0) {
      yPos = checkPageBreak(50);
      doc.setFontSize(14);
      doc.setTextColor(...colors.secondary);
      doc.setFont('helvetica', 'bold');
      doc.text(`Medical Visits (${data.medicalVisits.length} total)`, 20, yPos);
      yPos += 8;
      
      // Table header
      doc.setFillColor(...colors.background);
      doc.rect(20, yPos - 3, pageWidth - 40, 8, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.secondary);
      doc.text('Date', 25, yPos + 2);
      doc.text('Type', 55, yPos + 2);
      doc.text('Reason/Diagnosis', 85, yPos + 2);
      doc.text('AVS', pageWidth - 30, yPos + 2);
      yPos += 10;
      
      const sortedVisits = [...data.medicalVisits]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 15);
      
      doc.setFont('helvetica', 'normal');
      sortedVisits.forEach(visit => {
        yPos = checkPageBreak(8);
        doc.setTextColor(...colors.secondary);
        doc.text(new Date(visit.date).toLocaleDateString(), 25, yPos);
        doc.text((visit.visitType || '').substring(0, 15), 55, yPos);
        doc.text((visit.reason || visit.diagnosis || 'N/A').substring(0, 40), 85, yPos);
        doc.setTextColor(...(visit.gotAfterVisitSummary ? colors.success : colors.danger));
        doc.text(visit.gotAfterVisitSummary ? 'Yes' : 'No', pageWidth - 30, yPos);
        yPos += 6;
      });
      
      if (data.medicalVisits.length > 15) {
        doc.setTextColor(...colors.muted);
        doc.setFontSize(8);
        doc.text(`Showing 15 of ${data.medicalVisits.length} entries`, 25, yPos);
        yPos += 5;
      }
      yPos += 5;
    }

    // Symptoms Section
    if (sections.symptoms && data.symptoms.length > 0) {
      yPos = checkPageBreak(50);
      const avgSeverity = (data.symptoms.reduce((sum, s) => sum + s.severity, 0) / data.symptoms.length).toFixed(1);
      
      doc.setFontSize(14);
      doc.setTextColor(...colors.secondary);
      doc.setFont('helvetica', 'bold');
      doc.text(`Symptoms Journal (${data.symptoms.length} entries)`, 20, yPos);
      yPos += 6;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.muted);
      doc.text(`Average Severity: ${avgSeverity}/10 | Severe Episodes (7+): ${data.symptoms.filter(s => s.severity >= 7).length}`, 20, yPos);
      yPos += 8;
      
      const sortedSymptoms = [...data.symptoms]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
      
      sortedSymptoms.forEach(symptom => {
        yPos = checkPageBreak(15);
        
        doc.setDrawColor(...colors.border);
        doc.roundedRect(22, yPos - 2, pageWidth - 44, 12, 1, 1, 'S');
        
        doc.setFontSize(9);
        doc.setTextColor(...colors.secondary);
        doc.setFont('helvetica', 'bold');
        doc.text(`${new Date(symptom.date).toLocaleDateString()} - ${symptom.symptom}`, 25, yPos + 4);
        
        // Severity badge
        const severity = symptom.severity || 0;
        const badgeColor = severity >= 7 ? colors.dangerBg : severity >= 4 ? colors.warningBg : colors.successBg;
        doc.setFillColor(...badgeColor);
        doc.roundedRect(pageWidth - 45, yPos, 18, 6, 1, 1, 'F');
        doc.setFontSize(8);
        doc.setTextColor(...colors.secondary);
        doc.text(`${severity}/10`, pageWidth - 36, yPos + 4, { align: 'center' });
        
        doc.setFont('helvetica', 'normal');
        if (symptom.dailyImpact) {
          doc.text(`Impact: ${symptom.dailyImpact.substring(0, 50)}`, 25, yPos + 9);
        }
        
        yPos += 16;
      });
      yPos += 5;
    }

    // Medications Section
    if (sections.medications && data.medications.length > 0) {
      yPos = checkPageBreak(40);
      const currentMeds = data.medications.filter(m => m.stillTaking);
      
      doc.setFontSize(14);
      doc.setTextColor(...colors.secondary);
      doc.setFont('helvetica', 'bold');
      doc.text(`Medications (${currentMeds.length} current, ${data.medications.length - currentMeds.length} past)`, 20, yPos);
      yPos += 8;
      
      // Table header
      doc.setFillColor(...colors.background);
      doc.rect(20, yPos - 3, pageWidth - 40, 8, 'F');
      doc.setFontSize(8);
      doc.text('Medication', 25, yPos + 2);
      doc.text('Prescribed For', 70, yPos + 2);
      doc.text('Status', 130, yPos + 2);
      doc.text('Side Effects', 155, yPos + 2);
      yPos += 10;
      
      doc.setFont('helvetica', 'normal');
      data.medications.slice(0, 10).forEach(med => {
        yPos = checkPageBreak(8);
        doc.setTextColor(...colors.secondary);
        doc.text((med.name || '').substring(0, 25), 25, yPos);
        doc.text((med.prescribedFor || 'N/A').substring(0, 30), 70, yPos);
        doc.setTextColor(...(med.stillTaking ? colors.success : colors.muted));
        doc.text(med.stillTaking ? 'Active' : 'Past', 130, yPos);
        doc.setTextColor(...colors.secondary);
        doc.text((med.sideEffects || 'None').substring(0, 20), 155, yPos);
        yPos += 6;
      });
      yPos += 5;
    }

    // Exposures Section
    if (sections.exposures && data.exposures.length > 0) {
      yPos = checkPageBreak(40);
      
      doc.setFontSize(14);
      doc.setTextColor(...colors.secondary);
      doc.setFont('helvetica', 'bold');
      doc.text(`Exposures (${data.exposures.length} documented)`, 20, yPos);
      yPos += 8;
      
      data.exposures.forEach(exp => {
        yPos = checkPageBreak(15);
        
        doc.setFillColor(...colors.warningBg);
        doc.roundedRect(22, yPos - 2, pageWidth - 44, 12, 1, 1, 'F');
        
        doc.setFontSize(9);
        doc.setTextColor(...colors.warning);
        doc.setFont('helvetica', 'bold');
        doc.text(`⚠ ${exp.type || 'Exposure'}`, 25, yPos + 4);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.secondary);
        if (exp.location) {
          doc.text(`Location: ${exp.location}`, 25, yPos + 9);
        }
        
        yPos += 16;
      });
      yPos += 5;
    }

    // Sleep Log Section
    if (sections.sleepLog && data.sleepEntries && data.sleepEntries.length > 0) {
      yPos = checkPageBreak(40);
      const avgHours = (data.sleepEntries.reduce((sum, s) => sum + (s.hoursSlept || 0), 0) / data.sleepEntries.length).toFixed(1);
      const cpapUsers = data.sleepEntries.filter(s => s.usesCPAP).length;
      
      doc.setFontSize(14);
      doc.setTextColor(...colors.secondary);
      doc.setFont('helvetica', 'bold');
      doc.text(`Sleep Log (${data.sleepEntries.length} entries)`, 20, yPos);
      yPos += 6;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.muted);
      doc.text(`Average Sleep: ${avgHours} hrs | CPAP Used: ${cpapUsers} nights`, 20, yPos);
      yPos += 8;
      
      const recentSleep = [...data.sleepEntries]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 7);
      
      recentSleep.forEach(entry => {
        yPos = checkPageBreak(8);
        doc.setTextColor(...colors.secondary);
        doc.text(`${new Date(entry.date).toLocaleDateString()} - ${entry.hoursSlept || 0} hrs`, 25, yPos);
        doc.text(`Quality: ${entry.quality || 'N/A'}`, 100, yPos);
        if (entry.usesCPAP) {
          doc.setTextColor(...colors.primary);
          doc.text('CPAP', 150, yPos);
        }
        yPos += 6;
      });
      yPos += 5;
    }

    // Migraines Section with Rating Analysis
    if (sections.migraineLog && data.migraines && data.migraines.length > 0) {
      yPos = checkPageBreak(60);
      const prostrating = data.migraines.filter(m => m.wasProstrating || m.severity === 'Prostrating').length;
      const workImpact = data.migraines.filter(m => m.couldNotWork).length;
      
      // Calculate estimated rating
      const last3Months = data.migraines.filter(m => {
        const date = new Date(m.date);
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return date >= threeMonthsAgo;
      });
      const prostratingPer3Mo = last3Months.filter(m => m.wasProstrating || m.severity === 'Prostrating').length;
      const avgPerMonth = prostratingPer3Mo / 3;
      
      let estimatedRating = '0%';
      if (avgPerMonth >= 4) estimatedRating = '50%';
      else if (avgPerMonth >= 1) estimatedRating = '30%';
      else if (prostratingPer3Mo > 0) estimatedRating = '10%';
      
      doc.setFontSize(14);
      doc.setTextColor(...colors.secondary);
      doc.setFont('helvetica', 'bold');
      doc.text(`Migraine Log (${data.migraines.length} entries)`, 20, yPos);
      yPos += 6;
      
      // Rating analysis box
      doc.setFillColor(...colors.infoBg);
      doc.roundedRect(20, yPos - 2, pageWidth - 40, 20, 2, 2, 'F');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text(`VA Rating Estimate: ${estimatedRating} (DC 8100)`, 25, yPos + 5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.secondary);
      doc.text(`Prostrating: ${prostrating} total | Work Impact: ${workImpact} | Avg/Month: ${avgPerMonth.toFixed(1)}`, 25, yPos + 12);
      yPos += 25;
      
      // Table header
      doc.setFillColor(...colors.background);
      doc.rect(20, yPos - 3, pageWidth - 40, 8, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.secondary);
      doc.text('Date', 25, yPos + 2);
      doc.text('Severity', 55, yPos + 2);
      doc.text('Duration', 95, yPos + 2);
      doc.text('Prostrating', 130, yPos + 2);
      doc.text('Work Impact', 160, yPos + 2);
      yPos += 10;
      
      const sortedMigraines = [...data.migraines]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
      
      doc.setFont('helvetica', 'normal');
      sortedMigraines.forEach(m => {
        yPos = checkPageBreak(8);
        doc.setTextColor(...colors.secondary);
        doc.text(new Date(m.date).toLocaleDateString(), 25, yPos);
        
        const severityColor = m.severity === 'Prostrating' ? colors.danger 
          : m.severity === 'Severe' ? colors.warning : colors.secondary;
        doc.setTextColor(...severityColor);
        doc.text(m.severity || '', 55, yPos);
        
        doc.setTextColor(...colors.secondary);
        doc.text(m.duration || '', 95, yPos);
        doc.setTextColor(...(m.wasProstrating ? colors.danger : colors.muted));
        doc.text(m.wasProstrating ? 'Yes' : 'No', 130, yPos);
        doc.setTextColor(...(m.couldNotWork ? colors.danger : colors.muted));
        doc.text(m.couldNotWork ? 'Yes' : 'No', 160, yPos);
        yPos += 6;
      });
      yPos += 5;
    }

    // Buddy Contacts Section
    if (sections.buddyContacts && data.buddyContacts.length > 0) {
      yPos = checkPageBreak(40);
      
      doc.setFontSize(14);
      doc.setTextColor(...colors.secondary);
      doc.setFont('helvetica', 'bold');
      doc.text('Buddy Contacts & Statements', 20, yPos);
      yPos += 8;
      
      // Table header
      doc.setFillColor(...colors.background);
      doc.rect(20, yPos - 3, pageWidth - 40, 8, 'F');
      doc.setFontSize(8);
      doc.text('Name', 25, yPos + 2);
      doc.text('Relationship', 70, yPos + 2);
      doc.text('Status', 140, yPos + 2);
      yPos += 10;
      
      doc.setFont('helvetica', 'normal');
      data.buddyContacts.forEach(buddy => {
        yPos = checkPageBreak(8);
        doc.setTextColor(...colors.secondary);
        doc.text(`${buddy.rank || ''} ${buddy.name}`.trim().substring(0, 25), 25, yPos);
        doc.text((buddy.relationship || '').substring(0, 35), 70, yPos);
        
        const isReceived = buddy.statementStatus === 'Received' || buddy.statementStatus === 'Submitted';
        doc.setTextColor(...(isReceived ? colors.success : colors.warning));
        doc.text(buddy.statementStatus || 'Not Requested', 140, yPos);
        yPos += 6;
      });
      yPos += 5;
    }

    // Timeline Section
    if (sections.timeline) {
      yPos = checkPageBreak(50);
      
      doc.setFontSize(14);
      doc.setTextColor(...colors.secondary);
      doc.setFont('helvetica', 'bold');
      doc.text('Timeline of Key Events', 20, yPos);
      yPos += 8;
      
      // Collect and sort all events
      const events: { date: Date; type: string; description: string }[] = [];
      
      // Add service history
      data.serviceHistory.forEach(entry => {
        events.push({
          date: new Date(entry.startDate),
          type: 'Service',
          description: `Started: ${entry.base || entry.unit || 'Duty Station'}`,
        });
        if (entry.endDate) {
          events.push({
            date: new Date(entry.endDate),
            type: 'Service',
            description: `Ended: ${entry.base || entry.unit || 'Duty Station'}`,
          });
        }
      });
      
      // Add medical visits
      data.medicalVisits.slice(0, 5).forEach(visit => {
        events.push({
          date: new Date(visit.date),
          type: 'Medical',
          description: visit.reason || visit.diagnosis || 'Medical Visit',
        });
      });
      
      // Add severe symptoms
      data.symptoms.filter(s => s.severity >= 7).slice(0, 5).forEach(symptom => {
        events.push({
          date: new Date(symptom.date),
          type: 'Symptom',
          description: `${symptom.symptom} (Severity: ${symptom.severity}/10)`,
        });
      });
      
      // Sort by date
      events.sort((a, b) => a.date.getTime() - b.date.getTime());
      
      events.slice(0, 15).forEach(event => {
        yPos = checkPageBreak(10);
        
        const typeColors: Record<string, [number, number, number]> = {
          Service: colors.primary,
          Medical: colors.success,
          Symptom: colors.warning,
        };
        
        doc.setFillColor(...(typeColors[event.type] || colors.muted));
        doc.circle(25, yPos + 1, 2, 'F');
        
        doc.setFontSize(8);
        doc.setTextColor(...colors.muted);
        doc.text(event.date.toLocaleDateString(), 30, yPos + 2);
        
        doc.setFontSize(9);
        doc.setTextColor(...colors.secondary);
        doc.text(`[${event.type}] ${event.description.substring(0, 50)}`, 65, yPos + 2);
        
        yPos += 8;
      });
    }

    // Footer/Disclaimer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.3);
    doc.line(20, pageHeight - 35, pageWidth - 20, pageHeight - 35);
    
    doc.setFillColor(...colors.dangerBg);
    doc.roundedRect(20, pageHeight - 32, pageWidth - 40, 18, 1, 1, 'F');
    
    doc.setFontSize(8);
    doc.setTextColor(...colors.danger);
    doc.setFont('helvetica', 'bold');
    doc.text('DISCLAIMER', pageWidth / 2, pageHeight - 26, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.secondary);
    doc.setFontSize(7);
    const disclaimer = 'This document was generated by Vet Claim Support for personal record-keeping purposes only. It is not an official VA document. Official records must be obtained from military and medical facilities.';
    const lines = doc.splitTextToSize(disclaimer, pageWidth - 50);
    doc.text(lines, pageWidth / 2, pageHeight - 20, { align: 'center' });

    doc.save('custom-evidence-report.pdf');

    toast({
      title: 'PDF Downloaded',
      description: `Your customized evidence report (${selectedSections.length} sections) has been saved.`,
    });
  };

  return (
    <>
      <Button 
        onClick={() => setModalOpen(true)} 
        variant={variant === 'prominent' ? 'default' : 'outline'}
        size="sm" 
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Export
      </Button>
      
      <ExportCustomizationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onExport={exportPDF}
      />
    </>
  );
}
