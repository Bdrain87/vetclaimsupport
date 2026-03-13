/**
 * AskIntel — Full-page intelligent chat with proactive insights panel.
 *
 * Unlike AskIntelSheet (bottom sheet), this is a dedicated page with:
 * - Proactive insights panel (smart reminders, next steps, rating opportunities)
 * - Dynamic context-aware suggested questions
 * - Full streaming chat with tool routing
 * - AI output compliance scanning
 */
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle, Send, Loader2, AlertTriangle, Sparkles,
  ChevronRight, RotateCcw, Brain, TrendingUp, Clock,
  Shield, Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageContainer } from '@/components/PageContainer';
import { AIDisclaimer } from '@/components/ui/AIDisclaimer';
import { StreamingText } from '@/components/ui/StreamingText';
import { useAIStream } from '@/hooks/useAIStream';
import { getModelConfig } from '@/lib/ai-models';
import { isGeminiConfigured } from '@/lib/gemini';
import { buildVeteranContext } from '@/utils/veteranContext';
import { formatContextForAI } from '@/utils/formatContextForAI';
import { AI_ANTI_HALLUCINATION, buildCriteriaBlockForConditions, buildSecondaryConnectionsBlock } from '@/lib/ai-prompts';
import { requireOnline } from '@/utils/networkCheck';
import { checkAIRateLimit, trackAICall } from '@/services/aiUsageTracker';
import { scanAIOutput, AI_OUTPUT_WARNING } from '@/utils/aiOutputGuard';
import { useSmartReminders } from '@/hooks/useSmartReminders';
import { ClaimIntelligence } from '@/services/claimIntelligence';
import { useUserConditions } from '@/hooks/useUserConditions';
import { useClaims } from '@/hooks/useClaims';
import { useProfileStore } from '@/store/useProfileStore';
import { getConditionDisplayName } from '@/utils/conditionResolver';
import { buildToolLink, TOOL_REGISTRY } from '@/lib/toolRouting';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

function buildIntelSystemPrompt(opts: {
  veteranContext: string;
  criteriaBlock: string;
  secondaryBlock: string;
  reminders: string;
  nextSteps: string;
  toolRoutes: string;
}): string {
  return `You are Intel, a VA disability claims preparation advisor inside the VetClaimSupport app. You know the veteran's entire case through their tracked data.

ROLE: Help veterans prepare their claims, understand evidence requirements, and plan next steps. You are educational — you help veterans understand and prepare, you do NOT file claims, diagnose conditions, or provide legal advice.

CRITICAL RULES:
- NEVER diagnose medical conditions — say "your documented symptoms may align with criteria for X — discuss with your healthcare provider"
- NEVER predict specific VA ratings — say "your documentation aligns with the X% criteria level"
- NEVER advise filing a claim — recommend "consult a VA-accredited VSO, attorney, or claims agent"
- NEVER provide legal advice — say "veterans in similar situations often consider..."
- NEVER use: "nexus", "at least as likely as not", "more likely than not", "medical nexus", "reasonable medical certainty"
- Reference the veteran's logged data when relevant
- Keep responses concise and actionable
- When recommending a tool, use markdown links: [Tool Name](route)

VETERAN DATA:
${opts.veteranContext}

${opts.criteriaBlock ? `RATING CRITERIA (use ONLY these — for unlisted conditions, direct to Rating Guidance tool):\n${opts.criteriaBlock}` : ''}

${opts.secondaryBlock ? `SECONDARY CONNECTIONS:\n${opts.secondaryBlock}` : ''}

${opts.reminders ? `ACTIVE REMINDERS:\n${opts.reminders}` : ''}

${opts.nextSteps ? `RECOMMENDED NEXT STEPS:\n${opts.nextSteps}` : ''}

AVAILABLE TOOLS (link to these when relevant):
${opts.toolRoutes}

${AI_ANTI_HALLUCINATION}`;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  hasWarning?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AskIntel() {
  const navigate = useNavigate();
  const { conditions } = useUserConditions();
  const { data: claimsData } = useClaims();
  const profile = useProfileStore();
  const reminders = useSmartReminders();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const { streamedText, isStreaming, error, startStream, cancel } = useAIStream();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamedText]);

  // Proactive insights
  const conditionNames = useMemo(
    () => conditions.map(c => getConditionDisplayName(c)),
    [conditions],
  );

  const nextSteps = useMemo(() => {
    return ClaimIntelligence.getNextSteps(profile, conditions, claimsData).slice(0, 5);
  }, [profile, conditions, claimsData]);

  const ratingOpportunities = useMemo(() => {
    return ClaimIntelligence.getRatingOpportunities(claimsData).slice(0, 3);
  }, [claimsData]);

  const highPriorityReminders = useMemo(
    () => reminders.filter(r => r.priority === 'high').slice(0, 3),
    [reminders],
  );

  // Dynamic suggested questions
  const suggestedQuestions = useMemo(() => {
    const questions: string[] = [];

    for (const c of conditionNames.slice(0, 2)) {
      questions.push(`What evidence do I need for ${c}?`);
    }

    const denied = conditions.filter(c => c.claimStatus === 'denied');
    if (denied.length > 0) {
      questions.push(`How do I appeal my ${getConditionDisplayName(denied[0])} denial?`);
    }

    if (reminders.some(r => r.id === 'symptom-gap')) {
      questions.push('Why is consistent symptom logging important?');
    }

    if (reminders.some(r => r.id.startsWith('exam-prep-'))) {
      questions.push('How do I prepare for my C&P exam?');
    }

    if (questions.length < 4) {
      questions.push('What should I work on next?');
    }
    if (questions.length < 4) {
      questions.push('How do secondary conditions work?');
    }

    return questions.slice(0, 6);
  }, [conditionNames, conditions, reminders]);

  // Build tool routes string (compact)
  const toolRoutesStr = useMemo(() => {
    return TOOL_REGISTRY.slice(0, 20).map(t => `- [${t.label}](${t.route}): ${t.description}`).join('\n');
  }, []);

  // Handle send
  const handleSend = useCallback(async (text?: string) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isStreaming) return;

    if (!requireOnline('Intel')) return;
    const { allowed, status } = checkAIRateLimit();
    if (!allowed) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Monthly AI limit reached (${status.used}/${status.limit}). Resets ${status.resetDate}. Your tracked data and local tools still work without AI.`,
      }]);
      return;
    }

    const userMsg: ChatMessage = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const ctx = buildVeteranContext({ maskPII: true });
    const contextBlock = formatContextForAI(ctx, 'detailed');
    const conditionsForCriteria = (ctx.conditions || []).map((c: { name: string; diagnosticCode?: string }) => ({
      name: c.name, diagnosticCode: c.diagnosticCode,
    }));
    const criteriaBlock = buildCriteriaBlockForConditions(conditionsForCriteria);
    const secondaryBlock = buildSecondaryConnectionsBlock(conditionNames);

    const reminderStr = highPriorityReminders.map(r => `- [${r.priority}] ${r.title}: ${r.description}`).join('\n');
    const nextStepsStr = nextSteps.map(s => `- ${s.title}: ${s.description}`).join('\n');

    const systemPrompt = buildIntelSystemPrompt({
      veteranContext: contextBlock,
      criteriaBlock: criteriaBlock || '',
      secondaryBlock: secondaryBlock || '',
      reminders: reminderStr,
      nextSteps: nextStepsStr,
      toolRoutes: toolRoutesStr,
    });

    // Build conversation history (max 20 messages)
    const recentMessages = [...messages, userMsg].slice(-20);
    const history = recentMessages
      .map(m => `${m.role === 'user' ? 'Veteran' : 'Intel'}: ${m.content}`)
      .join('\n\n');

    const { model, temperature } = getModelConfig('ask-intel-full');
    const prompt = `${systemPrompt}\n\n--- CONVERSATION ---\n${history}\n\nIntel:`;

    const start = Date.now();
    try {
      const result = await startStream({ prompt, model, temperature });
      const scan = scanAIOutput(result);
      trackAICall({ feature: 'ask-intel-full', model, success: true, durationMs: Date.now() - start, inputLength: trimmed.length });
      setMessages(prev => [...prev, { role: 'assistant', content: result, hasWarning: !scan.clean }]);
    } catch {
      trackAICall({ feature: 'ask-intel-full', success: false, durationMs: Date.now() - start });
    }
  }, [input, isStreaming, messages, startStream, conditionNames, highPriorityReminders, nextSteps, toolRoutesStr]);

  const handleNewChat = () => {
    cancel();
    setMessages([]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Parse tool links in messages
  const renderMessage = (content: string) => {
    // Match markdown links [label](route)
    const parts = content.split(/(\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, i) => {
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, label, route] = linkMatch;
        // Only render as button if route matches a tool
        if (route.startsWith('/')) {
          return (
            <button
              key={i}
              onClick={() => navigate(route)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 transition-colors"
            >
              {label}
              <ChevronRight className="h-3 w-3" />
            </button>
          );
        }
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (!isGeminiConfigured) {
    return (
      <PageContainer className="py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">AI is not configured. Check your settings.</p>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="flex flex-col h-[calc(100dvh-120px)] overflow-hidden">
      <AIDisclaimer variant="banner" />

      {/* Header */}
      <div className="flex items-center justify-between py-3 shrink-0">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-gold" />
          <h1 className="text-lg font-bold text-foreground">Intel</h1>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold/10 text-gold font-medium">AI</span>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleNewChat} className="gap-1 text-xs">
            <RotateCcw className="h-3 w-3" />
            New Chat
          </Button>
        )}
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 space-y-4 pb-2">
        {messages.length === 0 && !isStreaming && (
          <>
            {/* Proactive Insights */}
            {(highPriorityReminders.length > 0 || ratingOpportunities.length > 0) && (
              <div className="space-y-2">
                {highPriorityReminders.map(r => (
                  <button
                    key={r.id}
                    onClick={() => handleSend(r.title)}
                    className="w-full flex items-start gap-2.5 p-3 rounded-xl border border-gold/20 bg-gold/5 hover:bg-gold/10 transition-colors text-left"
                  >
                    {r.category === 'deadline' ? (
                      <Clock className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    ) : r.category === 'exam' ? (
                      <Shield className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{r.title}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{r.description}</p>
                    </div>
                    <Sparkles className="h-3 w-3 text-gold shrink-0 mt-1" />
                  </button>
                ))}
                {ratingOpportunities.map((opp, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(`Tell me about the rating opportunity for ${opp.condition}`)}
                    className="w-full flex items-start gap-2.5 p-3 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-left"
                  >
                    <TrendingUp className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{opp.condition}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{opp.reason}</p>
                    </div>
                    <Sparkles className="h-3 w-3 text-gold shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            )}

            {/* Next Steps */}
            {nextSteps.length > 0 && (
              <div className="space-y-1">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1">Priority Actions</p>
                {nextSteps.slice(0, 3).map((step, i) => (
                  <button
                    key={i}
                    onClick={() => step.route ? navigate(step.route) : handleSend(step.title)}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors text-left"
                  >
                    <Activity className="h-3.5 w-3.5 text-gold shrink-0" />
                    <span className="text-xs text-foreground truncate">{step.title}</span>
                    <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0 ml-auto" />
                  </button>
                ))}
              </div>
            )}

            {/* Suggested Questions */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1">Ask Intel</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestedQuestions.map(q => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="text-[11px] px-2.5 py-1.5 rounded-full border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Messages */}
        {messages.map((msg, i) => (
          <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn(
              'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
              msg.role === 'user'
                ? 'bg-gold text-black rounded-br-md'
                : 'bg-muted/50 text-foreground rounded-bl-md',
            )}>
              {msg.role === 'assistant' ? (
                <div className="space-y-1">
                  {msg.hasWarning && (
                    <div className="flex items-center gap-1 text-[10px] text-gold mb-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span>{AI_OUTPUT_WARNING}</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-xs">{renderMessage(msg.content)}</div>
                </div>
              ) : (
                <span className="text-xs">{msg.content}</span>
              )}
            </div>
          </div>
        ))}

        {/* Streaming */}
        {isStreaming && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-muted/50 px-3.5 py-2.5">
              {streamedText ? (
                <div className="text-xs"><StreamingText text={streamedText} /></div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Thinking...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error */}
        {error && !isStreaming && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-destructive/10 border border-destructive/20 px-3.5 py-2.5">
              <p className="text-xs text-destructive">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 pt-2 pb-1 border-t border-border">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your claim..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-border bg-card px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold/50 min-h-[44px] max-h-[120px]"
            style={{ fieldSizing: 'content' } as React.CSSProperties}
            disabled={isStreaming}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isStreaming}
            size="icon"
            className="h-[44px] w-[44px] rounded-xl shrink-0"
          >
            {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
