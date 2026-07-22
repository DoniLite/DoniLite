import { createTagPayloadSchema, tagsService } from '~~/server/lib/service/tags.service'
import { assertAuthenticated } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  assertAuthenticated(event)
  const body = createTagPayloadSchema.parse(await readBody(event))
  return tagsService.createTag(body)
})
