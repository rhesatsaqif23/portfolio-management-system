import { db } from '#/infrastructure/db'
import { statsTable } from '#/infrastructure/db/schema'
import { eq } from 'drizzle-orm'
import type { IStatsRepository, Stat, StatInsert } from '#/domain/ports'

export const drizzleStatsRepository: IStatsRepository = {
  async findAll(): Promise<Stat[]> {
    return db.select().from(statsTable).orderBy(statsTable.sortOrder)
  },

  async create(data: StatInsert): Promise<Stat> {
    const [created] = await db.insert(statsTable).values(data).returning()
    return created
  },

  async update(id: string, data: Partial<StatInsert>): Promise<Stat> {
    const [updated] = await db.update(statsTable).set(data).where(eq(statsTable.id, id)).returning()
    return updated
  },

  async delete(id: string): Promise<void> {
    await db.delete(statsTable).where(eq(statsTable.id, id))
  },
}
