import { useEffect, useRef } from 'react';

interface StreamingTextProps {
  /** The text content being streamed (grows over time). */
  text: string;
  /** Whether streaming is still in progress. */
  isStreaming: boolean;
  /** Optional className for the container. */
  className?: string;
}

/**
 * Renders text with a typing cursor that disappears when streaming completes.
 * The text prop should be updated as new tokens arrive.
 */
export function StreamingText({ text, isStreaming, className }: StreamingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom as new text arrives
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [text]);

  return (
    <div ref={containerRef} className={className}>
      <div className="whitespace-pre-wrap">
        {text}
        {isStreaming && (
          <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse align-text-bottom" />
        )}
      </div>
    </div>
  );
}
