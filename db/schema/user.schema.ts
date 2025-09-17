import { createId } from '@paralleldrive/cuid2'
import * as T from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { Timestamp } from './shared.schema'

export const userTypeEnum = T.pgEnum('user_type', ['admin', 'user'])

export const UserTable = pgTable('users', {
  id: T.text()
    .primaryKey()
    .$default(() => createId()),
  login: T.text().unique().notNull(),
  password: T.text().notNull(),
  avatar: T.text(),
  userType: userTypeEnum().$default(() => 'user'),
  ...Timestamp
})
