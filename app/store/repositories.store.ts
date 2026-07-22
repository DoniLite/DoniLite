import type { RepoQuery } from '~/lib/request/repos.request'
import { repoService } from '~/lib/service/repos.service'
import type { Repos } from '~~/shared/types'

export const useRepositoriesStore = defineStore('repositories', () => {
  const repositories = ref<Repos[]>([])

  const loadRepositories = async (config: RepoQuery = {}) => {
    const loadReposFn = async () => {
      return repoService.loadRepositories(config)
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
    const data = (persistedData as Repos[] | undefined) ?? []
    // The localStorage cache is shared across every page that uses this
    // store (home asks for 6, /projects asks for 30), so a cache populated by
    // one page's per_page can be reused as "sufficient" for another's — cap
    // to what THIS call actually asked for so a smaller-per_page consumer
    // never renders a bigger cached batch than it requested.
    repositories.value = config.per_page ? data.slice(0, config.per_page) : data
  }
  return {
    repositories,
    loadRepositories
  }
})
