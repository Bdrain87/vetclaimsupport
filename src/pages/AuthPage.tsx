import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
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

export default function AuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const prefersReducedMotion = useReducedMotion();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null);

  // Listen for auth state changes — this is what detects OAuth completion
  // after the deep-link callback sets the session.
  useEffect(() => {
    // Check existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate(getSafeRedirect(), { replace: true });
      }
    }).catch(() => { /* session check failed — stay on auth */ });

    // Subscribe to auth changes (catches OAuth deep-link completions)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setOauthLoading(null);
        navigate(getSafeRedirect(), { replace: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Safety timeout: if OAuth loading stays active for 10s, clear it
  useEffect(() => {
    if (!oauthLoading) return;
    const timeout = setTimeout(() => {
      setOauthLoading(null);
      toast({
        title: 'Sign-in timed out',
        description: 'OAuth didn\u2019t complete. Please try again.',
        variant: 'destructive',
      });
    }, 10000);
    return () => clearTimeout(timeout);
  }, [oauthLoading, toast]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast({ title: 'Missing fields', description: 'Please enter your email and password.', variant: 'destructive' });
      return;
    }

    if (mode === 'signup') {
      if (password.length < 6) {
        toast({ title: 'Weak password', description: 'Password must be at least 6 characters.', variant: 'destructive' });
        return;
      }
      if (password !== confirmPassword) {
        toast({ title: 'Passwords don\'t match', description: 'Please make sure your passwords match.', variant: 'destructive' });
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
        navigate(getSafeRedirect(), { replace: true });
      } else {
        const data = await signUpWithEmail(email, password);
        if (data.user && !data.session) {
          toast({ title: 'Check your email', description: 'We sent you a confirmation link. Please verify your email to continue.' });
          setMode('signin');
        } else {
          navigate(getSafeRedirect(), { replace: true });
        }
      }
    } catch (err) {
      toast({
        title: mode === 'signin' ? 'Sign in failed' : 'Sign up failed',
        description: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setOauthLoading('google');
    try {
      await signInWithGoogle();
    } catch (err) {
      setOauthLoading(null);
      toast({
        title: 'Google sign-in failed',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAppleSignIn = async () => {
    setOauthLoading('apple');
    try {
      await signInWithApple();
    } catch (err) {
      setOauthLoading(null);
      toast({
        title: 'Apple sign-in failed',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const inputClass =
    'w-full h-12 px-4 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all';

  const anyLoading = loading || !!oauthLoading;

  return (
    <PageContainer noPadding className="min-h-screen flex flex-col bg-black">
      <div className="p-4" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' }}>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-sm"
          style={{ color: 'rgba(255, 255, 255, 0.4)' }}
        >
          <ArrowLeft size={15} />
          Back
        </button>
      </div>

      <div
        className="flex-1 flex items-center justify-center px-6"
        style={{ paddingBottom: 'calc(2rem + var(--keyboard-height, 0px) + env(safe-area-inset-bottom, 0px))' }}
      >
        <motion.div
          className="w-full max-w-sm"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className="text-2xl font-semibold mb-1.5"
              style={{ color: 'rgba(255, 255, 255, 0.95)' }}
            >
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
              {mode === 'signin'
                ? 'Sign in to access your claim data'
                : 'Start preparing your VA claim today'}
            </p>
          </div>

          {/* OAuth */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleAppleSignIn}
              disabled={anyLoading}
              className="w-full h-12 flex items-center justify-center gap-3 rounded-xl text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#ffffff',
                color: '#000000',
                border: 'none',
              }}
            >
              {oauthLoading === 'apple' ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="black">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              )}
              Continue with Apple
            </button>

            <button
              onClick={handleGoogleSignIn}
              disabled={anyLoading}
              className="w-full h-12 flex items-center justify-center gap-3 rounded-xl text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              {oauthLoading === 'google' ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
            <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.25)' }}>or</span>
            <div className="h-px flex-1" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailAuth} className="space-y-3 mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              aria-label="Email address"
              className={inputClass}
              autoComplete="email"
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                aria-label="Password"
                className={`${inputClass} pr-11`}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer transition-colors"
                style={{ color: 'rgba(255, 255, 255, 0.25)' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {mode === 'signup' && (
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                aria-label="Confirm password"
                className={inputClass}
                autoComplete="new-password"
              />
            )}

            {mode === 'signin' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={async () => {
                    if (!email.trim()) {
                      toast({ title: 'Enter your email', description: 'Type your email address, then tap Forgot Password.', variant: 'destructive' });
                      return;
                    }
                    setLoading(true);
                    try {
                      await resetPassword(email);
                      toast({ title: 'Check your email', description: 'Password reset link sent to your inbox.' });
                    } catch (err) {
                      toast({ title: 'Reset failed', description: err instanceof Error ? err.message : 'Please try again.', variant: 'destructive' });
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="bg-transparent border-none cursor-pointer text-xs transition-colors hover:underline"
                  style={{ color: 'rgba(255, 255, 255, 0.35)' }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={anyLoading}
              className="w-full h-12 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none transition-colors"
              style={{
                backgroundColor: '#ffffff',
                color: '#000000',
              }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto" />
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
            {mode === 'signin' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => { setMode('signup'); setConfirmPassword(''); }}
                  className="bg-transparent border-none cursor-pointer font-medium transition-colors"
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="bg-transparent border-none cursor-pointer font-medium transition-colors"
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  Sign In
                </button>
              </>
            )}
          </p>
        </motion.div>
      </div>
    </PageContainer>
  );
}
