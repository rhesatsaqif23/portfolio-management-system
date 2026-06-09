import type { IAchievementRepository } from '#/domain/ports'

export async function listAchievementsUseCase(repo: IAchievementRepository) {
  return repo.findAll()
}
