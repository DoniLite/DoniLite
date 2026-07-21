import { statsService } from '~~/server/lib/service/stats.service'
import { assertAuthenticated } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  assertAuthenticated(event)
  return statsService.getDashboardStats()
})
