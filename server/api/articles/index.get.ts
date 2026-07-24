import { articleService } from '~~/server/lib/service/article.service'
import { parsePagination } from '~~/server/utils/pagination'
import type { ArticleStatus } from '~~/shared/types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const status = typeof query.status === 'string' ? (query.status as ArticleStatus) : undefined
  const featured = typeof query.featured === 'string' ? query.featured === 'true' : undefined
  const seasonId = typeof query.seasonId === 'string' ? query.seasonId : undefined
  const tagId = typeof query.tagId === 'string' ? query.tagId : undefined
  const search =
    typeof query.search === 'string' && query.search.trim() ? query.search.trim() : undefined
  const sortKey =
    query.sortKey === 'status' || query.sortKey === 'updatedAt' ? query.sortKey : undefined
  const sortDir = query.sortDir === 'asc' ? 'asc' : undefined
  const { page, pageSize } = parsePagination(query)

  return articleService.list({
    status,
    featured,
    seasonId,
    tagId,
    search,
    page,
    pageSize,
    sortKey,
    sortDir
  })
})
