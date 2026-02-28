import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { signInWithApple, signInWithGoogle } from '@/services/auth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { impactLight, impactMedium } from '@/lib/haptics';

interface WelcomeScreenProps {
  onSkip: () => void;
}

const FEATURES = [
  '800+ conditions & VA form guides',
  'Track symptoms, sleep & medications',
  'Build personal statements & buddy letters',
  'Export your complete claim packet',
] as const;

export function WelcomeScreen({ onSkip }: WelcomeScreenProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const prefersReducedMotion = useReducedMotion();
  const [loading, setLoading] = useState<'apple' | 'google' | null>(null);

  const fast = prefersReducedMotion ? 0.15 : 0.35;
  const delay = (n: number) => (prefersReducedMotion ? 0 : n);

  // Auto-dismiss when auth succeeds
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setLoading(null);
        onSkip();
      }
    });
    return () => subscription.unsubscribe();
  }, [onSkip]);

  // Safety timeout: if OAuth loading stays active for 10s, clear it
  useEffect(() => {
    if (!loading) return;
    const timeout = setTimeout(() => {
      setLoading(null);
      toast({
        title: 'Sign-in timed out',
        description: 'OAuth didn\u2019t complete. Please try again.',
        variant: 'destructive',
      });
    }, 10000);
    return () => clearTimeout(timeout);
  }, [loading, toast]);

  const handleApple = async () => {
    impactLight();
    setLoading('apple');
    try {
      await signInWithApple();
    } catch (err) {
      setLoading(null);
      toast({
        title: 'Apple sign-in failed',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleGoogle = async () => {
    impactLight();
    setLoading('google');
    try {
      await signInWithGoogle();
    } catch (err) {
      setLoading(null);
      toast({
        title: 'Google sign-in failed',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEmail = () => {
    impactMedium();
    navigate('/auth');
    onSkip();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9998] flex flex-col bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: prefersReducedMotion ? 0.15 : 0.3, ease: [0.22, 1, 0.36, 1] },
      }}
      transition={{ duration: fast }}
    >
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 overflow-y-auto"
        style={{
          paddingTop: 'calc(2rem + env(safe-area-inset-top, 0px))',
          paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {/* Brand — icon + name, clean */}
        <motion.div
          className="flex flex-col items-center mb-10"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: fast, delay: delay(0.1) }}
        >
          <img
            src="/app-icon.png"
            alt="Vet Claim Support"
            width={56}
            height={56}
            style={{ borderRadius: 14, display: 'block' }}
          />
          <h1
            className="text-lg font-semibold tracking-[-0.01em] mt-3 mb-0"
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            Vet Claim Support
          </h1>
        </motion.div>

        {/* Value proposition */}
        <motion.div
          className="w-full max-w-sm mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: fast, delay: delay(0.2) }}
        >
          <h2
            className="text-[26px] font-semibold text-white text-center mb-6 leading-tight"
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
            }}
          >
            Your VA claim, organized.
          </h2>

          <div className="space-y-2.5">
            {FEATURES.map((label, i) => (
              <motion.div
                key={label}
                className="flex items-center gap-3 px-3.5 py-2.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: fast, delay: delay(0.3 + i * 0.06) }}
              >
                <div
                  className="rounded-full flex-shrink-0"
                  style={{
                    width: 6,
                    height: 6,
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  }}
                />
                <span
                  className="text-sm"
                  style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                >
                  {label}
                </span>
              </motion.div>
            ))}
          </div>

          <p
            className="text-center text-xs mt-5"
            style={{ color: 'rgba(255, 255, 255, 0.3)' }}
          >
            $9.99 one-time — No subscription
          </p>
        </motion.div>

        {/* Auth buttons */}
        <motion.div
          className="w-full max-w-sm space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: fast, delay: delay(0.55) }}
        >
          {/* Apple */}
          <button
            onClick={handleApple}
            disabled={!!loading}
            className="w-full h-12 flex items-center justify-center gap-3 rounded-xl text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              border: 'none',
            }}
          >
            {loading === 'apple' ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="black">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
            )}
            Continue with Apple
          </button>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={!!loading}
            className="w-full h-12 flex items-center justify-center gap-3 rounded-xl text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'transparent',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            {loading === 'google' ? (
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

          {/* Email */}
          <button
            onClick={handleEmail}
            disabled={!!loading}
            className="w-full h-12 flex items-center justify-center gap-3 rounded-xl text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'transparent',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            Sign in with Email
          </button>
        </motion.div>

        {/* Skip */}
        <motion.button
          onClick={onSkip}
          className="mt-8 bg-transparent border-none cursor-pointer text-sm"
          style={{ color: 'rgba(255, 255, 255, 0.3)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: fast, delay: delay(0.7) }}
        >
          Explore free tools — no account needed
        </motion.button>
      </div>
    </motion.div>
  );
}

export default WelcomeScreen;
