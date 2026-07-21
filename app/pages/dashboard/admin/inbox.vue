<script setup lang="ts">
import MessageArea from '~/components/admin/MessageArea.vue'
import MessageList from '~/components/admin/MessageList.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})
const currentMessage = ref({
  id: '',
  user: {
    name: '',
    email: ''
  },
  date: '',
  state: 'new' as 'new' | 'opened' | 'archived' | undefined | null,
  message: ''
})
const showMessage = ref(false)

const handleOpen = (message: Omit<typeof currentMessage.value, 'show'>) => {
  currentMessage.value = {
    ...message
  }
  showMessage.value = true
}

const handleArchiveOrDelete = (id: string) => {
  if (currentMessage.value.id === id) {
    showMessage.value = false
  }
}
</script>

<template>
  <div class="p-4 lg:py-8">
    <h1 class="text-foreground text-lg font-bold lg:text-4xl">
      {{ $t('admin.nav.inbox') }}
    </h1>

    <div class="mt-4 grid grid-cols-1 gap-2 lg:h-[calc(100vh-12rem)] lg:grid-cols-[60%_40%]">
      <MessageArea
        v-bind="currentMessage"
        v-model:show="showMessage"
      />
      <div
        v-if="showMessage === false"
        class="border-border bg-card flex h-full w-full items-center justify-center rounded-lg border font-bold"
      >
        {{ $t('message.fallback') }}
      </div>
      <MessageList
        :extend="true"
        @open="handleOpen"
        @archive="handleArchiveOrDelete"
        @delete="handleArchiveOrDelete"
      />
    </div>
  </div>
</template>
