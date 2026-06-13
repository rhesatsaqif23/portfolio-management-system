import type { statsTable } from '#/infrastructure/db/schema'

export type Stat = typeof statsTable.$inferSelect
export type StatInsert = typeof statsTable.$inferInsert

export interface IStatsRepository {
  findAll(): Promise<Stat[]>
  findByKey(key: string): Promise<Stat | null>
  create(data: StatInsert): Promise<Stat>
  update(id: string, data: Partial<StatInsert>): Promise<Stat>
  delete(id: string): Promise<void>
}
