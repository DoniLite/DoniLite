import { and, count, desc, eq, gte, sql, sum } from 'drizzle-orm'
import { db } from '~~/db/conf'
import {
  ArticleTable,
  ArticleTagLinkTable,
  ArticleTagTable,
  ArticleTranslationTable
} from '~~/db/schema/article.schema'
import { ContactTable, MessageTable } from '~~/db/schema/contact.schema'
import { JobTable } from '~~/db/schema/job.schema'
import { NewsletterSubscriberTable } from '~~/db/schema/newsletter.schema'

// Builds the last `months` "YYYY-MM" keys (oldest first) so every series can
// be filled to the same set of buckets, including months with zero activity.
const monthKeys = (months: number) => {
  const keys: string[] = []
  const cursor = new Date()
  cursor.setDate(1)
  cursor.setHours(0, 0, 0, 0)
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(cursor)
    date.setMonth(date.getMonth() - i)
    keys.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`)
  }
  return keys
}

const monthlyCounts = async (
  table: typeof ArticleTable | typeof MessageTable | typeof NewsletterSubscriberTable,
  since: Date
) => {
  const rows = await db
    .select({
      month: sql<string>`to_char(date_trunc('month', ${table.createdAt}), 'YYYY-MM')`,
      value: count()
    })
    .from(table)
    .where(gte(table.createdAt, since))
    .groupBy(sql`date_trunc('month', ${table.createdAt})`)

  return new Map(rows.map((row) => [row.month, row.value]))
}

export const statsService = {
  async getDashboardStats() {
    const [postsRows, messagesRows, contactsRows, viewsRows, failedJobsRows] = await Promise.all([
      db.select({ value: count() }).from(ArticleTable),
      db.select({ value: count() }).from(MessageTable),
      db.select({ value: count() }).from(ContactTable),
      db.select({ value: sum(ArticleTable.views) }).from(ArticleTable),
      db.select({ value: count() }).from(JobTable).where(eq(JobTable.status, 'failed'))
    ])
    const postsCount = postsRows[0]?.value ?? 0
    const messagesCount = messagesRows[0]?.value ?? 0
    const contactsCount = contactsRows[0]?.value ?? 0
    const totalViews = Number(viewsRows[0]?.value ?? 0)
    const failedJobsCount = failedJobsRows[0]?.value ?? 0

    const tagCounts = await db
      .select({ label: ArticleTagTable.label, value: count(ArticleTagLinkTable.articleId) })
      .from(ArticleTagLinkTable)
      .innerJoin(ArticleTagTable, eq(ArticleTagLinkTable.tagId, ArticleTagTable.id))
      .groupBy(ArticleTagTable.label)

    const totalTagLinks = tagCounts.reduce((total, tag) => total + tag.value, 0)
    const tagDistribution = tagCounts.map((tag) => ({
      label: tag.label,
      count: tag.value,
      value: totalTagLinks > 0 ? Math.round((tag.value / totalTagLinks) * 100) : 0
    }))

    const [topArticles, monthlyGrowth] = await Promise.all([
      this.getTopArticles(),
      this.getMonthlyGrowth()
    ])

    return {
      postsCount,
      messagesCount,
      contactsCount,
      totalViews,
      failedJobsCount,
      tagDistribution,
      topArticles,
      monthlyGrowth
    }
  },

  async getTopArticles(limit = 6) {
    const rows = await db
      .select({
        id: ArticleTable.id,
        views: ArticleTable.views,
        title: ArticleTranslationTable.title
      })
      .from(ArticleTable)
      .innerJoin(
        ArticleTranslationTable,
        and(
          eq(ArticleTranslationTable.articleId, ArticleTable.id),
          eq(ArticleTranslationTable.locale, ArticleTable.sourceLocale)
        )
      )
      .orderBy(desc(ArticleTable.views))
      .limit(limit)

    return rows.map((row) => ({ label: row.title, value: row.views }))
  },

  async getMonthlyGrowth(months = 6) {
    const since = new Date()
    since.setMonth(since.getMonth() - (months - 1))
    since.setDate(1)
    since.setHours(0, 0, 0, 0)

    const [articles, messages, subscribers] = await Promise.all([
      monthlyCounts(ArticleTable, since),
      monthlyCounts(MessageTable, since),
      monthlyCounts(NewsletterSubscriberTable, since)
    ])

    return monthKeys(months).map((month, index) => ({
      x: index,
      month,
      articles: articles.get(month) ?? 0,
      messages: messages.get(month) ?? 0,
      subscribers: subscribers.get(month) ?? 0
    }))
  }
}
