<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { Calendar, Home, Inbox, PenBox, Search, Settings } from 'lucide-vue-next'

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/dashboard/admin',
    icon: Home
  },
  {
    title: 'Inbox',
    url: '/dashboard/admin/inbox',
    icon: Inbox
  },
  {
    title: 'Posts',
    url: '/dashboard/admin/posts',
    icon: PenBox
  },
  {
    title: 'Calendar',
    url: '#',
    icon: Calendar
  },
  {
    title: 'Search',
    url: '#',
    icon: Search
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings
  }
]

const { user, refreshSession, logout } = useSession()

const route = useRoute()
const isActive = (url: string) => {
  return route.path === url
}

onMounted(async () => {
  await refreshSession()
})
</script>

<template>
  <Sidebar>
    <SidebarContent class="flex h-screen flex-col justify-between">
      <SidebarGroup>
        <SidebarGroupLabel>{{ $t('common.dashboard') }}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem
              v-for="item in items"
              :key="item.title"
            >
              <SidebarMenuButton
                as-child
                :class="[
                  'hover:bg-primary hover:text-primary-foreground',
                  isActive(item.url) && 'hover:bg-transparent'
                ]"
              >
                <NuxtLink :to="item.url">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarFooter>
        <AdminUser
          :on-logout="logout"
          :user="{
            login: user?.login as string,
            avatar: user?.avatar as string | undefined
          }"
        />
      </SidebarFooter>
    </SidebarContent>
  </Sidebar>
</template>
