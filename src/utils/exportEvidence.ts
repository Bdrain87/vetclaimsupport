import { saveAs } from 'file-saver';

export const generateVSOReport = (veteranName: string, activeClaims: any[], logs: any[]) => {
  const timestamp = new Date().toLocaleDateString();

  let content = `VETERAN EVIDENCE PACKET - ${veteranName}\n`;
  content += `GENERATED: ${timestamp}\n`;
  content += `====================================================\n\n`;

  content += `I. ACTIVE SERVICE CONNECTIONS & INTENT TO FILE\n`;
  activeClaims.forEach(claim => {
    content += `- ${claim.name} (${claim.rating || 'Pending'}%)\n`;
    content += `  Secondary Paths: ${claim.secondaries?.join(', ') || 'None identified'}\n`;
  });

  content += `\nII. CLINICAL SYMPTOM LOG (VA-SPEAK TRANSLATED)\n`;
  content += `----------------------------------------------------\n`;
  logs.forEach(log => {
    content += `[${log.date}] ${log.translatedText || log.rawText}\n`;
    if (log.equipmentIssued) content += `  DME EVIDENCE: ${log.equipmentIssued}\n`;
  });

  content += `\n\nDISCLAIMER: Educational mapping based on 38 CFR Part 4. This is a summary of personal evidence and not a legal medical nexus.`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${veteranName.replace(/\s+/g, '_')}_Evidence_Packet.txt`);
};
