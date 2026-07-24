import { contactService } from '~~/server/lib/service/contact.service'
import { assertAuthenticated } from '~~/server/utils/auth'
import { parsePagination } from '~~/server/utils/pagination'

export default defineEventHandler(async (event) => {
  assertAuthenticated(event)
  const { page, pageSize } = parsePagination(getQuery(event))
  return contactService.listContacts({ page, pageSize })
})
