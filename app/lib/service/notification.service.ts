import type { NotificationEntry } from '~~/shared/types'

export const notificationService = {
  async list(unreadOnly = false) {
    return useFetch<NotificationEntry[]>('/api/admin/notifications', {
      query: unreadOnly ? { unreadOnly: 'true' } : undefined,
      default: () => []
    })
  },
  async unreadCount() {
    return useFetch<{ count: number }>('/api/admin/notifications/unread-count', {
      default: () => ({ count: 0 })
    })
  },
  async markRead(id: string) {
    return $fetch(`/api/admin/notifications/${id}/read`, { method: 'PATCH' })
  },
  async markAllRead() {
    return $fetch('/api/admin/notifications/read-all', { method: 'PATCH' })
  }
}
