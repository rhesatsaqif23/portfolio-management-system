import type { IAchievementRepository } from '#/domain/ports'

export async function deleteAchievementUseCase(repo: IAchievementRepository, id: string) {
  return repo.delete(id)
}
