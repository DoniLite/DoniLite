import type {
  ColumnDef,
  ColumnFilter,
  ColumnPinningState,
  ExpandedState,
  SortingState,
  VisibilityState
} from '@tanstack/vue-table'
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable
} from '@tanstack/vue-table'
import { valueUpdater } from '~/components/ui/table/utils'
import type { PaginatedResponse } from '~/lib/interfaces/pagination'
import { useTableClientFilters } from './useTableClientFilters'

interface UseFlexTableOptions<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: ComputedRef<TData[]>
  serverSideSorting?: boolean
  serverSideFiltering?: boolean
  serverSidePagination?: ComputedRef<
    Pick<PaginatedResponse<TData>, 'itemCount' | 'page' | 'pageSize' | 'pageCount'> | undefined
  >
  useFuzzySearch?: boolean
  searchColumns?: string[]
}

interface UseFlexTableEmits {
  (e: 'update:sorting', sorting: SortingState): void
  (e: 'update:filters', filters: ColumnFilter[]): void
}

export function useFlexTable<TData extends Record<string, unknown>, TValue>(
  options: UseFlexTableOptions<TData, TValue>,
  emit: UseFlexTableEmits
) {
  // Table state
  const sorting = ref<SortingState>([])
  const columnFilters = ref<ColumnFilter[]>([])
  const globalFilter = ref<string>('')
  const columnVisibility = ref<VisibilityState>({})
  const rowSelection = ref({})
  const expanded = ref<ExpandedState>({})
  const pinning = ref<ColumnPinningState>({})

  // Client-side handlers
  const { handleFiltersUpdate, globalSearchFilter } = useTableClientFilters<TData>({
    searchColumns: options.searchColumns || [],
    useFuzzySearch: options.useFuzzySearch
  })
  // Table configuration
  const table = useVueTable({
    get data() {
      return options.data.value
    },
    get columns() {
      return options.columns
    },
    manualPagination: !!options.serverSidePagination?.value,
    manualSorting: options.serverSideSorting,
    manualFiltering: options.serverSideFiltering,
    pageCount: options.serverSidePagination?.value?.pageCount ?? -1,

    globalFilterFn: !options.serverSideFiltering ? globalSearchFilter : undefined,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    onSortingChange: (updaterOrValue) => {
      if (options.serverSideSorting) {
        const sortingValue =
          typeof updaterOrValue === 'function' ? updaterOrValue(sorting.value) : updaterOrValue
        emit('update:sorting', sortingValue)
      }
      valueUpdater(updaterOrValue, sorting)
    },
    onColumnFiltersChange: (updaterOrValue) => {
      if (options.serverSideFiltering) {
        emit('update:filters', columnFilters.value)
      } else {
        valueUpdater(updaterOrValue, columnFilters)
      }
    },
    onGlobalFilterChange: (updaterOrValue) => {
      if (options.serverSideFiltering) {
        emit('update:filters', [{ id: 'search', value: updaterOrValue }])
      } else {
        valueUpdater(updaterOrValue, globalFilter)
      }
    },
    onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
    onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
    onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),
    onColumnPinningChange: (updaterOrValue) => valueUpdater(updaterOrValue, pinning),

    state: {
      get sorting() {
        return sorting.value
      },
      get columnFilters() {
        return columnFilters.value
      },
      get globalFilter() {
        return globalFilter.value
      },
      get columnVisibility() {
        return columnVisibility.value
      },
      get rowSelection() {
        return rowSelection.value
      },
      get expanded() {
        return expanded.value
      },
      get columnPinning() {
        return pinning.value
      },
      ...(options.serverSidePagination?.value && {
        pagination: {
          pageIndex: options.serverSidePagination?.value.page - 1,
          pageSize: options.serverSidePagination?.value.pageSize
        }
      })
    }
  })

  return {
    table,
    handleFiltersUpdate,
    // Expose state for external access if needed
    sorting: readonly(sorting),
    columnFilters: readonly(columnFilters),
    globalFilter: readonly(globalFilter),
    columnVisibility: readonly(columnVisibility),
    rowSelection: readonly(rowSelection),
    expanded: readonly(expanded),
    pinning: readonly(pinning)
  }
}
