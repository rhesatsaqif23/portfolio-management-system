import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { requireAdminAuth } from '#/infrastructure/auth'
import { skillSchema } from '#/domain/schemas'
import { listSkillsUseCase, createSkillUseCase, updateSkillUseCase, deleteSkillUseCase } from '#/domain/use-cases'
import { drizzleSkillRepository } from '#/infrastructure/db/repositories/skillRepository'
import { drizzleStatsRepository } from '#/infrastructure/db/repositories/statsRepository'

export const listSkills = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdminAuth(getRequest())
  return listSkillsUseCase(drizzleSkillRepository)
})

export const createSkill = createServerFn({ method: 'POST' })
  .validator((data: unknown) => skillSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdminAuth(getRequest())
    return createSkillUseCase(drizzleSkillRepository, drizzleStatsRepository, data)
  })

export const updateSkill = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const { id, data: fields } = data as { id: string; data: Record<string, unknown> }
    return { id, data: skillSchema.partial().parse(fields) }
  })
  .handler(async ({ data }) => {
    await requireAdminAuth(getRequest())
    return updateSkillUseCase(drizzleSkillRepository, data.id, data.data)
  })

export const deleteSkill = createServerFn({ method: 'POST' })
  .validator((data: unknown) => ({ id: String(data) }))
  .handler(async ({ data }) => {
    await requireAdminAuth(getRequest())
    return deleteSkillUseCase(drizzleSkillRepository, drizzleStatsRepository, data.id)
  })
