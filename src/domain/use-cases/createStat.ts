import type { IStatsRepository, StatInsert } from '#/domain/ports'

export async function createStatUseCase(repo: IStatsRepository, data: StatInsert) {
  return repo.create(data)
}
