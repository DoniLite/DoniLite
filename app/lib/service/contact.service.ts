import type { ContactMessageRequest } from '~/lib/request/contact.request'

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
  async listContacts() {
    return useFetch<ContactEntry[]>('/api/admin/contacts', { default: () => [] })
  },
  async reply(messageId: string, body: string) {
    return $fetch(`/api/messages/${messageId}/reply`, { method: 'POST', body: { body } })
  }
}
