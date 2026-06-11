import type { IExperienceRepository } from '#/domain/ports'

export async function deleteExperienceUseCase(repo: IExperienceRepository, id: string) {
  return repo.delete(id)
}
