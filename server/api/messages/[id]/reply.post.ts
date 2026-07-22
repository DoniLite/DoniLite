import { z } from 'zod'
import { contactService } from '~~/server/lib/service/contact.service'
import { assertAuthenticated } from '~~/server/utils/auth'

const replyPayloadSchema = z.object({
  body: z.string().trim().min(1).max(5000)
})

export default defineEventHandler(async (event) => {
  assertAuthenticated(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing message id' })
  }
  const { body } = replyPayloadSchema.parse(await readBody(event))
  return contactService.replyToMessage(id, body)
})
