import { jobsService } from '~~/server/lib/service/jobs.service'
import { assertAuthenticated } from '~~/server/utils/auth'
import type { JobStatus } from '~~/shared/types'

export default defineEventHandler(async (event) => {
  assertAuthenticated(event)
  const query = getQuery(event)
  return jobsService.list({ status: query.status as JobStatus | undefined })
})
