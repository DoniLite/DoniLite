import { contactMessagePayloadSchema, contactService } from '~~/server/lib/service/contact.service'

export default defineEventHandler(async (event) => {
  const body = contactMessagePayloadSchema.parse(await readBody(event))
  await contactService.submitMessage(body)
  return { success: true }
})
