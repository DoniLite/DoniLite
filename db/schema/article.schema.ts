import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import * as T from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { Timestamp } from './shared.schema'

export const ArticleStatus = T.pgEnum('article_status', ['draft', 'published', 'archived'])
export const ArticleLocale = T.pgEnum('article_locale', ['en', 'fr'])
export const ArticleTranslationStatus = T.pgEnum('article_translation_status', [
  'missing',
  'queued',
  'generated',
  'reviewed',
  'published'
])
export const ArticleContentFormat = T.pgEnum('article_content_format', [
  'markdown',
  'html',
  'tiptap_json'
])

export const ArticleSeriesTable = pgTable('article_series', {
  id: T.text()
    .primaryKey()
    .$default(() => createId()),
  title: T.text().notNull(),
  slug: T.text().notNull().unique(),
  description: T.text(),
  ...Timestamp
})

export const ArticleSeasonTable = pgTable('article_seasons', {
  id: T.text()
    .primaryKey()
    .$default(() => createId()),
  seriesId: T.text('series_id').references(() => ArticleSeriesTable.id, {
    onDelete: 'cascade'
  }),
  title: T.text().notNull(),
  slug: T.text().notNull(),
  description: T.text(),
  position: T.integer().notNull().default(1),
  ...Timestamp
})

export const ArticleTable = pgTable('articles', {
  id: T.text()
    .primaryKey()
    .$default(() => createId()),
  status: ArticleStatus().notNull().default('draft'),
  sourceLocale: ArticleLocale('source_locale').notNull().default('en'),
  coverImage: T.text('cover_image'),
  seriesId: T.text('series_id').references(() => ArticleSeriesTable.id, {
    onDelete: 'set null'
  }),
  seasonId: T.text('season_id').references(() => ArticleSeasonTable.id, {
    onDelete: 'set null'
  }),
  episode: T.integer(),
  featured: T.boolean().notNull().default(false),
  publishedAt: T.timestamp('published_at'),
  views: T.integer().notNull().default(0),
  ...Timestamp
})

export const ArticleTranslationTable = pgTable(
  'article_translations',
  {
    id: T.text()
      .primaryKey()
      .$default(() => createId()),
    articleId: T.text('article_id')
      .notNull()
      .references(() => ArticleTable.id, { onDelete: 'cascade' }),
    locale: ArticleLocale().notNull(),
    translationStatus: ArticleTranslationStatus('translation_status').notNull().default('missing'),
    title: T.text().notNull(),
    slug: T.text().notNull(),
    description: T.text().notNull(),
    seoTitle: T.text('seo_title'),
    seoDescription: T.text('seo_description'),
    content: T.text().notNull().default(''),
    contentFormat: ArticleContentFormat('content_format').notNull().default('markdown'),
    contentBlocks: T.jsonb('content_blocks'),
    resources: T.jsonb(),
    correctionNotes: T.text('correction_notes'),
    ...Timestamp
  },
  (table) => ({
    articleLocaleUnique: T.uniqueIndex('article_translations_article_locale_unique').on(
      table.articleId,
      table.locale
    ),
    localeSlugUnique: T.uniqueIndex('article_translations_locale_slug_unique').on(
      table.locale,
      table.slug
    )
  })
)

export const ArticleTagTable = pgTable('article_tags', {
  id: T.text()
    .primaryKey()
    .$default(() => createId()),
  label: T.text().notNull(),
  slug: T.text().notNull().unique(),
  ...Timestamp
})

export const ArticleTagLinkTable = pgTable(
  'article_tag_links',
  {
    articleId: T.text('article_id')
      .notNull()
      .references(() => ArticleTable.id, { onDelete: 'cascade' }),
    tagId: T.text('tag_id')
      .notNull()
      .references(() => ArticleTagTable.id, { onDelete: 'cascade' })
  },
  (table) => ({
    pk: T.primaryKey({ columns: [table.articleId, table.tagId] })
  })
)

export const ArticleSeriesRelation = relations(ArticleSeriesTable, ({ many }) => ({
  seasons: many(ArticleSeasonTable),
  articles: many(ArticleTable)
}))

export const ArticleSeasonRelation = relations(ArticleSeasonTable, ({ one, many }) => ({
  series: one(ArticleSeriesTable, {
    fields: [ArticleSeasonTable.seriesId],
    references: [ArticleSeriesTable.id]
  }),
  articles: many(ArticleTable)
}))

export const ArticleRelation = relations(ArticleTable, ({ one, many }) => ({
  series: one(ArticleSeriesTable, {
    fields: [ArticleTable.seriesId],
    references: [ArticleSeriesTable.id]
  }),
  season: one(ArticleSeasonTable, {
    fields: [ArticleTable.seasonId],
    references: [ArticleSeasonTable.id]
  }),
  translations: many(ArticleTranslationTable),
  tagLinks: many(ArticleTagLinkTable)
}))

export const ArticleTranslationRelation = relations(ArticleTranslationTable, ({ one }) => ({
  article: one(ArticleTable, {
    fields: [ArticleTranslationTable.articleId],
    references: [ArticleTable.id]
  })
}))

export const ArticleTagRelation = relations(ArticleTagTable, ({ many }) => ({
  articleLinks: many(ArticleTagLinkTable)
}))

export const ArticleTagLinkRelation = relations(ArticleTagLinkTable, ({ one }) => ({
  article: one(ArticleTable, {
    fields: [ArticleTagLinkTable.articleId],
    references: [ArticleTable.id]
  }),
  tag: one(ArticleTagTable, {
    fields: [ArticleTagLinkTable.tagId],
    references: [ArticleTagTable.id]
  })
}))
