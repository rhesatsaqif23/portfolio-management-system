import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { requireAdminAuth } from '#/infrastructure/auth'
import { supabase } from '#/infrastructure/supabase'

export const uploadFile = createServerFn({ method: 'POST' })
  .validator((_data: unknown) => {
    const d = _data as { bucket: string; path: string; file: number[] }
    return { bucket: d.bucket, path: d.path, file: new Uint8Array(d.file) }
  })
  .handler(async ({ data }) => {
    await requireAdminAuth(getRequest())
    const { bucket, path, file } = data
    const { data: result, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true, contentType: '' })
    if (error) throw new Error(error.message)
    const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(result.path)
    return { url: publicUrl.publicUrl }
  })

export const deleteFile = createServerFn({ method: 'POST' })
  .validator((_data: unknown) => _data as { bucket: string; path: string })
  .handler(async ({ data }) => {
    await requireAdminAuth(getRequest())
    const { error } = await supabase.storage.from(data.bucket).remove([data.path])
    if (error && !error.message.includes('not found')) throw new Error(error.message)
    return { success: true }
  })

export const replaceFile = createServerFn({ method: 'POST' })
  .validator((_data: unknown) => {
    const d = _data as { bucket: string; path: string; oldPath?: string; file: number[] }
    return { bucket: d.bucket, path: d.path, oldPath: d.oldPath, file: new Uint8Array(d.file) }
  })
  .handler(async ({ data }) => {
    await requireAdminAuth(getRequest())
    const { bucket, path, oldPath, file } = data
    if (oldPath) {
      await supabase.storage.from(bucket).remove([oldPath])
    }
    const { data: result, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true, contentType: '' })
    if (error) throw new Error(error.message)
    const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(result.path)
    return { url: publicUrl.publicUrl }
  })
