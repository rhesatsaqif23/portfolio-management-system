import { db } from '#/infrastructure/db'
import { projectsTable, caseStudiesTable } from '#/infrastructure/db/schema'
import { eq, sql, desc } from 'drizzle-orm'
import type { IProjectRepository, Project, ProjectInsert, CaseStudy, CaseStudyInsert } from '#/domain/ports'

export const drizzleProjectRepository: IProjectRepository = {
  async findAll(): Promise<Project[]> {
    return db.select().from(projectsTable).orderBy(desc(projectsTable.createdAt))
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
    if (data.sortOrder == null) {
      const [{ nextSort }] = await db.select({ nextSort: sql<number>`coalesce(max(${projectsTable.sortOrder}), 0) + 1` }).from(projectsTable)
      data = { ...data, sortOrder: nextSort }
    }
    const [created] = await db.insert(projectsTable).values(data).returning()
    return created
  },

  async update(id: string, data: Partial<ProjectInsert>): Promise<Project> {
    if (Object.keys(data).length === 0) {
      const [existing] = await db.select().from(projectsTable).where(eq(projectsTable.id, id)).limit(1)
      return existing!
    }
    if (data.sortOrder != null) {
      const [current] = await db.select({ sortOrder: projectsTable.sortOrder }).from(projectsTable).where(eq(projectsTable.id, id)).limit(1)
      if (current && data.sortOrder !== current.sortOrder) {
        await db.transaction(async (tx) => {
          const [conflictingItem] = await tx.select({ id: projectsTable.id }).from(projectsTable).where(eq(projectsTable.sortOrder, data.sortOrder!)).limit(1)
          if (conflictingItem) {
            await tx.update(projectsTable).set({ sortOrder: current.sortOrder }).where(eq(projectsTable.id, conflictingItem.id))
          }
          await tx.update(projectsTable).set(data).where(eq(projectsTable.id, id))
        })
        const [updated] = await db.select().from(projectsTable).where(eq(projectsTable.id, id)).limit(1)
        return updated!
      }
    }
    const [updated] = await db.update(projectsTable).set(data).where(eq(projectsTable.id, id)).returning()
    return updated
  },

  async delete(id: string): Promise<void> {
    // Delete associated case study first (safety net for DBs without CASCADE)
    await db.delete(caseStudiesTable).where(eq(caseStudiesTable.projectId, id))
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
    if (Object.keys(data).length === 0) return existing
    const [updated] = await db.update(caseStudiesTable).set(data).where(eq(caseStudiesTable.projectId, projectId)).returning()
    return updated
  },
}
