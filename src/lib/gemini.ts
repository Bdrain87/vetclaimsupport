import { GoogleGenAI, type Chat, type GenerateContentConfig, type GenerateContentResponse, type Part } from '@google/genai';
import { redactPII } from './redaction';
import { logAISend } from '@/services/aiAuditLog';
import { checkAIRateLimit, trackAICall, AIRateLimitError } from '@/services/aiUsageTracker';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

export const isGeminiConfigured = apiKey.length > 0;

const DEFAULT_MODEL = 'gemini-2.5-flash';
const DEFAULT_TIMEOUT = 30_000;
const RETRY_CODES = [429, 503];
const RETRY_DELAY = 2_000;

let _ai: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!_ai) {
    if (!isGeminiConfigured) throw new Error('Gemini API key is not configured.');
    _ai = new GoogleGenAI({ apiKey });
  }
  return _ai;
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function redactAndLog(text: string, feature: string): { redactedText: string; redactionCount: number } {
  const { redactedText, redactionCount } = redactPII(text, 'high');
  logAISend({
    feature,
    redactionMode: 'high',
    redactionCount,
    textLengthSent: redactedText.length,
  });
  return { redactedText, redactionCount };
}

function makeSignal(timeout: number, external?: AbortSignal): AbortSignal {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  external?.addEventListener('abort', () => controller.abort(), { once: true });
  // Clean up timer if aborted early
  controller.signal.addEventListener('abort', () => clearTimeout(timer));
  return controller.signal;
}

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ??
      (err as { httpStatusCode?: number }).httpStatusCode;
    if (status && RETRY_CODES.includes(status)) {
      await new Promise(r => setTimeout(r, RETRY_DELAY));
      return fn();
    }
    throw err;
  }
}

/** Wrap an AI call with rate-limit check (before) and usage tracking (after). */
async function withRateLimitAndTracking<T>(
  feature: string,
  inputLength: number,
  fn: () => Promise<T>,
): Promise<T> {
  const { allowed, status } = checkAIRateLimit();
  if (!allowed) throw new AIRateLimitError(status);

  const start = Date.now();
  try {
    const result = await fn();
    trackAICall({ feature, model: DEFAULT_MODEL, success: true, durationMs: Date.now() - start, inputLength });
    return result;
  } catch (err) {
    trackAICall({ feature, model: DEFAULT_MODEL, success: false, durationMs: Date.now() - start, inputLength });
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Options interfaces
// ---------------------------------------------------------------------------

export interface AIGenerateOpts {
  prompt: string;
  systemInstruction?: string;
  feature: string;
  model?: string;
  timeout?: number;
  signal?: AbortSignal;
  temperature?: number;
}

export interface AITranscribeOpts {
  audioBase64: string;
  mimeType: string;
  feature: string;
  model?: string;
  timeout?: number;
  signal?: AbortSignal;
}

export interface AIAnalyzeImageOpts {
  imageBase64: string;
  mimeType: string;
  prompt: string;
  systemInstruction?: string;
  feature: string;
  model?: string;
  timeout?: number;
  signal?: AbortSignal;
  temperature?: number;
  /** If provided, forces JSON output with the given schema. */
  responseSchema?: Record<string, unknown>;
}

export interface AIGenerateJSONOpts<T = unknown> {
  prompt: string;
  systemInstruction?: string;
  responseSchema: Record<string, unknown>;
  feature: string;
  model?: string;
  timeout?: number;
  signal?: AbortSignal;
  temperature?: number;
  _phantom?: T;
}

export interface AIStreamOpts {
  prompt: string;
  systemInstruction?: string;
  feature: string;
  model?: string;
  timeout?: number;
  signal?: AbortSignal;
  temperature?: number;
}

export interface CreateChatOpts {
  systemInstruction?: string;
  feature: string;
  model?: string;
  temperature?: number;
}

// ---------------------------------------------------------------------------
// Core functions
// ---------------------------------------------------------------------------

/** Non-streaming text generation with PII redaction, audit logging, retry, and timeout. */
export async function aiGenerate(opts: AIGenerateOpts): Promise<{ text: string; redactionCount: number }> {
  const { redactedText, redactionCount } = redactAndLog(opts.prompt, opts.feature);

  return withRateLimitAndTracking(opts.feature, redactedText.length, async () => {
    const signal = makeSignal(opts.timeout ?? DEFAULT_TIMEOUT, opts.signal);
    const config: GenerateContentConfig = {
      systemInstruction: opts.systemInstruction,
      abortSignal: signal,
      temperature: opts.temperature,
    };

    const response = await withRetry(() =>
      getAI().models.generateContent({
        model: opts.model ?? DEFAULT_MODEL,
        contents: redactedText,
        config,
      })
    );

    return { text: response.text ?? '', redactionCount };
  });
}

/** Streaming text generation. Returns an async iterable of text chunks. */
export async function* aiGenerateStream(opts: AIStreamOpts): AsyncGenerator<string> {
  const { allowed, status } = checkAIRateLimit();
  if (!allowed) throw new AIRateLimitError(status);

  const { redactedText } = redactAndLog(opts.prompt, opts.feature);
  const signal = makeSignal(opts.timeout ?? DEFAULT_TIMEOUT, opts.signal);

  const config: GenerateContentConfig = {
    systemInstruction: opts.systemInstruction,
    abortSignal: signal,
    temperature: opts.temperature,
  };

  const start = Date.now();
  let success = false;
  try {
    const stream = await getAI().models.generateContentStream({
      model: opts.model ?? DEFAULT_MODEL,
      contents: redactedText,
      config,
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) yield text;
    }
    success = true;
  } finally {
    trackAICall({ feature: opts.feature, model: opts.model ?? DEFAULT_MODEL, success, durationMs: Date.now() - start, inputLength: redactedText.length });
  }
}

/** Audio transcription shortcut. */
export async function aiTranscribe(opts: AITranscribeOpts): Promise<string> {
  logAISend({
    feature: opts.feature,
    redactionMode: 'high',
    redactionCount: 0,
    textLengthSent: 0,
  });

  return withRateLimitAndTracking(opts.feature, opts.audioBase64.length, async () => {
    const signal = makeSignal(opts.timeout ?? DEFAULT_TIMEOUT, opts.signal);

    const audioPart: Part = {
      inlineData: { mimeType: opts.mimeType, data: opts.audioBase64 },
    };

    const response = await withRetry(() =>
      getAI().models.generateContent({
        model: opts.model ?? DEFAULT_MODEL,
        contents: [{ role: 'user', parts: [{ text: 'Transcribe this audio accurately:' }, audioPart] }],
        config: { abortSignal: signal },
      })
    );

    return response.text ?? '';
  });
}

/** Vision / document analysis shortcut. Handles images and PDFs via Gemini's multimodal input. */
export async function aiAnalyzeImage(opts: AIAnalyzeImageOpts): Promise<string> {
  const { redactedText } = redactAndLog(opts.prompt, opts.feature);

  return withRateLimitAndTracking(opts.feature, redactedText.length, async () => {
    const signal = makeSignal(opts.timeout ?? DEFAULT_TIMEOUT, opts.signal);

    const dataPart: Part = {
      inlineData: { mimeType: opts.mimeType, data: opts.imageBase64 },
    };

    const config: GenerateContentConfig = {
      systemInstruction: opts.systemInstruction,
      abortSignal: signal,
      temperature: opts.temperature,
    };
    if (opts.responseSchema) {
      config.responseMimeType = 'application/json';
      config.responseSchema = opts.responseSchema as GenerateContentConfig['responseSchema'];
    }

    const response = await withRetry(() =>
      getAI().models.generateContent({
        model: opts.model ?? DEFAULT_MODEL,
        contents: [{ role: 'user', parts: [{ text: redactedText }, dataPart] }],
        config,
      })
    );

    return response.text ?? '';
  });
}

// ---------------------------------------------------------------------------
// File Upload API (for PDFs — avoids base64 bloat and inline processing issues)
// ---------------------------------------------------------------------------

export interface AIAnalyzeFileOpts {
  file: Blob;
  mimeType: string;
  prompt: string;
  systemInstruction?: string;
  feature: string;
  model?: string;
  timeout?: number;
  signal?: AbortSignal;
  temperature?: number;
  responseSchema?: Record<string, unknown>;
  /** Called after the file upload completes, before analysis begins. */
  onUploaded?: () => void;
}

/** Analyze a file via the Gemini File Upload API (no base64). */
export async function aiAnalyzeFile(opts: AIAnalyzeFileOpts): Promise<string> {
  const { redactedText } = redactAndLog(opts.prompt, opts.feature);

  return withRateLimitAndTracking(opts.feature, redactedText.length, async () => {
    // 1. Upload the file (pass external signal so user can cancel, but no tight timeout —
    //    uploads on slow connections need room to breathe)
    const uploaded = await getAI().files.upload({
      file: opts.file,
      config: { mimeType: opts.mimeType, abortSignal: opts.signal },
    });

    // Start the analysis timeout AFTER upload completes
    opts.onUploaded?.();
    const signal = makeSignal(opts.timeout ?? DEFAULT_TIMEOUT, opts.signal);

    try {
      // 2. Build the file data part
      const filePart: Part = {
        fileData: { fileUri: uploaded.uri!, mimeType: opts.mimeType },
      };

      // 3. Configure response
      const config: GenerateContentConfig = {
        systemInstruction: opts.systemInstruction,
        abortSignal: signal,
        temperature: opts.temperature,
      };
      if (opts.responseSchema) {
        config.responseMimeType = 'application/json';
        config.responseSchema = opts.responseSchema as GenerateContentConfig['responseSchema'];
      }

      // 4. Generate (with retry on 429/503)
      const response = await withRetry(() =>
        getAI().models.generateContent({
          model: opts.model ?? DEFAULT_MODEL,
          contents: [{ role: 'user', parts: [{ text: redactedText }, filePart] }],
          config,
        })
      );

      return response.text ?? '';
    } finally {
      // 5. Fire-and-forget cleanup
      if (uploaded.name) {
        getAI().files.delete({ name: uploaded.name }).catch(() => { /* cleanup — non-critical */ });
      }
    }
  });
}

/** Structured JSON output with response schema. */
export async function aiGenerateJSON<T>(opts: AIGenerateJSONOpts<T>): Promise<T> {
  const { redactedText } = redactAndLog(opts.prompt, opts.feature);

  return withRateLimitAndTracking(opts.feature, redactedText.length, async () => {
    const signal = makeSignal(opts.timeout ?? DEFAULT_TIMEOUT, opts.signal);

    const response = await withRetry(() =>
      getAI().models.generateContent({
        model: opts.model ?? DEFAULT_MODEL,
        contents: redactedText,
        config: {
          systemInstruction: opts.systemInstruction,
          abortSignal: signal,
          temperature: opts.temperature,
          responseMimeType: 'application/json',
          responseSchema: opts.responseSchema as GenerateContentConfig['responseSchema'],
        },
      })
    );

    return JSON.parse(response.text ?? '{}') as T;
  });
}

/** Create a multi-turn chat session. */
export function createChat(opts: CreateChatOpts): Chat {
  return getAI().chats.create({
    model: opts.model ?? DEFAULT_MODEL,
    config: {
      systemInstruction: opts.systemInstruction,
      temperature: opts.temperature,
    },
  });
}

// ---------------------------------------------------------------------------
// Context-aware generation wrapper
// ---------------------------------------------------------------------------

import { buildVeteranContext } from '@/utils/veteranContext';
import { formatContextForAI } from '@/utils/formatContextForAI';

export interface AIGenerateWithContextOpts extends AIGenerateOpts {
  detailLevel?: 'minimal' | 'standard' | 'detailed';
}

/** Wrapper around `aiGenerate` that auto-injects veteran context into the prompt. */
export async function aiGenerateWithContext(opts: AIGenerateWithContextOpts): Promise<{ text: string; redactionCount: number }> {
  const ctx = buildVeteranContext({ maskPII: true });
  const contextBlock = formatContextForAI(ctx, opts.detailLevel ?? 'minimal');
  return aiGenerate({
    ...opts,
    prompt: `${contextBlock}\n\n${opts.prompt}`,
  });
}

// Re-export the Chat type for consumers
export type { Chat, GenerateContentResponse };
