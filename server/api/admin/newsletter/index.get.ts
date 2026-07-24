import { newsletterService } from '~~/server/lib/service/newsletter.service'
import { assertAuthenticated } from '~~/server/utils/auth'
import { parsePagination } from '~~/server/utils/pagination'

export default defineEventHandler(async (event) => {
  assertAuthenticated(event)
  const { page, pageSize } = parsePagination(getQuery(event))
  return newsletterService.listSubscribers({ page, pageSize })
})
