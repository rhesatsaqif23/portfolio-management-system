import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { requireAdminAuth } from '#/infrastructure/auth'
import { projectSchema } from '#/domain/schemas'
import { listProjectsUseCase, createProjectUseCase, updateProjectUseCase, deleteProjectUseCase } from '#/domain/use-cases'
import { drizzleProjectRepository } from '#/infrastructure/db/repositories/projectRepository'
import { drizzleStatsRepository } from '#/infrastructure/db/repositories/statsRepository'

export const ping = createServerFn({ method: 'GET' }).handler(async () => {
  console.log('[ping] handler called')
  return { ok: true, time: Date.now() }
})

export const testDb = createServerFn({ method: 'GET' }).handler(async () => {
  console.log('[testDb] handler called')
  try {
    const result = await listProjectsUseCase(drizzleProjectRepository)
    console.log('[testDb] result:', typeof result, result?.length)
    return { ok: true, count: result?.length ?? 0, data: result ?? [] }
  } catch (e) {
    console.error('[testDb] ERROR:', e)
    return { ok: false, error: String(e) }
  }
})

export const listProjects = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdminAuth(getRequest())
  return listProjectsUseCase(drizzleProjectRepository)
})

export const createProject = createServerFn({ method: 'POST' })
  .validator((data: unknown) => projectSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdminAuth(getRequest())
    return createProjectUseCase(drizzleProjectRepository, drizzleStatsRepository, data)
  })

export const updateProject = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const { id, data: fields } = data as { id: string; data: Record<string, unknown> }
    return { id, data: projectSchema.partial().parse(fields) }
  })
  .handler(async ({ data }) => {
    await requireAdminAuth(getRequest())
    return updateProjectUseCase(drizzleProjectRepository, data.id, data.data)
  })

export const deleteProject = createServerFn({ method: 'POST' })
  .validator((data: unknown) => ({ id: String(data) }))
  .handler(async ({ data }) => {
    await requireAdminAuth(getRequest())
    return deleteProjectUseCase(drizzleProjectRepository, drizzleStatsRepository, data.id)
  })
