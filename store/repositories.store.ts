import { GITHUB_CLIENT, type LoadReposConfig } from '~/shared/REST/github'
import { extractRepos, type Repos } from '~/shared/types'

export const useRepositoriesStore = defineStore('repositories', () => {
  const repositories = ref<Repos[]>([])

  const loadRepositories = async (config: LoadReposConfig = {}) => {
    const loadReposFn = async () => {
      return extractRepos(await GITHUB_CLIENT.loadRepository(config))
    }
    const persistedData =
      (await loadStore('repositories', 'repositories', loadReposFn, {
        validateTime: 1000 * 60 * 5
      })) || (await loadReposFn())
    if (persistedData) {
      repositories.value = persistedData as Repos[]
    }
  }
  return {
    repositories,
    loadRepositories
  }
})
