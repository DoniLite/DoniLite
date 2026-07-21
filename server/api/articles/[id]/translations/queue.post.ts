import { z } from 'zod'
import { articleService } from '~~/server/lib/service/article.service'
import { translationService } from '~~/server/lib/service/translation.service'
import { assertAuthenticated } from '~~/server/utils/auth'
import type { ArticleLocale } from '~~/shared/types'

const queueTranslationPayloadSchema = z.object({
  targetLocale: z.enum(['en', 'fr']),
  sourceLocale: z.enum(['en', 'fr']).optional()
})

const oppositeLocale = (locale: ArticleLocale): ArticleLocale => (locale === 'en' ? 'fr' : 'en')

export default defineEventHandler(async (event) => {
  assertAuthenticated(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing article id' })
  }

  const body = queueTranslationPayloadSchema.parse(await readBody(event))
  const article = await articleService.findById(id)
  if (!article) {
    throw createError({ statusCode: 404, message: 'Article not found' })
  }

  const targetLocale = body.targetLocale
  const existingTarget = article.translations.find(
    (translation) => translation.locale === targetLocale
  )
  if (existingTarget?.translationStatus === 'published') {
    return article
  }

  const sourceLocale = body.sourceLocale ?? oppositeLocale(targetLocale)
  const source =
    article.translations.find((translation) => translation.locale === sourceLocale) ??
    article.translations[0]
  if (!source) {
    throw createError({ statusCode: 400, message: 'Article has no source translation' })
  }

  const translated = await translationService.translateArticle({
    sourceLocale: source.locale,
    targetLocale,
    title: source.title,
    description: source.description,
    seoTitle: source.seoTitle,
    seoDescription: source.seoDescription,
    content: source.content,
    contentFormat: source.contentFormat
  })

  return articleService.upsertTranslation(id, {
    locale: targetLocale,
    translationStatus: 'generated',
    title: translated.title,
    slug: existingTarget?.slug,
    description: translated.description,
    seoTitle: translated.seoTitle,
    seoDescription: translated.seoDescription,
    content: translated.content,
    contentFormat: 'html',
    resources: source.resources,
    correctionNotes: `Translated from ${source.locale} to ${targetLocale} by Claude. Review and correct before publishing.`
  })
})
