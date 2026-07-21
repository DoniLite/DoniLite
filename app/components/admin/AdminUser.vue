<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from 'lucide-vue-next'
import EntityAvatar from '../shared/EntityAvatar.vue'

defineProps<{
  user: {
    login: string
    avatar?: string
  }
  onLogout: () => Promise<void>
}>()
const { isMobile } = useSidebar()
const { t } = useI18n()
const localPath = useLocalePath()

const handleClick = (path: string) => {
  void navigateTo(localPath(path))
}
</script>
<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <div
            size="lg"
            class="hover:bg-background hover:text-foreground focus:bg-background focus:text-foreground flex cursor-pointer items-center gap-2 rounded-md p-3"
          >
            <EntityAvatar
              class="h-8 w-8"
              :image="user.avatar"
              :name="user.login"
              :alt-text="t('common.avatarAltText')"
            />
            <div class="grid flex-1 text-left text-sm leading-tight">
              <!-- <span class="truncate font-semibold">{{ user.name }}</span> -->
              <span class="truncate text-xs">{{ user.login }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <EntityAvatar
                class="h-8 w-8"
                :image="user.avatar"
                :name="user.login"
                :alt-text="t('common.avatarAltText')"
              />
              <div class="grid flex-1 text-left text-sm leading-tight">
                <!-- <span class="truncate font-semibold">{{ user.name }}</span> -->
                <span class="truncate text-xs">{{ user.login }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem @click="handleClick('dashboard/admin/account')">
              <BadgeCheck />
              {{ t('admin.account') }}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell />
              {{ t('admin.notifications') }}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="onLogout">
            <LogOut />
            {{ t('admin.logout') }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
