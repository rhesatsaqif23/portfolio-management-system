import type { ISkillRepository, IStatsRepository } from '#/domain/ports'

export async function deleteSkillUseCase(repo: ISkillRepository, statsRepo: IStatsRepository, id: string) {
  await repo.delete(id)
  const stat = await statsRepo.findByKey('technologies_explored')
  if (stat) {
    const next = String(Number(stat.value) - 1)
    await statsRepo.update(stat.id, { value: next })
  }
}
