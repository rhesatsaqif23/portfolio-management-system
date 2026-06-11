import type { IProjectRepository } from '#/domain/ports'

export async function listProjectsUseCase(repo: IProjectRepository) {
  return repo.findAll()
}
