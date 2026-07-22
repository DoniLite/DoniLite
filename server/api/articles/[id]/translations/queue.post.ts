import { z } from 'zod'
import { articleService } from '~~/server/lib/service/article.service'
import { jobsService } from '~~/server/lib/service/jobs.service'
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

  const job = await jobsService.create('article_translation', {
    articleId: id,
    targetLocale,
    sourceLocale: source.locale,
    existingSlug: existingTarget?.slug
  })
  await jobsService.run(job.id)

  return articleService.findById(id)
})
