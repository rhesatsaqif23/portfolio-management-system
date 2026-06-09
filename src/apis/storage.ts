import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/clerk-react'

export const uploadFile = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data as { bucket: string; path: string; file: ArrayBuffer })
  .handler(async ({ data }) => {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')
    return { url: '', message: 'Storage adapter not configured' }
  })
