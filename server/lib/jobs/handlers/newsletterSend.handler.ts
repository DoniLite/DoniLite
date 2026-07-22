import { inArray } from 'drizzle-orm'
import { db } from '~~/db/conf'
import { NewsletterSubscriberTable } from '~~/db/schema/newsletter.schema'
import { sendNewsletterEmail } from '~~/server/lib/mail/sendNewsletterEmail'
import { JobExecutionError } from '../errors'

export interface NewsletterSendPayload {
  articleId: string
  title: string
  description: string
  articlePath: string
  subscriberIds: string[]
}

export interface NewsletterSendResult {
  sent: string[]
  failed: string[]
}

export const runNewsletterSendJob = async (
  payload: NewsletterSendPayload,
  priorResult?: NewsletterSendResult
) => {
  const alreadySent = new Set(priorResult?.sent ?? [])
  const sent = [...alreadySent]
  const failed: string[] = []

  const remainingIds = payload.subscriberIds.filter((id) => !alreadySent.has(id))
  const subscribers = remainingIds.length
    ? await db.query.NewsletterSubscriberTable.findMany({
        where: inArray(NewsletterSubscriberTable.id, remainingIds)
      })
    : []

  for (const subscriber of subscribers) {
    try {
      await sendNewsletterEmail({
        to: subscriber.email,
        title: payload.title,
        description: payload.description,
        articlePath: payload.articlePath,
        unsubscribeToken: subscriber.unsubscribeToken
      })
      sent.push(subscriber.id)
    } catch {
      failed.push(subscriber.id)
    }
  }

  const result: NewsletterSendResult = { sent, failed }
  if (failed.length > 0) {
    throw new JobExecutionError(`Failed to send to ${failed.length} subscriber(s)`, result)
  }
  return result
}
