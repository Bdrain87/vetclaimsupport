import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithApple, resetPassword } from '@/services/auth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { PageContainer } from '@/components/PageContainer';

/** Only allow relative paths starting with / (no protocol-relative // or external URLs). */
function getSafeRedirect(): string {
  const redirect = sessionStorage.getItem('post_login_redirect');
  sessionStorage.removeItem('post_login_redirect');
  if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
    return redirect;
  }
  return '/app';
}

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate(getSafeRedirect(), { replace: true });
      }
    }).catch(() => { /* session check failed — stay on login */ });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setOauthLoading(null);
        navigate(getSafeRedirect(), { replace: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Safety timeout: if OAuth loading stays active for 30s, clear it
  useEffect(() => {
    if (!oauthLoading) return;
    const timeout = setTimeout(() => {
      setOauthLoading(null);
      toast({
        title: 'Sign-in timed out',
        description: 'OAuth didn\u2019t complete. Please try again.',
        variant: 'destructive',
      });
    }, 30000);
    return () => clearTimeout(timeout);
  }, [oauthLoading, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    if (mode === 'signup') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password);
        setSuccessMsg('Check your email to confirm your account, then sign in.');
        setMode('signin');
      } else {
        await signInWithEmail(email, password);
        navigate(getSafeRedirect(), { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'apple') => {
    setError('');
    setOauthLoading(provider);
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithApple();
      }
    } catch (err) {
      setOauthLoading(null);
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  const inputClass =
    'w-full h-12 pl-11 pr-4 bg-white/[0.09] border border-white/[0.14] rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[rgba(240,192,0,0.4)] focus:border-gold/50 transition-all';

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <PageContainer className="flex-1 flex flex-col justify-center py-8">
        <div className="w-full max-w-sm mx-auto space-y-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="text-center space-y-4">
            <img
              src="/app-icon.png"
              alt="Vet Claim Support"
              className="w-16 h-16 mx-auto rounded-2xl shadow-lg shadow-[var(--gold-glow)]"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </h1>
              <p className="text-white/50 text-sm mt-1">
                {mode === 'signin'
                  ? 'Sign in to access premium features'
                  : 'Create an account to get started'}
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                aria-label="Email address"
                autoComplete="email"
                className={inputClass}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                aria-label="Password"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {mode === 'signup' && (
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  aria-label="Confirm password"
                  autoComplete="new-password"
                  className={inputClass}
                />
              </div>
            )}

            {mode === 'signin' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={async () => {
                    if (!email.trim()) {
                      setError('Enter your email address, then tap Forgot Password.');
                      return;
                    }
                    setError('');
                    setLoading(true);
                    try {
                      await resetPassword(email);
                      setSuccessMsg('Password reset email sent. Check your inbox.');
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Something went wrong.');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="text-xs text-[var(--gold-md)] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl text-[#000000] text-sm font-bold transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'var(--gold-gradient)' }}
            >
              {loading
                ? 'Please wait...'
                : mode === 'signin'
                  ? 'Sign In'
                  : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleOAuth('google')}
              disabled={loading || !!oauthLoading}
              className="w-full h-12 rounded-xl bg-white/[0.09] border border-white/[0.14] text-white text-sm font-medium flex items-center justify-center gap-3 hover:bg-white/[0.14] disabled:opacity-50 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => handleOAuth('apple')}
              disabled={loading || !!oauthLoading}
              className="w-full h-12 rounded-xl bg-white/[0.09] border border-white/[0.14] text-white text-sm font-medium flex items-center justify-center gap-3 hover:bg-white/[0.14] disabled:opacity-50 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-2.14 4.39-3.74 4.25z" />
              </svg>
              Continue with Apple
            </button>
          </div>

          <div className="text-center">
            {mode === 'signin' ? (
              <p className="text-white/40 text-sm">
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => { setMode('signup'); setError(''); setSuccessMsg(''); }}
                  className="text-[var(--gold-md)] hover:underline font-medium"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-white/40 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => { setMode('signin'); setError(''); setSuccessMsg(''); }}
                  className="text-[var(--gold-md)] hover:underline font-medium"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

          <p className="text-center text-white/20 text-xs">
            By continuing, you agree to our{' '}
            <Link to="/settings/terms" className="underline hover:text-white/40">Terms</Link>{' '}
            and{' '}
            <Link to="/settings/privacy" className="underline hover:text-white/40">Privacy Policy</Link>.
          </p>
        </div>
      </PageContainer>
    </div>
  );
}
