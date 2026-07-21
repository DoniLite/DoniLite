import type { NewsletterSubscribeRequest } from '~/lib/request/newsletter.request'

export const newsletterService = {
  async subscribe(payload: NewsletterSubscribeRequest) {
    return $fetch<{ success: boolean }>('/api/newsletter', {
      method: 'POST',
      body: payload
    })
  }
}
