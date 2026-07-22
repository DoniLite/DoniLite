import type { JobType } from '~~/shared/types'
import { runNewsletterSendJob } from './handlers/newsletterSend.handler'
import { runTranslationJob } from './handlers/translation.handler'

export type JobHandler = (payload: unknown, priorResult?: unknown) => Promise<unknown>

export const jobHandlers: Record<JobType, JobHandler> = {
  article_translation: runTranslationJob as JobHandler,
  newsletter_send: runNewsletterSendJob as JobHandler
}
