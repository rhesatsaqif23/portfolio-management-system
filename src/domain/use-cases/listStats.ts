import type { IStatsRepository } from '#/domain/ports'

export async function listStatsUseCase(repo: IStatsRepository) {
  return repo.findAll()
}
