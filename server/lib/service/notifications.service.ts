import { desc, eq } from 'drizzle-orm'
import { db } from '~~/db/conf'
import { NotificationTable } from '~~/db/schema/notification.schema'
import type { NotificationType } from '~~/shared/types'

export interface NotifyPayload {
  type: NotificationType
  message: string
  link?: string
}

export const notificationsService = {
  async notify(payload: NotifyPayload) {
    await db.insert(NotificationTable).values({
      type: payload.type,
      message: payload.message,
      link: payload.link
    })
  },

  async list(options: { unreadOnly?: boolean } = {}) {
    return db.query.NotificationTable.findMany({
      where: options.unreadOnly ? eq(NotificationTable.read, false) : undefined,
      orderBy: [desc(NotificationTable.createdAt)]
    })
  },

  async markRead(id: string) {
    await db.update(NotificationTable).set({ read: true }).where(eq(NotificationTable.id, id))
    return { id }
  },

  async markAllRead() {
    await db.update(NotificationTable).set({ read: true }).where(eq(NotificationTable.read, false))
  },

  async countUnread() {
    const rows = await db.query.NotificationTable.findMany({
      where: eq(NotificationTable.read, false),
      columns: { id: true }
    })
    return rows.length
  }
}
