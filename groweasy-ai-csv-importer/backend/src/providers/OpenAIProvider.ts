import { getOpenAIClient, getOpenAIModel } from '../config/openai';
import { crmExtractionJsonSchema } from '../schemas/crm.schema';
import { buildPrompt } from '../prompts/v1/promptBuilder';
import { EmptyAiResponseError, ExtractionValidationError } from '../utils/errors';
import type { AIProvider } from './AIProvider';
import type { ParsedCsvRow } from '../types/ai';

/**
 * OpenAI implementation of AIProvider.
 * Responsibility: compose prompt via PromptBuilder, call OpenAI Structured Outputs, return raw JSON.
 * No validation, no retry logic, no business rules.
 */
const extract = async (batch: ParsedCsvRow[]): Promise<unknown> => {
  const client = getOpenAIClient();
  const model = getOpenAIModel();
  const { system, user } = buildPrompt(batch);

  const completion = await client.chat.completions.create({
    model,
    temperature: 0,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'crm_extraction',
        strict: true,
        schema: crmExtractionJsonSchema,
      },
    },
  });

  const choice = completion.choices[0];

  if (choice?.message?.refusal) {
    throw new EmptyAiResponseError('The AI refused to process this batch.');
  }

  const content = choice?.message?.content;

  if (!content || content.trim().length === 0) {
    throw new EmptyAiResponseError();
  }

  try {
    return JSON.parse(content) as unknown;
  } catch {
    throw new ExtractionValidationError('The AI response was not valid JSON.');
  }
};

export const OpenAIProvider: AIProvider = {
  extract,
};
