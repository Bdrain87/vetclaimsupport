/**
 * Shared AI document analysis with OCR fallback and progress reporting.
 * Used by InteractiveDBQ, EvidenceScanner, and DecisionDecoder.
 */

import { normalizeFileForGemini, detectFileType, getTimeoutForFile, classifyError } from './fileProcessing';
import { aiAnalyzeImage, aiAnalyzeFile, aiGenerate, aiGenerateJSON } from './gemini';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AnalysisStep = 'reading' | 'uploading' | 'analyzing' | 'ocr-fallback';

export interface AnalyzeDocumentOpts {
  file: File;
  prompt: string;
  systemInstruction?: string;
  feature: string;
  /** JSON response schema for structured output. */
  responseSchema?: Record<string, unknown>;
  temperature?: number;
  /** Override the default file-based timeout (ms). */
  timeout?: number;
  signal?: AbortSignal;
  /** Called as the analysis progresses through steps. */
  onProgress?: (step: AnalysisStep) => void;
}

export interface AnalyzeDocumentResult {
  text: string;
  method: 'gemini' | 'ocr-fallback';
}

// ---------------------------------------------------------------------------
// Main function
// ---------------------------------------------------------------------------

/**
 * Analyze a document file using Gemini vision, with OCR fallback for images.
 *
 * Flow:
 * 1. Normalize file → base64 + correct MIME type
 * 2. Send to Gemini with extended timeout
 * 3. If Gemini fails on an image → try tesseract.js OCR, send extracted text to Gemini
 */
export async function analyzeDocument(opts: AnalyzeDocumentOpts): Promise<AnalyzeDocumentResult> {
  const { file, prompt, systemInstruction, feature, responseSchema, temperature, timeout: customTimeout, signal, onProgress } = opts;

  const fileType = detectFileType(file);
  const timeout = customTimeout ?? getTimeoutForFile(file);

  // ---------------------------------------------------------------------------
  // PDF path — use File Upload API (no base64 bloat) + text-extraction fallback
  // ---------------------------------------------------------------------------
  if (fileType === 'pdf') {
    onProgress?.('uploading');
    try {
      const text = await aiAnalyzeFile({
        file,
        mimeType: 'application/pdf',
        prompt,
        systemInstruction,
        feature,
        responseSchema,
        temperature,
        timeout,
        signal,
        onUploaded: () => onProgress?.('analyzing'),
      });
      return { text, method: 'gemini' };
    } catch (primaryErr) {
      // Fallback: ask Gemini to just extract text, then analyze that text
      onProgress?.('ocr-fallback');
      try {
        const extractedText = await aiAnalyzeFile({
          file,
          mimeType: 'application/pdf',
          prompt: 'Extract ALL text from this document exactly as written. Return only the extracted text, nothing else.',
          feature: `${feature}-extract`,
          timeout,
          signal,
        });

        if (!extractedText || extractedText.trim().length < 20) {
          const classified = classifyError(primaryErr, file);
          throw new Error(classified.message);
        }

        const enrichedPrompt = `The following text was extracted from a scanned PDF document. It may contain OCR artifacts.\n\n---\n${extractedText}\n---\n\n${prompt}`;

        let resultText: string;
        if (responseSchema) {
          const jsonResult = await aiGenerateJSON({
            prompt: enrichedPrompt,
            systemInstruction,
            responseSchema,
            feature: `${feature}-ocr`,
            timeout: 30_000,
            signal,
            temperature,
          });
          resultText = JSON.stringify(jsonResult);
        } else {
          const result = await aiGenerate({
            prompt: enrichedPrompt,
            systemInstruction,
            feature: `${feature}-ocr`,
            timeout: 30_000,
            signal,
            temperature,
          });
          resultText = result.text;
        }

        return { text: resultText, method: 'ocr-fallback' };
      } catch (fallbackErr) {
        // If the fallback error is already our classified error, rethrow it
        if (fallbackErr instanceof Error && fallbackErr.message === classifyError(primaryErr, file).message) {
          throw fallbackErr;
        }
        const classified = classifyError(primaryErr, file);
        throw new Error(classified.message);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Image path — existing inlineData + tesseract OCR fallback
  // ---------------------------------------------------------------------------
  onProgress?.('reading');
  const { base64, mimeType } = await normalizeFileForGemini(file);

  onProgress?.('analyzing');
  try {
    const text = await aiAnalyzeImage({
      imageBase64: base64,
      mimeType,
      prompt,
      systemInstruction,
      feature,
      responseSchema,
      temperature,
      timeout,
      signal,
    });
    return { text, method: 'gemini' };
  } catch (geminiErr) {
    // Only attempt OCR fallback for images (not unknown types)
    if (!mimeType.startsWith('image/')) {
      const classified = classifyError(geminiErr, file);
      throw new Error(classified.message);
    }

    onProgress?.('ocr-fallback');
    try {
      const ocrText = await runOCR(file);
      if (!ocrText || ocrText.trim().length < 20) {
        const classified = classifyError(geminiErr, file);
        throw new Error(classified.message);
      }

      const enrichedPrompt = `The following text was extracted from a scanned document via OCR. It may contain OCR artifacts.\n\n---\n${ocrText}\n---\n\n${prompt}`;

      let resultText: string;
      if (responseSchema) {
        const jsonResult = await aiGenerateJSON({
          prompt: enrichedPrompt,
          systemInstruction,
          responseSchema,
          feature: `${feature}-ocr`,
          timeout: 30_000,
          signal,
          temperature,
        });
        resultText = JSON.stringify(jsonResult);
      } else {
        const result = await aiGenerate({
          prompt: enrichedPrompt,
          systemInstruction,
          feature: `${feature}-ocr`,
          timeout: 30_000,
          signal,
          temperature,
        });
        resultText = result.text;
      }

      return { text: resultText, method: 'ocr-fallback' };
    } catch (ocrErr) {
      if (ocrErr instanceof Error && ocrErr.message !== classifyError(geminiErr, file).message) {
        // OCR had its own error — still show the original classified error
      }
      const classified = classifyError(geminiErr, file);
      throw new Error(classified.message);
    }
  }
}

// ---------------------------------------------------------------------------
// OCR helper (lazy-loaded tesseract.js)
// ---------------------------------------------------------------------------

async function runOCR(file: File): Promise<string> {
  const { createWorker, OEM } = await import('tesseract.js');
  const url = URL.createObjectURL(file);
  try {
    const worker = await createWorker('eng', OEM.LSTM_ONLY);
    const { data } = await worker.recognize(url);
    await worker.terminate();
    return data.text;
  } finally {
    URL.revokeObjectURL(url);
  }
}
