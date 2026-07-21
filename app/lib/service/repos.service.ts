import type { Repos } from '~~/shared/types'
import type { RepoQuery } from '../request/repos.request'

export const repoService = {
  async loadRepositories(config: RepoQuery = {}) {
    return $fetch<Repos[]>('/api/repos', {
      method: 'GET',
      params: config
    })
  }
}
