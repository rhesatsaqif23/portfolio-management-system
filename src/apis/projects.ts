import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { getServerAuth } from '#/infrastructure/auth'
import { projectSchema } from '#/domain/schemas'
import { listProjectsUseCase, createProjectUseCase, updateProjectUseCase, deleteProjectUseCase } from '#/domain/use-cases'
import { drizzleProjectRepository } from '#/infrastructure/db/repositories/projectRepository'

async function requireUserId() {
  const { userId } = await getServerAuth(getRequest())
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export const listProjects = createServerFn({ method: 'GET' }).handler(async () => {
  await requireUserId()
  return listProjectsUseCase(drizzleProjectRepository)
})

export const createProject = createServerFn({ method: 'POST' })
  .validator((data: unknown) => projectSchema.parse(data))
  .handler(async ({ data }) => {
    await requireUserId()
    return createProjectUseCase(drizzleProjectRepository, data)
  })

export const updateProject = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const { id, ...rest } = data as { id: string }
    return { id, data: projectSchema.partial().parse(rest) }
  })
  .handler(async ({ data }) => {
    await requireUserId()
    return updateProjectUseCase(drizzleProjectRepository, data.id, data.data)
  })

export const deleteProject = createServerFn({ method: 'POST' })
  .validator((data: unknown) => ({ id: String(data) }))
  .handler(async ({ data }) => {
    await requireUserId()
    return deleteProjectUseCase(drizzleProjectRepository, data.id)
  })
