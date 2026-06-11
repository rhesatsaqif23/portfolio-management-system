import type { ICaseStudyRepository, CaseStudyInsert } from '#/domain/ports'

export async function createCaseStudyUseCase(repo: ICaseStudyRepository, data: CaseStudyInsert) {
  return repo.create(data)
}
