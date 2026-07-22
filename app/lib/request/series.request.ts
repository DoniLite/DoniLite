export interface SeasonEntry {
  id: string
  seriesId: string | null
  title: string
  slug: string
  description: string | null
  position: number
}

export interface SeriesEntry {
  id: string
  title: string
  slug: string
  description: string | null
  seasons: SeasonEntry[]
}

export interface CreateSeriesRequest {
  title: string
  description?: string | null
}

export interface CreateSeasonRequest {
  title: string
  description?: string | null
}
