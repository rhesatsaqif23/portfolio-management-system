import type { IProjectRepository, IStatsRepository, ProjectInsert } from '#/domain/ports'

export async function createProjectUseCase(repo: IProjectRepository, statsRepo: IStatsRepository, data: ProjectInsert) {
  const project = await repo.create(data)
  const stat = await statsRepo.findByKey('projects_shipped')
  if (stat) {
    const next = String(Number(stat.value) + 1)
    await statsRepo.update(stat.id, { value: next })
  }
  return project
}
