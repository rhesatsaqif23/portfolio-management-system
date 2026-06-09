import type { IExperienceRepository } from '#/domain/ports'

export async function listExperiencesUseCase(repo: IExperienceRepository) {
  return repo.findAll()
}
