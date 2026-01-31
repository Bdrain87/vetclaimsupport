// PDF Export Utilities for Service Evidence Tracker

interface PDFExportOptions {
  title: string;
  subtitle?: string;
  generatedDate?: Date;
}

const getBaseStyles = () => `
  body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
  h1 { color: #1a365d; border-bottom: 2px solid #1a365d; padding-bottom: 10px; }
  h2 { color: #2d3748; margin-top: 30px; }
  .header-info { color: #718096; margin-bottom: 20px; }
  .entry { border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px; page-break-inside: avoid; }
  .entry-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
  .entry-date { font-weight: bold; font-size: 16px; }
  .entry-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .entry-row { margin-bottom: 10px; }
  .entry-label { font-weight: 600; color: #4a5568; }
  .va-note { background: #ebf8ff; border-left: 4px solid #3182ce; padding: 15px; margin: 30px 0; }
  .pact-note { background: #f0fff4; border-left: 4px solid #38a169; padding: 15px; margin: 30px 0; }
  .summary { background: #f7fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
  .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; }
  .summary-item { text-align: center; padding: 15px; }
  .summary-value { font-size: 28px; font-weight: bold; color: #1a365d; }
  .summary-label { color: #718096; font-size: 14px; }
  .footer { margin-top: 40px; text-align: center; color: #718096; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
  .badge-success { background: #c6f6d5; color: #22543d; }
  .badge-warning { background: #fefcbf; color: #744210; }
  .badge-danger { background: #fed7d7; color: #9b2c2c; }
  .badge-info { background: #bee3f8; color: #2a4365; }
  .badge-neutral { background: #e2e8f0; color: #4a5568; }
  table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
  th { background: #f7fafc; font-weight: 600; }
  @media print { .entry { break-inside: avoid; } }
`;

const createPDFWrapper = (content: string, options: PDFExportOptions) => {
  const date = options.generatedDate || new Date();
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${options.title} - VA Evidence</title>
      <style>${getBaseStyles()}</style>
    </head>
    <body>
      <h1>${options.title}</h1>
      ${options.subtitle ? `<p class="header-info">${options.subtitle}</p>` : ''}
      <p class="header-info">Generated: ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}</p>
      ${content}
      <div class="footer">
        <p>This document was generated from the Service Evidence Tracker application.</p>
        <p>Present this document to your VA representative, VSO, or include with your disability claim.</p>
      </div>
    </body>
    </html>
  `;
};

export const openPrintWindow = (html: string) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }
};

// Service History Export
export const exportServiceHistory = (entries: any[]) => {
  if (entries.length === 0) {
    alert('No service history entries to export');
    return;
  }

  const sorted = [...entries].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  
  const content = `
    <div class="va-note">
      <strong>Service History Documentation:</strong> This log documents your duty stations, deployments, 
      and hazardous exposures during military service. This information is critical for establishing 
      service connection for your VA disability claims.
    </div>

    <h2>Service Record Summary (${entries.length} entries)</h2>
    
    ${sorted.map(entry => `
      <div class="entry">
        <div class="entry-header">
          <span class="entry-date">${new Date(entry.startDate).toLocaleDateString()} - ${entry.endDate ? new Date(entry.endDate).toLocaleDateString() : 'Present'}</span>
        </div>
        <div class="entry-row">
          <span class="entry-label">Location:</span> ${entry.base || 'N/A'}
        </div>
        ${entry.unit ? `<div class="entry-row"><span class="entry-label">Unit:</span> ${entry.unit}</div>` : ''}
        ${entry.afsc ? `<div class="entry-row"><span class="entry-label">AFSC/MOS:</span> ${entry.afsc}</div>` : ''}
        ${entry.duties ? `<div class="entry-row"><span class="entry-label">Duties:</span> ${entry.duties}</div>` : ''}
        ${entry.hazards ? `<div class="entry-row" style="background: #fff5f5; padding: 10px; border-radius: 4px; margin-top: 10px;">
          <span class="entry-label" style="color: #c53030;">⚠ Hazards:</span> ${entry.hazards}
        </div>` : ''}
      </div>
    `).join('')}
  `;

  const html = createPDFWrapper(content, {
    title: 'Service History Record',
    subtitle: 'Military Service Documentation for VA Claims'
  });
  
  openPrintWindow(html);
};

// Medical Visits Export
export const exportMedicalVisits = (visits: any[]) => {
  if (visits.length === 0) {
    alert('No medical visits to export');
    return;
  }

  const sorted = [...visits].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const withoutSummary = visits.filter(v => !v.gotAfterVisitSummary).length;
  
  const content = `
    <div class="summary">
      <h2 style="margin-top: 0;">Summary</h2>
      <div class="summary-grid">
        <div class="summary-item">
          <div class="summary-value">${visits.length}</div>
          <div class="summary-label">Total Visits</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">${visits.filter(v => v.gotAfterVisitSummary).length}</div>
          <div class="summary-label">With After-Visit Summary</div>
        </div>
        <div class="summary-item">
          <div class="summary-value" style="color: ${withoutSummary > 0 ? '#c53030' : '#22543d'};">${withoutSummary}</div>
          <div class="summary-label">Missing Summaries</div>
        </div>
      </div>
    </div>

    <div class="va-note">
      <strong>Documentation Tip:</strong> Medical records are critical for VA claims. Ensure you have 
      copies of all After-Visit Summaries and that your symptoms were accurately documented by providers.
    </div>

    <h2>Medical Visit Log (${visits.length} entries)</h2>
    
    ${sorted.map(visit => `
      <div class="entry">
        <div class="entry-header">
          <span class="entry-date">${new Date(visit.date).toLocaleDateString()}</span>
          <span class="entry-badge badge-info">${visit.visitType}</span>
        </div>
        <div class="entry-row">
          <span class="entry-label">Reason:</span> ${visit.reason || 'N/A'}
        </div>
        ${visit.location ? `<div class="entry-row"><span class="entry-label">Location:</span> ${visit.location}</div>` : ''}
        ${visit.provider ? `<div class="entry-row"><span class="entry-label">Provider:</span> ${visit.provider}</div>` : ''}
        ${visit.diagnosis ? `<div class="entry-row"><span class="entry-label">Diagnosis:</span> ${visit.diagnosis}</div>` : ''}
        ${visit.treatment ? `<div class="entry-row"><span class="entry-label">Treatment:</span> ${visit.treatment}</div>` : ''}
        <div class="entry-row">
          <span class="entry-label">After-Visit Summary:</span> 
          <span class="entry-badge ${visit.gotAfterVisitSummary ? 'badge-success' : 'badge-danger'}">
            ${visit.gotAfterVisitSummary ? 'Yes' : 'No'}
          </span>
        </div>
        ${visit.followUp ? `<div class="entry-row"><span class="entry-label">Follow-up:</span> ${visit.followUp}</div>` : ''}
        ${visit.notes ? `<div class="entry-row"><span class="entry-label">Notes:</span> ${visit.notes}</div>` : ''}
      </div>
    `).join('')}
  `;

  const html = createPDFWrapper(content, {
    title: 'Medical Visits Log',
    subtitle: 'Healthcare Documentation for VA Claims'
  });
  
  openPrintWindow(html);
};

// Symptoms Journal Export
export const exportSymptoms = (symptoms: any[]) => {
  if (symptoms.length === 0) {
    alert('No symptoms to export');
    return;
  }

  const sorted = [...symptoms].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const avgSeverity = symptoms.length > 0 
    ? (symptoms.reduce((sum, s) => sum + s.severity, 0) / symptoms.length).toFixed(1)
    : 0;
  
  const getSeverityClass = (severity: number) => {
    if (severity <= 3) return 'badge-success';
    if (severity <= 6) return 'badge-warning';
    return 'badge-danger';
  };

  const content = `
    <div class="summary">
      <h2 style="margin-top: 0;">Summary</h2>
      <div class="summary-grid">
        <div class="summary-item">
          <div class="summary-value">${symptoms.length}</div>
          <div class="summary-label">Total Entries</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">${avgSeverity}</div>
          <div class="summary-label">Avg. Severity (1-10)</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">${symptoms.filter(s => s.severity >= 7).length}</div>
          <div class="summary-label">Severe Episodes (7+)</div>
        </div>
      </div>
    </div>

    <div class="va-note">
      <strong>VA Rating Tip:</strong> Consistent documentation of symptom frequency, severity, and 
      impact on daily life helps establish the current level of disability for rating purposes.
    </div>

    <h2>Symptoms Journal (${symptoms.length} entries)</h2>
    
    ${sorted.map(symptom => `
      <div class="entry">
        <div class="entry-header">
          <span class="entry-date">${new Date(symptom.date).toLocaleDateString()}</span>
          <span class="entry-badge ${getSeverityClass(symptom.severity)}">${symptom.severity}/10</span>
        </div>
        <div class="entry-row">
          <span class="entry-label">Symptom:</span> ${symptom.symptom}
        </div>
        ${symptom.bodyArea ? `<div class="entry-row"><span class="entry-label">Body Area:</span> ${symptom.bodyArea}</div>` : ''}
        ${symptom.frequency ? `<div class="entry-row"><span class="entry-label">Frequency:</span> ${symptom.frequency}</div>` : ''}
        ${symptom.dailyImpact ? `<div class="entry-row"><span class="entry-label">Daily Impact:</span> ${symptom.dailyImpact}</div>` : ''}
        ${symptom.notes ? `<div class="entry-row"><span class="entry-label">Notes:</span> ${symptom.notes}</div>` : ''}
      </div>
    `).join('')}
  `;

  const html = createPDFWrapper(content, {
    title: 'Symptoms Journal',
    subtitle: 'Symptom Documentation for VA Claims'
  });
  
  openPrintWindow(html);
};

// Medications Export
export const exportMedications = (medications: any[]) => {
  if (medications.length === 0) {
    alert('No medications to export');
    return;
  }

  const current = medications.filter(m => m.stillTaking);
  const past = medications.filter(m => !m.stillTaking);
  
  const content = `
    <div class="summary">
      <h2 style="margin-top: 0;">Summary</h2>
      <div class="summary-grid">
        <div class="summary-item">
          <div class="summary-value">${medications.length}</div>
          <div class="summary-label">Total Medications</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">${current.length}</div>
          <div class="summary-label">Currently Taking</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">${past.length}</div>
          <div class="summary-label">Discontinued</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">${medications.filter(m => m.sideEffects).length}</div>
          <div class="summary-label">With Side Effects</div>
        </div>
      </div>
    </div>

    <div class="va-note">
      <strong>Documentation Tip:</strong> Medication history demonstrates ongoing treatment for 
      your conditions and can support the severity of your disabilities.
    </div>

    ${current.length > 0 ? `
      <h2>Current Medications (${current.length})</h2>
      <table>
        <thead>
          <tr>
            <th>Medication</th>
            <th>Prescribed For</th>
            <th>Start Date</th>
            <th>Side Effects</th>
          </tr>
        </thead>
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
      <h2>Past Medications (${past.length})</h2>
      <table>
        <thead>
          <tr>
            <th>Medication</th>
            <th>Prescribed For</th>
            <th>Duration</th>
            <th>Side Effects</th>
          </tr>
        </thead>
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
  `;

  const html = createPDFWrapper(content, {
    title: 'Medication History',
    subtitle: 'Prescription Documentation for VA Claims'
  });
  
  openPrintWindow(html);
};

// Exposures Export
export const exportExposures = (exposures: any[]) => {
  if (exposures.length === 0) {
    alert('No exposures to export');
    return;
  }

  const sorted = [...exposures].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const noPPE = exposures.filter(e => !e.ppeProvided).length;
  
  // Group by type
  const byType: Record<string, number> = {};
  exposures.forEach(e => {
    byType[e.type] = (byType[e.type] || 0) + 1;
  });

  const content = `
    <div class="pact-note">
      <strong>PACT Act Information:</strong> The PACT Act (2022) expanded VA healthcare and benefits 
      for veterans exposed to burn pits, Agent Orange, and other toxic substances. If you served in 
      qualifying locations and have related conditions, you may be eligible for presumptive benefits.
    </div>

    <div class="summary">
      <h2 style="margin-top: 0;">Exposure Summary</h2>
      <div class="summary-grid">
        <div class="summary-item">
          <div class="summary-value">${exposures.length}</div>
          <div class="summary-label">Total Exposures</div>
        </div>
        <div class="summary-item">
          <div class="summary-value" style="color: #c53030;">${noPPE}</div>
          <div class="summary-label">Without PPE</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">${Object.keys(byType).length}</div>
          <div class="summary-label">Exposure Types</div>
        </div>
      </div>
      <div style="margin-top: 15px;">
        <strong>Exposure Types:</strong> ${Object.entries(byType).map(([type, count]) => `${type} (${count})`).join(', ')}
      </div>
    </div>

    <h2>Hazardous Exposure Log (${exposures.length} entries)</h2>
    
    ${sorted.map(exposure => `
      <div class="entry" style="border-left: 4px solid ${exposure.ppeProvided ? '#38a169' : '#c53030'};">
        <div class="entry-header">
          <span class="entry-date">${new Date(exposure.date).toLocaleDateString()}</span>
          <span class="entry-badge ${exposure.ppeProvided ? 'badge-success' : 'badge-danger'}">
            ${exposure.ppeProvided ? 'PPE Provided' : 'No PPE'}
          </span>
        </div>
        <div class="entry-row">
          <span class="entry-label">Exposure Type:</span> <strong>${exposure.type}</strong>
        </div>
        ${exposure.location ? `<div class="entry-row"><span class="entry-label">Location:</span> ${exposure.location}</div>` : ''}
        ${exposure.duration ? `<div class="entry-row"><span class="entry-label">Duration:</span> ${exposure.duration}</div>` : ''}
        ${exposure.details ? `<div class="entry-row"><span class="entry-label">Details:</span> ${exposure.details}</div>` : ''}
        ${exposure.witnesses ? `<div class="entry-row"><span class="entry-label">Witnesses:</span> ${exposure.witnesses}</div>` : ''}
      </div>
    `).join('')}
  `;

  const html = createPDFWrapper(content, {
    title: 'Hazardous Exposure Log',
    subtitle: 'PACT Act & Toxic Exposure Documentation'
  });
  
  openPrintWindow(html);
};

// Documents Checklist Export
export const exportDocuments = (documents: any[]) => {
  if (documents.length === 0) {
    alert('No documents to export');
    return;
  }

  const completed = documents.filter(d => d.status === 'Obtained' || d.status === 'Submitted');
  const inProgress = documents.filter(d => d.status === 'In Progress');
  const notStarted = documents.filter(d => d.status === 'Not Started');
  const totalCopies = documents.reduce((sum, d) => sum + (d.count || 0), 0);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Submitted': return 'badge-success';
      case 'Obtained': return 'badge-info';
      case 'In Progress': return 'badge-warning';
      default: return 'badge-neutral';
    }
  };

  const content = `
    <div class="summary">
      <h2 style="margin-top: 0;">Document Status Summary</h2>
      <div class="summary-grid">
        <div class="summary-item">
          <div class="summary-value">${documents.length}</div>
          <div class="summary-label">Total Documents</div>
        </div>
        <div class="summary-item">
          <div class="summary-value" style="color: #22543d;">${completed.length}</div>
          <div class="summary-label">Completed</div>
        </div>
        <div class="summary-item">
          <div class="summary-value" style="color: #744210;">${inProgress.length}</div>
          <div class="summary-label">In Progress</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">${notStarted.length}</div>
          <div class="summary-label">Not Started</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">${totalCopies}</div>
          <div class="summary-label">Total Copies</div>
        </div>
      </div>
    </div>

    <div class="va-note">
      <strong>Documentation Checklist:</strong> Having all required documents organized and ready 
      will help expedite your VA claims process. Keep multiple copies of critical documents.
    </div>

    <h2>Documents Checklist</h2>
    <table>
      <thead>
        <tr>
          <th>Document</th>
          <th>Description</th>
          <th>Status</th>
          <th>Copies</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        ${documents.map(doc => `
          <tr>
            <td><strong>${doc.name}</strong></td>
            <td>${doc.description || ''}</td>
            <td><span class="entry-badge ${getStatusClass(doc.status)}">${doc.status}</span></td>
            <td>${doc.count || 0}</td>
            <td>${doc.notes || ''}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  const html = createPDFWrapper(content, {
    title: 'Documents Checklist',
    subtitle: 'VA Claims Documentation Status'
  });
  
  openPrintWindow(html);
};

// Buddy Contacts Export
export const exportBuddyContacts = (contacts: any[]) => {
  if (contacts.length === 0) {
    alert('No buddy contacts to export');
    return;
  }

  const received = contacts.filter(c => c.statementStatus === 'Received' || c.statementStatus === 'Submitted');
  const requested = contacts.filter(c => c.statementStatus === 'Requested');
  const notRequested = contacts.filter(c => c.statementStatus === 'Not Requested');

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Submitted': return 'badge-success';
      case 'Received': return 'badge-info';
      case 'Requested': return 'badge-warning';
      default: return 'badge-neutral';
    }
  };

  const content = `
    <div class="summary">
      <h2 style="margin-top: 0;">Statement Status Summary</h2>
      <div class="summary-grid">
        <div class="summary-item">
          <div class="summary-value">${contacts.length}</div>
          <div class="summary-label">Total Contacts</div>
        </div>
        <div class="summary-item">
          <div class="summary-value" style="color: #22543d;">${received.length}</div>
          <div class="summary-label">Statements Received</div>
        </div>
        <div class="summary-item">
          <div class="summary-value" style="color: #744210;">${requested.length}</div>
          <div class="summary-label">Pending Request</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">${notRequested.length}</div>
          <div class="summary-label">Not Yet Requested</div>
        </div>
      </div>
    </div>

    <div class="va-note">
      <strong>Buddy Statements (VA Form 21-10210):</strong> Lay/witness statements from fellow 
      service members can provide critical evidence for your VA claim by corroborating your 
      account of in-service events, injuries, and symptoms.
    </div>

    <h2>Buddy Contacts for Witness Statements</h2>
    
    ${contacts.map(contact => `
      <div class="entry">
        <div class="entry-header">
          <span class="entry-date">${contact.rank ? `${contact.rank} ` : ''}${contact.name}</span>
          <span class="entry-badge ${getStatusClass(contact.statementStatus)}">${contact.statementStatus}</span>
        </div>
        ${contact.relationship ? `<div class="entry-row"><span class="entry-label">Relationship:</span> ${contact.relationship}</div>` : ''}
        ${contact.whatTheyWitnessed ? `
          <div class="entry-row" style="background: #f7fafc; padding: 10px; border-radius: 4px;">
            <span class="entry-label">Can Verify:</span><br/>
            ${contact.whatTheyWitnessed}
          </div>
        ` : ''}
        ${contact.contactInfo ? `<div class="entry-row"><span class="entry-label">Contact:</span> ${contact.contactInfo}</div>` : ''}
      </div>
    `).join('')}
  `;

  const html = createPDFWrapper(content, {
    title: 'Buddy Contacts List',
    subtitle: 'Witness Statement Contacts for VA Claims'
  });
  
  openPrintWindow(html);
};
