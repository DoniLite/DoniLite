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

export type Languages = Record<string, number>

export type Repos_Tags = { name: string }[]

type License = {
  key?: string
  name?: string
  node_id?: string
  spdx_id?: string
  url?: string
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
