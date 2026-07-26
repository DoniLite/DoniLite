import { articleService } from '~~/server/lib/service/article.service'
import type { ArticleLocale } from '~~/shared/types'

const locales: ArticleLocale[] = ['en', 'fr']
const defaultLocale: ArticleLocale = 'en'

export default defineEventHandler(async () => {
  const { items } = await articleService.list({ status: 'published', pageSize: 1000 })

  return items.flatMap((article) => {
    const sourceTranslation =
      article.translations.find((t) => t.locale === article.sourceLocale) ?? article.translations[0]
    if (!sourceTranslation) {
      return []
    }

    return locales.map((locale) => {
      const translation = article.translations.find((t) => t.locale === locale) ?? sourceTranslation
      const slugSegment = translation.slug ? `/${translation.slug}` : ''
      const path = `/blog/${article.id}${slugSegment}`
      return {
        loc: locale === defaultLocale ? path : `/${locale}${path}`,
        lastmod: article.updatedAt ?? article.createdAt ?? undefined
      }
    })
  })
})
