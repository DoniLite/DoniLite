import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as ArticleSchema from './schema/article.schema'
import * as ContactSchema from './schema/contact.schema'
import * as UserSchema from './schema/user.schema'
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const db = drizzle(process.env.DATABASE_URL!, {
  schema: { ...UserSchema, ...ContactSchema, ...ArticleSchema }
})
