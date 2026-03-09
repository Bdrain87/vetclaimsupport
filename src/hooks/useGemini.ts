import { useState, useRef, useCallback, useEffect } from 'react';
import { AI_CONFIG } from '@/lib/ai-prompts';
import { supabase } from '@/lib/supabase';
import { redactPII } from '@/lib/redaction';
import { logAISend } from '@/services/aiAuditLog';
import { buildVeteranContext } from '@/utils/veteranContext';
import { formatContextForAI } from '@/utils/formatContextForAI';

const PERSONA_FEATURE_MAP: Record<string, string> = {
  EXAMINER_PERSONA: 'exam-prep',
  VA_SPEAK_TRANSLATOR: 'va-speak',
  DOCTOR_SUMMARY_LOGIC: 'doctor-summary',
};

async function ensureSession(): Promise<boolean> {
  // 1. Check for a cached session
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    // If the access token is expiring within 30 seconds, proactively refresh
    const expiresAt = session.expires_at; // unix seconds
    if (expiresAt && expiresAt < Math.floor(Date.now() / 1000) + 30) {
      const { data: refreshed } = await supabase.auth.refreshSession();
      if (refreshed.session) return true;
      // Refresh failed — session is stale. User must sign in.
    } else {
      return true;
    }
  }

  // 2. No valid session — try refreshing (handles cases where getSession
  //    returned null but a refresh token still exists in storage)
  const { data: refreshed } = await supabase.auth.refreshSession();
  if (refreshed.session) return true;

  // 3. No valid session and refresh failed — require real authentication.
  //    Do NOT fall back to anonymous sign-in (security: anonymous sessions
  //    bypass entitlement checks and should not access Edge Functions).
  return false;
}

export const useGemini = (persona: keyof typeof AI_CONFIG) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamedText, setStreamedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (input: string): Promise<string | null> => {
    // Cancel any in-flight request
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    // Auto-abort after 30 seconds to prevent infinite loading
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    try {
      // Ensure we have a valid session (requires real auth — no anonymous fallback)
      const hasSession = await ensureSession();
      if (!hasSession) {
        setError('Unable to authenticate. Please sign in and try again.');
        return null;
      }

      const { redactedText: sanitizedInput, redactionCount } = redactPII(input, 'high');

      logAISend({
        feature: PERSONA_FEATURE_MAP[persona] || persona,
        redactionMode: 'high',
        redactionCount,
        textLengthSent: sanitizedInput.length,
      });

      const ctx = buildVeteranContext({ maskPII: true });
      const contextBlock = formatContextForAI(ctx, 'minimal');

      const body = {
        prompt: `${AI_CONFIG[persona]}\n\n${contextBlock}\n\nInput: ${sanitizedInput}`,
      };

      let result = await supabase.functions.invoke('analyze-disabilities', { body });

      if (controller.signal.aborted) return null;

      // If we got a 401 (token expired/invalid), refresh the session and retry once
      if (result.error) {
        let status: number | undefined;
        try {
          if (result.error.context instanceof Response) {
            status = result.error.context.status;
          }
        } catch { /* ignore */ }

        if (status === 401) {
          if (controller.signal.aborted) return null;
          const { data: refreshed } = await supabase.auth.refreshSession();
          if (refreshed.session && !controller.signal.aborted) {
            result = await supabase.functions.invoke('analyze-disabilities', { body });
            if (controller.signal.aborted) return null;
          }
        }
      }

      const { data, error: invokeError } = result;

      if (invokeError) {
        // In supabase-js v2, the actual error body may be in data or invokeError.context
        let msg = 'AI service request failed';

        // Try reading the error from the response context
        try {
          if (invokeError.context instanceof Response) {
            const errBody = await invokeError.context.json();
            if (errBody?.error) msg = errBody.error;
            else if (errBody?.message) msg = errBody.message;
          }
        } catch {
          // context may already be consumed
        }

        // Fallback: check if data has the error (some versions put parsed body in data)
        if (msg === 'AI service request failed' && data?.error) {
          msg = data.error;
        }

        // Last resort: use the invokeError message if it's not the generic one
        if (msg === 'AI service request failed' && invokeError.message && !invokeError.message.includes('non-2xx')) {
          msg = invokeError.message;
        }

        setError(msg);
        return null;
      }

      // Check if the response is actually an error (non-2xx returns can still populate data)
      if (data?.error) {
        setError(data.error);
        return null;
      }

      const text = data?.analysis;
      if (!text) {
        setError('Unexpected response format from AI service');
        return null;
      }
      return text;
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
        return null;
      }
      if (controller.signal.aborted) return null;
      const msg = err instanceof Error ? err.message : 'AI service request failed';
      setError(msg);
      return null;
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }, [persona]);

  /**
   * Streaming variant of generate(). Calls the edge function with stream=true
   * and reads SSE chunks. Falls back to non-streaming on error.
   *
   * Updates `streamedText` state as tokens arrive.
   * Returns the complete text when done, or null on error.
   */
  const generateStream = useCallback(async (input: string): Promise<string | null> => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setIsStreaming(true);
    setStreamedText('');
    setError(null);

    const timeoutId = setTimeout(() => controller.abort(), 60_000);

    try {
      const hasSession = await ensureSession();
      if (!hasSession) {
        setError('Unable to authenticate. Please sign in and try again.');
        return null;
      }

      const { redactedText: sanitizedInput, redactionCount } = redactPII(input, 'high');
      logAISend({ feature: PERSONA_FEATURE_MAP[persona] || persona, redactionMode: 'high', redactionCount, textLengthSent: sanitizedInput.length });

      const streamCtx = buildVeteranContext({ maskPII: true });
      const streamContextBlock = formatContextForAI(streamCtx, 'minimal');

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Session expired. Please sign in again.');
        return null;
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/analyze-disabilities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          prompt: `${AI_CONFIG[persona]}\n\n${streamContextBlock}\n\nInput: ${sanitizedInput}`,
          stream: true,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        // Fall back to non-streaming
        setIsStreaming(false);
        return generate(input);
      }

      if (!response.body) {
        // No streaming body — fall back
        setIsStreaming(false);
        return generate(input);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let rawBody = ''; // Track raw response for fallback parsing

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (controller.signal.aborted) return null;

        const chunk = decoder.decode(value, { stream: true });
        rawBody += chunk;

        // Parse SSE lines
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const token = parsed.text || parsed.token || parsed.content || '';
              if (token) {
                fullText += token;
                setStreamedText(fullText);
              }
            } catch {
              // If it's not JSON, treat the raw data as text
              if (data && data !== '[DONE]') {
                fullText += data;
                setStreamedText(fullText);
              }
            }
          }
        }
      }

      // If we got no streamed text, the edge function might not support streaming yet
      // Fall back to parsing the raw response body as JSON
      if (!fullText && rawBody) {
        try {
          const jsonResponse = JSON.parse(rawBody);
          if (jsonResponse?.analysis) {
            fullText = jsonResponse.analysis;
            setStreamedText(fullText);
          }
        } catch {
          // Not JSON either — fall back to non-streaming
          setIsStreaming(false);
          return generate(input);
        }
      }

      return fullText || null;
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
        return null;
      }
      if (controller.signal.aborted) return null;

      // Fall back to non-streaming on any streaming error (only once)
      setIsStreaming(false);
      try {
        return await generate(input);
      } catch {
        // generate() already sets error state internally
        return null;
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [persona, generate]);

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  // Clean up in-flight requests when the component unmounts
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return { generate, generateStream, isLoading, isStreaming, streamedText, cancel, error };
};
