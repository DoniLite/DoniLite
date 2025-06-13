import { extractRepos } from '~/server/utils/repos'
import type { RawRepoResponse } from '~/shared/types'

export const reposDTO = async (repos: RawRepoResponse[]) => {
  return extractRepos(repos)
}
export type ReposDTO = Awaited<ReturnType<typeof reposDTO>>
export type RepoDTO = Awaited<ReturnType<typeof extractRepos>>[number]
