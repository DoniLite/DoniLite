import { contactService } from '~~/server/lib/service/contact.service'
import { assertAuthenticated } from '~~/server/utils/auth'
import { parsePagination } from '~~/server/utils/pagination'

export default defineEventHandler(async (event) => {
  assertAuthenticated(event)
  const query = getQuery(event)
  const state =
    query.state === 'new' || query.state === 'opened' || query.state === 'archived'
      ? query.state
      : undefined
  const search =
    typeof query.search === 'string' && query.search.trim() ? query.search.trim() : undefined
  const orderDir = query.orderDir === 'asc' ? 'asc' : undefined
  const { page, pageSize } = parsePagination(query, 6)

  return contactService.listMessages({ page, pageSize, state, search, orderDir })
})
