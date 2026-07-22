<script setup lang="ts">
import { Bell } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { notificationService } from '~/lib/service/notification.service'

const localePath = useLocalePath()
const { data: unread, refresh: refreshCount } = await notificationService.unreadCount()
const { data: notifications, refresh: refreshList } = await notificationService.list()

const recent = computed(() => notifications.value.slice(0, 6))

const refreshAll = async () => {
  await Promise.all([refreshCount(), refreshList()])
}

const open = async (link?: string | null) => {
  if (link) {
    await navigateTo(localePath(link))
  }
}

const markAllRead = async () => {
  await notificationService.markAllRead()
  await refreshAll()
}
</script>

<template>
  <DropdownMenu @update:open="(isOpen) => isOpen && refreshAll()">
    <DropdownMenuTrigger as-child>
      <button class="relative cursor-pointer">
        <Bell class="h-6 w-6" />
        <span
          v-if="unread.count > 0"
          class="bg-destructive text-destructive-foreground absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold"
        >
          {{ unread.count > 9 ? '9+' : unread.count }}
        </span>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      class="w-80"
      align="start"
    >
      <div class="flex items-center justify-between px-2 py-1.5">
        <DropdownMenuLabel class="p-0">
          {{ $t('admin.notificationsPanel.title') }}
        </DropdownMenuLabel>
        <button
          v-if="unread.count > 0"
          class="text-primary text-xs hover:underline"
          @click="markAllRead"
        >
          {{ $t('admin.notificationsPanel.markAllRead') }}
        </button>
      </div>
      <DropdownMenuSeparator />

      <p
        v-if="recent.length === 0"
        class="text-muted-foreground p-3 text-center text-sm"
      >
        {{ $t('admin.notificationsPanel.empty') }}
      </p>
      <DropdownMenuItem
        v-for="notification in recent"
        :key="notification.id"
        :class="!notification.read && 'bg-muted/50'"
        @click="open(notification.link)"
      >
        <div class="flex flex-col gap-0.5">
          <span class="text-sm">{{ notification.message }}</span>
        </div>
      </DropdownMenuItem>

      <DropdownMenuSeparator />
      <DropdownMenuItem as-child>
        <NuxtLink :to="localePath('/dashboard/admin/notifications')">
          {{ $t('admin.notificationsPanel.viewAll') }}
        </NuxtLink>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
