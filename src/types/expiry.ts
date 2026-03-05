export type ExpiryStatus = 'EXPIRED' | 'NEAR_EXPIRY' | 'SAFE'

export interface ExpiryBatch {
  id: string
  productId: string
  productName: string
  sku: string
  image: string
  batchNumber: string
  expiryDate: string
  quantity: number
  unit: string
  status: ExpiryStatus
  daysDifference: number // Positive for days left, negative for days past
}

export interface ExpirySummary {
  expiredCount: number
  nearExpiryCount: number
  safeCount: number
}
