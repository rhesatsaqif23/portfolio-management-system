import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { getServerAuth } from '#/infrastructure/auth'

export const uploadFile = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data as { bucket: string; path: string; file: ArrayBuffer })
  .handler(async ({ data }) => {
    const { userId } = await getServerAuth(getRequest())
    if (!userId) throw new Error('Unauthorized')
    return { url: '', message: 'Storage adapter not configured' }
  })
