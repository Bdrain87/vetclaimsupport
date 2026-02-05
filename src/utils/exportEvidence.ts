import { saveAs } from 'file-saver';
import { vaConditions } from '@/data/vaConditions';

export const generateVSOReport = (veteranName: string, activeClaims: any[], logs: any[]) => {
  const timestamp = new Date().toLocaleDateString();

  let content = `VETERAN EVIDENCE PACKET (EDUCATIONAL SUMMARY)\n`;
  content += `NOT AN OFFICIAL VA DOCUMENT | NOT LEGAL ADVICE\n`;
  content += `VETERAN: ${veteranName}\n`;
  content += `GENERATED: ${timestamp}\n`;
  content += `----------------------------------------------------\n\n`;

  content += `I. ACTIVE SERVICE CONNECTIONS\n`;
  activeClaims.forEach(claim => {
    const detail = vaConditions.find(c => c.id === claim.id);
    content += `- ${claim.name} (${claim.rating || 'Pending'}%)\n`;
    content += `  Diagnostic Code: ${detail?.diagnosticCode || 'Unknown'}\n`;
    content += `  Secondary Potential: ${detail?.possibleSecondaries?.join(', ') || 'None'}\n`;
  });

  content += `\nII. SYMPTOM LOGS\n`;
  logs.forEach(log => {
    content += `[${log.date}] ${log.translatedText || log.rawText}\n`;
  });

  content += `\n[LEGAL NOTICE]: This packet was generated using the Service Evidence Tracker \n`;
  content += `to assist the veteran in organizing personal clinical observations. \n`;
  content += `The 'VA-Speak' translations are based on 38 CFR Part 4 nomenclature.`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${veteranName.replace(/\s+/g, '_')}_Evidence.txt`);
};
