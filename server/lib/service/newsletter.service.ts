import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~~/db/conf'
import { NewsletterSubscriberTable } from '~~/db/schema/newsletter.schema'

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

    return { id: subscriber.id }
  }
}
