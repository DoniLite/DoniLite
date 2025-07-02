<script setup lang="ts">
import AppSidebar from '@/components/DashboardLayout.vue'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main class="w-full">
      <SidebarTrigger class="m-4 cursor-pointer" />
      <slot />
    </main>
  </SidebarProvider>
</template>
