import type { ISkillRepository, SkillInsert } from '#/domain/ports'

export async function createSkillUseCase(repo: ISkillRepository, data: SkillInsert) {
  return repo.create(data)
}
