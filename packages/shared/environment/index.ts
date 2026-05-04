import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

/**
 * Backend environment variables validated with zod
 */

export const env = createEnv({
  server: {
    NODE_ENV: z.union([
      z.literal('development'),
      z.literal('production'),
      z.literal('staging'),
      z.literal('test'),
    ]).default('development'),
    PORT: z.coerce.number().default(3001),
    DATABASE_URL: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export type BackendEnv = typeof env;
