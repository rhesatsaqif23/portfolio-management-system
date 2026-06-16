import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { requireAdminAuth } from '#/infrastructure/auth'
import { statsSchema } from '#/domain/schemas'
import { listStatsUseCase, createStatUseCase, updateStatUseCase, deleteStatUseCase } from '#/domain/use-cases'
import { drizzleStatsRepository } from '#/infrastructure/db/repositories/statsRepository'

export const listStats = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdminAuth(getRequest())
  return listStatsUseCase(drizzleStatsRepository)
})

export const createStat = createServerFn({ method: 'POST' })
  .validator((data: unknown) => statsSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdminAuth(getRequest())
    return createStatUseCase(drizzleStatsRepository, data)
  })

export const updateStat = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const { id, data: fields } = data as { id: string; data: Record<string, unknown> }
    return { id, data: statsSchema.partial().parse(fields) }
  })
  .handler(async ({ data }) => {
    await requireAdminAuth(getRequest())
    return updateStatUseCase(drizzleStatsRepository, data.id, data.data)
  })

export const deleteStat = createServerFn({ method: 'POST' })
  .validator((data: unknown) => ({ id: String(data) }))
  .handler(async ({ data }) => {
    await requireAdminAuth(getRequest())
    return deleteStatUseCase(drizzleStatsRepository, data.id)
  })
