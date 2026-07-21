<script setup lang="ts">
import type { Component } from 'vue'

interface AdminCardProps {
  statsIcon: Component
  title: string
  total: number
}
const props = defineProps<AdminCardProps>()

const Icon = props.statsIcon
</script>

<template>
  <div
    class="bg-card border-border flex flex-col gap-3 rounded-lg border p-5 transition-shadow hover:shadow-md"
  >
    <div class="flex items-center justify-between">
      <span class="text-muted-foreground text-sm font-medium">{{ title }}</span>
      <div class="bg-primary/10 rounded-md p-2">
        <Icon class="text-primary h-5 w-5" />
      </div>
    </div>
    <span class="text-card-foreground text-3xl font-bold lg:text-4xl">{{ total }}</span>
  </div>
</template>
