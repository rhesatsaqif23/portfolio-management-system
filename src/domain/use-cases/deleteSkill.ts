import type { ISkillRepository } from '#/domain/ports'

export async function deleteSkillUseCase(repo: ISkillRepository, id: string) {
  return repo.delete(id)
}
