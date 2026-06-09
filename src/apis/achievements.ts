import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { getServerAuth } from '#/infrastructure/auth'
import { achievementSchema } from '#/domain/schemas'
import { listAchievementsUseCase, createAchievementUseCase, deleteAchievementUseCase } from '#/domain/use-cases'
import { drizzleAchievementRepository } from '#/infrastructure/db/repositories/achievementRepository'

async function requireUserId() {
  const { userId } = await getServerAuth(getRequest())
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export const listAchievements = createServerFn({ method: 'GET' }).handler(async () => {
  await requireUserId()
  return listAchievementsUseCase(drizzleAchievementRepository)
})

export const createAchievement = createServerFn({ method: 'POST' })
  .validator((data: unknown) => achievementSchema.parse(data))
  .handler(async ({ data }) => {
    await requireUserId()
    return createAchievementUseCase(drizzleAchievementRepository, data)
  })

export const deleteAchievement = createServerFn({ method: 'POST' })
  .validator((data: unknown) => ({ id: String(data) }))
  .handler(async ({ data }) => {
    await requireUserId()
    return deleteAchievementUseCase(drizzleAchievementRepository, data.id)
  })
