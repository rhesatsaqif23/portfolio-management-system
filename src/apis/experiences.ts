import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { getServerAuth } from '#/infrastructure/auth'
import { experienceSchema } from '#/domain/schemas'
import { listExperiencesUseCase, createExperienceUseCase, deleteExperienceUseCase } from '#/domain/use-cases'
import { drizzleExperienceRepository } from '#/infrastructure/db/repositories/experienceRepository'

async function requireUserId() {
  const { userId } = await getServerAuth(getRequest())
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export const listExperiences = createServerFn({ method: 'GET' }).handler(async () => {
  await requireUserId()
  return listExperiencesUseCase(drizzleExperienceRepository)
})

export const createExperience = createServerFn({ method: 'POST' })
  .validator((data: unknown) => experienceSchema.parse(data))
  .handler(async ({ data }) => {
    await requireUserId()
    return createExperienceUseCase(drizzleExperienceRepository, data)
  })

export const deleteExperience = createServerFn({ method: 'POST' })
  .validator((data: unknown) => ({ id: String(data) }))
  .handler(async ({ data }) => {
    await requireUserId()
    return deleteExperienceUseCase(drizzleExperienceRepository, data.id)
  })
