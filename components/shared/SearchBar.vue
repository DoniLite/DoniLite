<script setup lang="ts">
import { Search } from 'lucide-vue-next'

interface Props {
  entity: string
}

defineProps<Props>()
</script>

<template>
  <div class="mt-8 flex w-full max-w-md items-center space-x-2">
    <div class="relative flex-1">
      <Search
        class="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
        width="24"
        height="24"
      />
      <input
        type="search"
        :placeholder="$t('common.search_placeholder', { entity: entity })"
        class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border py-2 pl-9 text-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  </div>
</template>
