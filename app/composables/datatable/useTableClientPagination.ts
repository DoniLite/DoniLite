import type { Table } from '@tanstack/vue-table'
import type { PaginatedResponse } from '~/lib/interfaces/pagination'

interface UseTableClientPaginationOptions<TData> {
  table: Table<TData>
  serverSidePagination?: ComputedRef<
    Pick<PaginatedResponse<TData>, 'itemCount' | 'page' | 'pageSize' | 'pageCount'> | undefined
  >
}

interface UseTableClientPaginationEmits {
  (evt: 'update:page' | 'update:pageSize', value: number): void
}

export function useTableClientPagination<TData>(
  options: UseTableClientPaginationOptions<TData>,
  emit: UseTableClientPaginationEmits
) {
  // Client-side pagination calculations
  const clientSidePagination = computed(() => {
    const { pageIndex, pageSize } = options.table.getState().pagination
    const pageCount = Math.ceil(options.table.getFilteredRowModel().rows.length / pageSize)
    return {
      page: pageIndex + 1,
      pageSize: pageSize,
      pageCount: pageCount,
      itemCount: options.table.getFilteredRowModel().rows.length
    }
  })

  // Current pagination state (server-side or client-side)
  const currentPagination = computed(
    () => options.serverSidePagination?.value ?? clientSidePagination.value
  )

  // Navigation helpers
  const canPreviousPage = computed(() => currentPagination.value.page > 1)
  const canNextPage = computed(
    () => currentPagination.value.page < currentPagination.value.pageCount
  )

  // Actions
  const updatePageSize = (newSize: number) => {
    if (options.serverSidePagination?.value) {
      emit('update:pageSize', newSize)
    } else {
      options.table.setPageSize(newSize)
    }
  }

  const goToPage = (page: number) => {
    if (options.serverSidePagination?.value) {
      emit('update:page', page)
    } else {
      options.table.setPageIndex(page - 1) // Convert from 1-based to 0-based
    }
  }

  return {
    currentPagination: readonly(currentPagination),
    canPreviousPage: readonly(canPreviousPage),
    canNextPage: readonly(canNextPage),
    updatePageSize,
    goToPage
  }
}
