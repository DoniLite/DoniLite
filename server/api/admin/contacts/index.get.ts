import { contactService } from '~~/server/lib/service/contact.service'
import { assertAuthenticated } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  assertAuthenticated(event)
  return contactService.listContacts()
})
