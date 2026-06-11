import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

const isServer = typeof process !== 'undefined' && process.env?.CLERK_SECRET_KEY

export const env = createEnv({
  server: {
    CLERK_SECRET_KEY: isServer
      ? z.string().min(1, 'CLERK_SECRET_KEY is required')
      : z.string().optional(),
    DATABASE_URL: isServer
      ? z.string().url('DATABASE_URL must be a valid connection string')
      : z.string().optional(),
    SUPABASE_URL: isServer
      ? z.string().url()
      : z.string().optional(),
    SUPABASE_SERVICE_KEY: isServer
      ? z.string().min(1)
      : z.string().optional(),
  },

  clientPrefix: 'VITE_',

  client: {
    VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1, 'VITE_CLERK_PUBLISHABLE_KEY is required'),
    VITE_SUPABASE_URL: z.string().url().optional(),
    VITE_SUPABASE_ANON_KEY: z.string().min(1).optional(),
    VITE_APP_TITLE: z.string().min(1).optional(),
  },

  runtimeEnv: {
    CLERK_SECRET_KEY: isServer ? process.env.CLERK_SECRET_KEY : undefined,
    DATABASE_URL: isServer ? process.env.DATABASE_URL : undefined,
    SUPABASE_URL: isServer ? process.env.SUPABASE_URL : undefined,
    SUPABASE_SERVICE_KEY: isServer ? process.env.SUPABASE_SERVICE_KEY : undefined,
    VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
  },

  emptyStringAsUndefined: true,
})
