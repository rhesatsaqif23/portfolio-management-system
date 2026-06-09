import type { IProfileRepository } from '#/domain/ports'

export async function getProfileUseCase(repo: IProfileRepository) {
  return repo.getProfile()
}
