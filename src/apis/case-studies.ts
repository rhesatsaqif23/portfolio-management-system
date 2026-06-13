import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { requireAdminAuth } from '#/infrastructure/auth'
import { caseStudySchema } from '#/domain/schemas'
import { listCaseStudiesUseCase, createCaseStudyUseCase, updateCaseStudyUseCase, deleteCaseStudyUseCase } from '#/domain/use-cases'
import { drizzleCaseStudyRepository } from '#/infrastructure/db/repositories/caseStudyRepository'

export const listCaseStudies = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdminAuth(getRequest())
  return listCaseStudiesUseCase(drizzleCaseStudyRepository)
})

export const createCaseStudy = createServerFn({ method: 'POST' })
  .validator((data: unknown) => caseStudySchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdminAuth(getRequest())
    return createCaseStudyUseCase(drizzleCaseStudyRepository, data)
  })

export const updateCaseStudy = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const { id, ...rest } = data as { id: string }
    return { id, data: rest }
  })
  .handler(async ({ data }) => {
    await requireAdminAuth(getRequest())
    return updateCaseStudyUseCase(drizzleCaseStudyRepository, data.id, data.data)
  })

export const deleteCaseStudy = createServerFn({ method: 'POST' })
  .validator((data: unknown) => ({ id: String(data) }))
  .handler(async ({ data }) => {
    await requireAdminAuth(getRequest())
    return deleteCaseStudyUseCase(drizzleCaseStudyRepository, data.id)
  })
