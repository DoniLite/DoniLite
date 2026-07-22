import type { NewsletterSubscribeRequest } from '~/lib/request/newsletter.request'

export interface NewsletterSubscriberEntry {
  id: string
  email: string
  unsubscribedAt?: string | Date | null
  createdAt?: string | Date | null
}

export const newsletterService = {
  async subscribe(payload: NewsletterSubscribeRequest) {
    return $fetch<{ success: boolean }>('/api/newsletter', {
      method: 'POST',
      body: payload
    })
  },
  async listSubscribers() {
    return useFetch<NewsletterSubscriberEntry[]>('/api/admin/newsletter', { default: () => [] })
  }
}
