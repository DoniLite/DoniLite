import { jobsService } from '~~/server/lib/service/jobs.service'
import { assertAuthenticated } from '~~/server/utils/auth'
import { parsePagination } from '~~/server/utils/pagination'
import type { JobStatus } from '~~/shared/types'

export default defineEventHandler(async (event) => {
  assertAuthenticated(event)
  const query = getQuery(event)
  const { page, pageSize } = parsePagination(query)
  return jobsService.list({ status: query.status as JobStatus | undefined, page, pageSize })
})
