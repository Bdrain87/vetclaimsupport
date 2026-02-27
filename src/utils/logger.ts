/**
 * Production-safe logger.
 *
 * - `log`, `warn`, `info`, `debug` are suppressed in production builds.
 * - `error` always outputs (runtime errors should remain visible).
 *
 * Usage:  import { logger } from '@/utils/logger';
 *         logger.warn('[sync] something happened');
 */

const isDev = import.meta.env.DEV;

const noop = () => {/* intentionally empty */};

export const logger = {
  log: isDev ? console.log.bind(console) : noop,
  warn: isDev ? console.warn.bind(console) : noop,
  info: isDev ? console.info.bind(console) : noop,
  debug: isDev ? console.debug.bind(console) : noop,
  error: console.error.bind(console),
} as const;
