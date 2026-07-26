import { count, desc, eq, isNull } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~~/db/conf'
import { NewsletterSubscriberTable } from '~~/db/schema/newsletter.schema'
import type { PaginatedResult } from '~~/shared/types'
import { notificationsService } from './notifications.service'

export const newsletterSubscribePayloadSchema = z.object({
  email: z.string().trim().email().max(320)
})

export const newsletterService = {
  async subscribe(payload: z.infer<typeof newsletterSubscribePayloadSchema>) {
    const parsed = newsletterSubscribePayloadSchema.parse(payload)

    const existing = await db.query.NewsletterSubscriberTable.findFirst({
      where: eq(NewsletterSubscriberTable.email, parsed.email)
    })
    if (existing) {
      return { id: existing.id }
    }

    const [subscriber] = await db
      .insert(NewsletterSubscriberTable)
      .values({ email: parsed.email })
      .returning({ id: NewsletterSubscriberTable.id })

    if (!subscriber) {
      throw createError({ statusCode: 500, message: 'Subscription failed' })
    }

    await notificationsService.notify({
      type: 'new_subscriber',
      message: `New newsletter subscriber: ${parsed.email}`,
      link: '/dashboard/admin/contacts?tab=newsletter'
    })

    return { id: subscriber.id }
  },

  async listSubscribers(
    options: { page?: number; pageSize?: number } = {}
  ): Promise<PaginatedResult<typeof NewsletterSubscriberTable.$inferSelect>> {
    const page = options.page ?? 1
    const pageSize = options.pageSize ?? 10
    const [totalRows, items] = await Promise.all([
      db.select({ value: count() }).from(NewsletterSubscriberTable),
      db.query.NewsletterSubscriberTable.findMany({
        orderBy: [desc(NewsletterSubscriberTable.createdAt)],
        limit: pageSize,
        offset: (page - 1) * pageSize
      })
    ])
    return { items, total: totalRows[0]?.value ?? 0, page, pageSize }
  },

  async listActiveSubscriberIds() {
    const rows = await db.query.NewsletterSubscriberTable.findMany({
      where: isNull(NewsletterSubscriberTable.unsubscribedAt),
      columns: { id: true }
    })
    return rows.map((row) => row.id)
  },

  // Always resolves successfully regardless of whether the token is valid —
  // an unsubscribe endpoint shouldn't let a caller probe which tokens exist.
  async unsubscribe(token: string) {
    await db
      .update(NewsletterSubscriberTable)
      .set({ unsubscribedAt: new Date() })
      .where(eq(NewsletterSubscriberTable.unsubscribeToken, token))
    return { success: true }
  }
}
