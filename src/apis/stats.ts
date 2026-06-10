import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { getServerAuth } from '#/infrastructure/auth'
import { statsSchema } from '#/domain/schemas'
import { listStatsUseCase, createStatUseCase, updateStatUseCase, deleteStatUseCase } from '#/domain/use-cases'
import { drizzleStatsRepository } from '#/infrastructure/db/repositories/statsRepository'

async function requireUserId() {
  const { userId } = await getServerAuth(getRequest())
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export const listStats = createServerFn({ method: 'GET' }).handler(async () => {
  await requireUserId()
  return listStatsUseCase(drizzleStatsRepository)
})

export const createStat = createServerFn({ method: 'POST' })
  .validator((data: unknown) => statsSchema.parse(data))
  .handler(async ({ data }) => {
    await requireUserId()
    return createStatUseCase(drizzleStatsRepository, data)
  })

export const updateStat = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const { id, ...rest } = data as { id: string }
    return { id, data: statsSchema.partial().parse(rest) }
  })
  .handler(async ({ data }) => {
    await requireUserId()
    return updateStatUseCase(drizzleStatsRepository, data.id, data.data)
  })

export const deleteStat = createServerFn({ method: 'POST' })
  .validator((data: unknown) => ({ id: String(data) }))
  .handler(async ({ data }) => {
    await requireUserId()
    return deleteStatUseCase(drizzleStatsRepository, data.id)
  })
