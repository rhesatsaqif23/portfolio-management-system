import type { experiencesTable } from '#/infrastructure/db/schema'

export type Experience = typeof experiencesTable.$inferSelect
export type ExperienceInsert = typeof experiencesTable.$inferInsert

export interface IExperienceRepository {
  findAll(): Promise<Experience[]>
  create(data: ExperienceInsert): Promise<Experience>
  update(id: string, data: Partial<ExperienceInsert>): Promise<Experience>
  delete(id: string): Promise<void>
}
