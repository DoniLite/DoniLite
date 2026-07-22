<script setup lang="ts" generic="TData extends Record<string, unknown>, TValue">
import type {
  ColumnDef,
  ColumnFilter,
  ColumnPinningPosition,
  SortingState
} from '@tanstack/vue-table'
import TableContent from '~/components/datatable/TableContent.vue'
import TablePagination from '~/components/datatable/TablePagination.vue'
import TableToolbar from '~/components/datatable/TableToolbar.vue'
import { useColumnPinning } from '~/composables/datatable/useColumnPinning'
import { useFlexTable } from '~/composables/datatable/useFlexTable'
import { useTableClientPagination } from '~/composables/datatable/useTableClientPagination'
import { useDeviceType } from '~/composables/useDeviceType'
import type { PaginatedResponse } from '~/lib/interfaces/pagination'

const { isMobile } = useDeviceType()

const props = withDefaults(
  defineProps<{
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    noResultsTextKey?: string
    ofTextKey?: string
    pinnedColumnId?: string
    pinOnMobile?: ColumnPinningPosition
    pinOnDesktop?: ColumnPinningPosition
    serverSideSorting?: boolean
    serverSideFiltering?: boolean
    serverSidePagination?: Pick<
      PaginatedResponse<TData>,
      'itemCount' | 'page' | 'pageSize' | 'pageCount'
    >
    useFuzzySearch?: boolean
    searchColumns?: string[]
  }>(),
  {
    ofTextKey: 'common.table.of',
    noResultsTextKey: 'common.noResult',
    pinnedColumnId: 'actions',
    pinOnMobile: 'right',
    pinOnDesktop: false,
    serverSideSorting: false,
    serverSideFiltering: true,
    serverSidePagination: undefined,
    useFuzzySearch: true,
    searchColumns: () => []
  }
)

const emit = defineEmits<{
  (e: 'update:sorting', sorting: SortingState): void
  (e: 'update:filters', filters: ColumnFilter[]): void
  (e: 'update:page' | 'update:pageSize', value: number): void
}>()

// Use composables
const { table, handleFiltersUpdate } = useFlexTable(
  {
    columns: props.columns,
    data: computed(() => props.data),
    serverSideSorting: props.serverSideSorting,
    serverSideFiltering: props.serverSideFiltering,
    serverSidePagination: computed(() => props.serverSidePagination),
    useFuzzySearch: props.useFuzzySearch,
    searchColumns: props.searchColumns
  },
  emit
)

const { currentPagination, canPreviousPage, canNextPage, updatePageSize, goToPage } =
  useTableClientPagination(
    { table, serverSidePagination: computed(() => props.serverSidePagination) },
    emit
  )

const { getPinnedItemClassDefinition } = useColumnPinning({
  table,
  pinnedColumnId: props.pinnedColumnId,
  pinOnMobile: props.pinOnMobile,
  pinOnDesktop: props.pinOnDesktop,
  isMobile
})
</script>

<template>
  <div>
    <div class="mx-auto my-6 flex justify-between">
      <slot
        name="asset"
        :table="table"
      />
    </div>
    <div class="mx-auto rounded-lg border">
      <TableToolbar
        :table="table"
        :handle-filters-update="handleFiltersUpdate"
      >
        <template
          #tableFilters="{ table: slotTable, handleFiltersUpdate: slotHandleFiltersUpdate }"
        >
          <slot
            name="tableFilters"
            :table="slotTable"
            :handle-filters-update="slotHandleFiltersUpdate"
          />
        </template>
      </TableToolbar>

      <TableContent
        :table="table"
        :columns="columns"
        :no-results-text-key="props.noResultsTextKey"
        :get-pinned-item-class-definition="getPinnedItemClassDefinition"
      >
        <template #expandedRowContent="{ row, table: slotTable }">
          <slot
            name="expandedRowContent"
            :row="row"
            :table="slotTable"
          />
        </template>
      </TableContent>

      <TablePagination
        :current-pagination="currentPagination"
        :can-previous-page="canPreviousPage"
        :can-next-page="canNextPage"
        :of-text-key="props.ofTextKey"
        :update-page-size="updatePageSize"
        :go-to-page="goToPage"
      />
    </div>
  </div>
</template>
