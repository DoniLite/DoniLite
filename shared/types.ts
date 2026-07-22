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
  fork?: boolean
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

export type ArticleLocale = 'en' | 'fr'
export type ArticleStatus = 'draft' | 'published' | 'archived'
export type ArticleTranslationStatus = 'missing' | 'queued' | 'generated' | 'reviewed' | 'published'
export type ArticleContentFormat = 'markdown' | 'html' | 'tiptap_json'

export type JobType = 'article_translation' | 'newsletter_send'
export type JobStatus = 'pending' | 'running' | 'success' | 'failed'

export interface JobEntry {
  id: string
  type: JobType
  status: JobStatus
  payload: unknown
  result: unknown
  error?: string | null
  retryCount: number
  lastRunAt?: string | Date | null
  createdAt?: string | Date | null
  updatedAt?: string | Date | null
}

export type NotificationType =
  | 'new_message'
  | 'new_subscriber'
  | 'job_failed'
  | 'translation_generated'

export interface NotificationEntry {
  id: string
  type: NotificationType
  message: string
  link?: string | null
  read: boolean
  createdAt?: string | Date | null
}

export interface ArticleTranslation {
  id?: string
  locale: ArticleLocale
  translationStatus: ArticleTranslationStatus
  title: string
  description: string
  slug: string
  seoTitle?: string | null
  seoDescription?: string | null
  content: string
  contentFormat: ArticleContentFormat
  contentBlocks?: unknown
  resources?: ArticleResource[]
  correctionNotes?: string | null
}

export interface ArticleResource {
  type: 'image' | 'youtube' | 'link' | 'code' | 'file'
  url?: string
  label?: string
  language?: string
  metadata?: Record<string, unknown>
}

export interface ArticleSeries {
  id: string
  title: string
  slug: string
  description?: string | null
}

export interface ArticleSeason {
  id: string
  seriesId?: string | null
  title: string
  slug: string
  description?: string | null
  position: number
}

export interface ArticleTag {
  id: string
  label: string
  slug: string
}

export interface Article {
  id: string
  createdAt?: string | Date | null
  updatedAt?: string | Date | null
  deletedAt?: string | Date | null
  status: ArticleStatus
  sourceLocale: ArticleLocale
  coverImage?: string | null
  seriesId?: string | null
  seasonId?: string | null
  episode?: number | null
  featured: boolean
  publishedAt?: string | Date | null
  views: number
  series?: ArticleSeries | null
  season?: ArticleSeason | null
  tags?: ArticleTag[]
  translations: ArticleTranslation[]
  en?: ArticleTranslation
  fr?: ArticleTranslation
}

export type EntryType = {
  id: string
  label: string
  description?: string
}
