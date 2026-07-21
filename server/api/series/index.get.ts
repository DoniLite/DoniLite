import { seriesService } from '~~/server/lib/service/series.service'

export default defineEventHandler(async () => {
  return seriesService.list()
})
