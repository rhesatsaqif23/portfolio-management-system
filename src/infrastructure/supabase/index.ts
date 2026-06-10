import { createClient } from '@supabase/supabase-js'
import { env } from '#/env'

const isServer = typeof process !== 'undefined' && process.env?.SUPABASE_URL

export const supabase = isServer
  ? createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : (null as unknown as ReturnType<typeof createClient>)
