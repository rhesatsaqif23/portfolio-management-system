import type { ISkillRepository } from '#/domain/ports'

export async function listSkillsUseCase(repo: ISkillRepository) {
  return repo.findAll()
}
