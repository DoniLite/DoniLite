import type { CreateTagRequest, TagEntry } from '~/lib/request/tag.request'

export const tagService = {
  async list() {
    return useFetch<TagEntry[]>('/api/tags', { default: () => [] })
  },
  async createTag(payload: CreateTagRequest) {
    return $fetch<TagEntry>('/api/tags', { method: 'POST', body: payload })
  }
}
