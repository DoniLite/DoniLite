import { z } from 'zod'
import { newsletterService } from '~~/server/lib/service/newsletter.service'

const unsubscribePayloadSchema = z.object({
  token: z.string().trim().min(1)
})

export default defineEventHandler(async (event) => {
  const body = unsubscribePayloadSchema.parse(await readBody(event))
  return newsletterService.unsubscribe(body.token)
})
