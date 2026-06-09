import type { IExperienceRepository, ExperienceInsert } from '#/domain/ports'

export async function createExperienceUseCase(repo: IExperienceRepository, data: ExperienceInsert) {
  return repo.create(data)
}
