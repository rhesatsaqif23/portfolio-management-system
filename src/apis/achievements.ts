import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/clerk-react'
import { achievementSchema } from '#/domain/schemas'
import { listAchievementsUseCase, createAchievementUseCase, deleteAchievementUseCase } from '#/domain/use-cases'
import { drizzleAchievementRepository } from '#/infrastructure/db/repositories/achievementRepository'

export const listAchievements = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return listAchievementsUseCase(drizzleAchievementRepository)
})

export const createAchievement = createServerFn({ method: 'POST' })
  .validator((data: unknown) => achievementSchema.parse(data))
  .handler(async ({ data }) => {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')
    return createAchievementUseCase(drizzleAchievementRepository, data)
  })

export const deleteAchievement = createServerFn({ method: 'POST' })
  .validator((data: unknown) => ({ id: String(data) }))
  .handler(async ({ data }) => {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')
    return deleteAchievementUseCase(drizzleAchievementRepository, data.id)
  })
