<script setup lang="ts">
import FilterItem from './FilterItem.vue'

defineProps<{
  filters?: string[]
}>()
</script>

<template>
  <section class="border-b py-4 md:py-8">
    <div class="container mx-auto px-4 md:px-6">
      <div class="mx-auto max-w-5xl">
        <div class="flex flex-wrap items-center gap-2">
          <FilterItem
            v-for="filter in filters"
            :key="filter"
            :label="filter"
          />
        </div>
      </div>
    </div>
  </section>
</template>
