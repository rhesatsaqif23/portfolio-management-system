import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { getServerAuth } from '#/infrastructure/auth'
import { skillSchema } from '#/domain/schemas'
import { listSkillsUseCase, createSkillUseCase, deleteSkillUseCase } from '#/domain/use-cases'
import { drizzleSkillRepository } from '#/infrastructure/db/repositories/skillRepository'

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
    return createSkillUseCase(drizzleSkillRepository, data)
  })

export const deleteSkill = createServerFn({ method: 'POST' })
  .validator((data: unknown) => ({ id: String(data) }))
  .handler(async ({ data }) => {
    await requireUserId()
    return deleteSkillUseCase(drizzleSkillRepository, data.id)
  })
