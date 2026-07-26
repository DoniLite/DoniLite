import { count, desc, eq } from 'drizzle-orm'
import { db } from '~~/db/conf'
import { JobTable } from '~~/db/schema/job.schema'
import { jobHandlers } from '~~/server/lib/jobs/registry'
import { notificationsService } from '~~/server/lib/service/notifications.service'
import type { JobStatus, JobType, PaginatedResult } from '~~/shared/types'
import { JobExecutionError } from '../jobs/errors'

type JobRow = typeof JobTable.$inferSelect

export const jobsService = {
  async create(type: JobType, payload: unknown) {
    const [job] = await db.insert(JobTable).values({ type, payload }).returning()
    if (!job) {
      throw createError({ statusCode: 500, message: 'Job creation failed' })
    }
    return job
  },

  async findById(id: string) {
    return db.query.JobTable.findFirst({ where: eq(JobTable.id, id) })
  },

  async list(
    options: { status?: JobStatus; page?: number; pageSize?: number } = {}
  ): Promise<PaginatedResult<JobRow>> {
    const page = options.page ?? 1
    const pageSize = options.pageSize ?? 10
    const where = options.status ? eq(JobTable.status, options.status) : undefined

    const [totalRows, items] = await Promise.all([
      db.select({ value: count() }).from(JobTable).where(where),
      db.query.JobTable.findMany({
        where,
        orderBy: [desc(JobTable.createdAt)],
        limit: pageSize,
        offset: (page - 1) * pageSize
      })
    ])

    return { items, total: totalRows[0]?.value ?? 0, page, pageSize }
  },

  async run(id: string) {
    const job = await this.findById(id)
    if (!job) {
      throw createError({ statusCode: 404, message: 'Job not found' })
    }
    return this.execute(job)
  },

  async retry(id: string) {
    const job = await this.findById(id)
    if (!job) {
      throw createError({ statusCode: 404, message: 'Job not found' })
    }
    const retryCount = job.retryCount + 1
    await db.update(JobTable).set({ retryCount }).where(eq(JobTable.id, id))
    return this.execute({ ...job, retryCount })
  },

  async execute(job: JobRow) {
    await db
      .update(JobTable)
      .set({ status: 'running', lastRunAt: new Date() })
      .where(eq(JobTable.id, job.id))

    const handler = jobHandlers[job.type as JobType]
    try {
      const result = await handler(job.payload, job.result)
      await db
        .update(JobTable)
        .set({ status: 'success', result: result ?? null, error: null })
        .where(eq(JobTable.id, job.id))
      return { ...job, status: 'success' as const, result }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Job failed'
      const partialResult = error instanceof JobExecutionError ? error.partialResult : job.result

      await db
        .update(JobTable)
        .set({ status: 'failed', error: message, result: partialResult ?? null })
        .where(eq(JobTable.id, job.id))

      await notificationsService.notify({
        type: 'job_failed',
        message: `Job "${job.type}" failed: ${message}`,
        link: '/dashboard/admin/jobs'
      })

      throw createError({ statusCode: 500, message })
    }
  }
}
