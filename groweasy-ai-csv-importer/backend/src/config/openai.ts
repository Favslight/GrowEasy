import OpenAI from 'openai';
import { env } from './env';
import { AiConfigurationError } from '../utils/errors';

let client: OpenAI | null = null;

const assertApiKeyConfigured = (): void => {
  if (!env.OPENAI_API_KEY || env.OPENAI_API_KEY.trim().length === 0) {
    throw new AiConfigurationError();
  }
};

const assertModelConfigured = (): void => {
  if (!env.OPENAI_MODEL || env.OPENAI_MODEL.trim().length === 0) {
    throw new AiConfigurationError(
      'The AI model is not configured. Please set OPENAI_MODEL.'
    );
  }
};

/**
 * Returns a singleton OpenAI client.
 * Fails fast when credentials are missing — never hardcodes API keys.
 */
export const getOpenAIClient = (): OpenAI => {
  assertApiKeyConfigured();
  assertModelConfigured();

  if (!client) {
    client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }

  return client;
};

/**
 * Returns the configured model name from environment variables.
 * Never hardcode model names in provider or service code.
 */
export const getOpenAIModel = (): string => {
  assertApiKeyConfigured();
  assertModelConfigured();
  return env.OPENAI_MODEL;
};
