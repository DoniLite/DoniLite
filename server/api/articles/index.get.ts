import { articleService } from '~~/server/lib/service/article.service'
import type { ArticleStatus } from '~~/shared/types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const status = typeof query.status === 'string' ? (query.status as ArticleStatus) : undefined
  const featured = typeof query.featured === 'string' ? query.featured === 'true' : undefined

  return articleService.list({ status, featured })
})
