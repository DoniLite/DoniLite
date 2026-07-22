import type { JobEntry, JobStatus } from '~~/shared/types'

export const jobService = {
  async list(status?: JobStatus) {
    return useFetch<JobEntry[]>('/api/admin/jobs', {
      query: status ? { status } : undefined,
      default: () => []
    })
  },
  async retry(id: string) {
    return $fetch<JobEntry>(`/api/admin/jobs/${id}/retry`, { method: 'POST' })
  }
}
