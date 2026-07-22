<script setup lang="ts">
import { Button } from '~/components/ui/button'

const route = useRoute()
const token = computed(() => (typeof route.query.token === 'string' ? route.query.token : ''))
const state = ref<'idle' | 'busy' | 'done' | 'error'>('idle')

const confirmUnsubscribe = async () => {
  if (!token.value) {
    state.value = 'error'
    return
  }
  state.value = 'busy'
  try {
    await $fetch('/api/newsletter/unsubscribe', {
      method: 'POST',
      body: { token: token.value }
    })
    state.value = 'done'
  } catch {
    state.value = 'error'
  }
}

useSeoMeta({
  title: 'Doni Lite | Unsubscribe',
  robots: 'noindex'
})
</script>

<template>
  <div class="bg-background flex min-h-screen items-center justify-center px-4">
    <div class="max-w-md text-center">
      <h1 class="text-foreground text-2xl font-bold">
        {{ $t('page.newsletter.unsubscribe.title') }}
      </h1>

      <p
        v-if="state === 'idle'"
        class="text-muted-foreground mt-3"
      >
        {{ $t('page.newsletter.unsubscribe.confirmText') }}
      </p>
      <p
        v-else-if="state === 'done'"
        class="text-muted-foreground mt-3"
      >
        {{ $t('page.newsletter.unsubscribe.success') }}
      </p>
      <p
        v-else-if="state === 'error'"
        class="text-destructive mt-3"
      >
        {{ $t('page.newsletter.unsubscribe.error') }}
      </p>

      <Button
        v-if="state === 'idle' || state === 'error'"
        class="mt-6"
        @click="confirmUnsubscribe"
      >
        {{ $t('page.newsletter.unsubscribe.confirm') }}
      </Button>
    </div>
  </div>
</template>
