import { db } from '#/infrastructure/db'
import { caseStudiesTable } from '#/infrastructure/db/schema'
import { eq } from 'drizzle-orm'
import type { ICaseStudyRepository, CaseStudy, CaseStudyInsert } from '#/domain/ports'

export const drizzleCaseStudyRepository: ICaseStudyRepository = {
  async findAll(): Promise<CaseStudy[]> {
    return db.select().from(caseStudiesTable).orderBy(caseStudiesTable.createdAt)
  },

  async findByProjectId(projectId: string): Promise<CaseStudy | null> {
    const [study] = await db.select().from(caseStudiesTable).where(eq(caseStudiesTable.projectId, projectId)).limit(1)
    return study ?? null
  },

  async create(data: CaseStudyInsert): Promise<CaseStudy> {
    const [created] = await db.insert(caseStudiesTable).values(data).returning()
    return created
  },

  async update(id: string, data: Partial<CaseStudyInsert>): Promise<CaseStudy> {
    const [updated] = await db.update(caseStudiesTable).set(data).where(eq(caseStudiesTable.id, id)).returning()
    return updated
  },

  async delete(id: string): Promise<void> {
    await db.delete(caseStudiesTable).where(eq(caseStudiesTable.id, id))
  },
}
