import { saveAs } from 'file-saver';
import { VA_CONDITIONS } from '@/data/vaConditions';

export const generateVSOReport = (veteranName: string, activeClaims: any[], logs: any[]) => {
  const timestamp = new Date().toLocaleDateString();

  let content = `VETERAN EVIDENCE PACKET - ${veteranName}\n`;
  content += `GENERATED: ${timestamp}\n`;
  content += `====================================================\n\n`;

  content += `I. ACTIVE SERVICE CONNECTIONS & INTENT TO FILE\n`;
  activeClaims.forEach(claim => {
    // FIX: Using VA_CONDITIONS instead of the undefined 'Conditions'
    const conditionDetail = VA_CONDITIONS.find(c => c.id === claim.id);
    content += `- ${claim.name} (${claim.rating || 'Pending'}%)\n`;
    content += `  Diagnostic Code: ${conditionDetail?.diagnosticCode || 'Unknown'}\n`;
    content += `  Secondary Paths: ${conditionDetail?.possibleSecondaries?.join(', ') || 'None identified'}\n`;
  });

  content += `\nII. CLINICAL SYMPTOM LOG (VA-SPEAK TRANSLATED)\n`;
  content += `----------------------------------------------------\n`;
  logs.forEach(log => {
    content += `[${log.date}] ${log.translatedText || log.rawText}\n`;
  });

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${veteranName.replace(/\s+/g, '_')}_Evidence_Packet.txt`);
};
