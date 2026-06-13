import { db } from '#/infrastructure/db'
import { achievementsTable } from '#/infrastructure/db/schema'
import { eq } from 'drizzle-orm'
import type { IAchievementRepository, Achievement, AchievementInsert } from '#/domain/ports'

export const drizzleAchievementRepository: IAchievementRepository = {
  async findAll(): Promise<Achievement[]> {
    return db.select().from(achievementsTable).orderBy(achievementsTable.sortOrder)
  },

  async create(data: AchievementInsert): Promise<Achievement> {
    const [created] = await db.insert(achievementsTable).values(data).returning()
    return created
  },

  async update(id: string, data: Partial<AchievementInsert>): Promise<Achievement> {
    if (Object.keys(data).length === 0) {
      const [existing] = await db.select().from(achievementsTable).where(eq(achievementsTable.id, id)).limit(1)
      return existing!
    }
    const [updated] = await db.update(achievementsTable).set(data).where(eq(achievementsTable.id, id)).returning()
    return updated
  },

  async delete(id: string): Promise<void> {
    await db.delete(achievementsTable).where(eq(achievementsTable.id, id))
  },
}
