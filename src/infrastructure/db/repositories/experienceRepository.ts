import { db } from '#/infrastructure/db'
import { experiencesTable } from '#/infrastructure/db/schema'
import { eq, sql, desc } from 'drizzle-orm'
import type { IExperienceRepository, Experience, ExperienceInsert } from '#/domain/ports'

export const drizzleExperienceRepository: IExperienceRepository = {
  async findAll(): Promise<Experience[]> {
    return db.select().from(experiencesTable).orderBy(desc(experiencesTable.createdAt))
  },

  async create(data: ExperienceInsert): Promise<Experience> {
    if (data.sortOrder == null) {
      const [{ nextSort }] = await db.select({ nextSort: sql<number>`coalesce(max(${experiencesTable.sortOrder}), 0) + 1` }).from(experiencesTable)
      data = { ...data, sortOrder: nextSort }
    }
    const [created] = await db.insert(experiencesTable).values(data).returning()
    return created
  },

  async update(id: string, data: Partial<ExperienceInsert>): Promise<Experience> {
    if (Object.keys(data).length === 0) {
      const [existing] = await db.select().from(experiencesTable).where(eq(experiencesTable.id, id)).limit(1)
      return existing!
    }
    if (data.sortOrder != null) {
      const [current] = await db.select({ sortOrder: experiencesTable.sortOrder }).from(experiencesTable).where(eq(experiencesTable.id, id)).limit(1)
      if (current && data.sortOrder !== current.sortOrder) {
        await db.transaction(async (tx) => {
          const [conflictingItem] = await tx.select({ id: experiencesTable.id }).from(experiencesTable).where(eq(experiencesTable.sortOrder, data.sortOrder!)).limit(1)
          if (conflictingItem) {
            await tx.update(experiencesTable).set({ sortOrder: current.sortOrder }).where(eq(experiencesTable.id, conflictingItem.id))
          }
          await tx.update(experiencesTable).set(data).where(eq(experiencesTable.id, id))
        })
        const [updated] = await db.select().from(experiencesTable).where(eq(experiencesTable.id, id)).limit(1)
        return updated!
      }
    }
    const [updated] = await db.update(experiencesTable).set(data).where(eq(experiencesTable.id, id)).returning()
    return updated
  },

  async delete(id: string): Promise<void> {
    await db.delete(experiencesTable).where(eq(experiencesTable.id, id))
  },
}
