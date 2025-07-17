<script setup lang="ts">
import { Ellipsis } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import type { MessageTable } from '~/db/schema/contact.schema'
import EntityAvatar from './EntityAvatar.vue'

interface Props {
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

type Emits = {
  delete: [id: string]
  open: [value: Props]
  archive: [id: string]
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const handleOpen = () => {
  emits('open', { ...props })
}
const handleArchive = () => {
  if (props.state === 'archived') {
    toast.info('This message is already archived')
    return
  }
  emits('archive', props.id)
}
const handleDelete = () => {
  emits('delete', props.id)
}
const convertedDate = new Date(props.date)
</script>

<template>
  <div
    class="bg-card text-card-foreground grid h-[100px] grid-cols-[15%_60%_25%] gap-1 rounded-lg p-2 lg:grid-cols-[15%_70%_15%]"
  >
    <div class="flex h-full w-full items-center justify-center">
      <EntityAvatar
        :name="user.name"
        :image="user.profile"
      />
    </div>
    <div class="flex h-full w-full flex-col justify-center gap-3">
      <h1 class="text-primary text-md truncate font-bold">
        {{ user.name }}
      </h1>
      <p class="line-clamp-2 text-xs">
        {{ message }}
      </p>
    </div>
    <div class="flex h-full w-full flex-col items-center justify-center gap-8">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Ellipsis class="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            <span class="text-xs">
              {{ $t('common.actions') }}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              class="cursor-pointer"
              @click="handleOpen"
            >
              <span class="text-xs">
                {{ $t('common.open') }}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              class="cursor-pointer"
              @click="handleArchive"
            >
              <span class="text-xs">
                {{ $t('common.archive') }}
              </span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            class="text-destructive hover:text-destructive-foreground cursor-pointer text-xs"
            @click="handleDelete"
          >
            {{ $t('common.delete') }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <span class="text-xs">
        {{ $d(convertedDate) }}
      </span>
    </div>
  </div>
</template>
