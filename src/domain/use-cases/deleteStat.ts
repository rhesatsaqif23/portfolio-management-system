import type { IStatsRepository } from '#/domain/ports'

export async function deleteStatUseCase(repo: IStatsRepository, id: string) {
  return repo.delete(id)
}
