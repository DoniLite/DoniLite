<script setup lang="ts">
import type { MessageTable } from '~/db/schema/contact.schema'
import MessageCard from '../shared/MessageCard.vue'
import SearchBar from '../shared/SearchBar.vue'
interface Props {
  extend?: boolean
}

type Emits = {
  delete: [id: string]
  open: [
    value: {
      id: string
      user: {
        name: string
        profile?: string
        email: string
      }
      message: string
      date: string
      state: (typeof MessageTable.$inferInsert)['state']
    }
  ]
  archive: [id: string]
}

const props = defineProps<Props>()
defineEmits<Emits>()

const containerClass = computed(() =>
  props.extend
    ? ('bg-muted flex w-full h-full overflow-auto flex-col gap-2 rounded-lg p-3 shadow-lg' as const)
    : ('bg-muted flex w-auto h-[460px] overflow-auto flex-col gap-2 rounded-lg p-3 shadow-lg' as const)
)
</script>

<template>
  <div :class="containerClass">
    <SearchBar entity="messages" />
    <template
      v-for="message in mockMessages"
      :key="message.user.name"
    >
      <MessageCard
        v-bind="message"
        @archive="$emit('archive', $event)"
        @delete="$emit('delete', $event)"
        @open="$emit('open', $event)"
      />
    </template>
  </div>
</template>
