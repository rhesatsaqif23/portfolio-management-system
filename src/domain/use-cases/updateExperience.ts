import type { IExperienceRepository, ExperienceInsert } from '#/domain/ports'

export async function updateExperienceUseCase(repo: IExperienceRepository, id: string, data: Partial<ExperienceInsert>) {
  return repo.update(id, data)
}
