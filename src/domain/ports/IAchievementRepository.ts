import type { achievementsTable } from '#/infrastructure/db/schema'

export type Achievement = typeof achievementsTable.$inferSelect
export type AchievementInsert = typeof achievementsTable.$inferInsert

export interface IAchievementRepository {
  findAll(): Promise<Achievement[]>
  create(data: AchievementInsert): Promise<Achievement>
  update(id: string, data: Partial<AchievementInsert>): Promise<Achievement>
  delete(id: string): Promise<void>
}
