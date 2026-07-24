import type { MaybeRefOrGetter } from 'vue'
import type { JobEntry, JobStatus, PaginatedResult } from '~~/shared/types'

export interface JobListQuery {
  status?: JobStatus
  page?: number
  pageSize?: number
}

export const jobService = {
  async list(query: MaybeRefOrGetter<JobListQuery> = {}) {
    return useFetch<PaginatedResult<JobEntry>>('/api/admin/jobs', {
      query: computed(() => toValue(query)),
      default: () => ({ items: [], total: 0, page: 1, pageSize: toValue(query).pageSize ?? 10 })
    })
  },
  async retry(id: string) {
    return $fetch<JobEntry>(`/api/admin/jobs/${id}/retry`, { method: 'POST' })
  }
}
