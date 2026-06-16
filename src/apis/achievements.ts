import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { requireAdminAuth } from '#/infrastructure/auth'
import { achievementSchema } from '#/domain/schemas'
import { listAchievementsUseCase, createAchievementUseCase, updateAchievementUseCase, deleteAchievementUseCase } from '#/domain/use-cases'
import { drizzleAchievementRepository } from '#/infrastructure/db/repositories/achievementRepository'

export const listAchievements = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdminAuth(getRequest())
    return listAchievementsUseCase(drizzleAchievementRepository)
})

export const createAchievement = createServerFn({ method: 'POST' })
  .validator((data: unknown) => achievementSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdminAuth(getRequest())
    return createAchievementUseCase(drizzleAchievementRepository, data)
  })

export const updateAchievement = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const { id, data: fields } = data as { id: string; data: Record<string, unknown> }
    return { id, data: achievementSchema.partial().parse(fields) }
  })
  .handler(async ({ data }) => {
    await requireAdminAuth(getRequest())
    return updateAchievementUseCase(drizzleAchievementRepository, data.id, data.data)
  })

export const deleteAchievement = createServerFn({ method: 'POST' })
  .validator((data: unknown) => ({ id: String(data) }))
  .handler(async ({ data }) => {
    await requireAdminAuth(getRequest())
    return deleteAchievementUseCase(drizzleAchievementRepository, data.id)
  })
