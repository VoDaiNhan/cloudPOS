export type StockMovementType = 'IMPORT' | 'EXPORT' | 'AUDIT_ADJUSTMENT' | 'CANCELLATION' | 'RETURN_TO_SUPPLIER' | 'RETURN_FROM_CUSTOMER'

export interface StockHistoryEntry {
  id: string
  date: string
  type: StockMovementType
  referenceId: string // e.g., PN001, KK002, etc.
  productName: string
  sku: string
  changeQuantity: number // + for increase, - for decrease
  balanceAfter: number
  unit: string
  note: string
  performedBy: string
}

export interface StockHistoryFilter {
  startDate?: string
  endDate?: string
  type?: StockMovementType | 'ALL'
  search?: string
}
