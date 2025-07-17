import { ref } from 'vue'
import {
  PAGINATION_DEFAULT_PAGE_SIZE,
  type PaginatedResponse,
  type PaginationQuery
} from '~/lib/interfaces/pagination'

export interface TableServerPaginationHandlerOptions<
  T,
  Q extends PaginationQuery = PaginationQuery
> {
  initialPageSize?: number
  initialQuery?: Partial<Q>
  refetchFunction: (query: Q) => Promise<PaginatedResponse<T>>
}
export interface FetchAllDataOptions {
  force?: boolean
}

/**
 * Independent composable for handling pagination state and CRUD operations
 * Manages its own refs and provides computed values for stores to use
 */
export function useTableServerPaginationHandler<
  T extends { id: string },
  Q extends PaginationQuery = PaginationQuery
>(options: TableServerPaginationHandlerOptions<T, Q>) {
  const {
    initialPageSize = PAGINATION_DEFAULT_PAGE_SIZE,
    initialQuery = {},
    refetchFunction
  } = options

  // Internal refs managed by this composable
  const items = ref<T[]>([])
  const allItems = ref<T[]>([])
  const pagination = ref<
    Pick<PaginatedResponse<T>, 'itemCount' | 'page' | 'pageSize' | 'pageCount'>
  >({
    itemCount: 0,
    page: 1,
    pageSize: initialPageSize,
    pageCount: 0
  })
  const query = ref<Q>({
    page: 1,
    pageSize: initialPageSize,
    ...initialQuery
  } as Q)

  /**
   * Fetches data using the provided refetch function and updates internal state
   */
  async function fetchData(newQuery: Partial<Q> = {}): Promise<PaginatedResponse<T>> {
    Object.assign(query.value, newQuery)

    const response = await refetchFunction(query.value as Q)

    items.value = response.items
    pagination.value = {
      itemCount: response.itemCount,
      page: response.page,
      pageSize: response.pageSize,
      pageCount: response.pageCount
    }

    return response
  }

  function _setAllItems(items: T[]) {
    allItems.value = [...items, ...(allItems.value as T[])].filter(
      (x: T, i, self: T[]) => self.findIndex((item) => item.id === x.id) === i
    ) as T[]
  }
  /**
   * Fetches data using the provided refetch function and updates internal state
   */
  async function fetchAllData(
    newQuery: Partial<Q> = {},
    options: FetchAllDataOptions = { force: false }
  ): Promise<T[]> {
    const { filters, ...restQuery } = newQuery
    if (!allItems.value.length || options.force) {
      const response = await refetchFunction({ ...restQuery, ...filters, pageSize: -1 } as Q)
      _setAllItems(response.items)
      return response.items
    }
    return allItems.value as T[]
  }

  /**
   * Handles pagination state after creating or updating an item
   * Adds the item to the beginning of the list and maintains page size
   */
  function handlePostCreate(newItem: T) {
    items.value = [newItem, ...items.value] as T[]

    // Maintain page size by removing excess items
    if (items.value.length > pagination.value.pageSize) {
      items.value = items.value.slice(0, pagination.value.pageSize) as T[]
    }

    pagination.value.itemCount += 1
    pagination.value.pageCount = Math.ceil(pagination.value.itemCount / pagination.value.pageSize)
  }

  /**
   * Handles pagination state after updating an existing item
   * Updates the item in place if it exists in the current page
   */
  function handlePostUpdate(updatedItem: T) {
    const currentItems = [...items.value] as T[]
    const index = currentItems.findIndex((item: T) => item.id === updatedItem.id)
    if (index !== -1) {
      const newItems = [...currentItems] as T[]
      newItems[index] = updatedItem
      items.value = newItems
    }
  }

  /**
   * Removes specific items from the current list by ID
   */
  function removeItemsFromList(itemIds: T['id'][]) {
    const currentItems = [...items.value] as T[]
    items.value = currentItems.filter((item: T) => !itemIds.includes(item.id)) as T[]
  }

  /**
   * Handles pagination state after deleting items
   * Removes items from the list and handles page navigation if current page becomes empty
   */
  async function handlePostDelete(deletedCount: number = 1) {
    // Update total count
    pagination.value.itemCount = Math.max(0, pagination.value.itemCount - deletedCount)

    // Recalculate total pages
    pagination.value.pageCount = Math.ceil(pagination.value.itemCount / pagination.value.pageSize)

    // If current page is empty and not the first page, go to previous page
    if (items.value.length === 0 && pagination.value.page > 1) {
      const previousPage = pagination.value.page - 1
      pagination.value.page = previousPage
      await fetchData({ page: previousPage } as Partial<Q>)
    } else if (items.value.length === 0 && pagination.value.page === 1) {
      // If we're on the first page and it's empty, just refetch to ensure consistency
      await fetchData({ page: 1 } as Partial<Q>)
    }
  }

  /**
   * Handles bulk delete operations
   */
  async function handleBulkDelete(deletedItemIds: T['id'][]) {
    // Remove items from the current list
    removeItemsFromList(deletedItemIds)

    // Handle pagination state
    await handlePostDelete(deletedItemIds.length)
  }

  /**
   * Updates the current page and refetches data
   */
  async function goToPage(page: number) {
    await fetchData({ page } as Partial<Q>)
  }

  /**
   * Updates the page size and refetches data
   */
  async function updatePageSize(pageSize: number) {
    await fetchData({ page: 1, pageSize } as Partial<Q>)
  }

  /**
   * Updates search/filter parameters and refetches data
   */
  async function updateFilters(filters: Partial<Q>) {
    await fetchData({ page: 1, ...filters } as Partial<Q>)
  }

  /**
   * Resets the state to initial values
   */
  function resetFilters() {
    items.value = []
    pagination.value = {
      itemCount: 0,
      page: 1,
      pageSize: initialPageSize,
      pageCount: 0
    }
    query.value = {
      page: 1,
      pageSize: initialPageSize,
      ...initialQuery
    }
  }

  return {
    items,
    allItems,
    pagination,
    query,

    // Actions
    fetchData,
    fetchAllData,
    handlePostCreate,
    handlePostUpdate,
    handlePostDelete,
    handleBulkDelete,
    removeItemsFromList,
    goToPage,
    updatePageSize,
    updateFilters,
    resetFilters
  }
}
