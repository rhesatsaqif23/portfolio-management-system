import type { IAchievementRepository, AchievementInsert } from '#/domain/ports'

export async function createAchievementUseCase(repo: IAchievementRepository, data: AchievementInsert) {
  return repo.create(data)
}
