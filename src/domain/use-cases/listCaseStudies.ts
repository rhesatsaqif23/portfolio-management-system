import type { ICaseStudyRepository } from '#/domain/ports'

export async function listCaseStudiesUseCase(repo: ICaseStudyRepository) {
  return repo.findAll()
}
