<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { Home, Inbox, ListChecks, PenBox, Users } from 'lucide-vue-next'

const { t } = useI18n()

const items = computed(() => [
  {
    title: t('admin.nav.home'),
    url: '/dashboard/admin',
    icon: Home
  },
  {
    title: t('admin.nav.inbox'),
    url: '/dashboard/admin/inbox',
    icon: Inbox
  },
  {
    title: t('admin.nav.posts'),
    url: '/dashboard/admin/posts',
    icon: PenBox
  },
  {
    title: t('admin.nav.contacts'),
    url: '/dashboard/admin/contacts',
    icon: Users
  },
  {
    title: t('admin.nav.jobs'),
    url: '/dashboard/admin/jobs',
    icon: ListChecks
  }
])

const { user, refreshSession, logout } = useSession()

const route = useRoute()
const isActive = (url: string) => {
  return url === '/dashboard/admin' ? route.path === url : route.path.startsWith(url)
}

onMounted(async () => {
  await refreshSession()
})
</script>

<template>
  <Sidebar>
    <SidebarContent class="flex h-screen flex-col justify-between">
      <div>
        <SidebarHeader>
          <NuxtLink
            to="/"
            exact-active-class="active-link"
            class="flex items-center gap-2 px-2 py-1"
          >
            <img
              src="/icon.png"
              :alt="$t('name')"
              class="border-border h-8 w-8 rounded-full border object-cover"
            />
            <span class="text-foreground font-bold tracking-tight">{{ $t('name') }}</span>
          </NuxtLink>
        </SidebarHeader>

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
                    isActive(item.url) && 'bg-primary text-primary-foreground'
                  ]"
                >
                  <NuxtLink
                    :to="item.url"
                    exact-active-class="active-link"
                  >
                    <component :is="item.icon" />
                    <span>{{ item.title }}</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </div>

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
