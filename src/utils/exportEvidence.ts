import { saveAs } from 'file-saver';
import { VA_CONDITIONS } from '@/data/vaConditions';

export const generateVSOReport = (veteranName: string, activeClaims: any[], logs: any[]) => {
  const timestamp = new Date().toLocaleDateString();

  let content = `VETERAN EVIDENCE PACKET - ${veteranName}\n`;
  content += `GENERATED: ${timestamp}\n`;
  content += `====================================================\n\n`;

  content += `I. ACTIVE SERVICE CONNECTIONS\n`;
  activeClaims.forEach(claim => {
    // Audit Fix: Changed 'Conditions' to 'VA_CONDITIONS'
    const detail = VA_CONDITIONS.find(c => c.id === claim.id);
    content += `- ${claim.name} (${claim.rating || 'Pending'}%)\n`;
    content += `  Diagnostic Code: ${detail?.diagnosticCode || 'Unknown'}\n`;
    content += `  Secondary Potential: ${detail?.possibleSecondaries?.join(', ') || 'None'}\n`;
  });

  content += `\nII. SYMPTOM LOGS\n`;
  logs.forEach(log => {
    content += `[${log.date}] ${log.translatedText || log.rawText}\n`;
  });

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${veteranName.replace(/\s+/g, '_')}_Evidence.txt`);
};
