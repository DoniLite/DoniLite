import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import * as T from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { Timestamp } from './shared.schema'

// Enums

export const ArticleState = T.pgEnum('article_state', ['posted', 'archived', 'draft'])

// Table Definition

export const TopicTable = pgTable('topic_table', {
  id: T.text()
    .primaryKey()
    .$default(() => createId()),
  topic: T.text().notNull()
})

export const ExtendedArticleTable = pgTable('extended_article_table', {
  id: T.text()
    .primaryKey()
    .$default(() => createId()),
  title: T.text().notNull(),
  description: T.text().notNull(),
  slug: T.text().array(),
  topicId: T.text('topic_id').references(() => TopicTable.id),
  content: T.text().notNull()
})

export const ArticleTable = pgTable('article_table', {
  id: T.text()
    .primaryKey()
    .$default(() => createId()),
  status: ArticleState().$default(() => 'draft'),
  fr: T.text().references(() => ExtendedArticleTable.id),
  en: T.text().references(() => ExtendedArticleTable.id),
  views: T.integer().$default(() => 0),
  ...Timestamp
})

// Relations

export const TopicRelation = relations(TopicTable, ({ many }) => ({
  extendedArticleTable: many(ExtendedArticleTable)
}))

export const ExtendedArticleRelationToTopic = relations(ExtendedArticleTable, ({ one }) => ({
  topicTable: one(TopicTable, {
    fields: [ExtendedArticleTable.topicId],
    references: [TopicTable.id]
  })
}))

export const ExtendedArticleRelationToArticle = relations(ExtendedArticleTable, ({ many }) => ({
  articleTable: many(ArticleTable)
}))

export const ArticleRelationToFr = relations(ArticleTable, ({ one }) => ({
  extendedArticleTable: one(ExtendedArticleTable, {
    fields: [ArticleTable.fr],
    references: [ExtendedArticleTable.id]
  })
}))

export const ArticleRelationToEn = relations(ArticleTable, ({ one }) => ({
  extendedArticleTable: one(ExtendedArticleTable, {
    fields: [ArticleTable.en],
    references: [ExtendedArticleTable.id]
  })
}))
