import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { getServerAuth } from '#/infrastructure/auth'
import { supabase } from '#/infrastructure/supabase'

export const uploadFile = createServerFn({ method: 'POST' })
  .validator((_data: unknown) => {
    const { bucket, path, file } = _data as { bucket: string; path: string; file: ArrayBuffer }
    return { bucket, path, file: new Uint8Array(file) }
  })
  .handler(async ({ data }) => {
    const { userId } = await getServerAuth(getRequest())
    if (!userId) throw new Error('Unauthorized')
    const { bucket, path, file } = data
    const { data: result, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
    if (error) throw new Error(error.message)
    const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(result.path)
    return { url: publicUrl.publicUrl }
  })

export const deleteFile = createServerFn({ method: 'POST' })
  .validator((_data: unknown) => _data as { bucket: string; path: string })
  .handler(async ({ data }) => {
    const { userId } = await getServerAuth(getRequest())
    if (!userId) throw new Error('Unauthorized')
    const { error } = await supabase.storage.from(data.bucket).remove([data.path])
    if (error && !error.message.includes('not found')) throw new Error(error.message)
    return { success: true }
  })

export const replaceFile = createServerFn({ method: 'POST' })
  .validator((_data: unknown) => {
    const { bucket, path, oldPath, file } = _data as { bucket: string; path: string; oldPath?: string; file: ArrayBuffer }
    return { bucket, path, oldPath, file: new Uint8Array(file) }
  })
  .handler(async ({ data }) => {
    const { userId } = await getServerAuth(getRequest())
    if (!userId) throw new Error('Unauthorized')
    const { bucket, path, oldPath, file } = data
    if (oldPath) {
      await supabase.storage.from(bucket).remove([oldPath])
    }
    const { data: result, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
    if (error) throw new Error(error.message)
    const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(result.path)
    return { url: publicUrl.publicUrl }
  })
