import { db } from '#/infrastructure/db'
import { experiencesTable } from '#/infrastructure/db/schema'
import { eq } from 'drizzle-orm'
import type { IExperienceRepository, Experience, ExperienceInsert } from '#/domain/ports'

export const drizzleExperienceRepository: IExperienceRepository = {
  async findAll(): Promise<Experience[]> {
    return db.select().from(experiencesTable).orderBy(experiencesTable.sortOrder)
  },

  async findByType(type: string): Promise<Experience[]> {
    return db.select().from(experiencesTable).where(eq(experiencesTable.type, type)).orderBy(experiencesTable.sortOrder)
  },

  async create(data: ExperienceInsert): Promise<Experience> {
    const [created] = await db.insert(experiencesTable).values(data).returning()
    return created
  },

  async update(id: string, data: Partial<ExperienceInsert>): Promise<Experience> {
    const [updated] = await db.update(experiencesTable).set(data).where(eq(experiencesTable.id, id)).returning()
    return updated
  },

  async delete(id: string): Promise<void> {
    await db.delete(experiencesTable).where(eq(experiencesTable.id, id))
  },
}
