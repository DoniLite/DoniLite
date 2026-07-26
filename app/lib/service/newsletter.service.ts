import type { NewsletterSubscribeRequest } from '~/lib/request/newsletter.request'
import type { PaginatedResult } from '~~/shared/types'

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
  async listSubscribers(page = 1, pageSize = 10) {
    return useFetch<PaginatedResult<NewsletterSubscriberEntry>>('/api/admin/newsletter', {
      query: { page, pageSize },
      default: () => ({ items: [], total: 0, page: 1, pageSize })
    })
  },
  async listAllSubscribers() {
    return $fetch<PaginatedResult<NewsletterSubscriberEntry>>('/api/admin/newsletter', {
      query: { pageSize: 10000 }
    })
  }
}
