import type { MessageEntry, MessageState } from '~/lib/request/message.request'

export const messageService = {
  async list() {
    return useFetch<MessageEntry[]>('/api/messages', { default: () => [] })
  },
  async updateState(id: string, state: MessageState) {
    return $fetch(`/api/messages/${id}`, { method: 'PATCH', body: { state } })
  },
  async remove(id: string) {
    return $fetch(`/api/messages/${id}`, { method: 'DELETE' })
  }
}
