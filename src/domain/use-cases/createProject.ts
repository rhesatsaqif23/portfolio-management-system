import type { IProjectRepository, ProjectInsert } from '#/domain/ports'

export async function createProjectUseCase(repo: IProjectRepository, data: ProjectInsert) {
  return repo.create(data)
}
