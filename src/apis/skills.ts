import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { getServerAuth } from '#/infrastructure/auth'
import { skillSchema } from '#/domain/schemas'
import { listSkillsUseCase, createSkillUseCase, updateSkillUseCase, deleteSkillUseCase } from '#/domain/use-cases'
import { drizzleSkillRepository } from '#/infrastructure/db/repositories/skillRepository'
import { drizzleStatsRepository } from '#/infrastructure/db/repositories/statsRepository'

async function requireUserId() {
  const { userId } = await getServerAuth(getRequest())
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export const listSkills = createServerFn({ method: 'GET' }).handler(async () => {
  await requireUserId()
  return listSkillsUseCase(drizzleSkillRepository)
})

export const createSkill = createServerFn({ method: 'POST' })
  .validator((data: unknown) => skillSchema.parse(data))
  .handler(async ({ data }) => {
    await requireUserId()
    return createSkillUseCase(drizzleSkillRepository, drizzleStatsRepository, data)
  })

export const updateSkill = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const { id, ...rest } = data as { id: string }
    return { id, data: skillSchema.partial().parse(rest) }
  })
  .handler(async ({ data }) => {
    await requireUserId()
    return updateSkillUseCase(drizzleSkillRepository, data.id, data.data)
  })

export const deleteSkill = createServerFn({ method: 'POST' })
  .validator((data: unknown) => ({ id: String(data) }))
  .handler(async ({ data }) => {
    await requireUserId()
    return deleteSkillUseCase(drizzleSkillRepository, drizzleStatsRepository, data.id)
  })
