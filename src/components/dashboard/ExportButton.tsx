import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClaims } from '@/context/ClaimsContext';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

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

export function ExportButton() {
  const { data } = useClaims();
  const { toast } = useToast();

  const exportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const now = new Date();
    
    let yPos = 20;
    
    // Title
    doc.setFontSize(18);
    doc.setTextColor(...colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('Service Evidence Tracker - Complete Report', 20, yPos);
    
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
    doc.text('This report contains all documented evidence for VA disability claim purposes.', 20, yPos + 5);
    yPos += 15;
    
    // Summary Box
    doc.setFillColor(...colors.background);
    doc.roundedRect(20, yPos, pageWidth - 40, 40, 2, 2, 'F');
    
    const summaryItems = [
      { value: data.serviceHistory.length, label: 'Service Entries' },
      { value: data.medicalVisits.length, label: 'Medical Visits' },
      { value: data.symptoms.length, label: 'Symptom Entries' },
      { value: data.exposures.length, label: 'Exposures' },
      { value: data.medications.length, label: 'Medications' },
      { value: data.buddyContacts.length, label: 'Buddy Contacts' },
    ];
    
    const boxWidth = (pageWidth - 50) / summaryItems.length;
    summaryItems.forEach((item, index) => {
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
    yPos += 50;

    // Helper to check page break
    const checkPageBreak = (neededHeight: number = 30): number => {
      const pageHeight = doc.internal.pageSize.getHeight();
      if (yPos + neededHeight > pageHeight - 40) {
        doc.addPage();
        return 20;
      }
      return yPos;
    };

    // Service History Section
    if (data.serviceHistory.length > 0) {
      yPos = checkPageBreak(40);
      doc.setFontSize(14);
      doc.setTextColor(...colors.secondary);
      doc.setFont('helvetica', 'bold');
      doc.text('Service History', 20, yPos);
      yPos += 8;
      
      const sortedHistory = [...data.serviceHistory].sort((a, b) => 
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      
      sortedHistory.forEach(entry => {
        yPos = checkPageBreak(25);
        
        doc.setDrawColor(...colors.border);
        doc.roundedRect(22, yPos - 2, pageWidth - 44, 20, 1, 1, 'S');
        
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
          doc.text(`⚠ ${entry.hazards.substring(0, 50)}`, 25, yPos + 16);
        }
        
        yPos += 25;
      });
      yPos += 5;
    }

    // Medical Visits Section
    if (data.medicalVisits.length > 0) {
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
    if (data.symptoms.length > 0) {
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
    if (data.medications.length > 0) {
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

    // Buddy Contacts Section
    if (data.buddyContacts.length > 0) {
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

    // Migraines Section
    if (data.migraines && data.migraines.length > 0) {
      yPos = checkPageBreak(40);
      const prostrating = data.migraines.filter(m => m.severity === 'Prostrating').length;
      
      doc.setFontSize(14);
      doc.setTextColor(...colors.secondary);
      doc.setFont('helvetica', 'bold');
      doc.text(`Migraine Log (${data.migraines.length} entries)`, 20, yPos);
      yPos += 6;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.muted);
      doc.text(`Prostrating Episodes: ${prostrating} - key for VA migraine ratings`, 20, yPos);
      yPos += 8;
      
      // Table header
      doc.setFillColor(...colors.background);
      doc.rect(20, yPos - 3, pageWidth - 40, 8, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('Date', 25, yPos + 2);
      doc.text('Severity', 55, yPos + 2);
      doc.text('Duration', 95, yPos + 2);
      doc.text('Impact', 130, yPos + 2);
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
        doc.text(m.severity, 55, yPos);
        
        doc.setTextColor(...colors.secondary);
        doc.text(m.duration || '', 95, yPos);
        doc.text((m.impact || '').substring(0, 25), 130, yPos);
        yPos += 6;
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
    const disclaimer = 'This document was generated by Service Evidence Tracker for personal record-keeping purposes only. It is not an official VA document. Official records must be obtained from military and medical facilities.';
    const lines = doc.splitTextToSize(disclaimer, pageWidth - 50);
    doc.text(lines, pageWidth / 2, pageHeight - 20, { align: 'center' });

    doc.save('complete-evidence-report.pdf');

    toast({
      title: 'PDF Downloaded',
      description: 'Your complete evidence report has been saved as a PDF.',
    });
  };

  return (
    <Button onClick={exportPDF} variant="outline" size="sm" className="gap-2">
      <FileDown className="h-4 w-4" />
      <span className="hidden sm:inline">Export PDF</span>
    </Button>
  );
}
