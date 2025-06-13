import type { RepoQuery } from '../request/repos.request'

export const repoService = {
  async loadRepositories(config: RepoQuery = {}) {
    return useFetch('/api/repos', {
      method: 'GET',
      params: config
    })
  }
}
