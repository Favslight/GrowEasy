import OpenAI from 'openai';
import { EmptyAiResponseError, ExtractionValidationError } from '../utils/errors';
import { logger } from '../utils/logger';

export const DEFAULT_MAX_RETRIES = 2;

const isTransientOpenAiError = (error: unknown): boolean => {
  if (
    error instanceof OpenAI.APIConnectionError ||
    error instanceof OpenAI.APIConnectionTimeoutError
  ) {
    return true;
  }

  if (error instanceof OpenAI.APIError) {
    const status = error.status;
    if (typeof status !== 'number') {
      return true;
    }
    return status === 408 || status === 409 || status === 429 || status >= 500;
  }

  return false;
};

const isRetryable = (error: unknown): boolean =>
  error instanceof ExtractionValidationError ||
  error instanceof EmptyAiResponseError ||
  isTransientOpenAiError(error);

export interface RetryOptions {
  maxRetries?: number;
  label?: string;
}

/**
 * Executes an async task, retrying only on validation failures or
 * transient OpenAI errors, up to a bounded number of retries.
 */
const execute = async <T>(task: () => Promise<T>, options: RetryOptions = {}): Promise<T> => {
  const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
  const label = options.label ?? 'batch';
  let attempt = 0;

  for (;;) {
    try {
      return await task();
    } catch (error) {
      if (attempt >= maxRetries || !isRetryable(error)) {
        throw error;
      }

      attempt += 1;
      logger.warn('retry attempt', {
        label,
        attempt,
        maxRetries,
        reason: error instanceof Error ? error.name : 'unknown',
      });
    }
  }
};

export const RetryService = {
  execute,
  isRetryable,
};
