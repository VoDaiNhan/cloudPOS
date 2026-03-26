import type { BatchStatus, IssuePolicy } from './inventory'

export type ExpiryStatus = BatchStatus

export interface ExpiryBatch {
  id: string
  productId: string
  productName: string
  sku: string
  category: string
  image: string
  batchNumber: string
  receivedDate: string
  expiryDate?: string
  quantity: number
  unit: string
  status: ExpiryStatus
  issuePolicy: IssuePolicy
  priorityRank: number | null
  isSellable: boolean
  daysDifference: number | null
}

export interface ExpirySummary {
  expiredCount: number
  nearExpiryCount: number
  safeCount: number
  noExpiryCount: number
  trackedProductCount: number
  priorityCount: number
}
