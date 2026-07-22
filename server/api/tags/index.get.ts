import { tagsService } from '~~/server/lib/service/tags.service'

export default defineEventHandler(async () => {
  return tagsService.list()
})
