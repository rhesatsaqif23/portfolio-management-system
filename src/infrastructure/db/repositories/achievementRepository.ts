import { db } from '#/infrastructure/db'
import { achievementsTable } from '#/infrastructure/db/schema'
import { eq, sql, desc } from 'drizzle-orm'
import type { IAchievementRepository, Achievement, AchievementInsert } from '#/domain/ports'

export const drizzleAchievementRepository: IAchievementRepository = {
  async findAll(): Promise<Achievement[]> {
    return db.select().from(achievementsTable).orderBy(desc(achievementsTable.createdAt))
  },

  async create(data: AchievementInsert): Promise<Achievement> {
    if (data.sortOrder == null) {
      const [{ nextSort }] = await db.select({ nextSort: sql<number>`coalesce(max(${achievementsTable.sortOrder}), 0) + 1` }).from(achievementsTable)
      data = { ...data, sortOrder: nextSort }
    }
    const [created] = await db.insert(achievementsTable).values(data).returning()
    return created
  },

  async update(id: string, data: Partial<AchievementInsert>): Promise<Achievement> {
    if (Object.keys(data).length === 0) {
      const [existing] = await db.select().from(achievementsTable).where(eq(achievementsTable.id, id)).limit(1)
      return existing!
    }
    if (data.sortOrder != null) {
      const [current] = await db.select({ sortOrder: achievementsTable.sortOrder }).from(achievementsTable).where(eq(achievementsTable.id, id)).limit(1)
      if (current && data.sortOrder !== current.sortOrder) {
        await db.transaction(async (tx) => {
          const [conflictingItem] = await tx.select({ id: achievementsTable.id }).from(achievementsTable).where(eq(achievementsTable.sortOrder, data.sortOrder!)).limit(1)
          if (conflictingItem) {
            await tx.update(achievementsTable).set({ sortOrder: current.sortOrder }).where(eq(achievementsTable.id, conflictingItem.id))
          }
          await tx.update(achievementsTable).set(data).where(eq(achievementsTable.id, id))
        })
        const [updated] = await db.select().from(achievementsTable).where(eq(achievementsTable.id, id)).limit(1)
        return updated!
      }
    }
    const [updated] = await db.update(achievementsTable).set(data).where(eq(achievementsTable.id, id)).returning()
    return updated
  },

  async delete(id: string): Promise<void> {
    await db.delete(achievementsTable).where(eq(achievementsTable.id, id))
  },
}
