import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import * as T from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { Timestamp } from './shared.schema'

export const MessageState = T.pgEnum('message_state', ['opened', 'archived', 'new'])

export const ContactTable = pgTable('contacts', {
  id: T.text()
    .primaryKey()
    .$default(() => createId()),
  name: T.text().notNull(),
  email: T.text().notNull().unique(),
  ...Timestamp
})

export const ContactRelation = relations(ContactTable, ({ many }) => ({
  messageTable: many(MessageTable)
}))

export const MessageTable = pgTable('messages', {
  id: T.text()
    .primaryKey()
    .$default(() => createId()),
  contactId: T.text('contact_id').references(() => ContactTable.id),
  message: T.text().notNull(),
  state: MessageState().$default(() => 'new'),
  ...Timestamp
})

export const MessageRelation = relations(MessageTable, ({ one }) => ({
  contactTable: one(ContactTable, {
    fields: [MessageTable.contactId],
    references: [ContactTable.id]
  })
}))
