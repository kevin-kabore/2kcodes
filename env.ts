import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-side environment variables schema
   */
  server: {
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url().optional(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    
    // NextAuth
    NEXTAUTH_SECRET: z.string().min(32),
    NEXTAUTH_URL: z.string().url(),
    
    // OAuth (optional)
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    
    // Email
    EMAIL_SERVER_HOST: z.string().optional(),
    EMAIL_SERVER_PORT: z.string().optional(),
    EMAIL_SERVER_USER: z.string().optional(),
    EMAIL_SERVER_PASSWORD: z.string().optional(),
    EMAIL_FROM: z.string().email().optional(),
    
    // Redis
    REDIS_URL: z.string().url().optional(),
    
    // Sentry
    SENTRY_DSN: z.string().url().optional(),
    
    // IPFS
    PINATA_API_KEY: z.string().optional(),
    PINATA_SECRET_KEY: z.string().optional(),
  },

  /**
   * Client-side environment variables schema
   * Prefix with NEXT_PUBLIC_
   */
  client: {
    NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
    NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
    NEXT_PUBLIC_ALCHEMY_API_KEY: z.string().optional(),
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: z.string().optional(),
    
    // Feature flags
    NEXT_PUBLIC_ENABLE_WEB3: z
      .string()
      .transform((val) => val === "true")
      .default("false"),
    NEXT_PUBLIC_ENABLE_ANALYTICS: z
      .string()
      .transform((val) => val === "true")
      .default("false"),
  },

  /**
   * Runtime environment variables
   * Don't touch unless you know what you're doing
   */
  runtimeEnv: {
    // Server
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,
    REDIS_URL: process.env.REDIS_URL,
    SENTRY_DSN: process.env.SENTRY_DSN,
    PINATA_API_KEY: process.env.PINATA_API_KEY,
    PINATA_SECRET_KEY: process.env.PINATA_SECRET_KEY,
    
    // Client
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    NEXT_PUBLIC_ENABLE_WEB3: process.env.NEXT_PUBLIC_ENABLE_WEB3,
    NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
  },

  /**
   * Skip validation in certain environments
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Empty string edge case handling
   */
  emptyStringAsUndefined: true,
});