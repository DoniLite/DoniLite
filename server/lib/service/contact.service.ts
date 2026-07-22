import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~~/db/conf'
import { ContactTable, MessageTable } from '~~/db/schema/contact.schema'
import { sendMail } from '~~/server/lib/mail/sendMail'
import { notificationsService } from './notifications.service'

export const contactMessagePayloadSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(1).max(5000)
})

export const messageStateSchema = z.object({
  state: z.enum(['new', 'opened', 'archived'])
})

export const contactService = {
  async listContacts() {
    return db.query.ContactTable.findMany({
      orderBy: [desc(ContactTable.createdAt)]
    })
  },

  async listMessages() {
    const rows = await db
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
      .orderBy(desc(MessageTable.createdAt))

    return rows.map((row) => ({
      id: row.id,
      message: row.message,
      state: row.state,
      date: row.date,
      user: { name: row.name, email: row.email }
    }))
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
