import type { ContactMessageRequest } from '~/lib/request/contact.request'

export const contactService = {
  async sendMessage(payload: ContactMessageRequest) {
    return $fetch<{ success: boolean }>('/api/contact', {
      method: 'POST',
      body: payload
    })
  }
}
