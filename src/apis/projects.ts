import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/clerk-react'
import { projectSchema } from '#/domain/schemas'
import { listProjectsUseCase, createProjectUseCase, updateProjectUseCase, deleteProjectUseCase } from '#/domain/use-cases'
import { drizzleProjectRepository } from '#/infrastructure/db/repositories/projectRepository'

export const listProjects = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return listProjectsUseCase(drizzleProjectRepository)
})

export const createProject = createServerFn({ method: 'POST' })
  .validator((data: unknown) => projectSchema.parse(data))
  .handler(async ({ data }) => {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')
    return createProjectUseCase(drizzleProjectRepository, data)
  })

export const updateProject = createServerFn({ method: 'POST' })
  .validator((data: unknown) => projectSchema.partial().parse(data))
  .handler(async ({ data }) => {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')
    return updateProjectUseCase(drizzleProjectRepository, data.id, data)
  })

export const deleteProject = createServerFn({ method: 'POST' })
  .validator((data: unknown) => ({ id: String(data) }))
  .handler(async ({ data }) => {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')
    return deleteProjectUseCase(drizzleProjectRepository, data.id)
  })
