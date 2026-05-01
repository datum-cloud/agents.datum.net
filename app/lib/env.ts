import { z } from 'zod';

const ServerEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z
    .string()
    .default('3000')
    .transform((v) => Number.parseInt(v, 10)),
});

const PublicEnvSchema = z.object({
  VITE_APP_URL: z.string().url().default('https://agents.datum.net'),
  VITE_MAIN_SITE_URL: z.string().url().default('https://datum.net'),
  VITE_PORTAL_URL: z.string().url().default('https://cloud.datum.net'),
  VITE_DOCS_URL: z.string().url().default('https://docs.datum.net'),
  VITE_GITHUB_ORG_URL: z.string().url().default('https://github.com/datum-cloud'),
  VITE_DISCORD_URL: z.string().url().default('https://link.datum.net/discord'),
  VITE_YOUTUBE_URL: z.string().url().default('https://www.youtube.com/@datum-cloud'),
  VITE_LINKEDIN_URL: z.string().url().default('https://www.linkedin.com/company/datum-cloud'),
});

export type ServerEnv = z.infer<typeof ServerEnvSchema>;
export type PublicEnv = z.infer<typeof PublicEnvSchema>;

/**
 * Parse and validate server-only env vars. Throws at startup on misconfig.
 * Call once on the server (e.g. in a loader / server entry).
 */
export function getServerEnv(): ServerEnv {
  return ServerEnvSchema.parse(process.env);
}

/**
 * Parse and validate publicly-exposed env vars (VITE_*).
 * Safe to call on the client.
 */
export function getPublicEnv(): PublicEnv {
  return PublicEnvSchema.parse(import.meta.env);
}
