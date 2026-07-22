<script setup lang="ts">
import { Send, X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import EntityAvatar from '~/components/shared/EntityAvatar.vue'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent } from '~/components/ui/dialog'
import { Textarea } from '~/components/ui/textarea'
import { contactService } from '~/lib/service/contact.service'
import type { MessageTable } from '~~/db/schema/contact.schema'

interface Props {
  id: string
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
const { t } = useI18n()
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

const replyBody = ref('')
const sending = ref(false)

const sendReply = async () => {
  if (!replyBody.value.trim() || !props.id) {
    return
  }
  sending.value = true
  try {
    await contactService.reply(props.id, replyBody.value.trim())
    toast.success(t('message.reply.sent'))
    replyBody.value = ''
  } catch {
    toast.error(t('message.reply.error'))
  } finally {
    sending.value = false
  }
}

watch(
  () => props.id,
  () => {
    replyBody.value = ''
  }
)
</script>

<template>
  <div v-if="show">
    <div
      v-if="isDesktop"
      class="bg-muted relative hidden h-screen w-full flex-col gap-4 rounded-lg p-4 lg:flex"
    >
      <button
        type="button"
        class="absolute top-0 right-0 z-10"
        @click="show = false"
      >
        <X class="text-primary-foreground bg-primary h-6 w-6 cursor-pointer rounded-full p-1" />
      </button>

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

      <div
        class="bg-card flex w-full flex-1 flex-col items-center justify-start overflow-auto rounded-lg p-4"
      >
        <article class="prose lg:prose-lg dark:prose-invert mx-auto max-w-3xl px-3">
          <p>
            {{ message }}
          </p>
        </article>

        <div class="mt-6 flex w-full max-w-3xl flex-col gap-2 px-3">
          <Textarea
            v-model="replyBody"
            :placeholder="t('message.reply.placeholder')"
            class="min-h-24"
          />
          <Button
            class="self-end"
            :disabled="sending || !replyBody.trim()"
            @click="sendReply"
          >
            <Send class="h-4 w-4" />
            {{ t('message.reply.send') }}
          </Button>
        </div>
      </div>
    </div>
    <Dialog
      v-else
      v-model:open="show"
    >
      <DialogContent class="bg-muted flex w-full flex-col gap-4 overflow-y-auto rounded-lg p-0">
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

        <div
          class="bg-card flex w-full flex-col items-center justify-start overflow-auto rounded-b-lg p-4"
        >
          <article
            class="prose prose-sm sm:prose lg:prose-lg dark:prose-invert mx-auto max-w-3xl px-3"
          >
            <p>
              {{ message }}
            </p>
          </article>

          <div class="mt-6 flex w-full max-w-3xl flex-col gap-2 px-3">
            <Textarea
              v-model="replyBody"
              :placeholder="t('message.reply.placeholder')"
              class="min-h-24"
            />
            <Button
              class="self-end"
              :disabled="sending || !replyBody.trim()"
              @click="sendReply"
            >
              <Send class="h-4 w-4" />
              {{ t('message.reply.send') }}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
