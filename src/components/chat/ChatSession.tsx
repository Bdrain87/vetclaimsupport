import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Download, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage, type ChatMessageData } from './ChatMessage';
import { StreamingText } from '@/components/ui/StreamingText';
import { useGemini } from '@/hooks/useGemini';
import { cn } from '@/lib/utils';

interface ChatSessionProps {
  /** Condition name for context. */
  conditionName: string;
  /** System prompt to prepend to each AI request. */
  systemPrompt: string;
  /** Callback when user wants to export the session as PDF. */
  onExport?: (messages: ChatMessageData[]) => void;
}

const AI_DISCLAIMER =
  'This is an AI practice tool, not medical or legal advice. AI responses are for preparation only — they do not represent what a VA examiner will say. Always consult with a VA-accredited representative for official guidance.';

export function ChatSession({ conditionName, systemPrompt, onExport }: ChatSessionProps) {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { generateStream, isLoading, isStreaming, streamedText, error } = useGemini('cpExamPrep');

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamedText]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessageData = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Build context from last N messages
    const recentMessages = [...messages.slice(-8), userMessage];
    const conversationContext = recentMessages
      .map((m) => `${m.role === 'user' ? 'Veteran' : 'AI Coach'}: ${m.content}`)
      .join('\n\n');

    const fullPrompt = `${systemPrompt}\n\nCondition: ${conditionName}\n\nConversation so far:\n${conversationContext}\n\nRespond as an AI C&P exam preparation coach. Help the veteran practice describing their condition for a C&P exam. Ask follow-up questions about frequency, severity, and functional impact. Use "Veterans often report..." framing, never "You have...".`;

    const result = await generateStream(fullPrompt);

    if (result) {
      const assistantMessage: ChatMessageData = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }
  }, [input, isLoading, messages, conditionName, systemPrompt, generateStream]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Disclaimer */}
      <div className="px-4 py-2 bg-warning/5 border-b border-warning/20">
        <p className="text-[10px] text-warning leading-tight">{AI_DISCLAIMER}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm font-medium mb-2">C&P Exam Practice: {conditionName}</p>
            <p className="text-xs max-w-xs mx-auto">
              Practice describing your condition as if you were in a C&P exam.
              The AI coach will ask follow-up questions to help you prepare.
            </p>
            <div className="mt-4 space-y-2">
              {[
                'How does this condition affect my daily life?',
                "What should I tell the examiner about my worst days?",
                'What questions will the examiner ask?',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="block w-full text-left text-xs px-3 py-2 rounded-xl border border-border hover:bg-accent transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Streaming response */}
        {isStreaming && streamedText && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
            </div>
            <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm bg-card border border-border">
              <StreamingText text={streamedText} isStreaming={true} />
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-2">
            <p className="text-xs text-destructive">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Actions bar */}
      {messages.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-1">
          <button
            onClick={handleClear}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" />
            Clear
          </button>
          {onExport && (
            <button
              onClick={() => onExport(messages)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Download className="h-3 w-3" />
              Save as PDF
            </button>
          )}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-border">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your condition or ask a question..."
            rows={1}
            className={cn(
              'flex-1 resize-none text-sm bg-muted/50 border border-border rounded-xl px-4 py-3',
              'text-foreground placeholder:text-muted-foreground/50',
              'focus:outline-none focus:ring-1 focus:ring-primary/50',
            )}
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="h-11 w-11 rounded-xl flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
