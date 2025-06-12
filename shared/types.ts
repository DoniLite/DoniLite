import { GITHUB_CLIENT } from './REST/github'

export interface Repos {
  name: string
  full_name: string
  html_url: string
  language?: string
  languages: Languages
  license?: License
  tags: Repos_Tags
  description?: string | null
  topics?: string[]
  visibility?: string
  url: string
  stargazers_count?: number
}

export interface RawRepoResponse {
  name: string
  full_name: string
  html_url: string
  language?: string | null
  languages_url: string
  license?: License | null
  description?: string | null
  tags_url: string
  topics?: string[]
  visibility?: string
  url: string
  stargazers_count?: number
}

type Languages = Record<string, number>

type Repos_Tags = string[]

type License = {
  key?: string
  name?: string
  node_id?: string
  spdx_id?: string
  url?: string
}

export const extractResponseObj = async <T extends RawRepoResponse>(obj: T) => {
  const client = new GITHUB_CLIENT()
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

type ArticleState = 'posted' | 'archived' | 'draft'
export interface Article {
  id: string | number
  createdAt: string
  updatedAt?: string
  status: ArticleState
  en: ExtendedArticle
  fr: ExtendedArticle
}

interface ExtendedArticle {
  title: string
  description: string
  slug: string[]
  topic: string
  content: string
}
