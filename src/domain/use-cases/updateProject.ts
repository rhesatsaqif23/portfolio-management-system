import type { IProjectRepository, ProjectInsert } from '#/domain/ports'

export async function updateProjectUseCase(repo: IProjectRepository, id: string, data: Partial<ProjectInsert>) {
  return repo.update(id, data)
}
