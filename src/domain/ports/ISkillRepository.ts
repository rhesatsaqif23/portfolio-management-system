import type { skillsTable } from '#/infrastructure/db/schema'

export type Skill = typeof skillsTable.$inferSelect
export type SkillInsert = typeof skillsTable.$inferInsert

export interface ISkillRepository {
  findAll(): Promise<Skill[]>
  findByCategory(category: string): Promise<Skill[]>
  create(data: SkillInsert): Promise<Skill>
  update(id: string, data: Partial<SkillInsert>): Promise<Skill>
  delete(id: string): Promise<void>
}
