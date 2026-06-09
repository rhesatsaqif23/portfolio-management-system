import { db } from '#/infrastructure/db'
import { profilesTable } from '#/infrastructure/db/schema'
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
    const [updated] = await db.update(profilesTable).set(data).returning()
    return updated
  },

  async uploadCV(_fileBuffer: ArrayBuffer, _fileName: string): Promise<string> {
    throw new Error('Storage adapter not configured')
  },

  async deleteCV(): Promise<void> {
    throw new Error('Storage adapter not configured')
  },
}
