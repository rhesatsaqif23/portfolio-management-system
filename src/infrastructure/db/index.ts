import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema.ts'

const connectionString = (typeof process !== 'undefined' && process.env?.DATABASE_URL) as string | undefined

export const db = drizzle(connectionString!, { schema })
