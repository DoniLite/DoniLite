import type { ContactMessageRequest } from '~/lib/request/contact.request'
import type { PaginatedResult } from '~~/shared/types'

export interface ContactEntry {
  id: string
  name: string
  email: string
  createdAt?: string | Date | null
}

export const contactService = {
  async sendMessage(payload: ContactMessageRequest) {
    return $fetch<{ success: boolean }>('/api/contact', {
      method: 'POST',
      body: payload
    })
  },
  async listContacts(page = 1, pageSize = 10) {
    return useFetch<PaginatedResult<ContactEntry>>('/api/admin/contacts', {
      query: { page, pageSize },
      default: () => ({ items: [], total: 0, page: 1, pageSize })
    })
  },
  async listAllContacts() {
    return $fetch<PaginatedResult<ContactEntry>>('/api/admin/contacts', {
      query: { pageSize: 10000 }
    })
  },
  async reply(messageId: string, body: string) {
    return $fetch(`/api/messages/${messageId}/reply`, { method: 'POST', body: { body } })
  }
}
