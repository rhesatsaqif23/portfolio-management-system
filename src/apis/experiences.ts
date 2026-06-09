import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/clerk-react'
import { experienceSchema } from '#/domain/schemas'
import { listExperiencesUseCase, createExperienceUseCase, deleteExperienceUseCase } from '#/domain/use-cases'
import { drizzleExperienceRepository } from '#/infrastructure/db/repositories/experienceRepository'

export const listExperiences = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return listExperiencesUseCase(drizzleExperienceRepository)
})

export const createExperience = createServerFn({ method: 'POST' })
  .validator((data: unknown) => experienceSchema.parse(data))
  .handler(async ({ data }) => {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')
    return createExperienceUseCase(drizzleExperienceRepository, data)
  })

export const deleteExperience = createServerFn({ method: 'POST' })
  .validator((data: unknown) => ({ id: String(data) }))
  .handler(async ({ data }) => {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')
    return deleteExperienceUseCase(drizzleExperienceRepository, data.id)
  })
