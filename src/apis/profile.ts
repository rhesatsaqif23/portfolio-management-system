import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/clerk-react'
import { profileSchema } from '#/domain/schemas'
import { getProfileUseCase, updateProfileUseCase } from '#/domain/use-cases'
import { drizzleProfileRepository } from '#/infrastructure/db/repositories/profileRepository'

export const getProfile = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return getProfileUseCase(drizzleProfileRepository)
})

export const updateProfile = createServerFn({ method: 'POST' })
  .validator((data: unknown) => profileSchema.parse(data))
  .handler(async ({ data }) => {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')
    return updateProfileUseCase(drizzleProfileRepository, data)
  })
