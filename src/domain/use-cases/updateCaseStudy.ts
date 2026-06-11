import type { ICaseStudyRepository, CaseStudyInsert } from '#/domain/ports'

export async function updateCaseStudyUseCase(repo: ICaseStudyRepository, id: string, data: Partial<CaseStudyInsert>) {
  return repo.update(id, data)
}
