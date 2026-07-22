import { jobsService } from '~~/server/lib/service/jobs.service'
import { assertAuthenticated } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  assertAuthenticated(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing job id' })
  }
  const job = await jobsService.findById(id)
  if (!job) {
    throw createError({ statusCode: 404, message: 'Job not found' })
  }
  return job
})
