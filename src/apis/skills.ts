import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/clerk-react'
import { skillSchema } from '#/domain/schemas'
import { listSkillsUseCase, createSkillUseCase, deleteSkillUseCase } from '#/domain/use-cases'
import { drizzleSkillRepository } from '#/infrastructure/db/repositories/skillRepository'

export const listSkills = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return listSkillsUseCase(drizzleSkillRepository)
})

export const createSkill = createServerFn({ method: 'POST' })
  .validator((data: unknown) => skillSchema.parse(data))
  .handler(async ({ data }) => {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')
    return createSkillUseCase(drizzleSkillRepository, data)
  })

export const deleteSkill = createServerFn({ method: 'POST' })
  .validator((data: unknown) => ({ id: String(data) }))
  .handler(async ({ data }) => {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')
    return deleteSkillUseCase(drizzleSkillRepository, data.id)
  })
