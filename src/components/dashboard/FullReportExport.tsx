import { Download, FileText, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useClaims } from '@/context/ClaimsContext';
import { useToast } from '@/hooks/use-toast';

const getBaseStyles = () => `
  body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #1a1a1a; }
  h1 { color: #1a365d; border-bottom: 2px solid #1a365d; padding-bottom: 10px; margin-bottom: 20px; }
  h2 { color: #2d3748; margin-top: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
  h3 { color: #4a5568; margin-top: 20px; }
  .header-info { color: #718096; margin-bottom: 20px; }
  .section { margin-bottom: 40px; page-break-inside: avoid; }
  .entry { border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 15px; page-break-inside: avoid; }
  .entry-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .entry-date { font-weight: bold; }
  .entry-badge { padding: 3px 10px; border-radius: 15px; font-size: 11px; font-weight: 600; }
  .entry-row { margin-bottom: 8px; font-size: 14px; }
  .entry-label { font-weight: 600; color: #4a5568; }
  .summary-box { background: #f7fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
  .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; }
  .summary-item { text-align: center; }
  .summary-value { font-size: 24px; font-weight: bold; color: #1a365d; }
  .summary-label { font-size: 12px; color: #718096; }
  .badge-success { background: #c6f6d5; color: #22543d; }
  .badge-warning { background: #fefcbf; color: #744210; }
  .badge-danger { background: #fed7d7; color: #9b2c2c; }
  .badge-info { background: #bee3f8; color: #2a4365; }
  .footer { margin-top: 40px; text-align: center; color: #718096; font-size: 11px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
  .disclaimer { background: #fff5f5; border-left: 4px solid #c53030; padding: 15px; margin: 30px 0; font-size: 12px; }
  .tip { background: #ebf8ff; border-left: 4px solid #3182ce; padding: 15px; margin: 20px 0; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 13px; }
  th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
  th { background: #f7fafc; font-weight: 600; }
  @media print { .section { break-inside: avoid; } }
`;

export function FullReportExport() {
  const { data } = useClaims();
  const { toast } = useToast();

  const generateFullReport = () => {
    const now = new Date();
    
    let content = `
      <h1>Service Evidence Tracker - Complete Report</h1>
      <p class="header-info">
        Generated: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}<br>
        This report contains all documented evidence for VA disability claim purposes.
      </p>

      <div class="summary-box">
        <h3 style="margin-top: 0;">Evidence Summary</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-value">${data.serviceHistory.length}</div>
            <div class="summary-label">Service Entries</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${data.medicalVisits.length}</div>
            <div class="summary-label">Medical Visits</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${data.symptoms.length}</div>
            <div class="summary-label">Symptom Entries</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${data.exposures.length}</div>
            <div class="summary-label">Exposures</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${data.medications.length}</div>
            <div class="summary-label">Medications</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${data.buddyContacts.length}</div>
            <div class="summary-label">Buddy Contacts</div>
          </div>
        </div>
      </div>
    `;

    // Service History
    if (data.serviceHistory.length > 0) {
      content += `
        <div class="section">
          <h2>Service History</h2>
          ${data.serviceHistory.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
            .map(entry => `
              <div class="entry">
                <div class="entry-header">
                  <span class="entry-date">${new Date(entry.startDate).toLocaleDateString()} - ${entry.endDate ? new Date(entry.endDate).toLocaleDateString() : 'Present'}</span>
                </div>
                <div class="entry-row"><span class="entry-label">Location:</span> ${entry.base || 'N/A'}</div>
                ${entry.unit ? `<div class="entry-row"><span class="entry-label">Unit:</span> ${entry.unit}</div>` : ''}
                ${entry.afsc ? `<div class="entry-row"><span class="entry-label">AFSC/MOS:</span> ${entry.afsc}</div>` : ''}
                ${entry.duties ? `<div class="entry-row"><span class="entry-label">Duties:</span> ${entry.duties}</div>` : ''}
                ${entry.hazards ? `<div class="entry-row" style="color: #c53030;"><span class="entry-label">⚠ Hazards:</span> ${entry.hazards}</div>` : ''}
              </div>
            `).join('')}
        </div>
      `;
    }

    // Medical Visits
    if (data.medicalVisits.length > 0) {
      const missingSummaries = data.medicalVisits.filter(v => !v.gotAfterVisitSummary).length;
      content += `
        <div class="section">
          <h2>Medical Visits (${data.medicalVisits.length} total)</h2>
          ${missingSummaries > 0 ? `<div class="tip">⚠ ${missingSummaries} visits missing after-visit summaries - request copies from your MTF.</div>` : ''}
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Reason/Diagnosis</th>
                <th>Location</th>
                <th>After-Visit Summary</th>
              </tr>
            </thead>
            <tbody>
              ${data.medicalVisits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(visit => `
                  <tr>
                    <td>${new Date(visit.date).toLocaleDateString()}</td>
                    <td>${visit.visitType}</td>
                    <td>${visit.reason || visit.diagnosis || 'N/A'}</td>
                    <td>${visit.location || 'N/A'}</td>
                    <td style="color: ${visit.gotAfterVisitSummary ? '#22543d' : '#c53030'};">
                      ${visit.gotAfterVisitSummary ? '✓ Yes' : '✗ No'}
                    </td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    // Symptoms Journal
    if (data.symptoms.length > 0) {
      const avgSeverity = (data.symptoms.reduce((sum, s) => sum + s.severity, 0) / data.symptoms.length).toFixed(1);
      content += `
        <div class="section">
          <h2>Symptoms Journal (${data.symptoms.length} entries)</h2>
          <div class="tip">Average Severity: ${avgSeverity}/10 | Severe Episodes (7+): ${data.symptoms.filter(s => s.severity >= 7).length}</div>
          ${data.symptoms.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 20).map(symptom => `
              <div class="entry">
                <div class="entry-header">
                  <span class="entry-date">${new Date(symptom.date).toLocaleDateString()} - ${symptom.symptom}</span>
                  <span class="entry-badge ${symptom.severity >= 7 ? 'badge-danger' : symptom.severity >= 4 ? 'badge-warning' : 'badge-success'}">${symptom.severity}/10</span>
                </div>
                ${symptom.bodyArea ? `<div class="entry-row"><span class="entry-label">Body Area:</span> ${symptom.bodyArea}</div>` : ''}
                ${symptom.frequency ? `<div class="entry-row"><span class="entry-label">Frequency:</span> ${symptom.frequency}</div>` : ''}
                ${symptom.dailyImpact ? `<div class="entry-row"><span class="entry-label">Impact:</span> ${symptom.dailyImpact}</div>` : ''}
                ${symptom.notes ? `<div class="entry-row"><span class="entry-label">Notes:</span> ${symptom.notes}</div>` : ''}
              </div>
            `).join('')}
          ${data.symptoms.length > 20 ? `<p style="color: #718096; font-style: italic;">Showing first 20 of ${data.symptoms.length} entries</p>` : ''}
        </div>
      `;
    }

    // Exposures
    if (data.exposures.length > 0) {
      content += `
        <div class="section">
          <h2>Hazardous Exposures (${data.exposures.length} documented)</h2>
          <div class="tip">PACT Act: If you served in qualifying locations and have related conditions, you may be eligible for presumptive benefits.</div>
          ${data.exposures.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(exposure => `
              <div class="entry" style="border-left: 4px solid ${exposure.ppeProvided ? '#38a169' : '#c53030'};">
                <div class="entry-header">
                  <span class="entry-date">${new Date(exposure.date).toLocaleDateString()} - ${exposure.type}</span>
                  <span class="entry-badge ${exposure.ppeProvided ? 'badge-success' : 'badge-danger'}">${exposure.ppeProvided ? 'PPE Provided' : 'No PPE'}</span>
                </div>
                ${exposure.location ? `<div class="entry-row"><span class="entry-label">Location:</span> ${exposure.location}</div>` : ''}
                ${exposure.duration ? `<div class="entry-row"><span class="entry-label">Duration:</span> ${exposure.duration}</div>` : ''}
                ${exposure.details ? `<div class="entry-row"><span class="entry-label">Details:</span> ${exposure.details}</div>` : ''}
                ${exposure.witnesses ? `<div class="entry-row"><span class="entry-label">Witnesses:</span> ${exposure.witnesses}</div>` : ''}
              </div>
            `).join('')}
        </div>
      `;
    }

    // Medications
    if (data.medications.length > 0) {
      const current = data.medications.filter(m => m.stillTaking);
      const past = data.medications.filter(m => !m.stillTaking);
      content += `
        <div class="section">
          <h2>Medications (${data.medications.length} total)</h2>
          ${current.length > 0 ? `
            <h3>Current Medications (${current.length})</h3>
            <table>
              <thead><tr><th>Medication</th><th>Prescribed For</th><th>Started</th><th>Side Effects</th></tr></thead>
              <tbody>
                ${current.map(med => `
                  <tr>
                    <td><strong>${med.name}</strong></td>
                    <td>${med.prescribedFor || 'N/A'}</td>
                    <td>${new Date(med.startDate).toLocaleDateString()}</td>
                    <td>${med.sideEffects || 'None reported'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}
          ${past.length > 0 ? `
            <h3>Past Medications (${past.length})</h3>
            <table>
              <thead><tr><th>Medication</th><th>Prescribed For</th><th>Duration</th><th>Side Effects</th></tr></thead>
              <tbody>
                ${past.map(med => `
                  <tr>
                    <td>${med.name}</td>
                    <td>${med.prescribedFor || 'N/A'}</td>
                    <td>${new Date(med.startDate).toLocaleDateString()} - ${med.endDate ? new Date(med.endDate).toLocaleDateString() : 'N/A'}</td>
                    <td>${med.sideEffects || 'None reported'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}
        </div>
      `;
    }

    // Buddy Contacts
    if (data.buddyContacts.length > 0) {
      content += `
        <div class="section">
          <h2>Buddy Contacts & Statements</h2>
          <table>
            <thead><tr><th>Name</th><th>Relationship</th><th>What They Witnessed</th><th>Statement Status</th></tr></thead>
            <tbody>
              ${data.buddyContacts.map(buddy => `
                <tr>
                  <td><strong>${buddy.rank} ${buddy.name}</strong></td>
                  <td>${buddy.relationship}</td>
                  <td>${buddy.whatTheyWitnessed || 'N/A'}</td>
                  <td><span class="entry-badge ${buddy.statementStatus === 'Received' || buddy.statementStatus === 'Submitted' ? 'badge-success' : 'badge-warning'}">${buddy.statementStatus}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    // Migraines
    if (data.migraines.length > 0) {
      const prostrating = data.migraines.filter(m => m.severity === 'Prostrating').length;
      content += `
        <div class="section">
          <h2>Migraine Log (${data.migraines.length} entries)</h2>
          <div class="tip">Prostrating Episodes: ${prostrating} | These are key for VA migraine ratings.</div>
          <table>
            <thead><tr><th>Date</th><th>Severity</th><th>Duration</th><th>Impact</th></tr></thead>
            <tbody>
              ${data.migraines.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 15).map(m => `
                  <tr>
                    <td>${new Date(m.date).toLocaleDateString()}</td>
                    <td><span class="entry-badge ${m.severity === 'Prostrating' ? 'badge-danger' : m.severity === 'Severe' ? 'badge-warning' : 'badge-info'}">${m.severity}</span></td>
                    <td>${m.duration}</td>
                    <td>${m.impact}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    // Footer
    content += `
      <div class="disclaimer">
        <strong>⚠️ DISCLAIMER</strong><br>
        This document was generated by Service Evidence Tracker for personal record-keeping purposes only. 
        It is not an official VA document and should not be submitted as such. 
        Official records must be obtained from military and medical facilities.
      </div>
      <div class="footer">
        <p>Present this document to your VA representative, VSO, or use it to organize your claim materials.</p>
        <p>Generated by Service Evidence Tracker | ${now.toLocaleDateString()}</p>
      </div>
    `;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>VA Evidence Report - ${now.toLocaleDateString()}</title>
        <style>${getBaseStyles()}</style>
      </head>
      <body>${content}</body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }

    toast({
      title: 'Report Generated',
      description: 'Your complete evidence report is ready to print or save as PDF.',
    });
  };

  return (
    <Button onClick={generateFullReport} variant="outline" size="sm">
      <Printer className="h-4 w-4 mr-2" />
      Full Report
    </Button>
  );
}
