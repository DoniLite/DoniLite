import type { ColumnPinningPosition, Table } from '@tanstack/vue-table'

interface UseColumnPinningOptions<TData> {
  table: Table<TData>
  pinnedColumnId?: string
  pinOnMobile?: ColumnPinningPosition
  pinOnDesktop?: ColumnPinningPosition
  isMobile: Ref<boolean>
}

export function useColumnPinning<TData>(options: UseColumnPinningOptions<TData>) {
  // Helper function to generate class object for pinned cells/headers
  const getPinnedItemClassDefinition = (
    index: number,
    itemsLength: number,
    pinnedState: ColumnPinningPosition
  ) => {
    return {
      'pl-4': index === 0,
      'pr-4': index === itemsLength - 1,
      'bg-background sticky z-50 align-middle': pinnedState !== false,
      'right-0': pinnedState === 'right',
      'left-0': pinnedState === 'left'
    }
  }

  // Watch for changes in mobile state and pinning configuration
  watch(
    [
      () => options.isMobile.value,
      () => options.pinnedColumnId,
      () => options.pinOnMobile,
      () => options.pinOnDesktop
    ],
    ([isMobileValue, pinnedColumnId, pinOnMobile, pinOnDesktop]) => {
      // Only proceed if a column ID is specified
      if (!pinnedColumnId) {
        return
      }

      // Get the column by ID
      const column = options.table.getColumn(pinnedColumnId)
      if (!column) {
        return
      }

      // Determine which pin direction to use based on device type
      let pinDirection: ColumnPinningPosition = false

      if (isMobileValue) {
        // For mobile devices
        pinDirection = pinOnMobile ?? false
      } else {
        // For desktop devices
        pinDirection = pinOnDesktop ?? false
      }

      // Apply the pin direction to the column
      column.pin(pinDirection)
    },
    { immediate: true }
  )

  return {
    getPinnedItemClassDefinition
  }
}
