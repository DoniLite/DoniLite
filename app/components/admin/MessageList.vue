<script setup lang="ts">
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-vue-next'
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
const { t } = useI18n()

const { data: messages } = await messageService.list()
const searchQuery = ref('')
// Narrower than MessageState (which allows null/undefined per the DB column
// definition) — this filter only ever holds one of these four literals.
type StateFilter = 'all' | 'new' | 'opened' | 'archived'
const stateFilter = ref<StateFilter>('all')
const stateFilters: StateFilter[] = ['all', 'new', 'opened', 'archived']
const sortDir = ref<'asc' | 'desc'>('desc')

const toggleSort = () => {
  sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
}
const sortIcon = computed(() => (sortDir.value === 'asc' ? ArrowUp : ArrowDown))

const filteredMessages = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const dir = sortDir.value === 'asc' ? 1 : -1
  return messages.value
    .filter((message) => stateFilter.value === 'all' || message.state === stateFilter.value)
    .filter(
      (message) =>
        !query ||
        message.user.name.toLowerCase().includes(query) ||
        message.message.toLowerCase().includes(query)
    )
    .sort((a, b) => (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir)
})

const pageSize = props.extend ? 10 : 6
const currentPage = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(filteredMessages.value.length / pageSize)))
const pagedMessages = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredMessages.value.slice(start, start + pageSize)
})

watch([searchQuery, stateFilter, sortDir], () => {
  currentPage.value = 1
})

const goToPage = (page: number) => {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
}

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

    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex flex-wrap gap-1">
        <button
          v-for="filter in stateFilters"
          :key="filter"
          class="rounded-md px-2 py-1 text-xs font-medium transition-colors"
          :class="
            stateFilter === filter
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-muted-foreground hover:bg-accent'
          "
          @click="stateFilter = filter"
        >
          {{ filter === 'all' ? t('common.all') : t(`message.states.${filter}`) }}
        </button>
      </div>
      <button
        class="text-muted-foreground flex items-center gap-1 text-xs"
        @click="toggleSort"
      >
        {{ t('common.updatedAt') }}
        <component
          :is="sortIcon"
          class="h-3.5 w-3.5"
        />
      </button>
    </div>

    <template
      v-for="message in pagedMessages"
      :key="message.id"
    >
      <MessageCard
        v-bind="message"
        @archive="handleArchive"
        @delete="handleDelete"
        @open="$emit('open', $event)"
      />
    </template>

    <div
      v-if="totalPages > 1"
      class="mt-2 flex items-center justify-center gap-2"
    >
      <button
        :class="Pagination_class.nextPage"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        <ChevronLeft class="h-4 w-4" />
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        :class="page === currentPage ? Pagination_class.currentPage : Pagination_class.nextPage"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
      <button
        :class="Pagination_class.nextPage"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        <ChevronRight class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>
