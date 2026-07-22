import { jobsService } from '~~/server/lib/service/jobs.service'
import { assertAuthenticated } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  assertAuthenticated(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing job id' })
  }
  return jobsService.retry(id)
})
