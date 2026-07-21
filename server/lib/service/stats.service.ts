import { count, eq } from 'drizzle-orm'
import { db } from '~~/db/conf'
import { ArticleTable, ArticleTagLinkTable, ArticleTagTable } from '~~/db/schema/article.schema'
import { ContactTable, MessageTable } from '~~/db/schema/contact.schema'

export const statsService = {
  async getDashboardStats() {
    const [postsRows, messagesRows, contactsRows] = await Promise.all([
      db.select({ value: count() }).from(ArticleTable),
      db.select({ value: count() }).from(MessageTable),
      db.select({ value: count() }).from(ContactTable)
    ])
    const postsCount = postsRows[0]?.value ?? 0
    const messagesCount = messagesRows[0]?.value ?? 0
    const contactsCount = contactsRows[0]?.value ?? 0

    const tagCounts = await db
      .select({ label: ArticleTagTable.label, value: count(ArticleTagLinkTable.articleId) })
      .from(ArticleTagLinkTable)
      .innerJoin(ArticleTagTable, eq(ArticleTagLinkTable.tagId, ArticleTagTable.id))
      .groupBy(ArticleTagTable.label)

    const totalTagLinks = tagCounts.reduce((sum, tag) => sum + tag.value, 0)
    const tagDistribution = tagCounts.map((tag) => ({
      label: tag.label,
      count: tag.value,
      value: totalTagLinks > 0 ? Math.round((tag.value / totalTagLinks) * 100) : 0
    }))

    return { postsCount, messagesCount, contactsCount, tagDistribution }
  }
}
