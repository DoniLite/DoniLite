<script setup lang="ts" generic="T extends boolean = false">
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import type { HTMLAttributes } from 'vue'
import type { EntryType } from '~/shared/types'
const { t } = useI18n()

const emit = defineEmits<{
  selected: [value: T extends true ? EntryType['id'][] : EntryType['id']]
  search: [query: string]
  'update:modelValue': [value: T extends true ? EntryType['id'][] : EntryType['id']]
}>()

const props = defineProps<{
  entries: EntryType[]
  placeholder: string
  multiple?: T
  initialValue?: T extends true ? EntryType['id'][] : EntryType['id']
  class?: HTMLAttributes['class']
  searchInputDisabled?: boolean
  modelValue?: T extends true ? EntryType['id'][] : EntryType['id']
}>()

const value = props.multiple
  ? ref<EntryType['id'][]>(
      (props.modelValue as EntryType['id'][]) || (props.initialValue as EntryType['id'][]) || []
    )
  : ref<EntryType['id']>(
      (props.modelValue as EntryType['id']) || (props.initialValue as EntryType['id']) || ''
    )

const open = ref(false)
const triggerRef = ref<HTMLButtonElement>()

// Watch for modelValue changes to keep internal value in sync
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== undefined) {
      value.value = newValue
    }
  },
  { immediate: true }
)

const selectedEntry = computed(() => {
  if (props.multiple) {
    const selectedValues = value.value as EntryType['id'][]
    if (!selectedValues.length) {
      return props.placeholder
    }

    // If there's only one selected item, show its label
    if (selectedValues.length === 1) {
      const selected = props.entries.find((entry) => entry.id === selectedValues[0])
      return selected?.label || props.placeholder
    }

    // Otherwise show count of selected items
    return t('common.selectedItems', { count: selectedValues.length })
  } else {
    // Single selection mode
    const selected = props.entries.find((entry) => entry.id === value.value)
    return selected?.label || props.placeholder
  }
})

// Helper function to check if an item is selected in multiple mode
const isSelected = (entryId: EntryType['id']) => {
  if (props.multiple) {
    return (value.value as EntryType['id'][]).includes(entryId)
  }
  return value.value === entryId
}

// Toggle selection for multiple mode
const toggleSelection = (entryId: string) => {
  if (props.multiple) {
    // Multiple selection mode - emit array of IDs
    const currentValue = [...(value.value as EntryType['id'][])]
    const index = currentValue.indexOf(entryId)

    if (index === -1) {
      currentValue.push(entryId)
    } else {
      currentValue.splice(index, 1)
    }

    value.value = currentValue
    const emitValue = currentValue as T extends true ? EntryType['id'][] : EntryType['id']
    emit('selected', emitValue)
    emit('update:modelValue', emitValue)
  } else {
    // Single selection mode - emit just the ID string
    value.value = entryId
    const emitValue = entryId as T extends true ? EntryType['id'][] : EntryType['id']
    emit('selected', emitValue)
    emit('update:modelValue', emitValue)
    open.value = false
  }
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger
      as-child
      data-testid="entity-sorted-combobox"
      :style="{
        '--reka-popover-trigger-width': '100%',
        '--reka-popover-trigger-max-width': 'calc(100% - 4rem)'
      }"
    >
      <Button
        ref="triggerRef"
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        :class="
          cn(
            'hover:border-ring focus:border:ring mix w-full max-w-[var(--reka-popover-trigger-max-width)] min-w-[var(--reka-popover-trigger-width)] justify-between font-normal hover:bg-inherit',
            props.class
          )
        "
      >
        <span class="truncate">
          {{ selectedEntry }}
        </span>

        <ChevronsUpDown class="ml-1 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[var(--reka-popover-trigger-width)] p-0">
      <Command :multiple="multiple">
        <CommandInput
          :placeholder="$t('common.search')"
          :disabled="searchInputDisabled"
          @input="emit('search', $event.value)"
        />
        <CommandEmpty>
          {{ $t('common.no_results') }}
        </CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="entry in entries"
              :key="entry.id"
              :value="entry.id"
              class="hover:bg-accent flex items-center gap-2"
              @select="toggleSelection(entry.id)"
            >
              <div class="flex w-full items-center gap-2">
                <div
                  class="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border"
                  :class="isSelected(entry.id) ? 'bg-primary border-primary' : 'border-input'"
                >
                  <Check
                    v-if="isSelected(entry.id)"
                    class="text-primary-foreground h-3 w-3"
                  />
                </div>
                <span class="truncate">
                  {{ entry.label }}
                </span>
              </div>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
