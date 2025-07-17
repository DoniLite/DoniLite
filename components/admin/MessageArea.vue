<script setup lang="ts">
import { X } from 'lucide-vue-next'
import EntityAvatar from '~/components/shared/EntityAvatar.vue'
import type { MessageTable } from '~/db/schema/contact.schema'

interface Props {
  user: {
    name: string
    profile?: string
    email: string
  }
  state: (typeof MessageTable.$inferInsert)['state']
  date: string
  message: string
}

const { isDesktop } = useDeviceType()
const show = defineModel<boolean>('show', {
  required: true
})

const badgeClass = computed(() => {
  if (props.state === 'archived') {
    return 'bg-background text-foreground'
  }
  if (props.state === 'new') {
    return 'bg-green-500 text-white'
  }
  return 'bg-muted text-muted-foreground'
})
const props = defineProps<Props>()
const parsedDate = computed(() => new Date(props.date))
</script>

<template>
  <div v-if="show">
    <div
      v-if="isDesktop"
      class="bg-muted relative hidden h-screen w-full flex-col gap-4 rounded-lg p-4 lg:flex"
    >
      <X
        class="text-primary-foreground bg-primary absolute top-0 right-0 h-6 w-6 cursor-pointer rounded-full p-1"
      />

      <div class="bg-card flex h-[180px] w-full flex-col gap-2 rounded-tl-lg rounded-tr-lg p-4">
        <div class="flex w-full items-center justify-between">
          <div class="flex items-center gap-2">
            <EntityAvatar class="h-12 w-12" />
            <h1 class="font-bold">
              {{ user.name }}
            </h1>
          </div>
          <Badge :class="badgeClass">
            {{ state }}
          </Badge>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-primary font-bold">
            {{ $t('message.from') }}
          </span>
          <span class="text-xs font-semibold">
            {{ user.email }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-primary font-bold">
            {{ $t('message.to') }}
          </span>
          <span class="text-xs font-semibold">
            {{ $t('message.you') }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-primary font-bold">
            {{ $t('message.at') }}
          </span>
          <span class="text-xs font-semibold">
            {{ $d(parsedDate) }}
          </span>
        </div>
      </div>

      <div class="bg-card flex w-full items-center justify-center overflow-auto rounded-lg p-4">
        <article class="prose lg:prose-lg dark:prose-invert mx-auto max-w-3xl px-3">
          <p>
            {{ message }}
          </p>
        </article>
      </div>
    </div>
    <Dialog
      v-else
      :open="show"
    >
      <DialogContent class="bg-muted flex w-full flex-col gap-4 overflow-y-auto rounded-lg p-0">
        <DialogClose @click="show = false">
          <X
            class="text-primary-foreground bg-primary z-10 h-6 w-6 cursor-pointer rounded-full p-1"
          />
        </DialogClose>

        <div class="bg-card flex w-full flex-col gap-2 rounded-tl-lg rounded-tr-lg p-4 pt-10">
          <div class="flex w-full items-center justify-between">
            <div class="flex items-center gap-2">
              <EntityAvatar class="h-12 w-12" />
              <h1 class="font-bold">
                {{ user.name }}
              </h1>
            </div>
            <Badge :class="badgeClass">
              {{ state }}
            </Badge>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-primary font-bold">
              {{ $t('message.from') }}
            </span>
            <span class="text-xs font-semibold">
              {{ user.email }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-primary font-bold">
              {{ $t('message.to') }}
            </span>
            <span class="text-xs font-semibold">
              {{ $t('message.you') }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-primary font-bold">
              {{ $t('message.at') }}
            </span>
            <span class="text-xs font-semibold">
              {{ $d(parsedDate) }}
            </span>
          </div>
        </div>

        <div class="bg-card flex w-full items-center justify-center overflow-auto rounded-b-lg p-4">
          <article
            class="prose prose-sm sm:prose lg:prose-lg dark:prose-invert mx-auto max-w-3xl px-3"
          >
            <p>
              {{ message }}
            </p>
          </article>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
