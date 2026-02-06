/**
 * Centralized AI Client
 *
 * Provides a unified interface for AI operations with:
 * - Automatic retry with exponential backoff
 * - Timeout handling
 * - Proper error handling
 * - Request/response logging (dev only)
 */

import { supabase } from '@/integrations/supabase/client';

// Configuration
const AI_CONFIG = {
  maxRetries: 3,
  initialRetryDelay: 1000, // 1 second
  maxRetryDelay: 10000, // 10 seconds
  timeout: 30000, // 30 seconds
  maxInputLength: 5000, // Maximum characters for prompts
};

// Error codes that are worth retrying
const RETRYABLE_ERRORS = ['TIMEOUT', 'RATE_LIMIT', 'INTERNAL_ERROR'];

// Error types
export class AIError extends Error {
  code: string;
  status?: number;
  requestId?: string;
  retryable: boolean;

  constructor(
    message: string,
    code: string,
    options?: { status?: number; requestId?: string; retryable?: boolean }
  ) {
    super(message);
    this.name = 'AIError';
    this.code = code;
    this.status = options?.status;
    this.requestId = options?.requestId;
    this.retryable = options?.retryable ?? RETRYABLE_ERRORS.includes(code);
  }
}

// Response type
export interface AIResponse<T = string> {
  data: T;
  model: string;
  provider: string;
  requestId: string;
}

// Request options
interface AIRequestOptions {
  maxRetries?: number;
  timeout?: number;
  signal?: AbortSignal;
}

/**
 * Validate and sanitize input before sending to AI
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    throw new AIError('Invalid input: must be a non-empty string', 'INVALID_INPUT');
  }

  // Truncate if too long
  if (input.length > AI_CONFIG.maxInputLength) {
    console.warn(`Input truncated from ${input.length} to ${AI_CONFIG.maxInputLength} characters`);
    input = input.substring(0, AI_CONFIG.maxInputLength) + '... [truncated]';
  }

  // Remove potential prompt injection patterns
  const sanitized = input
    // Remove attempts to escape the prompt context
    .replace(/\[INST\]|\[\/INST\]|<\|im_start\|>|<\|im_end\|>/gi, '')
    // Remove attempts to inject system prompts
    .replace(/system:|assistant:|user:|human:/gi, '')
    // Remove excessive whitespace
    .replace(/\s{3,}/g, '  ')
    .trim();

  return sanitized;
}

/**
 * Validate object input (for structured data)
 */
export function sanitizeObjectInput<T extends Record<string, unknown>>(input: T): T {
  if (!input || typeof input !== 'object') {
    throw new AIError('Invalid input: must be an object', 'INVALID_INPUT');
  }

  // Deep clone and sanitize string values
  const sanitized = JSON.parse(JSON.stringify(input)) as T;

  function sanitizeStrings(obj: Record<string, unknown>): void {
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'string') {
        obj[key] = sanitizeInput(value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'string') {
            (value as string[])[index] = sanitizeInput(item);
          } else if (typeof item === 'object' && item !== null) {
            sanitizeStrings(item as Record<string, unknown>);
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        sanitizeStrings(value as Record<string, unknown>);
      }
    }
  }

  sanitizeStrings(sanitized as Record<string, unknown>);
  return sanitized;
}

/**
 * Sleep helper for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate retry delay with exponential backoff
 */
function getRetryDelay(attempt: number): number {
  const delay = AI_CONFIG.initialRetryDelay * Math.pow(2, attempt);
  return Math.min(delay, AI_CONFIG.maxRetryDelay);
}

/**
 * Log AI request/response (development only)
 */
function logAIOperation(
  operation: string,
  data: unknown,
  type: 'request' | 'response' | 'error'
): void {
  if (import.meta.env.DEV) {
    const prefix = type === 'error' ? '[AI ERROR]' : `[AI ${type.toUpperCase()}]`;
    console.log(`${prefix} ${operation}:`, data);
  }
}

/**
 * Analyze disabilities using the Supabase edge function
 */
export async function analyzeDisabilities(
  userData: {
    medicalVisits?: unknown[];
    exposures?: unknown[];
    symptoms?: unknown[];
    medications?: unknown[];
    serviceHistory?: unknown[];
  },
  options?: AIRequestOptions
): Promise<AIResponse<{
  suggestions: Array<{
    condition: string;
    category: string;
    evidenceStrength: string;
    reasoning: string;
    supportingEvidence: string[];
    additionalEvidence: string[];
    typicalRating: string;
  }>;
  overallAssessment: string;
  priorityActions: string[];
}>> {
  const maxRetries = options?.maxRetries ?? AI_CONFIG.maxRetries;

  // Sanitize input
  const sanitizedData = sanitizeObjectInput({ userData });

  logAIOperation('analyzeDisabilities', sanitizedData, 'request');

  let lastError: AIError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Check if aborted
      if (options?.signal?.aborted) {
        throw new AIError('Request cancelled', 'CANCELLED', { retryable: false });
      }

      const { data, error } = await supabase.functions.invoke('analyze-disabilities', {
        body: sanitizedData,
      });

      if (error) {
        throw new AIError(
          error.message || 'Failed to invoke AI function',
          'INVOKE_ERROR',
          { retryable: true }
        );
      }

      if (data?.error) {
        const aiError = new AIError(
          data.error,
          data.code || 'AI_ERROR',
          {
            status: data.status,
            requestId: data.requestId,
            retryable: RETRYABLE_ERRORS.includes(data.code),
          }
        );

        // Don't retry non-retryable errors
        if (!aiError.retryable) {
          throw aiError;
        }

        throw aiError;
      }

      logAIOperation('analyzeDisabilities', data, 'response');

      return {
        data: data,
        model: data.model || 'unknown',
        provider: data.provider || 'unknown',
        requestId: data.requestId || 'unknown',
      };
    } catch (err) {
      lastError = err instanceof AIError
        ? err
        : new AIError(
            err instanceof Error ? err.message : 'Unknown error',
            'UNKNOWN_ERROR'
          );

      logAIOperation('analyzeDisabilities', lastError, 'error');

      // Don't retry if not retryable or out of retries
      if (!lastError.retryable || attempt >= maxRetries) {
        throw lastError;
      }

      // Wait before retrying
      const delay = getRetryDelay(attempt);
      if (import.meta.env.DEV) console.log(`Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})...`);
      await sleep(delay);
    }
  }

  throw lastError || new AIError('Max retries exceeded', 'MAX_RETRIES');
}

/**
 * Generate claim strategy using the Supabase edge function
 */
export async function generateClaimStrategy(
  wizardData: {
    serviceInfo: unknown;
    healthConditions: unknown;
    existingRatings: unknown;
    evidence: unknown;
  },
  options?: AIRequestOptions
): Promise<AIResponse<{
  summary: string;
  filingType: string;
  priorityConditions: Array<{
    condition: string;
    reason: string;
    estimatedRating: string;
  }>;
  evidenceGaps: string[];
  timeline: string;
  nextSteps: string[];
  warnings: string[];
}>> {
  const maxRetries = options?.maxRetries ?? AI_CONFIG.maxRetries;

  // Sanitize input
  const sanitizedData = sanitizeObjectInput(wizardData);

  logAIOperation('generateClaimStrategy', sanitizedData, 'request');

  let lastError: AIError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (options?.signal?.aborted) {
        throw new AIError('Request cancelled', 'CANCELLED', { retryable: false });
      }

      const { data, error } = await supabase.functions.invoke('analyze-disabilities', {
        body: { wizardData: sanitizedData },
      });

      if (error) {
        throw new AIError(
          error.message || 'Failed to invoke AI function',
          'INVOKE_ERROR',
          { retryable: true }
        );
      }

      if (data?.error) {
        const aiError = new AIError(
          data.error,
          data.code || 'AI_ERROR',
          {
            status: data.status,
            requestId: data.requestId,
            retryable: RETRYABLE_ERRORS.includes(data.code),
          }
        );

        if (!aiError.retryable) {
          throw aiError;
        }

        throw aiError;
      }

      logAIOperation('generateClaimStrategy', data, 'response');

      return {
        data: data,
        model: data.model || 'unknown',
        provider: data.provider || 'unknown',
        requestId: data.requestId || 'unknown',
      };
    } catch (err) {
      lastError = err instanceof AIError
        ? err
        : new AIError(
            err instanceof Error ? err.message : 'Unknown error',
            'UNKNOWN_ERROR'
          );

      logAIOperation('generateClaimStrategy', lastError, 'error');

      if (!lastError.retryable || attempt >= maxRetries) {
        throw lastError;
      }

      const delay = getRetryDelay(attempt);
      if (import.meta.env.DEV) console.log(`Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})...`);
      await sleep(delay);
    }
  }

  throw lastError || new AIError('Max retries exceeded', 'MAX_RETRIES');
}

/**
 * Get user-friendly error message from AI error
 */
export function getAIErrorMessage(error: unknown): string {
  if (error instanceof AIError) {
    switch (error.code) {
      case 'RATE_LIMIT':
        return 'AI service is busy. Please wait a moment and try again.';
      case 'TIMEOUT':
        return 'Request timed out. Please try again with less data.';
      case 'INVALID_INPUT':
        return 'Invalid input provided. Please check your data and try again.';
      case 'AUTH_ERROR':
        return 'AI service authentication failed. Please contact support.';
      case 'CONTENT_BLOCKED':
        return 'Unable to process this content. Please try rephrasing.';
      case 'CANCELLED':
        return 'Request was cancelled.';
      default:
        return error.message || 'An error occurred. Please try again.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}
