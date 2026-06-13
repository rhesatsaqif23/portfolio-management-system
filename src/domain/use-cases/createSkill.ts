import type { ISkillRepository, IStatsRepository, SkillInsert } from '#/domain/ports'

export async function createSkillUseCase(repo: ISkillRepository, statsRepo: IStatsRepository, data: SkillInsert) {
  const skill = await repo.create(data)
  const stat = await statsRepo.findByKey('technologies_explored')
  if (stat) {
    const next = String(Number(stat.value) + 1)
    await statsRepo.update(stat.id, { value: next })
  }
  return skill
}
