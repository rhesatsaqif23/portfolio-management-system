import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { getServerAuth } from '#/infrastructure/auth'
import { profileSchema } from '#/domain/schemas'
import { getProfileUseCase, updateProfileUseCase } from '#/domain/use-cases'
import { drizzleProfileRepository } from '#/infrastructure/db/repositories/profileRepository'

async function requireUserId() {
  const { userId } = await getServerAuth(getRequest())
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export const getProfile = createServerFn({ method: 'GET' }).handler(async () => {
  await requireUserId()
  return getProfileUseCase(drizzleProfileRepository)
})

export const updateProfile = createServerFn({ method: 'POST' })
  .validator((data: unknown) => profileSchema.parse(data))
  .handler(async ({ data }) => {
    await requireUserId()
    return updateProfileUseCase(drizzleProfileRepository, data)
  })
