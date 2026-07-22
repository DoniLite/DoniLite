import { contactService } from '~~/server/lib/service/contact.service'
import { assertAuthenticated } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  assertAuthenticated(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing message id' })
  }
  return contactService.deleteMessage(id)
})
