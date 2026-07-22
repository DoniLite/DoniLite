import { notificationsService } from '~~/server/lib/service/notifications.service'
import { assertAuthenticated } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  assertAuthenticated(event)
  await notificationsService.markAllRead()
  return { success: true }
})
