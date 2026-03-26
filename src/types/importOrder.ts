export interface ImportItem {
  id: string
  name: string
  sku: string
  linkedProductId?: string
  unit: string
  unitOptions: string[]
  unitRates: Record<string, number>
  quantity: number
  conversionRate: number
  conversionUnit: string
  unitPrice: number
  expiryDate: string
  batchNumber: string
}
