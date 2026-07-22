import type {
  CreateSeasonRequest,
  CreateSeriesRequest,
  SeasonEntry,
  SeriesEntry
} from '~/lib/request/series.request'

export const seriesService = {
  async list() {
    return useFetch<SeriesEntry[]>('/api/series', { default: () => [] })
  },
  async createSeries(payload: CreateSeriesRequest) {
    return $fetch<SeriesEntry>('/api/series', { method: 'POST', body: payload })
  },
  async createSeason(seriesId: string, payload: CreateSeasonRequest) {
    return $fetch<SeasonEntry>(`/api/series/${seriesId}/seasons`, {
      method: 'POST',
      body: payload
    })
  }
}
