<script setup lang="ts">
import AppSidebar from '@/components/DashboardLayout.vue'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main class="w-full">
      <div class="container mx-auto mt-6 flex items-center justify-between p-4">
        <div>
          <SidebarTrigger class="h-12 w-12 cursor-pointer" />
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
