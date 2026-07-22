import { notificationsService } from '~~/server/lib/service/notifications.service'
import { assertAuthenticated } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  assertAuthenticated(event)
  const count = await notificationsService.countUnread()
  return { count }
})
