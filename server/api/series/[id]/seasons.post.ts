import { createSeasonPayloadSchema, seriesService } from '~~/server/lib/service/series.service'
import { assertAuthenticated } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  assertAuthenticated(event)
  const seriesId = getRouterParam(event, 'id')
  if (!seriesId) {
    throw createError({ statusCode: 400, message: 'Missing series id' })
  }
  const body = createSeasonPayloadSchema.parse(await readBody(event))
  return seriesService.createSeason(seriesId, body)
})
