import { articleService, createArticlePayloadSchema } from '~~/server/lib/service/article.service'
import { assertAuthenticated } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  assertAuthenticated(event)
  const body = createArticlePayloadSchema.parse(await readBody(event))
  return articleService.create(body)
})
