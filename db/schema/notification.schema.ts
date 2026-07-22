import { createId } from '@paralleldrive/cuid2'
import * as T from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { Timestamp } from './shared.schema'

export const NotificationType = T.pgEnum('notification_type', [
  'new_message',
  'new_subscriber',
  'job_failed',
  'translation_generated'
])

export const NotificationTable = pgTable('notifications', {
  id: T.text()
    .primaryKey()
    .$default(() => createId()),
  type: NotificationType().notNull(),
  message: T.text().notNull(),
  link: T.text(),
  read: T.boolean().notNull().default(false),
  ...Timestamp
})
