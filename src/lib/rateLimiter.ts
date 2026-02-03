/**
 * Client-side rate limiter for API requests
 * Prevents excessive requests and provides user feedback
 */

interface RateLimitConfig {
  maxRequests: number;  // Maximum requests allowed
  windowMs: number;     // Time window in milliseconds
  key?: string;         // Optional key to track different endpoints
}

interface RateLimitState {
  requests: number[];   // Timestamps of requests
  blocked: boolean;
  blockedUntil: number | null;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60000, // 1 minute
};

// In-memory storage for rate limit states
const rateLimitStates = new Map<string, RateLimitState>();

/**
 * Get or create a rate limit state for a given key
 */
function getState(key: string): RateLimitState {
  if (!rateLimitStates.has(key)) {
    rateLimitStates.set(key, {
      requests: [],
      blocked: false,
      blockedUntil: null,
    });
  }
  return rateLimitStates.get(key)!;
}

/**
 * Clean up old request timestamps outside the window
 */
function cleanOldRequests(state: RateLimitState, windowMs: number): void {
  const now = Date.now();
  state.requests = state.requests.filter(
    (timestamp) => now - timestamp < windowMs
  );
}

/**
 * Check if a request is allowed based on rate limits
 */
export function checkRateLimit(config: Partial<RateLimitConfig> = {}): {
  allowed: boolean;
  remaining: number;
  resetIn: number;
  message?: string;
} {
  const { maxRequests, windowMs, key = 'default' } = { ...DEFAULT_CONFIG, ...config };
  const state = getState(key);
  const now = Date.now();

  // Check if currently blocked
  if (state.blocked && state.blockedUntil) {
    if (now < state.blockedUntil) {
      const resetIn = Math.ceil((state.blockedUntil - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        resetIn,
        message: `Too many requests. Please wait ${resetIn} seconds.`,
      };
    }
    // Block period expired
    state.blocked = false;
    state.blockedUntil = null;
    state.requests = [];
  }

  // Clean old requests
  cleanOldRequests(state, windowMs);

  // Check if under limit
  const remaining = maxRequests - state.requests.length;
  const resetIn = state.requests.length > 0
    ? Math.ceil((windowMs - (now - state.requests[0])) / 1000)
    : Math.ceil(windowMs / 1000);

  if (remaining <= 0) {
    // Block for the remaining window time
    state.blocked = true;
    state.blockedUntil = now + (windowMs - (now - state.requests[0]));
    return {
      allowed: false,
      remaining: 0,
      resetIn,
      message: `Rate limit exceeded. Please wait ${resetIn} seconds.`,
    };
  }

  return {
    allowed: true,
    remaining,
    resetIn,
  };
}

/**
 * Record a request (call after successful rate limit check)
 */
export function recordRequest(key: string = 'default'): void {
  const state = getState(key);
  state.requests.push(Date.now());
}

/**
 * Create a rate-limited wrapper for async functions
 */
export function withRateLimit<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  config: Partial<RateLimitConfig> = {}
): T {
  const key = config.key ?? fn.name ?? 'anonymous';

  return (async (...args: Parameters<T>) => {
    const check = checkRateLimit({ ...config, key });

    if (!check.allowed) {
      throw new RateLimitError(check.message ?? 'Rate limit exceeded', check.resetIn);
    }

    recordRequest(key);
    return fn(...args);
  }) as T;
}

/**
 * Custom error class for rate limit errors
 */
export class RateLimitError extends Error {
  public readonly resetIn: number;
  public readonly isRateLimitError = true;

  constructor(message: string, resetIn: number) {
    super(message);
    this.name = 'RateLimitError';
    this.resetIn = resetIn;
  }
}

/**
 * Check if an error is a rate limit error
 */
export function isRateLimitError(error: unknown): error is RateLimitError {
  return error instanceof RateLimitError ||
    (error !== null &&
     typeof error === 'object' &&
     'isRateLimitError' in error &&
     (error as { isRateLimitError: boolean }).isRateLimitError === true);
}

/**
 * Rate limit configurations for different API endpoints
 */
export const API_RATE_LIMITS = {
  // AI analysis - strict limit
  analyze: {
    maxRequests: 5,
    windowMs: 60000, // 5 requests per minute
    key: 'api:analyze',
  },

  // General API calls
  general: {
    maxRequests: 30,
    windowMs: 60000, // 30 requests per minute
    key: 'api:general',
  },

  // Export operations
  export: {
    maxRequests: 3,
    windowMs: 60000, // 3 exports per minute
    key: 'api:export',
  },
} as const;

/**
 * Reset rate limit state (useful for testing or user actions)
 */
export function resetRateLimit(key: string = 'default'): void {
  rateLimitStates.delete(key);
}

/**
 * Reset all rate limit states
 */
export function resetAllRateLimits(): void {
  rateLimitStates.clear();
}

/**
 * Get current rate limit status for UI display
 */
export function getRateLimitStatus(key: string = 'default'): {
  requestsUsed: number;
  maxRequests: number;
  windowMs: number;
  isBlocked: boolean;
  blockedUntil: number | null;
} {
  const state = getState(key);
  const config = DEFAULT_CONFIG;

  // Clean old requests for accurate count
  cleanOldRequests(state, config.windowMs);

  return {
    requestsUsed: state.requests.length,
    maxRequests: config.maxRequests,
    windowMs: config.windowMs,
    isBlocked: state.blocked,
    blockedUntil: state.blockedUntil,
  };
}
