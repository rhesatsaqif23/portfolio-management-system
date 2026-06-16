import { db } from '#/infrastructure/db'
import { statsTable } from '#/infrastructure/db/schema'
import { eq, sql, desc } from 'drizzle-orm'
import type { IStatsRepository, Stat, StatInsert } from '#/domain/ports'

export const drizzleStatsRepository: IStatsRepository = {
  async findAll(): Promise<Stat[]> {
    return db.select().from(statsTable).orderBy(desc(statsTable.createdAt))
  },

  async findByKey(key: string): Promise<Stat | null> {
    const [stat] = await db.select().from(statsTable).where(eq(statsTable.key, key)).limit(1)
    return stat ?? null
  },

  async create(data: StatInsert): Promise<Stat> {
    if (data.sortOrder == null) {
      const [{ nextSort }] = await db.select({ nextSort: sql<number>`coalesce(max(${statsTable.sortOrder}), 0) + 1` }).from(statsTable)
      data = { ...data, sortOrder: nextSort }
    }
    const [created] = await db.insert(statsTable).values(data).returning()
    return created
  },

  async update(id: string, data: Partial<StatInsert>): Promise<Stat> {
    if (Object.keys(data).length === 0) {
      const [existing] = await db.select().from(statsTable).where(eq(statsTable.id, id)).limit(1)
      return existing!
    }
    if (data.sortOrder != null) {
      const [current] = await db.select({ sortOrder: statsTable.sortOrder }).from(statsTable).where(eq(statsTable.id, id)).limit(1)
      if (current && data.sortOrder !== current.sortOrder) {
        await db.transaction(async (tx) => {
          const [conflictingItem] = await tx.select({ id: statsTable.id }).from(statsTable).where(eq(statsTable.sortOrder, data.sortOrder!)).limit(1)
          if (conflictingItem) {
            await tx.update(statsTable).set({ sortOrder: current.sortOrder }).where(eq(statsTable.id, conflictingItem.id))
          }
          await tx.update(statsTable).set(data).where(eq(statsTable.id, id))
        })
        const [updated] = await db.select().from(statsTable).where(eq(statsTable.id, id)).limit(1)
        return updated!
      }
    }
    const [updated] = await db.update(statsTable).set(data).where(eq(statsTable.id, id)).returning()
    return updated
  },

  async delete(id: string): Promise<void> {
    await db.delete(statsTable).where(eq(statsTable.id, id))
  },
}
