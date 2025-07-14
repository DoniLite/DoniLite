<script setup lang="ts" generic="TData extends Record<string, unknown>">
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import type { Column, Table } from '@tanstack/vue-table'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'

interface Props {
  table: Table<TData>
}
defineEmits<{
  open: [boolean]
}>()

const { t, te } = useI18n()
const open = ref(false)

function getDropDownItemName(column: Column<TData, unknown>): string {
  if (te(`common.${column.id}`)) {
    return t(`common.${column.id}`)
  }
  return column.id
}

defineProps<Props>()
</script>

<template>
  <DropdownMenu
    v-model:open="open"
    @update:open="(payload) => $emit('open', payload)"
  >
    <DropdownMenuTrigger
      as-child
      data-testid="table-dropdown"
      class="hover:border-ring focus:border:ring hover:bg-transparent"
    >
      <Button
        variant="outline"
        class="ml-auto w-full justify-between lg:w-auto"
      >
        {{ $t('common.columns') }}
        <ChevronUp
          v-if="open"
          class="ml-2 h-4 w-4"
        />
        <ChevronDown
          v-else
          class="ml-2 h-4 w-4"
        />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="center"
      class="w-[var(--reka-dropdown-menu-trigger-width)] md:w-full"
    >
      <DropdownMenuCheckboxItem
        v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
        :key="column.id"
        class="capitalize"
        :model-value="column.getIsVisible()"
        @update:model-value="(value) => column.toggleVisibility(!!value)"
      >
        {{ getDropDownItemName(column) }}
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
