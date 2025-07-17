<script setup lang="ts" generic="TData extends Record<string, unknown>, TValue">
import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { ColumnDef, ColumnPinningPosition, Row, Table } from '@tanstack/vue-table'
import { FlexRender } from '@tanstack/vue-table'

interface Props {
  table: Table<TData>
  columns: ColumnDef<TData, TValue>[]
  noResultsTextKey: string
  getPinnedItemClassDefinition: (
    index: number,
    itemsLength: number,
    pinnedState: ColumnPinningPosition
  ) => Record<string, boolean>
}

defineProps<Props>()

defineSlots<{
  expandedRowContent(props: { row: Row<TData>; table: Table<TData> }): unknown
}>()
</script>

<template>
  <div>
    <TableComponent>
      <TableHeader class="h-13 border-b-2">
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <TableHead
            v-for="(header, index) in headerGroup.headers"
            :key="header.id"
            :class="
              cn(
                getPinnedItemClassDefinition(
                  index,
                  headerGroup.headers.length,
                  header.column.getIsPinned()
                )
              )
            "
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows.length">
          <template
            v-for="row in table.getRowModel().rows"
            :key="row.id"
          >
            <TableRow
              class="px-4"
              :data-state="row.getIsSelected() && 'selected'"
            >
              <TableCell
                v-for="(cell, index) in row.getVisibleCells()"
                :key="cell.id"
                :class="
                  cn(
                    getPinnedItemClassDefinition(
                      index,
                      row.getVisibleCells().length,
                      cell.column.getIsPinned()
                    )
                  )
                "
              >
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </TableCell>
            </TableRow>
            <TableRow
              v-if="row.getIsExpanded()"
              :data-state="'expanded'"
            >
              <TableCell :colspan="row.getAllCells().length">
                <slot
                  name="expandedRowContent"
                  :row="row"
                  :table="table"
                >
                  <pre class="bg-muted rounded p-2 text-xs">{{
                    JSON.stringify(row.original, null, 2)
                  }}</pre>
                </slot>
              </TableCell>
            </TableRow>
          </template>
        </template>

        <TableRow v-else>
          <TableCell
            :colspan="columns.length"
            class="h-24 text-center"
          >
            {{ $t(noResultsTextKey || 'common.noResult') }}
          </TableCell>
        </TableRow>
      </TableBody>
    </TableComponent>
  </div>
</template>
