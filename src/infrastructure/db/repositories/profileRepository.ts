import { db } from '#/infrastructure/db'
import { profilesTable } from '#/infrastructure/db/schema'
import { supabase } from '#/infrastructure/supabase'
import type { IProfileRepository, Profile, ProfileInsert } from '#/domain/ports'

export const drizzleProfileRepository: IProfileRepository = {
  async getProfile(): Promise<Profile | null> {
    const [profile] = await db.select().from(profilesTable).limit(1)
    return profile ?? null
  },

  async updateProfile(data: Partial<ProfileInsert>): Promise<Profile> {
    const [existing] = await db.select().from(profilesTable).limit(1)
    if (!existing) {
      const [created] = await db.insert(profilesTable).values(data as ProfileInsert).returning()
      return created
    }
    if (Object.keys(data).length === 0) return existing
    const [updated] = await db.update(profilesTable).set(data).returning()
    return updated
  },

  async uploadCV(fileBuffer: ArrayBuffer, fileName: string): Promise<string> {
    const path = `cv/${fileName}`
    const { data, error } = await supabase.storage.from('public').upload(path, new Uint8Array(fileBuffer), { upsert: true })
    if (error) throw new Error(error.message)
    const { data: publicUrl } = supabase.storage.from('public').getPublicUrl(data.path)
    return publicUrl.publicUrl
  },

  async deleteCV(): Promise<void> {
    const [profile] = await db.select({ cvUrl: profilesTable.cvUrl }).from(profilesTable).limit(1)
    if (!profile?.cvUrl) return
    const path = profile.cvUrl.split('/').pop()
    if (path) {
      await supabase.storage.from('public').remove([`cv/${path}`])
    }
  },
}
