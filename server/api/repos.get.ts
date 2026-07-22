import { reposDTO } from '../lib/DTO/repos.dto'
import type { LoadReposConfig } from '../lib/REST/github'
import { GITHUB_CLIENT } from '../lib/REST/github'

export default defineCachedEventHandler(
  async (event) => {
    const query = getQuery(event) as Record<string, string>
    // `type`/`visibility` are deliberately NOT taken from the query string —
    // this endpoint only ever backs the portfolio's own project listing, and
    // letting a client override them would pull in repos the user doesn't
    // own (org repos, repos they're merely a collaborator on).
    const options: LoadReposConfig = {
      per_page: parseInt(query.per_page || '10'),
      sort: query.sort as 'created' | 'updated' | 'pushed' | 'full_name',
      direction: query.direction as 'asc' | 'desc',
      visibility: 'public',
      type: 'owner'
    }

    const repos = await GITHUB_CLIENT.loadRepository(options)
    // listForUser includes repos the user forked from someone else — those
    // aren't "my projects", so they're excluded from the portfolio.
    const ownRepos = repos.filter((repo) => !repo.fork)
    return reposDTO(ownRepos)
  },
  { maxAge: 60 * 5 }
)
