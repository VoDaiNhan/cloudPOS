export type InventoryStatus = 'stable' | 'low' | 'under_limit' | 'expiring'

export type IssuePolicy = 'FIFO' | 'FEFO'

export type BatchStatus = 'EXPIRED' | 'NEAR_EXPIRY' | 'SAFE' | 'NO_EXPIRY'

export interface StockBatch {
  id: string
  productId: string
  sku: string
  productName: string
  category: string
  unit: string
  quantity: number
  costPrice: number
  receivedDate: string
  batchNumber: string
  expiryDate?: string
  image?: string
}

export interface InventoryItem {
  id: string
  sku: string
  name: string
  image?: string
  category: string
  unit: string
  stockLevel: number
  stockValue: number
  status: InventoryStatus
  issuePolicy: IssuePolicy
  trackedBatchCount: number
  expiringQuantity: number
  expiredQuantity: number
  nextExpiryDate?: string
}
