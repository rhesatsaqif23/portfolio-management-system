import type { IProfileRepository, ProfileInsert } from '#/domain/ports'

export async function updateProfileUseCase(repo: IProfileRepository, data: Partial<ProfileInsert>) {
  return repo.updateProfile(data)
}
