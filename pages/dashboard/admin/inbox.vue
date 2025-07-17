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
</script>

<template>
  <div class="container mx-auto grid h-screen grid-cols-1 gap-2 p-1 lg:grid-cols-[60%_40%] lg:p-4">
    <MessageArea
      v-bind="currentMessage"
      v-model:show="showMessage"
    />
    <div
      v-if="showMessage === false"
      class="flex h-full w-full items-center justify-center font-bold"
    >
      {{ $t('message.fallback') }}
    </div>
    <MessageList
      :extend="true"
      @open="handleOpen"
    />
  </div>
</template>
