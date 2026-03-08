import { GoogleGenAI, type Chat, type GenerateContentConfig, type GenerateContentResponse, type Part } from '@google/genai';
import { redactPII } from './redaction';
import { logAISend } from '@/services/aiAuditLog';

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
  _phantom?: T;
}

export interface AIStreamOpts {
  prompt: string;
  systemInstruction?: string;
  feature: string;
  model?: string;
  timeout?: number;
  signal?: AbortSignal;
}

export interface CreateChatOpts {
  systemInstruction?: string;
  feature: string;
  model?: string;
}

// ---------------------------------------------------------------------------
// Core functions
// ---------------------------------------------------------------------------

/** Non-streaming text generation with PII redaction, audit logging, retry, and timeout. */
export async function aiGenerate(opts: AIGenerateOpts): Promise<{ text: string; redactionCount: number }> {
  const { redactedText, redactionCount } = redactAndLog(opts.prompt, opts.feature);
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
}

/** Streaming text generation. Returns an async iterable of text chunks. */
export async function* aiGenerateStream(opts: AIStreamOpts): AsyncGenerator<string> {
  const { redactedText } = redactAndLog(opts.prompt, opts.feature);
  const signal = makeSignal(opts.timeout ?? DEFAULT_TIMEOUT, opts.signal);

  const config: GenerateContentConfig = {
    systemInstruction: opts.systemInstruction,
    abortSignal: signal,
  };

  const stream = await getAI().models.generateContentStream({
    model: opts.model ?? DEFAULT_MODEL,
    contents: redactedText,
    config,
  });

  for await (const chunk of stream) {
    const text = chunk.text;
    if (text) yield text;
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
}

/** Vision analysis shortcut. */
export async function aiAnalyzeImage(opts: AIAnalyzeImageOpts): Promise<string> {
  const { redactedText } = redactAndLog(opts.prompt, opts.feature);
  const signal = makeSignal(opts.timeout ?? DEFAULT_TIMEOUT, opts.signal);

  const imagePart: Part = {
    inlineData: { mimeType: opts.mimeType, data: opts.imageBase64 },
  };

  const config: GenerateContentConfig = {
    systemInstruction: opts.systemInstruction,
    abortSignal: signal,
  };
  if (opts.responseSchema) {
    config.responseMimeType = 'application/json';
    config.responseSchema = opts.responseSchema as GenerateContentConfig['responseSchema'];
  }

  const response = await withRetry(() =>
    getAI().models.generateContent({
      model: opts.model ?? DEFAULT_MODEL,
      contents: [{ role: 'user', parts: [{ text: redactedText }, imagePart] }],
      config,
    })
  );

  return response.text ?? '';
}

/** Structured JSON output with response schema. */
export async function aiGenerateJSON<T>(opts: AIGenerateJSONOpts<T>): Promise<T> {
  const { redactedText } = redactAndLog(opts.prompt, opts.feature);
  const signal = makeSignal(opts.timeout ?? DEFAULT_TIMEOUT, opts.signal);

  const response = await withRetry(() =>
    getAI().models.generateContent({
      model: opts.model ?? DEFAULT_MODEL,
      contents: redactedText,
      config: {
        systemInstruction: opts.systemInstruction,
        abortSignal: signal,
        responseMimeType: 'application/json',
        responseSchema: opts.responseSchema as GenerateContentConfig['responseSchema'],
      },
    })
  );

  return JSON.parse(response.text ?? '{}') as T;
}

/** Create a multi-turn chat session. */
export function createChat(opts: CreateChatOpts): Chat {
  return getAI().chats.create({
    model: opts.model ?? DEFAULT_MODEL,
    config: {
      systemInstruction: opts.systemInstruction,
    },
  });
}

// Re-export the Chat type for consumers
export type { Chat, GenerateContentResponse };
