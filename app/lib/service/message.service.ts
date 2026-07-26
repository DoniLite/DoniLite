import type { MaybeRefOrGetter } from 'vue'
import type { MessageEntry, MessageState } from '~/lib/request/message.request'
import type { PaginatedResult } from '~~/shared/types'

export interface MessageListQuery {
  page?: number
  pageSize?: number
  state?: MessageState | 'all'
  search?: string
  orderDir?: 'asc' | 'desc'
}

export const messageService = {
  async list(query: MaybeRefOrGetter<MessageListQuery> = {}) {
    return useFetch<PaginatedResult<MessageEntry>>('/api/messages', {
      query: computed(() => {
        const q = toValue(query)
        return {
          page: q.page,
          pageSize: q.pageSize,
          state: q.state && q.state !== 'all' ? q.state : undefined,
          search: q.search || undefined,
          orderDir: q.orderDir
        }
      }),
      default: () => ({ items: [], total: 0, page: 1, pageSize: toValue(query).pageSize ?? 10 })
    })
  },
  async updateState(id: string, state: MessageState) {
    return $fetch(`/api/messages/${id}`, { method: 'PATCH', body: { state } })
  },
  async remove(id: string) {
    return $fetch(`/api/messages/${id}`, { method: 'DELETE' })
  }
}
