import { db } from '#/infrastructure/db'
import { skillsTable } from '#/infrastructure/db/schema'
import { eq, sql, desc } from 'drizzle-orm'
import type { ISkillRepository, Skill, SkillInsert } from '#/domain/ports'

export const drizzleSkillRepository: ISkillRepository = {
  async findAll(): Promise<Skill[]> {
    return db.select().from(skillsTable).orderBy(desc(skillsTable.createdAt))
  },

  async findByCategory(category: string): Promise<Skill[]> {
    return db.select().from(skillsTable).where(eq(skillsTable.category, category as 'Frontend' | 'Backend' | 'Mobile' | 'Database' | 'DevOps' | 'Cloud & Deployment' | 'Tools' | 'Design')).orderBy(skillsTable.sortOrder)
  },

  async create(data: SkillInsert): Promise<Skill> {
    if (data.sortOrder == null) {
      const [{ nextSort }] = await db.select({ nextSort: sql<number>`coalesce(max(${skillsTable.sortOrder}), 0) + 1` }).from(skillsTable)
      data = { ...data, sortOrder: nextSort }
    }
    const [created] = await db.insert(skillsTable).values(data).returning()
    return created
  },

  async update(id: string, data: Partial<SkillInsert>): Promise<Skill> {
    if (Object.keys(data).length === 0) {
      const [existing] = await db.select().from(skillsTable).where(eq(skillsTable.id, id)).limit(1)
      return existing!
    }
    if (data.sortOrder != null) {
      const [current] = await db.select({ sortOrder: skillsTable.sortOrder }).from(skillsTable).where(eq(skillsTable.id, id)).limit(1)
      if (current && data.sortOrder !== current.sortOrder) {
        await db.transaction(async (tx) => {
          const [conflictingItem] = await tx.select({ id: skillsTable.id }).from(skillsTable).where(eq(skillsTable.sortOrder, data.sortOrder!)).limit(1)
          if (conflictingItem) {
            await tx.update(skillsTable).set({ sortOrder: current.sortOrder }).where(eq(skillsTable.id, conflictingItem.id))
          }
          await tx.update(skillsTable).set(data).where(eq(skillsTable.id, id))
        })
        const [updated] = await db.select().from(skillsTable).where(eq(skillsTable.id, id)).limit(1)
        return updated!
      }
    }
    const [updated] = await db.update(skillsTable).set(data).where(eq(skillsTable.id, id)).returning()
    return updated
  },

  async delete(id: string): Promise<void> {
    await db.delete(skillsTable).where(eq(skillsTable.id, id))
  },
}
