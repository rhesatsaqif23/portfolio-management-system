import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { requireAdminAuth } from '#/infrastructure/auth'
import { experienceSchema } from '#/domain/schemas'
import { listExperiencesUseCase, createExperienceUseCase, updateExperienceUseCase, deleteExperienceUseCase } from '#/domain/use-cases'
import { drizzleExperienceRepository } from '#/infrastructure/db/repositories/experienceRepository'

export const listExperiences = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdminAuth(getRequest())
  return listExperiencesUseCase(drizzleExperienceRepository)
})

export const createExperience = createServerFn({ method: 'POST' })
  .validator((data: unknown) => experienceSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdminAuth(getRequest())
    return createExperienceUseCase(drizzleExperienceRepository, data)
  })

export const updateExperience = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const { id, data: fields } = data as { id: string; data: Record<string, unknown> }
    return { id, data: experienceSchema.partial().parse(fields) }
  })
  .handler(async ({ data }) => {
    await requireAdminAuth(getRequest())
    return updateExperienceUseCase(drizzleExperienceRepository, data.id, data.data)
  })

export const deleteExperience = createServerFn({ method: 'POST' })
  .validator((data: unknown) => ({ id: String(data) }))
  .handler(async ({ data }) => {
    await requireAdminAuth(getRequest())
    return deleteExperienceUseCase(drizzleExperienceRepository, data.id)
  })
