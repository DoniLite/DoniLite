import { articleService } from '~~/server/lib/service/article.service'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing article id' })
  }

  const article = await articleService.findById(id)
  if (!article) {
    throw createError({ statusCode: 404, message: 'Article not found' })
  }

  return article
})
