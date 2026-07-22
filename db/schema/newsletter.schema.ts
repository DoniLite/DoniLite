import { createId } from '@paralleldrive/cuid2'
import * as T from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { Timestamp } from './shared.schema'

export const NewsletterSubscriberTable = pgTable('newsletter_subscribers', {
  id: T.text()
    .primaryKey()
    .$default(() => createId()),
  email: T.text().notNull().unique(),
  unsubscribeToken: T.text('unsubscribe_token')
    .notNull()
    .unique()
    .$default(() => createId()),
  unsubscribedAt: T.timestamp('unsubscribed_at'),
  ...Timestamp
})
