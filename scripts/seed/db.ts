import { config } from 'dotenv'
config({ path: ['.env.local', '.env'] })

import pg from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '../../src/infrastructure/db/schema'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export const db = drizzle(pool, { schema })
export { pool }
