import { and, asc, count, desc, eq, ilike, or, type SQL } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~~/db/conf'
import { ContactTable, MessageTable } from '~~/db/schema/contact.schema'
import { sendMail } from '~~/server/lib/mail/sendMail'
import type { PaginatedResult } from '~~/shared/types'
import { notificationsService } from './notifications.service'

export const contactMessagePayloadSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(1).max(5000)
})

export const messageStateSchema = z.object({
  state: z.enum(['new', 'opened', 'archived'])
})

type MessageStateFilter = z.infer<typeof messageStateSchema>['state']

export const contactService = {
  async listContacts(options: { page?: number; pageSize?: number } = {}) {
    const page = options.page ?? 1
    const pageSize = options.pageSize ?? 10
    const [totalRows, items] = await Promise.all([
      db.select({ value: count() }).from(ContactTable),
      db.query.ContactTable.findMany({
        orderBy: [desc(ContactTable.createdAt)],
        limit: pageSize,
        offset: (page - 1) * pageSize
      })
    ])
    return { items, total: totalRows[0]?.value ?? 0, page, pageSize }
  },

  async listMessages(
    options: {
      page?: number
      pageSize?: number
      state?: MessageStateFilter
      search?: string
      orderDir?: 'asc' | 'desc'
    } = {}
  ): Promise<
    PaginatedResult<{
      id: string
      message: string
      state: MessageStateFilter | null
      date: Date | null
      user: { name: string; email: string }
    }>
  > {
    const page = options.page ?? 1
    const pageSize = options.pageSize ?? 10

    const conditions: SQL[] = []
    if (options.state) {
      conditions.push(eq(MessageTable.state, options.state))
    }
    if (options.search) {
      const term = `%${options.search}%`
      const searchCondition = or(ilike(ContactTable.name, term), ilike(MessageTable.message, term))
      if (searchCondition) {
        conditions.push(searchCondition)
      }
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined
    const orderBy =
      options.orderDir === 'asc' ? asc(MessageTable.createdAt) : desc(MessageTable.createdAt)

    const [totalRows, rows] = await Promise.all([
      db
        .select({ value: count() })
        .from(MessageTable)
        .innerJoin(ContactTable, eq(MessageTable.contactId, ContactTable.id))
        .where(where),
      db
        .select({
          id: MessageTable.id,
          message: MessageTable.message,
          state: MessageTable.state,
          date: MessageTable.createdAt,
          name: ContactTable.name,
          email: ContactTable.email
        })
        .from(MessageTable)
        .innerJoin(ContactTable, eq(MessageTable.contactId, ContactTable.id))
        .where(where)
        .orderBy(orderBy)
        .limit(pageSize)
        .offset((page - 1) * pageSize)
    ])

    return {
      items: rows.map((row) => ({
        id: row.id,
        message: row.message,
        state: row.state,
        date: row.date,
        user: { name: row.name, email: row.email }
      })),
      total: totalRows[0]?.value ?? 0,
      page,
      pageSize
    }
  },

  async updateMessageState(id: string, state: z.infer<typeof messageStateSchema>['state']) {
    await db.update(MessageTable).set({ state }).where(eq(MessageTable.id, id))
    return { id, state }
  },

  async deleteMessage(id: string) {
    await db.delete(MessageTable).where(eq(MessageTable.id, id))
    return { id }
  },

  async replyToMessage(id: string, body: string) {
    const row = await db
      .select({ email: ContactTable.email, name: ContactTable.name })
      .from(MessageTable)
      .innerJoin(ContactTable, eq(MessageTable.contactId, ContactTable.id))
      .where(eq(MessageTable.id, id))
      .then((rows) => rows[0])

    if (!row) {
      throw createError({ statusCode: 404, message: 'Message not found' })
    }

    await sendMail({
      to: row.email,
      subject: 'Re: your message to Doni Lite',
      html: body
        .split('\n')
        .map((line) => `<p>${line}</p>`)
        .join(''),
      text: body
    })

    await db.update(MessageTable).set({ state: 'opened' }).where(eq(MessageTable.id, id))
    return { success: true }
  },

  async submitMessage(payload: z.infer<typeof contactMessagePayloadSchema>) {
    const parsed = contactMessagePayloadSchema.parse(payload)

    const existingContact = await db.query.ContactTable.findFirst({
      where: eq(ContactTable.email, parsed.email)
    })

    let contactId = existingContact?.id
    if (!contactId) {
      const [contact] = await db
        .insert(ContactTable)
        .values({ name: parsed.name, email: parsed.email })
        .returning({ id: ContactTable.id })
      if (!contact) {
        throw createError({ statusCode: 500, message: 'Contact creation failed' })
      }
      contactId = contact.id
    }

    const [message] = await db
      .insert(MessageTable)
      .values({ contactId, message: parsed.message })
      .returning({ id: MessageTable.id })

    if (!message) {
      throw createError({ statusCode: 500, message: 'Message creation failed' })
    }

    await notificationsService.notify({
      type: 'new_message',
      message: `New message from ${parsed.name}`,
      link: '/dashboard/admin/inbox'
    })

    return { id: message.id }
  }
}
