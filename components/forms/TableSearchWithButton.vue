<script setup lang="ts">
import { cn } from '@/lib/utils'
import { useDebounceFn } from '@vueuse/core'
import { Search, X } from 'lucide-vue-next'
import { computed, inject, ref } from 'vue'

defineProps<{
  className?: string
}>()

const emit = defineEmits<{
  update: [searchValue: string]
}>()

const searchValue = ref<string>('')

// Inject the loading state
const isLoading = inject<ComputedRef<boolean>>(
  'TABLE_LOADING_STATE',
  computed(() => false)
)

const canSearch = computed(() => searchValue.value.length > 0)

const handleSearch = () => {
  if (isLoading.value) {
    return
  }
  // Use the injected isLoading state
  emit('update', searchValue.value)
}

const onClear = () => {
  searchValue.value = ''
}
// This is to reset search when the user clears the input
// Debounced function for server-side search (200ms delay)
const debouncedSetFilter = useDebounceFn((value: string) => {
  if (!value) {
    handleSearch()
  }
}, 200)

// Watch for changes and apply debounced filter
watch(searchValue, async (newValue) => {
  await debouncedSetFilter(newValue)
})
</script>
<template>
  <div :class="cn(`relative w-full items-center rounded-lg border`, className)">
    <div class="relative flex-1">
      <Input
        id="search"
        v-model="searchValue"
        type="text"
        :placeholder="$t('common.search')"
        class="w-full pr-15 pl-10 md:pr-20"
        @keyup.enter="() => searchValue && handleSearch()"
      />
      <span class="absolute inset-y-0 start-0 flex items-center justify-center px-2">
        <Search
          v-if="!canSearch"
          class="text-muted-foreground h-4 w-4"
        />
        <button
          v-else
          type="button"
          class="focus:outline-none"
          @click="onClear"
        >
          <X class="text-muted-foreground h-4 w-4" />
        </button>
      </span>
      <Button
        v-if="canSearch"
        variant="default"
        class="border-primary absolute inset-y-0 end-0 flex items-center space-x-2 rounded-l-none border-2"
        :disabled="isLoading"
        @click="handleSearch"
      >
        <span class="hidden lg:inline">{{ $t('common.search') }}</span>
        <Search class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
