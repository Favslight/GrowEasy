import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
});

const validateEnv = (): z.infer<typeof envSchema> => {
  const env = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
    FRONTEND_URL: process.env.FRONTEND_URL,
  };

  const result = envSchema.safeParse(env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    result.error.errors.forEach((error: { path: (string | number)[]; message: string }) => {
      console.error(`  - ${error.path.join('.')}: ${error.message}`);
    });
    process.exit(1);
  }

  return result.data;
};

export const env = validateEnv();
