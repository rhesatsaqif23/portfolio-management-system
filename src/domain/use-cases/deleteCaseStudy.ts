import type { ICaseStudyRepository } from '#/domain/ports'

export async function deleteCaseStudyUseCase(repo: ICaseStudyRepository, id: string) {
  return repo.delete(id)
}
