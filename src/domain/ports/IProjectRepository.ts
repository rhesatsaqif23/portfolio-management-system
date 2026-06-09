import type { projectsTable, caseStudiesTable } from '#/infrastructure/db/schema'

export type Project = typeof projectsTable.$inferSelect
export type ProjectInsert = typeof projectsTable.$inferInsert
export type CaseStudy = typeof caseStudiesTable.$inferSelect
export type CaseStudyInsert = typeof caseStudiesTable.$inferInsert

export interface IProjectRepository {
  findAll(): Promise<Project[]>
  findById(id: string): Promise<Project | null>
  findBySlug(slug: string): Promise<Project | null>
  create(data: ProjectInsert): Promise<Project>
  update(id: string, data: Partial<ProjectInsert>): Promise<Project>
  delete(id: string): Promise<void>
  getCaseStudy(projectId: string): Promise<CaseStudy | null>
  upsertCaseStudy(projectId: string, data: Partial<CaseStudyInsert>): Promise<CaseStudy>
}
