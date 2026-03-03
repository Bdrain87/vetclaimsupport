import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBuddyShare, submitBuddyStatement } from '@/services/buddyShare';
import { FileText, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type PageState =
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'expired' }
  | { status: 'already-submitted' }
  | {
      status: 'ready';
      share: {
        token: string;
        veteranFirstName: string;
        conditionName: string;
        templateContent: string;
        relationshipHint: string;
      };
    }
  | { status: 'submitting' }
  | { status: 'submitted' }
  | { status: 'error'; message: string };

export default function BuddyFillPage() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<PageState>({ status: 'loading' });
  const [form, setForm] = useState({
    buddyName: '',
    buddyRelationship: '',
    buddyContact: '',
    statementContent: '',
  });

  useEffect(() => {
    if (!token) {
      setState({ status: 'not-found' });
      return;
    }

    fetchBuddyShare(token).then((result) => {
      if (!result.found) {
        if ('expired' in result && result.expired) {
          setState({ status: 'expired' });
        } else if ('alreadySubmitted' in result && result.alreadySubmitted) {
          setState({ status: 'already-submitted' });
        } else {
          setState({ status: 'not-found' });
        }
        return;
      }
      setState({ status: 'ready', share: result.share });
    }).catch(() => {
      setState({ status: 'error', message: 'Unable to load this buddy statement. Check your internet connection and try again.' });
    });
  }, [token]);

  const handleSubmit = async () => {
    if (state.status !== 'ready') return;
    if (!form.buddyName.trim() || !form.statementContent.trim()) return;

    setState({ status: 'submitting' });
    const result = await submitBuddyStatement(state.share.token, form);
    if (result.success) {
      setState({ status: 'submitted' });
    } else {
      setState({ status: 'error', message: result.error || 'Submission failed.' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 mb-3">
            <FileText className="h-6 w-6 text-gold" />
          </div>
          <h1 className="text-xl font-bold">Buddy Statement</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Help a veteran with their VA disability claim
          </p>
        </div>

        {state.status === 'loading' && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {state.status === 'not-found' && (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium">Link Not Found</p>
              <p className="text-xs text-muted-foreground mt-1">
                This buddy statement link is invalid or has been removed.
              </p>
            </CardContent>
          </Card>
        )}

        {state.status === 'expired' && (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto text-warning mb-3" />
              <p className="text-sm font-medium">Link Expired</p>
              <p className="text-xs text-muted-foreground mt-1">
                This buddy statement link has expired. Ask the veteran to send a new one.
              </p>
            </CardContent>
          </Card>
        )}

        {state.status === 'already-submitted' && (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="h-8 w-8 mx-auto text-success mb-3" />
              <p className="text-sm font-medium">Already Submitted</p>
              <p className="text-xs text-muted-foreground mt-1">
                A statement has already been submitted for this request.
              </p>
            </CardContent>
          </Card>
        )}

        {state.status === 'submitted' && (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="h-8 w-8 mx-auto text-success mb-3" />
              <p className="text-sm font-medium text-success">Statement Submitted</p>
              <p className="text-xs text-muted-foreground mt-1">
                Thank you for supporting a fellow veteran. Your statement has been sent to them.
              </p>
            </CardContent>
          </Card>
        )}

        {state.status === 'error' && (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto text-destructive mb-3" />
              <p className="text-sm font-medium text-destructive">Submission Error</p>
              <p className="text-xs text-muted-foreground mt-1">{state.message}</p>
            </CardContent>
          </Card>
        )}

        {state.status === 'ready' && (
          <>
            {/* Context */}
            <Card className="border-gold/20 bg-gold/5">
              <CardContent className="p-4 space-y-1.5">
                <p className="text-sm font-semibold">
                  {state.share.veteranFirstName} is requesting your help
                </p>
                <p className="text-xs text-muted-foreground">
                  They're filing a VA claim for <strong>{state.share.conditionName}</strong> and need
                  a buddy statement from someone who can speak to their condition.
                </p>
                {state.share.relationshipHint && (
                  <p className="text-xs text-muted-foreground">
                    Suggested relationship: <em>{state.share.relationshipHint}</em>
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Template / Guide */}
            {state.share.templateContent && (
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    Guiding Questions
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {state.share.templateContent}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Your Full Name *</label>
                <input
                  type="text"
                  value={form.buddyName}
                  onChange={(e) => setForm((f) => ({ ...f, buddyName: e.target.value }))}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 min-h-[44px] text-sm text-foreground placeholder:text-muted-foreground/50"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  Your Relationship to the Veteran
                </label>
                <input
                  type="text"
                  value={form.buddyRelationship}
                  onChange={(e) => setForm((f) => ({ ...f, buddyRelationship: e.target.value }))}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 min-h-[44px] text-sm text-foreground placeholder:text-muted-foreground/50"
                  placeholder="e.g. Fellow service member, spouse, coworker"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  Contact Information (phone or email)
                </label>
                <input
                  type="text"
                  value={form.buddyContact}
                  onChange={(e) => setForm((f) => ({ ...f, buddyContact: e.target.value }))}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 min-h-[44px] text-sm text-foreground placeholder:text-muted-foreground/50"
                  placeholder="email@example.com or (555) 123-4567"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  Your Statement *
                </label>
                <p className="text-[11px] text-muted-foreground mb-2">
                  Describe what you witnessed or know about the veteran's condition. Be specific about
                  dates, events, and how the condition affects their daily life.
                </p>
                <textarea
                  value={form.statementContent}
                  onChange={(e) => setForm((f) => ({ ...f, statementContent: e.target.value }))}
                  rows={8}
                  className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none"
                  placeholder="I have known [veteran] since... During our time together, I observed..."
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!form.buddyName.trim() || !form.statementContent.trim()}
                className="w-full py-3 rounded-lg bg-gold text-black font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gold/90 transition-colors"
              >
                Submit Statement
              </button>
            </div>

            {/* Disclaimer */}
            <p className="text-[11px] text-muted-foreground/60 text-center px-4">
              Your statement will only be shared with the requesting veteran. By submitting, you
              affirm that the information provided is true and accurate to the best of your knowledge.
            </p>
          </>
        )}

        {state.status === 'submitting' && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
            <span className="ml-2 text-sm text-muted-foreground">Submitting...</span>
          </div>
        )}

        {/* Footer */}
        <p className="text-[10px] text-muted-foreground/40 text-center">
          Powered by Vet Claim Support
        </p>
      </div>
    </div>
  );
}
