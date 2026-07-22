import { and, desc, eq, sql, type SQL } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~~/db/conf'
import {
  ArticleTable,
  ArticleTagLinkTable,
  ArticleTranslationTable
} from '~~/db/schema/article.schema'
import { jobsService } from '~~/server/lib/service/jobs.service'
import { newsletterService } from '~~/server/lib/service/newsletter.service'
import { slugify } from '~~/server/utils/slugify'
import type {
  Article,
  ArticleContentFormat,
  ArticleLocale,
  ArticleResource,
  ArticleStatus,
  ArticleTranslation,
  ArticleTranslationStatus
} from '~~/shared/types'

const localeSchema = z.enum(['en', 'fr'])
const statusSchema = z.enum(['draft', 'published', 'archived'])
const translationStatusSchema = z.enum(['missing', 'queued', 'generated', 'reviewed', 'published'])
const contentFormatSchema = z.enum(['markdown', 'html', 'tiptap_json'])

export const articleTranslationPayloadSchema = z.object({
  locale: localeSchema,
  translationStatus: translationStatusSchema.default('reviewed'),
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().min(1),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  content: z.string().default(''),
  contentFormat: contentFormatSchema.default('markdown'),
  contentBlocks: z.unknown().optional(),
  resources: z.array(z.unknown()).optional().nullable(),
  correctionNotes: z.string().optional().nullable()
})

export const createArticlePayloadSchema = z.object({
  status: statusSchema.default('draft'),
  sourceLocale: localeSchema.default('en'),
  coverImage: z.string().optional().nullable(),
  seriesId: z.string().optional().nullable(),
  seasonId: z.string().optional().nullable(),
  episode: z.number().int().positive().optional().nullable(),
  featured: z.boolean().default(false),
  publishedAt: z.coerce.date().optional().nullable(),
  translation: articleTranslationPayloadSchema,
  tagIds: z.array(z.string()).optional()
})

export const updateArticlePayloadSchema = z.object({
  status: statusSchema.optional(),
  sourceLocale: localeSchema.optional(),
  coverImage: z.string().optional().nullable(),
  seriesId: z.string().optional().nullable(),
  seasonId: z.string().optional().nullable(),
  episode: z.number().int().positive().optional().nullable(),
  featured: z.boolean().optional(),
  publishedAt: z.coerce.date().optional().nullable(),
  tagIds: z.array(z.string()).optional()
})

type ArticleRow = Awaited<ReturnType<typeof fetchArticleRows>>[number]

function normalizeTranslation(translation: ArticleRow['translations'][number]): ArticleTranslation {
  return {
    id: translation.id,
    locale: translation.locale as ArticleLocale,
    translationStatus: translation.translationStatus as ArticleTranslationStatus,
    title: translation.title,
    slug: translation.slug,
    description: translation.description,
    seoTitle: translation.seoTitle,
    seoDescription: translation.seoDescription,
    content: translation.content,
    contentFormat: translation.contentFormat as ArticleContentFormat,
    contentBlocks: translation.contentBlocks,
    resources: translation.resources as ArticleResource[] | undefined,
    correctionNotes: translation.correctionNotes
  }
}

function normalizeArticle(row: ArticleRow): Article {
  const translations = row.translations.map(normalizeTranslation)
  return {
    id: row.id,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
    status: row.status as ArticleStatus,
    sourceLocale: row.sourceLocale as ArticleLocale,
    coverImage: row.coverImage,
    seriesId: row.seriesId,
    seasonId: row.seasonId,
    episode: row.episode,
    featured: row.featured,
    publishedAt: row.publishedAt,
    views: row.views,
    series: row.series,
    season: row.season,
    tags: row.tagLinks.map((link) => link.tag),
    translations,
    en: translations.find((translation) => translation.locale === 'en'),
    fr: translations.find((translation) => translation.locale === 'fr')
  }
}

async function fetchArticleRows(where?: SQL) {
  return db.query.ArticleTable.findMany({
    where,
    with: {
      series: true,
      season: true,
      translations: true,
      tagLinks: {
        with: {
          tag: true
        }
      }
    },
    orderBy: [desc(ArticleTable.updatedAt), desc(ArticleTable.createdAt)]
  })
}

export const articleService = {
  async list(options: { status?: ArticleStatus; featured?: boolean } = {}) {
    const conditions: SQL[] = []
    if (options.status) {
      conditions.push(eq(ArticleTable.status, options.status))
    }
    if (typeof options.featured === 'boolean') {
      conditions.push(eq(ArticleTable.featured, options.featured))
    }

    const rows = await fetchArticleRows(conditions.length > 0 ? and(...conditions) : undefined)
    return rows.map(normalizeArticle)
  },

  async findById(id: string) {
    const row = await db.query.ArticleTable.findFirst({
      where: eq(ArticleTable.id, id),
      with: {
        series: true,
        season: true,
        translations: true,
        tagLinks: {
          with: {
            tag: true
          }
        }
      }
    })
    return row ? normalizeArticle(row) : null
  },

  async findBySlug(locale: ArticleLocale, slug: string) {
    const translation = await db.query.ArticleTranslationTable.findFirst({
      where: and(eq(ArticleTranslationTable.locale, locale), eq(ArticleTranslationTable.slug, slug))
    })
    if (!translation) {
      return null
    }
    return this.findById(translation.articleId)
  },

  // Each translation can have its own slug, but the language switcher just
  // swaps the locale prefix and keeps whatever slug segment was already in
  // the URL — so a locale switch commonly requests (newLocale, oldSlug),
  // which doesn't exist under that locale. Falling back to a slug lookup
  // across all locales still identifies the right article, so the client can
  // redirect to that locale's real slug instead of 404ing.
  async findBySlugAnyLocale(slug: string) {
    const translation = await db.query.ArticleTranslationTable.findFirst({
      where: eq(ArticleTranslationTable.slug, slug)
    })
    if (!translation) {
      return null
    }
    return this.findById(translation.articleId)
  },

  async create(payload: z.infer<typeof createArticlePayloadSchema>) {
    const parsed = createArticlePayloadSchema.parse(payload)
    const [article] = await db
      .insert(ArticleTable)
      .values({
        status: parsed.status,
        sourceLocale: parsed.sourceLocale,
        coverImage: parsed.coverImage,
        seriesId: parsed.seriesId,
        seasonId: parsed.seasonId,
        episode: parsed.episode,
        featured: parsed.featured,
        publishedAt: parsed.publishedAt
      })
      .returning({ id: ArticleTable.id })

    if (!article) {
      throw createError({ statusCode: 500, message: 'Article creation failed' })
    }

    await this.upsertTranslation(article.id, parsed.translation)
    if (parsed.tagIds) {
      await this.replaceTags(article.id, parsed.tagIds)
    }
    return this.findById(article.id)
  },

  async update(id: string, payload: z.infer<typeof updateArticlePayloadSchema>) {
    const { tagIds, ...parsed } = updateArticlePayloadSchema.parse(payload)

    const before = await db.query.ArticleTable.findFirst({
      where: eq(ArticleTable.id, id),
      columns: { status: true }
    })

    if (Object.keys(parsed).length > 0) {
      await db.update(ArticleTable).set(parsed).where(eq(ArticleTable.id, id))
    }
    if (tagIds) {
      await this.replaceTags(id, tagIds)
    }

    const updated = await this.findById(id)

    // A publish event triggers a one-off newsletter send to every active
    // subscriber. Lives here (not in the PATCH route) so any future caller of
    // update() gets the same guarantee, not just this one endpoint.
    if (before && before.status !== 'published' && updated?.status === 'published') {
      await this.notifySubscribersOfPublish(updated)
    }

    return updated
  },

  async notifySubscribersOfPublish(article: Article) {
    const sourceTranslation =
      article.translations.find((translation) => translation.locale === article.sourceLocale) ??
      article.translations[0]
    if (!sourceTranslation) {
      return
    }

    const subscriberIds = await newsletterService.listActiveSubscriberIds()
    if (subscriberIds.length === 0) {
      return
    }

    const defaultLocale: ArticleLocale = 'en'
    const articlePath =
      article.sourceLocale === defaultLocale
        ? `/blog/${sourceTranslation.slug}`
        : `/${article.sourceLocale}/blog/${sourceTranslation.slug}`

    const job = await jobsService.create('newsletter_send', {
      articleId: article.id,
      title: sourceTranslation.title,
      description: sourceTranslation.description,
      articlePath,
      subscriberIds
    })
    await jobsService.run(job.id).catch(() => {
      // Failure is already persisted on the job row (and surfaced as a
      // notification) by jobsService — publishing the article itself must
      // not fail just because some/all newsletter sends did.
    })
  },

  // Only archived articles can be deleted — publishing/draft state must be
  // moved to "archived" first, as a deliberate speed bump against deleting
  // something still live or in progress by mistake.
  async remove(id: string) {
    const article = await this.findById(id)
    if (!article) {
      throw createError({ statusCode: 404, message: 'Article not found' })
    }
    if (article.status !== 'archived') {
      throw createError({
        statusCode: 400,
        message: 'Only archived articles can be deleted'
      })
    }
    await db.delete(ArticleTable).where(eq(ArticleTable.id, id))
    return { id }
  },

  async incrementViews(id: string) {
    await db
      .update(ArticleTable)
      .set({ views: sql`${ArticleTable.views} + 1` })
      .where(eq(ArticleTable.id, id))
  },

  async upsertTranslation(
    articleId: string,
    payload: z.infer<typeof articleTranslationPayloadSchema>
  ) {
    const parsed = articleTranslationPayloadSchema.parse(payload)
    // Always normalize — an explicitly-typed slug ("Mon Article !") was
    // previously stored verbatim (spaces, accents, punctuation and all),
    // producing a broken public URL and a value that looked nothing like
    // what a "slug" should be when reopened for editing.
    const slug = slugify(parsed.slug ?? parsed.title)
    const existing = await db.query.ArticleTranslationTable.findFirst({
      where: and(
        eq(ArticleTranslationTable.articleId, articleId),
        eq(ArticleTranslationTable.locale, parsed.locale)
      )
    })

    const values = {
      locale: parsed.locale,
      translationStatus: parsed.translationStatus,
      title: parsed.title,
      slug,
      description: parsed.description,
      seoTitle: parsed.seoTitle,
      seoDescription: parsed.seoDescription,
      content: parsed.content,
      contentFormat: parsed.contentFormat,
      contentBlocks: parsed.contentBlocks,
      resources: parsed.resources,
      correctionNotes: parsed.correctionNotes
    }

    if (existing) {
      await db
        .update(ArticleTranslationTable)
        .set(values)
        .where(eq(ArticleTranslationTable.id, existing.id))
    } else {
      await db.insert(ArticleTranslationTable).values({ ...values, articleId })
    }

    return this.findById(articleId)
  },

  async replaceTags(articleId: string, tagIds: string[]) {
    await db.delete(ArticleTagLinkTable).where(eq(ArticleTagLinkTable.articleId, articleId))
    if (tagIds.length > 0) {
      await db.insert(ArticleTagLinkTable).values(
        tagIds.map((tagId) => ({
          articleId,
          tagId
        }))
      )
    }
    return this.findById(articleId)
  }
}
