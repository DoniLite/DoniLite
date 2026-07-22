<script setup lang="ts">
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { notificationService } from '~/lib/service/notification.service'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const localePath = useLocalePath()
const { d } = useI18n()
const { data: notifications, refresh } = await notificationService.list()

const markRead = async (id: string) => {
  await notificationService.markRead(id)
  await refresh()
}

const markAllRead = async () => {
  await notificationService.markAllRead()
  await refresh()
}

const open = async (notification: (typeof notifications.value)[number]) => {
  if (!notification.read) {
    await markRead(notification.id)
  }
  if (notification.link) {
    await navigateTo(localePath(notification.link))
  }
}
</script>

<template>
  <div class="flex flex-col gap-6 p-4">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h1 class="text-foreground text-2xl font-bold">
          {{ $t('admin.notificationsPanel.title') }}
        </h1>
      </div>
      <Button
        variant="outline"
        size="sm"
        :disabled="notifications.every((n) => n.read)"
        @click="markAllRead"
      >
        {{ $t('admin.notificationsPanel.markAllRead') }}
      </Button>
    </div>

    <div
      v-if="notifications.length === 0"
      class="text-muted-foreground rounded-md border border-dashed p-6 text-center text-sm"
    >
      {{ $t('admin.notificationsPanel.empty') }}
    </div>

    <div
      v-else
      class="border-border divide-border divide-y rounded-lg border"
    >
      <button
        v-for="notification in notifications"
        :key="notification.id"
        class="hover:bg-muted/50 flex w-full items-start justify-between gap-3 p-4 text-left"
        :class="!notification.read && 'bg-muted/30'"
        @click="open(notification)"
      >
        <div>
          <p class="text-sm">{{ notification.message }}</p>
          <p class="text-muted-foreground mt-1 text-xs">
            {{ notification.createdAt ? d(new Date(notification.createdAt)) : '' }}
          </p>
        </div>
        <Badge
          v-if="!notification.read"
          variant="default"
        >
          {{ $t('admin.notificationsPanel.new') }}
        </Badge>
      </button>
    </div>
  </div>
</template>
