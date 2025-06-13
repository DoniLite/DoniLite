import type { RepoQuery } from '~/lib/request/repos.request'
import { repoService } from '~/lib/service/repos.service'
import type { Repos } from '~/shared/types'

export const useRepositoriesStore = defineStore('repositories', () => {
  const repositories = ref<Repos[]>([])

  const loadRepositories = async (config: RepoQuery = {}) => {
    const loadReposFn = async () => {
      const { data } = await repoService.loadRepositories(config)
      return data.value as Repos[]
    }
    const persistedData =
      (await loadStore('repositories', 'repositories', loadReposFn, {
        validateTime: 1000 * 60 * 5
      })) || (await loadReposFn())
    repositories.value = persistedData as Repos[]
  }
  return {
    repositories,
    loadRepositories
  }
})
