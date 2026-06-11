import type { IProjectRepository } from '#/domain/ports'

export async function deleteProjectUseCase(repo: IProjectRepository, id: string) {
  return repo.delete(id)
}
