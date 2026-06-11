import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { getServerAuth } from '#/infrastructure/auth'
import { caseStudySchema } from '#/domain/schemas'
import { listCaseStudiesUseCase, createCaseStudyUseCase, updateCaseStudyUseCase, deleteCaseStudyUseCase } from '#/domain/use-cases'
import { drizzleCaseStudyRepository } from '#/infrastructure/db/repositories/caseStudyRepository'

async function requireUserId() {
  const { userId } = await getServerAuth(getRequest())
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export const listCaseStudies = createServerFn({ method: 'GET' }).handler(async () => {
  await requireUserId()
  return listCaseStudiesUseCase(drizzleCaseStudyRepository)
})

export const createCaseStudy = createServerFn({ method: 'POST' })
  .validator((data: unknown) => caseStudySchema.parse(data))
  .handler(async ({ data }) => {
    await requireUserId()
    return createCaseStudyUseCase(drizzleCaseStudyRepository, data)
  })

export const updateCaseStudy = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const { id, ...rest } = data as { id: string }
    return { id, data: rest }
  })
  .handler(async ({ data }) => {
    await requireUserId()
    return updateCaseStudyUseCase(drizzleCaseStudyRepository, data.id, data.data)
  })

export const deleteCaseStudy = createServerFn({ method: 'POST' })
  .validator((data: unknown) => ({ id: String(data) }))
  .handler(async ({ data }) => {
    await requireUserId()
    return deleteCaseStudyUseCase(drizzleCaseStudyRepository, data.id)
  })
