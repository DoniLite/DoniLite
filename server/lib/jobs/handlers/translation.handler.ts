import { articleService } from '~~/server/lib/service/article.service'
import { notificationsService } from '~~/server/lib/service/notifications.service'
import { translationService } from '~~/server/lib/service/translation.service'
import type { ArticleLocale } from '~~/shared/types'

export interface TranslationJobPayload {
  articleId: string
  targetLocale: ArticleLocale
  sourceLocale: ArticleLocale
  existingSlug?: string
}

export const runTranslationJob = async (payload: TranslationJobPayload) => {
  const article = await articleService.findById(payload.articleId)
  if (!article) {
    throw createError({ statusCode: 404, message: 'Article not found' })
  }

  const source =
    article.translations.find((translation) => translation.locale === payload.sourceLocale) ??
    article.translations[0]
  if (!source) {
    throw createError({ statusCode: 400, message: 'Article has no source translation' })
  }

  const translated = await translationService.translateArticle({
    sourceLocale: source.locale,
    targetLocale: payload.targetLocale,
    title: source.title,
    description: source.description,
    seoTitle: source.seoTitle,
    seoDescription: source.seoDescription,
    content: source.content,
    contentFormat: source.contentFormat
  })

  const updated = await articleService.upsertTranslation(payload.articleId, {
    locale: payload.targetLocale,
    translationStatus: 'generated',
    title: translated.title,
    slug: payload.existingSlug,
    description: translated.description,
    seoTitle: translated.seoTitle,
    seoDescription: translated.seoDescription,
    content: translated.content,
    contentFormat: source.contentFormat,
    resources: source.resources,
    correctionNotes: `Machine-translated from ${source.locale} to ${payload.targetLocale}. Review and correct before publishing — automated translation may not preserve all formatting.`
  })

  const newTranslation = updated?.translations.find(
    (translation) => translation.locale === payload.targetLocale
  )
  if (newTranslation?.translationStatus === 'generated') {
    await notificationsService.notify({
      type: 'translation_generated',
      message: `Translation to ${payload.targetLocale.toUpperCase()} generated for "${source.title}" — needs review before publishing.`,
      link: `/dashboard/admin/posts/${payload.articleId}`
    })
  }

  return updated
}
