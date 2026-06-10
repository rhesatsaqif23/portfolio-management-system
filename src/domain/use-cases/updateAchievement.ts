import type { IAchievementRepository, AchievementInsert } from '#/domain/ports'

export async function updateAchievementUseCase(repo: IAchievementRepository, id: string, data: Partial<AchievementInsert>) {
  return repo.update(id, data)
}
