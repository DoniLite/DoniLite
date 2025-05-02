import type { Repos } from '~/shared/types'

export const useRepositoriesStore = defineStore('repositories', () => {
  const repositories = ref<Repos[]>([])
  return {
    repositories
  }
})
