/**
 * AskIntelSheet — Reusable bottom sheet with streaming AI chat,
 * context-aware via buildVeteranContext. NOT a general chatbot — a claims
 * preparation assistant.
 *
 * System instruction: "You are a VA claims preparation advisor. Never diagnose,
 * never predict ratings, never file claims. Always recommend consulting a VSO."
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAIStream } from '@/hooks/useAIStream';
import { getModelConfig } from '@/lib/ai-models';
import { isGeminiConfigured } from '@/lib/gemini';
import { buildVeteranContext } from '@/utils/veteranContext';
import { formatContextForAI } from '@/utils/formatContextForAI';
import { StreamingText } from '@/components/ui/StreamingText';
import { MessageCircle, X, Send, Loader2, AlertTriangle } from 'lucide-react';
import { AI_ANTI_HALLUCINATION, buildCriteriaBlockForConditions, buildSecondaryConnectionsBlock } from '@/lib/ai-prompts';
import { cn } from '@/lib/utils';

const SYSTEM_INSTRUCTION = `You are a VA disability claims preparation advisor built into the VetClaimSupport app. Your role:

1. Help veterans understand VA claims processes, evidence requirements, and exam preparation
2. Answer questions about rating criteria using only the criteria data provided in your context, and about secondary conditions and filing strategies
3. Suggest next steps based on the veteran's documented data

CRITICAL RULES:
- NEVER diagnose medical conditions
- NEVER predict specific VA ratings or outcomes
- NEVER advise filing a claim — only preparation
- NEVER provide legal advice
- Always recommend consulting an accredited VSO or attorney for personalized guidance
- Reference the veteran's logged data when relevant (symptoms, medications, visits)
- Keep responses concise and actionable
- Use plain language, not VA jargon${AI_ANTI_HALLUCINATION}`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AskIntelSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const { streamedText, isStreaming, error, startStream, cancel } = useAIStream();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamedText]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMsg: Message = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Build context
    const ctx = buildVeteranContext({ maskPII: true });
    const contextBlock = formatContextForAI(ctx, 'summary');

    // Inject rating criteria and secondary connections
    const conditionsForCriteria = (ctx.conditions || []).map((c: { name: string; diagnosticCode?: string }) => ({
      name: c.name,
      diagnosticCode: c.diagnosticCode,
    }));
    const criteriaBlock = buildCriteriaBlockForConditions(conditionsForCriteria);
    const conditionNames = (ctx.conditions || []).map((c: { name: string }) => c.name);
    const secondaryBlock = buildSecondaryConnectionsBlock(conditionNames);

    // Build conversation history
    const history = [...messages, userMsg]
      .map((m) => `${m.role === 'user' ? 'Veteran' : 'Advisor'}: ${m.content}`)
      .join('\n\n');

    const { model, temperature } = getModelConfig('assistant');

    const prompt = `${SYSTEM_INSTRUCTION}\n\n--- VETERAN DATA ---\n${contextBlock}${criteriaBlock ? `\n\n${criteriaBlock}\nUse ONLY the criteria above. For unlisted conditions, direct the veteran to the Rating Guidance tool.` : ''}${secondaryBlock ? `\n\n${secondaryBlock}\nWhen discussing secondary conditions, reference ONLY the connections listed above.` : ''}\n\n--- CONVERSATION ---\n${history}\n\nAdvisor:`;

    try {
      const result = await startStream({
        prompt,
        model,
        temperature,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: result }]);
    } catch {
      // Error is handled in useAIStream
    }
  }, [input, isStreaming, messages, startStream]);

  if (!isGeminiConfigured) return null;

  return (
    <>
      {/* Bottom Sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => { cancel(); setIsOpen(false); }}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border rounded-t-2xl max-h-[70vh] flex flex-col"
              style={{ paddingBottom: 'calc(var(--keyboard-height, 0px) + env(safe-area-inset-bottom, 0px))' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-gold" />
                  <h3 className="text-sm font-bold text-foreground">Ask Intel</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold/10 text-gold font-medium">AI</span>
                </div>
                <button
                  onClick={() => { cancel(); setIsOpen(false); }}
                  className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {messages.length === 0 && !isStreaming && (
                  <div className="text-center py-6 space-y-2">
                    <MessageCircle className="h-8 w-8 text-gold/40 mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Ask about your claim, rating criteria, evidence strategies, or exam preparation.
                    </p>
                    <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                      {['What evidence do I need?', 'How do secondaries work?', 'Exam day tips'].map((q) => (
                        <button
                          key={q}
                          onClick={() => { setInput(q); }}
                          className="text-[11px] px-2.5 py-1.5 rounded-full border border-border text-muted-foreground hover:bg-accent transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      'max-w-[85%] p-3 rounded-2xl text-sm',
                      msg.role === 'user'
                        ? 'ml-auto bg-gold/10 text-foreground'
                        : 'bg-secondary text-foreground',
                    )}
                  >
                    {msg.content}
                  </div>
                ))}

                {isStreaming && (
                  <div className="max-w-[85%] p-3 rounded-2xl bg-secondary text-sm">
                    <StreamingText text={streamedText} isStreaming={true} />
                  </div>
                )}

                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                    <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-xs text-destructive">{error}</p>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="px-4 py-1.5 border-t border-border">
                <p className="text-[9px] text-muted-foreground/60 text-center">
                  AI preparation tool. Not legal or medical advice. Consult a VSO for personalized guidance.
                </p>
              </div>

              {/* Input */}
              <div className="px-4 pb-4 pt-2 shrink-0">
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Ask about your claim..."
                    className="flex-1 text-sm bg-muted/50 border border-border rounded-xl px-4 py-3 min-h-[44px] text-foreground placeholder:text-muted-foreground/50"
                    disabled={isStreaming}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isStreaming}
                    className="shrink-0 w-11 h-11 rounded-xl bg-gold text-black flex items-center justify-center disabled:opacity-50 hover:bg-gold/90 transition-colors"
                    aria-label="Send"
                  >
                    {isStreaming ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
