<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <button
    class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md px-4 text-xs font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
  >
    {{ label }}
  </button>
</template>
