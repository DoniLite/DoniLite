import type { MessageTable } from '~~/db/schema/contact.schema'

export type MessageState = (typeof MessageTable.$inferInsert)['state']

export interface MessageEntry {
  id: string
  user: {
    name: string
    email: string
    profile?: string
  }
  message: string
  date: string
  state: MessageState
}
