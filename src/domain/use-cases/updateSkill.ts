import type { ISkillRepository, SkillInsert } from '#/domain/ports'

export async function updateSkillUseCase(repo: ISkillRepository, id: string, data: Partial<SkillInsert>) {
  return repo.update(id, data)
}
