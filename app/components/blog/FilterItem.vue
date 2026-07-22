<script setup lang="ts">
defineProps<{
  label: string
  active?: boolean
}>()
defineEmits<{ click: [] }>()
</script>

<template>
  <button
    type="button"
    :class="[
      'inline-flex h-9 items-center justify-center rounded-md px-4 text-xs font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
      active
        ? 'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring'
        : 'bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground border'
    ]"
    @click="$emit('click')"
  >
    {{ label }}
  </button>
</template>
