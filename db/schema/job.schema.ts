import { createId } from '@paralleldrive/cuid2'
import * as T from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { Timestamp } from './shared.schema'

export const JobType = T.pgEnum('job_type', ['article_translation', 'newsletter_send'])
export const JobStatus = T.pgEnum('job_status', ['pending', 'running', 'success', 'failed'])

export const JobTable = pgTable('jobs', {
  id: T.text()
    .primaryKey()
    .$default(() => createId()),
  type: JobType().notNull(),
  status: JobStatus().notNull().default('pending'),
  payload: T.jsonb().notNull(),
  result: T.jsonb(),
  error: T.text(),
  retryCount: T.integer('retry_count').notNull().default(0),
  lastRunAt: T.timestamp('last_run_at'),
  ...Timestamp
})
