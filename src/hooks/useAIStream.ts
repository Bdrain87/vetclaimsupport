import { useState, useCallback, useRef } from 'react';
import { aiGenerateStream, type AIStreamOpts } from '@/lib/gemini';

interface UseAIStreamReturn {
  streamedText: string;
  isStreaming: boolean;
  error: string | null;
  startStream: (opts: Omit<AIStreamOpts, 'signal'>) => Promise<string>;
  cancel: () => void;
}

export function useAIStream(): UseAIStreamReturn {
  const [streamedText, setStreamedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const startStream = useCallback(async (opts: Omit<AIStreamOpts, 'signal'>): Promise<string> => {
    // Cancel any previous stream
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStreamedText('');
    setError(null);
    setIsStreaming(true);

    let fullText = '';
    let pending = '';
    let rafId: number | null = null;

    const flush = () => {
      if (pending) {
        fullText += pending;
        const captured = fullText;
        setStreamedText(captured);
        pending = '';
      }
      rafId = null;
    };

    try {
      const stream = aiGenerateStream({ ...opts, signal: controller.signal });
      for await (const chunk of stream) {
        if (controller.signal.aborted) break;
        pending += chunk;
        // Batch updates at ~animation frame rate
        if (rafId === null) {
          rafId = requestAnimationFrame(flush);
        }
      }
      // Flush any remaining
      if (rafId !== null) cancelAnimationFrame(rafId);
      flush();
    } catch (err) {
      if (rafId !== null) cancelAnimationFrame(rafId);
      flush();
      if ((err as Error).name !== 'AbortError') {
        setError('AI generation failed. Please try again.');
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }

    return fullText;
  }, []);

  return { streamedText, isStreaming, error, startStream, cancel };
}
