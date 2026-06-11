import type { profilesTable } from '#/infrastructure/db/schema'

export type Profile = typeof profilesTable.$inferSelect
export type ProfileInsert = typeof profilesTable.$inferInsert

export interface IProfileRepository {
  getProfile(): Promise<Profile | null>
  updateProfile(data: Partial<ProfileInsert>): Promise<Profile>
  uploadCV(fileBuffer: ArrayBuffer, fileName: string): Promise<string>
  deleteCV(): Promise<void>
}
