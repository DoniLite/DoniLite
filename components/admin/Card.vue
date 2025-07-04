<script setup lang="ts">
import type { Component } from 'vue'

interface AdminCardProps {
  statsIcon: Component
  title: string
  total: number
  stats: number
}
const props = defineProps<AdminCardProps>()

const Icon = props.statsIcon

const isStateNegative = computed(() => props.stats.toString().includes('-'))
</script>

<template>
  <div class="bg-card grid h-[300px] w-full grid-rows-[40%_40%_20%] rounded-lg p-4">
    <div class="flex h-full w-full items-center justify-between">
      <Icon class="text-primary h-12 w-12" />
      <h1 class="text-card-foreground text-2xl font-bold lg:text-4xl">{{ title }}</h1>
    </div>

    <div class="fleX h-full w-full items-center justify-center">
      <H1 class="text-primary text-3xl font-bold lg:text-6xl">{{ total }}</H1>
    </div>

    <div class="flex h-full w-full items-center">
      <span :class="isStateNegative ? 'font-bold text-red-500' : 'font-bold text-green-500'">
        {{ `${stats}%` }}
      </span>
    </div>
  </div>
</template>
