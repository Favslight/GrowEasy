import { HttpError } from './httpError';

/**
 * Raised when an AI response cannot be validated against the CRM schema.
 * Treated as retryable by the RetryService.
 */
export class ExtractionValidationError extends Error {
  constructor(message = 'The AI response did not match the expected schema.') {
    super(message);
    this.name = 'ExtractionValidationError';
    Object.setPrototypeOf(this, ExtractionValidationError.prototype);
  }
}

/**
 * Raised when the AI returns an empty or unusable response.
 * Treated as retryable by the RetryService.
 */
export class EmptyAiResponseError extends Error {
  constructor(message = 'The AI returned an empty response.') {
    super(message);
    this.name = 'EmptyAiResponseError';
    Object.setPrototypeOf(this, EmptyAiResponseError.prototype);
  }
}

/**
 * Raised when the AI service is not configured (e.g. missing API key).
 * Not retryable — surfaces to the client as a configuration error.
 */
export class AiConfigurationError extends HttpError {
  constructor(message = 'The AI service is not configured. Please set OPENAI_API_KEY.') {
    super(503, message);
    this.name = 'AiConfigurationError';
    Object.setPrototypeOf(this, AiConfigurationError.prototype);
  }
}
