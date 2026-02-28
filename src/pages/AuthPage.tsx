import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithApple, resetPassword } from '@/services/auth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { PageContainer } from '@/components/PageContainer';

const GOLD_GRADIENT =
  'linear-gradient(90deg, #A68B3C 0%, #C5A55A 25%, #D9BE6C 50%, #C5A55A 75%, #A68B3C 100%)';

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
      // Don't clear oauthLoading here — the onAuthStateChange listener
      // or the safety timeout will handle it when OAuth completes/fails.
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
    'w-full h-12 pl-11 pr-4 bg-white/[0.07] border border-white/[0.12] rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[rgba(197,165,90,0.4)] focus:border-[rgba(197,165,90,0.5)] transition-all';

  return (
    <PageContainer noPadding className="min-h-screen flex flex-col bg-black">
      <div className="p-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-sm"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <img
              src="/app-icon.png"
              alt="Vet Claim Support"
              width={56}
              height={56}
              style={{ borderRadius: 14, margin: '0 auto 16px' }}
            />
            <h1 className="text-2xl font-semibold text-white mb-2">
              {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>
              {mode === 'signin'
                ? 'Sign in to access your claim data'
                : 'Start preparing your VA claim today'}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={!!oauthLoading || loading}
              className="w-full h-12 flex items-center justify-center gap-3 rounded-xl text-sm font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#ffffff',
                color: '#1f1f1f',
                border: 'none',
              }}
            >
              {oauthLoading === 'google' ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              Continue with Google
            </button>

            <button
              onClick={handleAppleSignIn}
              disabled={!!oauthLoading || loading}
              className="w-full h-12 flex items-center justify-center gap-3 rounded-xl text-sm font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#000000',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              {oauthLoading === 'apple' ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              )}
              Continue with Apple
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <span className="text-xs" style={{ color: '#6B7280' }}>or</span>
            <div className="h-px flex-1" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-3 mb-6">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                aria-label="Email address"
                className={inputClass}
                autoComplete="email"
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
                className={`${inputClass} pr-11`}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-white/30 hover:text-white/60 cursor-pointer transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                  className={inputClass}
                  autoComplete="new-password"
                />
              </div>
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
                  className="bg-transparent border-none cursor-pointer text-xs transition-colors text-gold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !!oauthLoading}
              className="w-full h-12 rounded-xl text-sm font-semibold text-black transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none"
              style={{ background: GOLD_GRADIENT }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mx-auto" />
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm" style={{ color: '#9CA3AF' }}>
            {mode === 'signin' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => { setMode('signup'); setConfirmPassword(''); }}
                  className="bg-transparent border-none cursor-pointer font-medium transition-colors text-gold"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="bg-transparent border-none cursor-pointer font-medium transition-colors text-gold"
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
