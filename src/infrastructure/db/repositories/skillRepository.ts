import { db } from '#/infrastructure/db'
import { skillsTable } from '#/infrastructure/db/schema'
import { eq } from 'drizzle-orm'
import type { ISkillRepository, Skill, SkillInsert } from '#/domain/ports'

export const drizzleSkillRepository: ISkillRepository = {
  async findAll(): Promise<Skill[]> {
    return db.select().from(skillsTable).orderBy(skillsTable.sortOrder)
  },

  async findByCategory(category: string): Promise<Skill[]> {
    return db.select().from(skillsTable).where(eq(skillsTable.category, category as 'Frontend' | 'Backend' | 'Mobile' | 'Database' | 'DevOps' | 'Cloud & Deployment' | 'Tools' | 'Design')).orderBy(skillsTable.sortOrder)
  },

  async create(data: SkillInsert): Promise<Skill> {
    const [created] = await db.insert(skillsTable).values(data).returning()
    return created
  },

  async update(id: string, data: Partial<SkillInsert>): Promise<Skill> {
    if (Object.keys(data).length === 0) {
      const [existing] = await db.select().from(skillsTable).where(eq(skillsTable.id, id)).limit(1)
      return existing!
    }
    const [updated] = await db.update(skillsTable).set(data).where(eq(skillsTable.id, id)).returning()
    return updated
  },

  async delete(id: string): Promise<void> {
    await db.delete(skillsTable).where(eq(skillsTable.id, id))
  },
}
