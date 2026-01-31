import { Download, FileJson, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useClaims } from '@/context/ClaimsContext';
import { useToast } from '@/hooks/use-toast';

export function ExportButton() {
  const { data } = useClaims();
  const { toast } = useToast();

  const exportAsJSON = () => {
    const exportData = {
      ...data,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `va-claims-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Complete',
      description: 'Your data has been exported as JSON.',
    });
  };

  const formatSection = (title: string, items: any[], formatItem: (item: any) => string): string => {
    if (items.length === 0) return '';
    return `\n## ${title}\n\n${items.map(formatItem).join('\n\n')}`;
  };

  const exportAsText = () => {
    let content = `# VA Claims Tracker Data Export\nExported: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n`;

    // Medical Visits
    content += formatSection('Medical Visits', data.medicalVisits, (v) =>
      `### ${v.date} - ${v.visitType}\n- Location: ${v.location}\n- Provider: ${v.provider}\n- Reason: ${v.reason}\n- Diagnosis: ${v.diagnosis}\n- Treatment: ${v.treatment}\n- Got After-Visit Summary: ${v.gotAfterVisitSummary ? 'Yes' : 'NO'}\n- Follow-up: ${v.followUp}\n- Notes: ${v.notes}`
    );

    // Exposures
    content += formatSection('Exposures', data.exposures, (e) =>
      `### ${e.date} - ${e.type}\n- Location: ${e.location}\n- Duration: ${e.duration}\n- Details: ${e.details}\n- PPE Provided: ${e.ppeProvided ? 'Yes' : 'No'}\n- Witnesses: ${e.witnesses}`
    );

    // Symptoms
    content += formatSection('Symptoms Journal', data.symptoms, (s) =>
      `### ${s.date} - ${s.symptom}\n- Body Area: ${s.bodyArea}\n- Severity: ${s.severity}/10\n- Frequency: ${s.frequency}\n- Daily Impact: ${s.dailyImpact}\n- Notes: ${s.notes}`
    );

    // Medications
    content += formatSection('Medications', data.medications, (m) =>
      `### ${m.name}\n- Period: ${m.startDate} to ${m.endDate || 'Present'}\n- Prescribed For: ${m.prescribedFor}\n- Side Effects: ${m.sideEffects}\n- Still Taking: ${m.stillTaking ? 'Yes' : 'No'}`
    );

    // Service History
    content += formatSection('Service History', data.serviceHistory, (s) =>
      `### ${s.base}\n- Period: ${s.startDate} to ${s.endDate}\n- Unit: ${s.unit}\n- AFSC: ${s.afsc}\n- Duties: ${s.duties}\n- Hazards: ${s.hazards}`
    );

    // Buddy Contacts
    content += formatSection('Buddy Contacts', data.buddyContacts, (b) =>
      `### ${b.rank} ${b.name}\n- Relationship: ${b.relationship}\n- What They Witnessed: ${b.whatTheyWitnessed}\n- Contact: ${b.contactInfo}\n- Statement Status: ${b.statementStatus}`
    );

    // Documents
    content += formatSection('Documents Checklist', data.documents, (d) =>
      `- [${d.status === 'Obtained' || d.status === 'Submitted' ? 'X' : ' '}] ${d.name} - ${d.status}${d.notes ? ` (${d.notes})` : ''}`
    );

    // Summary
    content += `\n\n---\n## Summary\n- Medical Visits: ${data.medicalVisits.length}\n- Exposures: ${data.exposures.length}\n- Symptom Entries: ${data.symptoms.length}\n- Medications: ${data.medications.length}\n- Service Entries: ${data.serviceHistory.length}\n- Buddy Contacts: ${data.buddyContacts.length}\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `va-claims-data-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Complete',
      description: 'Your data has been exported as a text file.',
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportAsJSON}>
          <FileJson className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsText}>
          <FileText className="h-4 w-4 mr-2" />
          Export as Text
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
