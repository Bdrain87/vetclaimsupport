import { saveAs } from 'file-saver';

export const generateVSOReport = (data: any) => {
  const timestamp = new Date().toLocaleDateString();

  let content = `VETERAN EVIDENCE PACKET - GENERATED ${timestamp}\n`;
  content += `====================================================\n\n`;

  content += `SYMPTOM LOG (VA-SPEAK TRANSLATED):\n`;
  data.logs.forEach((log: any) => {
    content += `[${log.date}] ${log.text}\n`;
  });

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `Evidence_Packet_${timestamp}.txt`);
};
