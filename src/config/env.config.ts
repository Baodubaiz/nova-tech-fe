import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:8080/api'),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default('http://localhost:8080/api/v1'),
  NEXT_PUBLIC_APP_NAME: z.string().default('NovaTech'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  // Add other server/client environment variables here
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Validate environment variables
const _env = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NODE_ENV: process.env.NODE_ENV,
});

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment variables');
}

export const env = {
  ..._env.data,
  apiBaseUrl: _env.data.NEXT_PUBLIC_API_BASE_URL,
  appName: _env.data.NEXT_PUBLIC_APP_NAME,
};
