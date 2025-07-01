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
    const persistedData = await loadStore(loadReposFn, 'repositories', 'repositories', {
      validateTime: 1000 * 60 * 5,
      validateFunc(entity) {
        if (!entity) {
          return true
        }
        if (Array.isArray(entity) && config.per_page) {
          return entity.length < config.per_page
        }
        return true
      }
    })
    repositories.value = persistedData as Repos[]
  }
  return {
    repositories,
    loadRepositories
  }
})
