import type { IProjectRepository, IStatsRepository } from '#/domain/ports'

export async function deleteProjectUseCase(repo: IProjectRepository, statsRepo: IStatsRepository, id: string) {
  await repo.delete(id)
  const stat = await statsRepo.findByKey('projects_shipped')
  if (stat) {
    const next = String(Number(stat.value) - 1)
    await statsRepo.update(stat.id, { value: next })
  }
}
