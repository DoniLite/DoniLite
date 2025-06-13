import { reposDTO } from '../lib/DTO/repos.dto'
import type { LoadReposConfig } from '../lib/REST/github'
import { GITHUB_CLIENT } from '../lib/REST/github'

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as Record<string, string>
  const options: LoadReposConfig = {
    per_page: parseInt(query.per_page || '10'),
    sort: query.sort as 'created' | 'updated' | 'pushed' | 'full_name',
    direction: query.direction as 'asc' | 'desc',
    visibility: query.visibility as 'all' | 'public' | 'private',
    type: query.type as 'all' | 'owner' | 'member'
  }

  const repos = await GITHUB_CLIENT.loadRepository(options)
  return reposDTO(repos)
})
