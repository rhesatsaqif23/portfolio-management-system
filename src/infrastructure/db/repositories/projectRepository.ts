import { db } from '#/infrastructure/db'
import { projectsTable, caseStudiesTable } from '#/infrastructure/db/schema'
import { eq } from 'drizzle-orm'
import type { IProjectRepository, Project, ProjectInsert, CaseStudy, CaseStudyInsert } from '#/domain/ports'

export const drizzleProjectRepository: IProjectRepository = {
  async findAll(): Promise<Project[]> {
    return db.select().from(projectsTable).orderBy(projectsTable.sortOrder)
  },

  async findById(id: string): Promise<Project | null> {
    const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, id)).limit(1)
    return project ?? null
  },

  async findBySlug(slug: string): Promise<Project | null> {
    const [project] = await db.select().from(projectsTable).where(eq(projectsTable.slug, slug)).limit(1)
    return project ?? null
  },

  async create(data: ProjectInsert): Promise<Project> {
    const [created] = await db.insert(projectsTable).values(data).returning()
    return created
  },

  async update(id: string, data: Partial<ProjectInsert>): Promise<Project> {
    const [updated] = await db.update(projectsTable).set(data).where(eq(projectsTable.id, id)).returning()
    return updated
  },

  async delete(id: string): Promise<void> {
    await db.delete(projectsTable).where(eq(projectsTable.id, id))
  },

  async getCaseStudy(projectId: string): Promise<CaseStudy | null> {
    const [study] = await db.select().from(caseStudiesTable).where(eq(caseStudiesTable.projectId, projectId)).limit(1)
    return study ?? null
  },

  async upsertCaseStudy(projectId: string, data: Partial<CaseStudyInsert>): Promise<CaseStudy> {
    const [existing] = await db.select().from(caseStudiesTable).where(eq(caseStudiesTable.projectId, projectId)).limit(1)
    if (!existing) {
      const [created] = await db.insert(caseStudiesTable).values({ ...data, projectId } as CaseStudyInsert).returning()
      return created
    }
    const [updated] = await db.update(caseStudiesTable).set(data).where(eq(caseStudiesTable.projectId, projectId)).returning()
    return updated
  },
}
