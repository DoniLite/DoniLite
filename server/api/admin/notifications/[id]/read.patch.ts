import { notificationsService } from '~~/server/lib/service/notifications.service'
import { assertAuthenticated } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  assertAuthenticated(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing notification id' })
  }
  return notificationsService.markRead(id)
})
