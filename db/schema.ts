import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'

export const ContactTable = pgTable('contacts', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  message: varchar().notNull()
})
