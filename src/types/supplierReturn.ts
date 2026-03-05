export interface SupplierReturnProduct {
  id: string
  name: string
  sku: string
  batchCode: string
  expiryDate: string
  currentStock: number
  returnQuantity: number
  importPrice: number
}

export type ReturnReason = 'expiry' | 'damage' | 'other'
