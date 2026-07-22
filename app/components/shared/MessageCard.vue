<script setup lang="ts">
import { Ellipsis } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import type { MessageTable } from '~~/db/schema/contact.schema'
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
  <div class="bg-card text-card-foreground flex min-h-22 items-center gap-3 rounded-lg p-3">
    <div class="shrink-0">
      <EntityAvatar
        :name="user.name"
        :image="user.profile"
      />
    </div>

    <div class="flex min-w-0 flex-1 flex-col gap-1">
      <div class="flex items-center justify-between gap-2">
        <h1 class="text-primary truncate text-sm font-bold">
          {{ user.name }}
        </h1>
        <span class="text-muted-foreground hidden shrink-0 text-xs sm:inline">
          {{ $d(convertedDate) }}
        </span>
      </div>
      <p class="text-muted-foreground line-clamp-2 text-xs">
        {{ message }}
      </p>
      <span class="text-muted-foreground text-xs sm:hidden">
        {{ $d(convertedDate) }}
      </span>
    </div>

    <div class="shrink-0">
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
    </div>
  </div>
</template>
