import type { ReactNode } from 'react'

export interface Column<T> {
  title: string
  key: string
  dataIndex?: keyof T
  render?: (value: unknown, record: T, index: number) => ReactNode
  align?: 'left' | 'center' | 'right'
  width?: string | number
}

interface TableProps<T> {
  columns: Column<T>[]
  dataSource: T[]
  loading?: boolean
  rowKey?: keyof T | ((record: T) => string | number)
  onRowClick?: (record: T) => void
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number) => void
  }
}

export function Table<T>({
  columns,
  dataSource,
  loading = false,
  rowKey = 'id' as keyof T,
  onRowClick,
  pagination,
}: TableProps<T>) {
  const getRowKey = (record: T): string | number => {
    if (typeof rowKey === 'function') return rowKey(record)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (record as any)[rowKey]
  }

  const pagedDataSource = pagination
    ? dataSource.slice(
        (pagination.current - 1) * pagination.pageSize,
        pagination.current * pagination.pageSize
      )
    : dataSource

  const rangeStart =
    !pagination || pagination.total === 0
      ? 0
      : (pagination.current - 1) * pagination.pageSize + 1
  const rangeEnd =
    !pagination || pagination.total === 0
      ? 0
      : Math.min(pagination.current * pagination.pageSize, pagination.total)

  return (
    <div className="w-full">
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}`}
                  style={{ width: column.width }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-5">
                      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-md w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : pagedDataSource.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-slate-400 text-sm"
                >
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              pagedDataSource.map((record, index) => (
                <tr
                  key={getRowKey(record)}
                  onClick={() => onRowClick?.(record)}
                  className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 text-[15px] ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'} text-slate-600 dark:text-slate-300`}
                    >
                      {column.render
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ? (column.render as any)(
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            column.dataIndex ? (record as any)[column.dataIndex] : record,
                            record,
                            index
                          )
                        : column.dataIndex
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          ? (record as any)[column.dataIndex] as ReactNode
                          : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <p className="text-sm text-slate-500 order-2 sm:order-1">
            Hiển thị{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              {rangeStart}-{rangeEnd}
            </span>{' '}
            trong số{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              {pagination.total}
            </span>{' '}
            bản ghi
          </p>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <button
              onClick={() => pagination.onChange(pagination.current - 1)}
              disabled={pagination.current === 1}
              className="size-9 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>

            {/* Simple Dynamic Pagination */}
            {Array.from({
              length: Math.ceil(pagination.total / pagination.pageSize),
            }).map((_, i) => {
              const pageNum = i + 1
              const isActive = pagination.current === pageNum
              return (
                <button
                  key={pageNum}
                  onClick={() => pagination.onChange(pageNum)}
                  className={`size-9 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              onClick={() => pagination.onChange(pagination.current + 1)}
              disabled={
                pagination.current ===
                Math.ceil(pagination.total / pagination.pageSize)
              }
              className="size-9 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
