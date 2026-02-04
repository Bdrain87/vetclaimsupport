/**
 * Client-side Rate Limiting
 *
 * Provides rate limiting for AI and other expensive operations.
 * Uses localStorage to persist rate limit data across sessions.
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // Time window in milliseconds
  storageKey: string;
}

interface RateLimitState {
  requests: number[];
  blocked?: {
    until: number;
    reason: string;
  };
}

const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  ai_analysis: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 10 requests per minute
    storageKey: 'rate_limit_ai_analysis',
  },
  ai_daily: {
    maxRequests: 100,
    windowMs: 24 * 60 * 60 * 1000, // 100 requests per day
    storageKey: 'rate_limit_ai_daily',
  },
  general: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 60 requests per minute
    storageKey: 'rate_limit_general',
  },
};

/**
 * Get rate limit state from localStorage
 */
function getState(storageKey: string): RateLimitState {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return { requests: [] };
}

/**
 * Save rate limit state to localStorage
 */
function saveState(storageKey: string, state: RateLimitState): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Clean up old requests outside the time window
 */
function cleanupOldRequests(requests: number[], windowMs: number): number[] {
  const now = Date.now();
  return requests.filter(timestamp => now - timestamp < windowMs);
}

/**
 * Check if an operation is rate limited
 */
export function isRateLimited(configKey: string = 'general'): {
  limited: boolean;
  remaining: number;
  resetIn: number;
  message?: string;
} {
  const config = DEFAULT_CONFIGS[configKey] || DEFAULT_CONFIGS.general;
  const state = getState(config.storageKey);
  const now = Date.now();

  // Check if blocked
  if (state.blocked && state.blocked.until > now) {
    return {
      limited: true,
      remaining: 0,
      resetIn: state.blocked.until - now,
      message: state.blocked.reason,
    };
  }

  // Clean up old requests
  const validRequests = cleanupOldRequests(state.requests, config.windowMs);

  // Calculate remaining
  const remaining = Math.max(0, config.maxRequests - validRequests.length);

  // Calculate reset time
  const oldestRequest = validRequests[0];
  const resetIn = oldestRequest
    ? Math.max(0, config.windowMs - (now - oldestRequest))
    : 0;

  return {
    limited: validRequests.length >= config.maxRequests,
    remaining,
    resetIn,
    message: validRequests.length >= config.maxRequests
      ? `Rate limit exceeded. Please wait ${Math.ceil(resetIn / 1000)} seconds.`
      : undefined,
  };
}

/**
 * Record a request for rate limiting
 */
export function recordRequest(configKey: string = 'general'): void {
  const config = DEFAULT_CONFIGS[configKey] || DEFAULT_CONFIGS.general;
  const state = getState(config.storageKey);
  const now = Date.now();

  // Clean up old requests
  const validRequests = cleanupOldRequests(state.requests, config.windowMs);

  // Add new request
  validRequests.push(now);

  // Save state
  saveState(config.storageKey, { ...state, requests: validRequests });
}

/**
 * Block requests for a period
 */
export function blockRequests(
  configKey: string,
  durationMs: number,
  reason: string
): void {
  const config = DEFAULT_CONFIGS[configKey] || DEFAULT_CONFIGS.general;
  const state = getState(config.storageKey);

  state.blocked = {
    until: Date.now() + durationMs,
    reason,
  };

  saveState(config.storageKey, state);
}

/**
 * Clear rate limit for a config
 */
export function clearRateLimit(configKey: string): void {
  const config = DEFAULT_CONFIGS[configKey] || DEFAULT_CONFIGS.general;
  localStorage.removeItem(config.storageKey);
}

/**
 * Wrapper function that checks rate limit before executing
 */
export async function withRateLimit<T>(
  fn: () => Promise<T>,
  configKey: string = 'general'
): Promise<T> {
  const check = isRateLimited(configKey);

  if (check.limited) {
    throw new RateLimitError(check.message || 'Rate limit exceeded', check.resetIn);
  }

  // Record the request
  recordRequest(configKey);

  return fn();
}

/**
 * Rate limit error class
 */
export class RateLimitError extends Error {
  resetIn: number;

  constructor(message: string, resetIn: number) {
    super(message);
    this.name = 'RateLimitError';
    this.resetIn = resetIn;
  }
}

/**
 * Get formatted time until rate limit resets
 */
export function getResetTimeFormatted(resetIn: number): string {
  if (resetIn < 1000) return 'less than a second';
  if (resetIn < 60000) return `${Math.ceil(resetIn / 1000)} seconds`;
  if (resetIn < 3600000) return `${Math.ceil(resetIn / 60000)} minutes`;
  return `${Math.ceil(resetIn / 3600000)} hours`;
}

/**
 * Hook-friendly rate limit status
 */
export function getRateLimitStatus(configKey: string = 'general'): {
  canRequest: boolean;
  remaining: number;
  resetIn: number;
  resetTimeFormatted: string;
} {
  const status = isRateLimited(configKey);
  return {
    canRequest: !status.limited,
    remaining: status.remaining,
    resetIn: status.resetIn,
    resetTimeFormatted: getResetTimeFormatted(status.resetIn),
  };
}
