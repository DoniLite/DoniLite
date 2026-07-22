import { articleService } from '~~/server/lib/service/article.service'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing article id' })
  }

  await articleService.incrementViews(id)
  return { ok: true }
})
