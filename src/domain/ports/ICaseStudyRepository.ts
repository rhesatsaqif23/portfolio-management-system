import type { caseStudiesTable } from '#/infrastructure/db/schema'

export type CaseStudy = typeof caseStudiesTable.$inferSelect
export type CaseStudyInsert = typeof caseStudiesTable.$inferInsert

export interface ICaseStudyRepository {
  findAll(): Promise<CaseStudy[]>
  findByProjectId(projectId: string): Promise<CaseStudy | null>
  create(data: CaseStudyInsert): Promise<CaseStudy>
  update(id: string, data: Partial<CaseStudyInsert>): Promise<CaseStudy>
  delete(id: string): Promise<void>
}
