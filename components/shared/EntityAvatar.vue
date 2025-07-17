<!-- src/components/common/EntityAvatar.vue -->
<script setup lang="ts">
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  image?: string | null
  name?: string | null
  isSelected?: boolean
  fallbackText?: string // Optional: Specific fallback root text
  altText?: string // Optional: Specific alt text
  class?: HTMLAttributes['class']
}>()

const { t } = useI18n()

const imageHasError = ref(false) // Reactive variable to track image loading error

// Determine fallback: Use provided text or generate initials
const fallbackText = computed(() =>
  getInitials(props.name || props.fallbackText || t('common.fallbackText'))
)

const isImageDataValid = computed(() => {
  const { image } = props
  if (!image) {
    return false
  }
  if (typeof image === 'string') {
    return image.startsWith('http') || image.startsWith('data:image')
  }
  return true
})

function handleImageError() {
  imageHasError.value = true
}
</script>

<template>
  <Avatar :class="cn(`${isSelected ? 'border-primary border-2' : ''}`, props.class)">
    <AvatarImage
      v-if="image && isImageDataValid && !imageHasError"
      :src="image"
      :alt="altText || `${name || 'Entity'} Logo/Avatar`"
      @error="handleImageError"
    />
    <div
      v-else
      class="bg-muted flex size-full items-center justify-center rounded-full"
      data-slot="avatar-fallback"
    >
      {{ fallbackText }}
    </div>
  </Avatar>
</template>
