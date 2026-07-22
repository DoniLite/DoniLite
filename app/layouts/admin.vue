<script setup lang="ts">
import NotificationsBell from '@/components/admin/NotificationsBell.vue'
import AppSidebar from '@/components/DashboardLayout.vue'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main class="container mx-auto">
      <div class="mt-6 flex w-full items-center justify-between p-4">
        <div class="flex items-center gap-3">
          <SidebarTrigger
            class="cursor-pointer"
            icon-class="h-6 w-6"
          />
          <NotificationsBell />
        </div>
        <div class="flex items-center gap-3">
          <ThemingTrigger />
          <LanguageTrigger />
        </div>
      </div>
      <slot />
    </main>
  </SidebarProvider>
</template>
