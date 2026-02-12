import { useState, useMemo } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Printer,
  ClipboardList,
  AlertCircle,
  Stethoscope,
  Pill,
  Activity,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { getDiagnosticCodeForCondition } from '@/components/shared/ConditionSearchInput.utils';
import { DisclaimerNotice } from '@/components/shared/DisclaimerNotice';

// DBQ Form database for matching conditions
const dbqFormNumbers: Record<string, { form: string; name: string }> = {
  'ptsd': { form: '21-0960P-3', name: 'PTSD DBQ' },
  'back': { form: '21-0960M-14', name: 'Thoracolumbar Spine DBQ' },
  'knee': { form: '21-0960M-9', name: 'Knee DBQ' },
  'hearing': { form: '21-0960N-1', name: 'Hearing Loss/Tinnitus DBQ' },
  'tinnitus': { form: '21-0960N-1', name: 'Hearing Loss/Tinnitus DBQ' },
  'sleep_apnea': { form: '21-0960G-3', name: 'Sleep Apnea DBQ' },
  'migraine': { form: '21-0960C-8', name: 'Headaches DBQ' },
  'shoulder': { form: '21-0960M-12', name: 'Shoulder DBQ' },
};

function getDBQForCondition(name: string): { form: string; name: string } | null {
  const lower = name.toLowerCase();
  if (lower.includes('ptsd') || lower.includes('anxiety') || lower.includes('depression')) return dbqFormNumbers['ptsd'];
  if (lower.includes('back') || lower.includes('lumbar') || lower.includes('spine')) return dbqFormNumbers['back'];
  if (lower.includes('knee')) return dbqFormNumbers['knee'];
  if (lower.includes('hearing')) return dbqFormNumbers['hearing'];
  if (lower.includes('tinnitus') || lower.includes('ringing')) return dbqFormNumbers['tinnitus'];
  if (lower.includes('sleep') || lower.includes('apnea')) return dbqFormNumbers['sleep_apnea'];
  if (lower.includes('migraine') || lower.includes('headache')) return dbqFormNumbers['migraine'];
  if (lower.includes('shoulder')) return dbqFormNumbers['shoulder'];
  return null;
}

// PDF Colors
const colors = {
  primary: [26, 54, 93] as [number, number, number],
  secondary: [45, 55, 72] as [number, number, number],
  muted: [113, 128, 150] as [number, number, number],
  success: [34, 84, 61] as [number, number, number],
  warning: [116, 66, 16] as [number, number, number],
  border: [226, 232, 240] as [number, number, number],
  background: [247, 250, 252] as [number, number, number],
  highlight: [254, 243, 199] as [number, number, number],
};

export function DBQAppointmentSummary() {
  const { data } = useClaims();
  const claimConditions = useMemo(() => data.claimConditions ?? [], [data.claimConditions]);
  
  const [selectedConditionId, setSelectedConditionId] = useState<string>('');
  const [includeSymptoms, setIncludeSymptoms] = useState(true);
  const [includeMedicalVisits, setIncludeMedicalVisits] = useState(true);
  const [includeMedications, setIncludeMedications] = useState(true);
  const [includeMigraines, setIncludeMigraines] = useState(true);
  const [includeSleep, setIncludeSleep] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedCondition = useMemo(() => {
    return claimConditions.find(c => c.id === selectedConditionId);
  }, [claimConditions, selectedConditionId]);

  const linkedEvidence = useMemo(() => {
    if (!selectedCondition) return null;

    const symptoms = data.symptoms.filter(s => 
      selectedCondition.linkedSymptoms.includes(s.id)
    );
    const medicalVisits = data.medicalVisits.filter(v => 
      selectedCondition.linkedMedicalVisits.includes(v.id)
    );
    const medications = data.medications.filter(m => 
      // Check if medication is related to condition
      selectedCondition.name.toLowerCase().split(' ').some(word => 
        m.prescribedFor?.toLowerCase().includes(word)
      )
    );
    
    // Get recent migraines if condition is migraine-related
    const isMigraineCondition = selectedCondition.name.toLowerCase().includes('migraine') || 
                                 selectedCondition.name.toLowerCase().includes('headache');
    const migraines = isMigraineCondition ? data.migraines.slice(-30) : [];
    
    // Get recent sleep entries if condition is sleep-related
    const isSleepCondition = selectedCondition.name.toLowerCase().includes('sleep') || 
                              selectedCondition.name.toLowerCase().includes('apnea');
    const sleepEntries = isSleepCondition ? data.sleepEntries.slice(-30) : [];

    return { symptoms, medicalVisits, medications, migraines, sleepEntries };
  }, [selectedCondition, data]);

  const generatePDF = async () => {
    if (!selectedCondition || !linkedEvidence) return;
    
    setIsGenerating(true);
    
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;

      // Header with prominent title
      doc.setFillColor(...colors.background);
      doc.rect(0, 0, pageWidth, 45, 'F');
      
      doc.setFontSize(18);
      doc.setTextColor(...colors.primary);
      doc.setFont('helvetica', 'bold');
      doc.text('Evidence Summary for Your Doctor', pageWidth / 2, 18, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(...colors.muted);
      doc.setFont('helvetica', 'normal');
      doc.text('Prepared for DBQ Appointment', pageWidth / 2, 26, { align: 'center' });
      
      // Condition name with diagnostic code
      const dcInfo = getDiagnosticCodeForCondition(selectedCondition.name);
      doc.setFontSize(14);
      doc.setTextColor(...colors.secondary);
      doc.setFont('helvetica', 'bold');
      doc.text(`Condition: ${selectedCondition.name}`, pageWidth / 2, 36, { align: 'center' });
      
      if (dcInfo) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`VA Diagnostic Code: DC ${dcInfo.code}`, pageWidth / 2, 42, { align: 'center' });
      }
      
      yPos = dcInfo ? 52 : 48;

      // DBQ Form Info Box
      const dbqInfo = getDBQForCondition(selectedCondition.name);
      if (dbqInfo) {
        doc.setFillColor(...colors.highlight);
        doc.roundedRect(20, yPos, pageWidth - 40, dcInfo ? 24 : 18, 2, 2, 'F');
        doc.setFontSize(9);
        doc.setTextColor(...colors.warning);
        doc.setFont('helvetica', 'bold');
        doc.text('RECOMMENDED DBQ FORM:', 25, yPos + 7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.secondary);
        doc.text(`${dbqInfo.form} - ${dbqInfo.name}`, 25, yPos + 14);
        if (dcInfo) {
          doc.setFontSize(8);
          doc.text(`Rating Criteria: 38 CFR Part 4, DC ${dcInfo.code}`, 25, yPos + 21);
        }
        yPos += dcInfo ? 32 : 25;
      }

      // Purpose statement
      doc.setFillColor(...colors.background);
      doc.roundedRect(20, yPos, pageWidth - 40, 22, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setTextColor(...colors.secondary);
      const purposeText = 'Dear Doctor: This summary contains documented evidence of my condition to assist you in completing the Disability Benefits Questionnaire (DBQ). All information is from my personal tracking records.';
      const purposeLines = doc.splitTextToSize(purposeText, pageWidth - 50);
      doc.text(purposeLines, 25, yPos + 8);
      yPos += 30;

      // Helper function for section headers
      const addSectionHeader = (title: string, count: number) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFillColor(...colors.primary);
        doc.rect(20, yPos, pageWidth - 40, 8, 'F');
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text(`${title} (${count} entries)`, 25, yPos + 6);
        yPos += 12;
      };

      // Symptoms Section
      if (includeSymptoms && linkedEvidence.symptoms.length > 0) {
        addSectionHeader('SYMPTOM HISTORY', linkedEvidence.symptoms.length);
        
        linkedEvidence.symptoms.slice(0, 10).forEach((symptom) => {
          if (yPos > 260) {
            doc.addPage();
            yPos = 20;
          }
          
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...colors.secondary);
          doc.text(`${new Date(symptom.date).toLocaleDateString()} - ${symptom.symptom}`, 25, yPos);
          
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...colors.muted);
          doc.text(`Severity: ${symptom.severity}/10 | Frequency: ${symptom.frequency}`, 25, yPos + 5);
          
          if (symptom.dailyImpact) {
            const impactLines = doc.splitTextToSize(`Impact: ${symptom.dailyImpact}`, pageWidth - 60);
            doc.text(impactLines.slice(0, 2), 25, yPos + 10);
            yPos += impactLines.length * 4;
          }
          
          yPos += 12;
        });
        
        yPos += 5;
      }

      // Medical Visits Section
      if (includeMedicalVisits && linkedEvidence.medicalVisits.length > 0) {
        addSectionHeader('MEDICAL VISIT HISTORY', linkedEvidence.medicalVisits.length);
        
        linkedEvidence.medicalVisits.slice(0, 8).forEach((visit) => {
          if (yPos > 260) {
            doc.addPage();
            yPos = 20;
          }
          
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...colors.secondary);
          doc.text(`${new Date(visit.date).toLocaleDateString()} - ${visit.visitType}`, 25, yPos);
          
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...colors.muted);
          doc.text(`Provider: ${visit.provider || 'N/A'} | Location: ${visit.location || 'N/A'}`, 25, yPos + 5);
          
          if (visit.diagnosis) {
            doc.text(`Diagnosis: ${visit.diagnosis}`, 25, yPos + 10);
            yPos += 5;
          }
          if (visit.treatment) {
            const treatmentLines = doc.splitTextToSize(`Treatment: ${visit.treatment}`, pageWidth - 60);
            doc.text(treatmentLines.slice(0, 2), 25, yPos + 10);
            yPos += treatmentLines.length * 4;
          }
          
          yPos += 15;
        });
        
        yPos += 5;
      }

      // Medications Section
      if (includeMedications && linkedEvidence.medications.length > 0) {
        addSectionHeader('CURRENT MEDICATIONS', linkedEvidence.medications.length);
        
        linkedEvidence.medications.forEach((med) => {
          if (yPos > 265) {
            doc.addPage();
            yPos = 20;
          }
          
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...colors.secondary);
          doc.text(med.name, 25, yPos);
          
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...colors.muted);
          doc.text(`For: ${med.prescribedFor} | Started: ${new Date(med.startDate).toLocaleDateString()}`, 25, yPos + 5);
          
          if (med.sideEffects) {
            doc.text(`Side Effects: ${med.sideEffects}`, 25, yPos + 10);
            yPos += 5;
          }
          
          yPos += 12;
        });
        
        yPos += 5;
      }

      // Migraine Stats Section
      if (includeMigraines && linkedEvidence.migraines.length > 0) {
        addSectionHeader('MIGRAINE STATISTICS (Last 30 Entries)', linkedEvidence.migraines.length);
        
        const prostrating = linkedEvidence.migraines.filter(m => m.wasProstrating).length;
        const avgSeverity = linkedEvidence.migraines.length > 0
          ? linkedEvidence.migraines.filter(m => m.severity === 'Severe' || m.severity === 'Prostrating').length
          : 0;
        const missedWork = linkedEvidence.migraines.filter(m => m.couldNotWork).length;
        
        doc.setFontSize(9);
        doc.setTextColor(...colors.secondary);
        doc.text(`• Total Migraines Logged: ${linkedEvidence.migraines.length}`, 25, yPos);
        doc.text(`• Prostrating Attacks: ${prostrating}`, 25, yPos + 5);
        doc.text(`• Severe/Prostrating Severity: ${avgSeverity}`, 25, yPos + 10);
        doc.text(`• Unable to Work: ${missedWork} episodes`, 25, yPos + 15);
        
        yPos += 25;
      }

      // Sleep Stats Section
      if (includeSleep && linkedEvidence.sleepEntries.length > 0) {
        addSectionHeader('SLEEP/CPAP STATISTICS (Last 30 Entries)', linkedEvidence.sleepEntries.length);
        
        const cpapNights = linkedEvidence.sleepEntries.filter(s => s.cpapUsedLastNight).length;
        const avgHours = linkedEvidence.sleepEntries.reduce((sum, s) => sum + s.hoursSlept, 0) / linkedEvidence.sleepEntries.length;
        const poorSleep = linkedEvidence.sleepEntries.filter(s => s.quality === 'Poor' || s.quality === 'Very Poor').length;
        
        doc.setFontSize(9);
        doc.setTextColor(...colors.secondary);
        doc.text(`• Nights Logged: ${linkedEvidence.sleepEntries.length}`, 25, yPos);
        doc.text(`• CPAP Compliance: ${cpapNights}/${linkedEvidence.sleepEntries.length} nights (${Math.round((cpapNights / linkedEvidence.sleepEntries.length) * 100)}%)`, 25, yPos + 5);
        doc.text(`• Average Sleep: ${avgHours.toFixed(1)} hours/night`, 25, yPos + 10);
        doc.text(`• Poor/Very Poor Quality Nights: ${poorSleep}`, 25, yPos + 15);
        
        yPos += 25;
      }

      // Footer disclaimer
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setDrawColor(...colors.border);
      doc.line(20, yPos, pageWidth - 20, yPos);
      yPos += 8;
      
      doc.setFontSize(7);
      doc.setTextColor(...colors.muted);
      const disclaimer = 'DISCLAIMER: This document is for informational purposes to assist your healthcare provider. It is generated from personal tracking and is not an official medical record. Please verify all information with official medical documentation.';
      const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 40);
      doc.text(disclaimerLines, 20, yPos);
      
      yPos += 15;
      doc.setFontSize(8);
      doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, yPos);
      doc.text('Vet Claim Support', pageWidth - 20, yPos, { align: 'right' });

      // Save PDF
      doc.save(`DBQ-Summary-${selectedCondition.name.replace(/\s+/g, '-')}.pdf`);
      
    } catch {
      // PDF generation failed silently
    } finally {
      setIsGenerating(false);
    }
  };

  if (claimConditions.length === 0) {
    return (
      <Card className="data-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            DBQ Appointment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ClipboardList className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-2">
              No conditions added yet
            </p>
            <p className="text-xs text-muted-foreground">
              Add conditions to your Claim Builder first to generate a summary for your doctor
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Intro Card */}
      <Card className="data-card border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            Evidence Summary for Your Doctor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Generate a printable summary of your documented evidence to bring to your DBQ appointment. 
            This helps your doctor understand your condition history and complete the DBQ accurately.
          </p>
          
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
              <h4 className="text-sm font-medium text-success mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                What's Included
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Symptom history with severity & frequency</li>
                <li>• Medical visit documentation</li>
                <li>• Current medications & side effects</li>
                <li>• Condition-specific statistics</li>
              </ul>
            </div>
            
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <h4 className="text-sm font-medium text-warning mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                How to Use
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>1. Select your condition below</li>
                <li>2. Choose what evidence to include</li>
                <li>3. Generate and print the PDF</li>
                <li>4. Bring to your DBQ appointment</li>
              </ul>
            </div>
          </div>
          
          <DisclaimerNotice variant="inline" className="mt-4" />
        </CardContent>
      </Card>

      {/* Generator Card */}
      <Card className="data-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Generate Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Condition Selector */}
          <div className="space-y-2">
            <Label>Select Condition</Label>
            <Select value={selectedConditionId} onValueChange={setSelectedConditionId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a condition..." />
              </SelectTrigger>
              <SelectContent>
                {claimConditions.map(condition => (
                  <SelectItem key={condition.id} value={condition.id}>
                    {condition.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCondition && (
            <>
              <Separator />
              
              {/* DBQ Form Info */}
              {getDBQForCondition(selectedCondition.name) && (
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                      {getDBQForCondition(selectedCondition.name)?.form}
                    </Badge>
                    <span className="text-sm font-medium text-foreground">
                      {getDBQForCondition(selectedCondition.name)?.name}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This is the recommended DBQ form for your condition
                  </p>
                </div>
              )}

              {/* Evidence Options */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Include in Summary</Label>
                
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="symptoms" 
                      checked={includeSymptoms}
                      onCheckedChange={(checked) => setIncludeSymptoms(!!checked)}
                    />
                    <Label htmlFor="symptoms" className="text-sm flex items-center gap-2 cursor-pointer">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      Symptoms ({linkedEvidence?.symptoms.length || 0})
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="visits" 
                      checked={includeMedicalVisits}
                      onCheckedChange={(checked) => setIncludeMedicalVisits(!!checked)}
                    />
                    <Label htmlFor="visits" className="text-sm flex items-center gap-2 cursor-pointer">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Medical Visits ({linkedEvidence?.medicalVisits.length || 0})
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="meds" 
                      checked={includeMedications}
                      onCheckedChange={(checked) => setIncludeMedications(!!checked)}
                    />
                    <Label htmlFor="meds" className="text-sm flex items-center gap-2 cursor-pointer">
                      <Pill className="h-4 w-4 text-muted-foreground" />
                      Medications ({linkedEvidence?.medications.length || 0})
                    </Label>
                  </div>

                  {(linkedEvidence?.migraines.length || 0) > 0 && (
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="migraines" 
                        checked={includeMigraines}
                        onCheckedChange={(checked) => setIncludeMigraines(!!checked)}
                      />
                      <Label htmlFor="migraines" className="text-sm flex items-center gap-2 cursor-pointer">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        Migraine Stats ({linkedEvidence?.migraines.length || 0})
                      </Label>
                    </div>
                  )}

                  {(linkedEvidence?.sleepEntries.length || 0) > 0 && (
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sleep" 
                        checked={includeSleep}
                        onCheckedChange={(checked) => setIncludeSleep(!!checked)}
                      />
                      <Label htmlFor="sleep" className="text-sm flex items-center gap-2 cursor-pointer">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        Sleep/CPAP Stats ({linkedEvidence?.sleepEntries.length || 0})
                      </Label>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Generate Button */}
              <Button 
                className="w-full gap-2" 
                size="lg"
                onClick={generatePDF}
                disabled={isGenerating}
              >
                <Printer className="h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Generate Printable Summary'}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                The PDF will download automatically. Print it and bring to your appointment.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
