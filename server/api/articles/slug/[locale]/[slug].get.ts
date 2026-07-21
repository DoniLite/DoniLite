import { articleService } from '~~/server/lib/service/article.service'
import type { ArticleLocale } from '~~/shared/types'

export default defineEventHandler(async (event) => {
  const locale = getRouterParam(event, 'locale') as ArticleLocale | undefined
  const slug = getRouterParam(event, 'slug')

  if (!locale || !slug || !['en', 'fr'].includes(locale)) {
    throw createError({ statusCode: 400, message: 'Invalid article slug lookup' })
  }

  const article = await articleService.findBySlug(locale, slug)
  if (!article) {
    throw createError({ statusCode: 404, message: 'Article not found' })
  }

  return article
})
