export interface PaginationParams {
  page: number
  pageSize: number
  limit: number
  offset: number
}

const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 100

export function parsePagination(
  query: Record<string, unknown>,
  defaultPageSize = DEFAULT_PAGE_SIZE
): PaginationParams {
  const page = Math.max(1, parseInt(String(query.page ?? '1'), 10) || 1)
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(String(query.pageSize ?? defaultPageSize), 10) || defaultPageSize)
  )
  return { page, pageSize, limit: pageSize, offset: (page - 1) * pageSize }
}
