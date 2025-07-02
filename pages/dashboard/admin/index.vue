<script setup lang="ts">
import { PlusSquare } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin'
})
</script>

<template>
  <div class="container mx-auto p-4 lg:p-8">
    <div class="flex w-full items-center justify-between lg:flex-row">
      <div>
        <h1 class="text-lg font-bold lg:text-4xl">{{ $t('admin.index.dashboard') }}</h1>
        <p class="mt-2">{{ $t('admin.index.description') }}</p>
      </div>

      <PlusSquare class="text-primary h-8 w-8 cursor-pointer" />
    </div>
  </div>
</template>
