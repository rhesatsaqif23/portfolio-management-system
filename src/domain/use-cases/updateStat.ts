import type { IStatsRepository, StatInsert } from '#/domain/ports'

export async function updateStatUseCase(repo: IStatsRepository, id: string, data: Partial<StatInsert>) {
  return repo.update(id, data)
}
