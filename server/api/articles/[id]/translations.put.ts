import {
  articleService,
  articleTranslationPayloadSchema
} from '~~/server/lib/service/article.service'
import { assertAuthenticated } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  assertAuthenticated(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing article id' })
  }

  const body = articleTranslationPayloadSchema.parse(await readBody(event))
  const article = await articleService.upsertTranslation(id, body)
  if (!article) {
    throw createError({ statusCode: 404, message: 'Article not found' })
  }

  return article
})
