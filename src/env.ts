import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

const isServer = typeof process !== 'undefined' && process.env?.CLERK_SECRET_KEY

export const env = createEnv({
  server: {
    CLERK_SECRET_KEY: isServer
      ? z.string().min(1, 'CLERK_SECRET_KEY is required')
      : z.string().optional(),
  },

  clientPrefix: 'VITE_',

  client: {
    VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1, 'VITE_CLERK_PUBLISHABLE_KEY is required'),
    VITE_APP_TITLE: z.string().min(1).optional(),
  },

  runtimeEnv: {
    CLERK_SECRET_KEY: isServer ? process.env.CLERK_SECRET_KEY : undefined,
    VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
    VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
  },

  emptyStringAsUndefined: true,
})
