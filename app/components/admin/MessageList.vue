<script setup lang="ts">
import type { MessageEntry } from '~/lib/request/message.request'
import { messageService } from '~/lib/service/message.service'
import MessageCard from '../shared/MessageCard.vue'
import SearchBar from '../shared/SearchBar.vue'
interface Props {
  extend?: boolean
}

type Emits = {
  delete: [id: string]
  open: [value: MessageEntry]
  archive: [id: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { data: messages } = await messageService.list()
const searchQuery = ref('')

const filteredMessages = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    return messages.value
  }
  return messages.value.filter(
    (message) =>
      message.user.name.toLowerCase().includes(query) ||
      message.message.toLowerCase().includes(query)
  )
})

const handleArchive = async (id: string) => {
  await messageService.updateState(id, 'archived')
  const message = messages.value.find((m) => m.id === id)
  if (message) {
    message.state = 'archived'
  }
  emit('archive', id)
}

const handleDelete = async (id: string) => {
  await messageService.remove(id)
  messages.value = messages.value.filter((m) => m.id !== id)
  emit('delete', id)
}

const containerClass = computed(() =>
  props.extend
    ? ('bg-muted flex w-full h-full overflow-auto flex-col gap-2 rounded-lg p-3 shadow-lg' as const)
    : ('bg-muted flex w-auto h-[460px] overflow-auto flex-col gap-2 rounded-lg p-3 shadow-lg' as const)
)
</script>

<template>
  <div :class="containerClass">
    <SearchBar
      v-model="searchQuery"
      entity="messages"
    />
    <template
      v-for="message in filteredMessages"
      :key="message.id"
    >
      <MessageCard
        v-bind="message"
        @archive="handleArchive"
        @delete="handleDelete"
        @open="$emit('open', $event)"
      />
    </template>
  </div>
</template>
