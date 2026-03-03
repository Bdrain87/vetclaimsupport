/**
 * Smart Document OCR Field Extraction.
 *
 * After OCR extracts raw text, this service passes the text through Gemini
 * for structured extraction (document type, dates, diagnosis codes, findings).
 *
 * VA compliance: Always show "Extracted by AI — please verify all information"
 */

import { supabase } from '@/lib/supabase';
import { redactPII } from '@/lib/redaction';
import { logger } from '@/utils/logger';

export type DocumentType =
  | 'dd214'
  | 'service_treatment_record'
  | 'cp_exam_report'
  | 'denial_letter'
  | 'medical_record'
  | 'buddy_statement'
  | 'nexus_letter'
  | 'unknown';

export interface ExtractedField {
  label: string;
  value: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface DocumentClassification {
  documentType: DocumentType;
  documentTypeLabel: string;
  extractedFields: ExtractedField[];
  summary: string;
  /** For denial letters: extracted reasons for denial. */
  denialReasons?: string[];
  /** For medical records: extracted diagnosis codes. */
  diagnosisCodes?: string[];
  /** For C&P reports: extracted findings. */
  findings?: string[];
  /** Raw AI response for debugging. */
  rawResponse?: string;
}

const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  dd214: 'DD-214 (Certificate of Release)',
  service_treatment_record: 'Service Treatment Record',
  cp_exam_report: 'C&P Exam Report',
  denial_letter: 'VA Denial Letter',
  medical_record: 'Medical Record',
  buddy_statement: 'Buddy/Lay Statement',
  nexus_letter: 'Nexus Letter / IMO',
  unknown: 'Unknown Document',
};

const CLASSIFICATION_PROMPT = `You are a VA disability claims document classifier. Analyze the following OCR text and extract structured information.

Respond ONLY in valid JSON with this exact structure:
{
  "documentType": "dd214" | "service_treatment_record" | "cp_exam_report" | "denial_letter" | "medical_record" | "buddy_statement" | "nexus_letter" | "unknown",
  "summary": "1-2 sentence summary of the document",
  "extractedFields": [
    { "label": "field name", "value": "extracted value", "confidence": "high" | "medium" | "low" }
  ],
  "denialReasons": ["reason 1", "reason 2"],
  "diagnosisCodes": ["ICD-10 or DC codes found"],
  "findings": ["key medical findings"]
}

Extract:
- Dates (service dates, exam dates, decision dates)
- Names (veteran name, examiner name)
- Diagnosis codes (ICD-10, DC codes)
- Conditions mentioned
- Key findings or determinations
- For denial letters: specific reasons for denial
- For C&P reports: examiner findings and opinions

OCR Text:
`;

/**
 * Classify and extract structured data from OCR text.
 * Sends text to Gemini via the analyze-disabilities edge function.
 */
export async function classifyDocument(ocrText: string): Promise<DocumentClassification> {
  try {
    const { redactedText } = redactPII(ocrText, 'low');
    // Only send first 4000 chars to stay within token limits
    const truncated = redactedText.slice(0, 4000);

    const { data, error } = await supabase.functions.invoke('analyze-disabilities', {
      body: {
        prompt: CLASSIFICATION_PROMPT + truncated,
      },
    });

    if (error || !data?.analysis) {
      return fallbackClassification(ocrText);
    }

    try {
      // Try to parse the JSON response
      const rawText = data.analysis;
      // Extract JSON from the response (might be wrapped in markdown code blocks)
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return fallbackClassification(ocrText);

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        documentType: parsed.documentType || 'unknown',
        documentTypeLabel: DOCUMENT_TYPE_LABELS[parsed.documentType as DocumentType] || 'Unknown Document',
        extractedFields: (parsed.extractedFields || []).map((f: { label: string; value: string; confidence?: string }) => ({
          label: f.label,
          value: f.value,
          confidence: f.confidence || 'medium',
        })),
        summary: parsed.summary || 'Document classification completed.',
        denialReasons: parsed.denialReasons?.length > 0 ? parsed.denialReasons : undefined,
        diagnosisCodes: parsed.diagnosisCodes?.length > 0 ? parsed.diagnosisCodes : undefined,
        findings: parsed.findings?.length > 0 ? parsed.findings : undefined,
        rawResponse: rawText,
      };
    } catch {
      return fallbackClassification(ocrText);
    }
  } catch (err) {
    logger.error('[documentClassifier] Classification failed:', err);
    return fallbackClassification(ocrText);
  }
}

/**
 * Simple rule-based fallback when AI is unavailable.
 */
function fallbackClassification(text: string): DocumentClassification {
  const lower = text.toLowerCase();
  let documentType: DocumentType = 'unknown';

  if (lower.includes('dd form 214') || lower.includes('certificate of release')) {
    documentType = 'dd214';
  } else if (lower.includes('denial') || lower.includes('not service-connected') || lower.includes('rating decision')) {
    documentType = 'denial_letter';
  } else if (lower.includes('compensation and pension') || lower.includes('c&p exam') || lower.includes('disability benefits questionnaire')) {
    documentType = 'cp_exam_report';
  } else if (lower.includes('nexus') || lower.includes('medical opinion') || lower.includes('more likely than not')) {
    documentType = 'nexus_letter';
  } else if (lower.includes('buddy statement') || lower.includes('lay statement') || lower.includes('witness statement')) {
    documentType = 'buddy_statement';
  } else if (lower.includes('service treatment') || lower.includes('military medical')) {
    documentType = 'service_treatment_record';
  } else if (lower.includes('diagnosis') || lower.includes('patient') || lower.includes('treatment plan')) {
    documentType = 'medical_record';
  }

  return {
    documentType,
    documentTypeLabel: DOCUMENT_TYPE_LABELS[documentType],
    extractedFields: [],
    summary: `Document identified as: ${DOCUMENT_TYPE_LABELS[documentType]}. Use AI classification for detailed field extraction.`,
  };
}
