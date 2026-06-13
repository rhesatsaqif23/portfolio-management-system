import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { requireAdminAuth } from '#/infrastructure/auth'
import { profileSchema } from '#/domain/schemas'
import { getProfileUseCase, updateProfileUseCase } from '#/domain/use-cases'
import { drizzleProfileRepository } from '#/infrastructure/db/repositories/profileRepository'

export const getProfile = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdminAuth(getRequest())
  return getProfileUseCase(drizzleProfileRepository)
})

export const updateProfile = createServerFn({ method: 'POST' })
  .validator((data: unknown) => profileSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdminAuth(getRequest())
    return updateProfileUseCase(drizzleProfileRepository, data)
  })
