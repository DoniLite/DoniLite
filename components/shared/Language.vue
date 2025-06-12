<template>
  <div class="flex items-center gap-2">
    <div
      class="h-3 w-3 rounded-full"
      :style="{ backgroundColor: colorForLanguage(language) }"
    ></div>
    <span>{{ language }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  language: string
}>()

// Generate a unique color for each language using a hash function
function colorForLanguage(lang: string) {
  let hash = 0
  for (let i = 0; i < lang.length; i++) {
    hash = lang.charCodeAt(i) + ((hash << 5) - hash)
  }
  // Convert hash to hex color
  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ('00' + value.toString(16)).slice(-2)
  }
  return color
}

const language = computed(() => props.language)
</script>
