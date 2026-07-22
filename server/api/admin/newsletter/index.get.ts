import { newsletterService } from '~~/server/lib/service/newsletter.service'
import { assertAuthenticated } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  assertAuthenticated(event)
  return newsletterService.listSubscribers()
})
