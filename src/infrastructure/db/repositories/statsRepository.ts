import { db } from '#/infrastructure/db'
import { statsTable } from '#/infrastructure/db/schema'
import { eq } from 'drizzle-orm'
import type { IStatsRepository, Stat, StatInsert } from '#/domain/ports'

export const drizzleStatsRepository: IStatsRepository = {
  async findAll(): Promise<Stat[]> {
    return db.select().from(statsTable).orderBy(statsTable.sortOrder)
  },

  async findByKey(key: string): Promise<Stat | null> {
    const [stat] = await db.select().from(statsTable).where(eq(statsTable.key, key)).limit(1)
    return stat ?? null
  },

  async create(data: StatInsert): Promise<Stat> {
    const [created] = await db.insert(statsTable).values(data).returning()
    return created
  },

  async update(id: string, data: Partial<StatInsert>): Promise<Stat> {
    if (Object.keys(data).length === 0) {
      const [existing] = await db.select().from(statsTable).where(eq(statsTable.id, id)).limit(1)
      return existing!
    }
    const [updated] = await db.update(statsTable).set(data).where(eq(statsTable.id, id)).returning()
    return updated
  },

  async delete(id: string): Promise<void> {
    await db.delete(statsTable).where(eq(statsTable.id, id))
  },
}
