import { GITHUB_CLIENT } from '~/shared/REST/github'
import { extractRepos, type Repos } from '~/shared/types'

export const useRepositoriesStore = defineStore('repositories', () => {
  const repositories = ref<Repos[]>([])

  const loadRepositories = async () => {
    const loadReposFn = async () => {
      return extractRepos(await GITHUB_CLIENT.loadRepository())
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
