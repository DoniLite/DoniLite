import dotenv from 'dotenv'
import type { Languages, RawRepoResponse, Repos, Repos_Tags } from '~/shared/types'
import { GITHUB_CLIENT } from '../lib/REST/github'
dotenv.config()

export const extractResponseObj = async <T extends RawRepoResponse>(obj: T) => {
  const client = new GITHUB_CLIENT({ auth: process.env.GITHUB_TOKEN })
  const langs = await client.request<Languages>(obj.languages_url)
  const tags = await client.request<Repos_Tags>(obj.tags_url)
  const out: Partial<Repos> = {}
  for (const [key, v] of Object.entries(obj)) {
    if (key === 'languages_url') {
      out['languages'] = langs
      continue
    }
    if (key === 'tags_url') {
      out['tags'] = tags
      continue
    }
    out[key as keyof Repos] = v
  }
  return out
}

export const extractRepos = async (repos: RawRepoResponse[]) => {
  const promises = repos.map((repo) => extractResponseObj(repo))
  return Promise.all(promises)
}
