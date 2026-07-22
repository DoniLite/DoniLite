import { notificationsService } from '~~/server/lib/service/notifications.service'
import { assertAuthenticated } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  assertAuthenticated(event)
  const query = getQuery(event)
  return notificationsService.list({ unreadOnly: query.unreadOnly === 'true' })
})
