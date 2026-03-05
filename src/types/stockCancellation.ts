export interface StockCancellationItem {
  id: string
  name: string
  sku: string
  unit: string
  cancellationQuantity: number
  costPrice: number
}

export type CancellationReason = 'damage' | 'expired' | 'loss' | 'other'
