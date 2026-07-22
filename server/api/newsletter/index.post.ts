import {
  newsletterService,
  newsletterSubscribePayloadSchema
} from '~~/server/lib/service/newsletter.service'

export default defineEventHandler(async (event) => {
  const body = newsletterSubscribePayloadSchema.parse(await readBody(event))
  await newsletterService.subscribe(body)
  return { success: true }
})
