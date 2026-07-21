import { createSeriesPayloadSchema, seriesService } from '~~/server/lib/service/series.service'
import { assertAuthenticated } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  assertAuthenticated(event)
  const body = createSeriesPayloadSchema.parse(await readBody(event))
  return seriesService.createSeries(body)
})
